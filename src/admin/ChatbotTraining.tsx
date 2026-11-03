import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Check, X, Sparkles, MessageSquare, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Faq {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  published: boolean;
}

interface Unanswered {
  id: string;
  question: string;
}

const inputBase =
  "w-full rounded-xl border border-[#050505]/12 bg-white px-4 py-2.5 text-sm text-[#050505] outline-none transition-colors placeholder:text-[#5F5F5F]/60 focus:border-[#FF6B00]";
const label = "block font-mono text-[10px] font-bold uppercase tracking-widest text-[#5F5F5F] mb-1.5";

export default function ChatbotTraining() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [unanswered, setUnanswered] = useState<Unanswered[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [kw, setKw] = useState("");
  const [published, setPublished] = useState(true);
  const [editing, setEditing] = useState<Faq | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const [faqRes, unRes] = await Promise.all([
      supabase
        .from("chatbot_faqs")
        .select("id, question, answer, keywords, published")
        .order("updated_at", { ascending: false }),
      supabase
        .from("chatbot_unanswered")
        .select("id, message:chatbot_messages(content)")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (faqRes.error) setError(`Could not load FAQs: ${faqRes.error.message}`);
    else setFaqs((faqRes.data ?? []) as Faq[]);

    if (unRes.error) setError(`Could not load unanswered questions: ${unRes.error.message}`);
    else {
      setUnanswered(
        (unRes.data ?? []).map((r: any) => {
          const m = Array.isArray(r.message) ? r.message[0] : r.message;
          return { id: r.id as string, question: (m?.content as string) ?? "" };
        })
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Runs a write, surfaces errors, and detects writes silently blocked by RLS.
  async function run(action: () => PromiseLike<{ data: any; error: { message: string } | null }>) {
    setBusy(true);
    setError("");
    const { data, error: err } = await action();
    setBusy(false);
    if (err) {
      setError(err.message);
      return false;
    }
    if (Array.isArray(data) && data.length === 0) {
      setError("Nothing was changed. You may not have permission for this action.");
      return false;
    }
    await load();
    return true;
  }

  const resetForm = () => {
    setQ("");
    setA("");
    setKw("");
    setPublished(true);
    setEditing(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || busy) return;
    const question = q.trim();
    const answer = a.trim();
    if (!question || !answer) return;
    const keywords = kw.split(",").map((k) => k.trim()).filter(Boolean);

    let ok: boolean;
    if (editing) {
      ok = await run(() =>
        supabase!
          .from("chatbot_faqs")
          .update({ question, answer, keywords, published, updated_at: new Date().toISOString() })
          .eq("id", editing.id)
          .select("id")
      );
    } else {
      const { data: auth } = await supabase.auth.getUser();
      ok = await run(() =>
        supabase!
          .from("chatbot_faqs")
          .insert({ question, answer, keywords, published, created_by: auth.user?.id ?? null })
          .select("id")
      );
    }
    if (ok) resetForm();
  };

  const startEdit = (item: Faq) => {
    setEditing(item);
    setQ(item.question);
    setA(item.answer);
    setKw((item.keywords || []).join(", "));
    setPublished(item.published);
  };

  const togglePublish = (item: Faq) =>
    run(() =>
      supabase!
        .from("chatbot_faqs")
        .update({ published: !item.published, updated_at: new Date().toISOString() })
        .eq("id", item.id)
        .select("id")
    );

  const removeFaq = (item: Faq) => {
    if (!confirm(`Delete this FAQ?\n\n${item.question}`)) return;
    void run(() => supabase!.from("chatbot_faqs").delete().eq("id", item.id).select("id"));
  };

  const closeUnanswered = async (id: string, status: "resolved" | "dismissed") => {
    const { data: auth } = await supabase!.auth.getUser();
    return run(() =>
      supabase!
        .from("chatbot_unanswered")
        .update({ status, resolved_by: auth.user?.id ?? null, resolved_at: new Date().toISOString() })
        .eq("id", id)
        .select("id")
    );
  };

  const teach = async (item: Unanswered, answer: string) => {
    if (!supabase || busy) return false;
    const { data: auth } = await supabase.auth.getUser();
    const created = await run(() =>
      supabase!
        .from("chatbot_faqs")
        .insert({
          question: item.question.slice(0, 500),
          answer: answer.trim(),
          keywords: [],
          published: true,
          created_by: auth.user?.id ?? null,
        })
        .select("id")
    );
    if (!created) return false;
    return closeUnanswered(item.id, "resolved");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      {error && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button onClick={() => setError("")} title="Dismiss" className="shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: add / edit form */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-[#050505]/8 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF6B00]" />
              <h2 className="font-sans text-lg font-extrabold tracking-tight text-[#050505]">
                {editing ? "Edit FAQ" : "Add FAQ"}
              </h2>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className={label}>Question *</label>
                <input
                  className={inputBase}
                  value={q}
                  maxLength={500}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Do you offer monthly maintenance?"
                />
              </div>
              <div>
                <label className={label}>Verified answer *</label>
                <textarea
                  className={`${inputBase} min-h-[110px] resize-y`}
                  value={a}
                  maxLength={10000}
                  onChange={(e) => setA(e.target.value)}
                  placeholder="Yes — I offer monthly care plans covering updates, backups, and monitoring."
                />
              </div>
              <div>
                <label className={label}>Keywords (comma-separated, English or Roman Urdu)</label>
                <input
                  className={inputBase}
                  value={kw}
                  onChange={(e) => setKw(e.target.value)}
                  placeholder="maintenance, care plan, monthly, kharcha"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#050505]">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 accent-[#FF6B00]"
                />
                Published (visible to the chatbot)
              </label>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 rounded-full bg-[#FF6B00] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#050505] disabled:opacity-50"
                >
                  {editing ? "Save Changes" : "Add FAQ"}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-[#050505]/15 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#050505] transition-colors hover:bg-[#050505]/5"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right: FAQ list + unanswered */}
        <div className="space-y-8 lg:col-span-7">
          <div>
            <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-widest text-[#5F5F5F]">
              FAQs · {faqs.length}
            </h3>
            {loading ? (
              <p className="py-10 text-center text-sm text-[#5F5F5F]">Loading…</p>
            ) : faqs.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#050505]/15 bg-white py-10 text-center text-sm text-[#5F5F5F]">
                No FAQs yet. Add one to train the assistant.
              </p>
            ) : (
              <div className="space-y-3">
                {faqs.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-[#050505]/8 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-sans text-sm font-bold text-[#050505]">{item.question}</p>
                          {!item.published && (
                            <span className="shrink-0 rounded bg-[#050505]/8 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#5F5F5F]">
                              Unpublished
                            </span>
                          )}
                        </div>
                        <p className="mt-1 font-sans text-sm leading-relaxed text-[#5F5F5F]">{item.answer}</p>
                        {item.keywords && item.keywords.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.keywords.map((k) => (
                              <span
                                key={k}
                                className="rounded bg-[#050505]/5 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#5F5F5F]"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => togglePublish(item)}
                          disabled={busy}
                          title={item.published ? "Unpublish" : "Publish"}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F5F5F] transition-colors hover:bg-[#050505]/5 hover:text-[#FF6B00] disabled:opacity-50"
                        >
                          {item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => startEdit(item)}
                          title="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F5F5F] transition-colors hover:bg-[#050505]/5 hover:text-[#FF6B00]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFaq(item)}
                          disabled={busy}
                          title="Delete"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F5F5F] transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-[#5F5F5F]">
              <MessageSquare className="h-3.5 w-3.5 text-[#FF6B00]" />
              Unanswered Questions · {unanswered.length}
            </h3>
            {unanswered.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#050505]/15 bg-white py-8 text-center text-sm text-[#5F5F5F]">
                Nothing unanswered. Questions the bot can't answer from verified FAQs show up here.
              </p>
            ) : (
              <div className="space-y-2">
                {unanswered.map((item) => (
                  <div key={item.id}>
                    <UnansweredRow
                      item={item}
                      busy={busy}
                      onTeach={teach}
                      onDismiss={() => closeUnanswered(item.id, "dismissed")}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UnansweredRow({
  item,
  busy,
  onTeach,
  onDismiss,
}: {
  item: Unanswered;
  busy: boolean;
  onTeach: (item: Unanswered, answer: string) => Promise<boolean>;
  onDismiss: () => Promise<boolean>;
}) {
  const [answering, setAnswering] = useState(false);
  const [draft, setDraft] = useState("");

  const save = async () => {
    if (!draft.trim()) return;
    if (await onTeach(item, draft)) {
      setAnswering(false);
      setDraft("");
    }
  };

  return (
    <div className="rounded-2xl border border-[#050505]/8 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 break-words font-sans text-sm font-semibold text-[#050505]">“{item.question}”</p>
        {!answering && (
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setAnswering(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#050505]/12 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#050505] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
            >
              <Plus className="h-3 w-3" /> Teach
            </button>
            <button
              onClick={() => void onDismiss()}
              disabled={busy}
              className="rounded-full border border-[#050505]/12 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#5F5F5F] transition-colors hover:border-red-400 hover:text-red-500 disabled:opacity-50"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
      {answering && (
        <div className="mt-3 flex items-start gap-2">
          <textarea
            autoFocus
            value={draft}
            maxLength={10000}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type the verified answer. It will be saved as a published FAQ…"
            className={`${inputBase} min-h-[70px] resize-y`}
          />
          <div className="flex flex-col gap-1">
            <button
              onClick={() => void save()}
              disabled={busy}
              title="Save"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B00] text-white transition-colors hover:bg-[#050505] disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => setAnswering(false)}
              title="Cancel"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#050505]/12 text-[#5F5F5F] transition-colors hover:bg-[#050505]/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}