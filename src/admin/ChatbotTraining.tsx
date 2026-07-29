import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Check, X, Sparkles, MessageSquare, RotateCcw } from "lucide-react";
import { useChatbotData, chatbotApi, type CustomQA } from "../lib/chatbotStore";

const inputBase =
  "w-full rounded-xl border border-[#050505]/12 bg-white px-4 py-2.5 text-sm text-[#050505] outline-none transition-colors placeholder:text-[#5F5F5F]/60 focus:border-[#FF6B00]";
const label = "block font-mono text-[10px] font-bold uppercase tracking-widest text-[#5F5F5F] mb-1.5";

export default function ChatbotTraining() {
  const { qa, logs } = useChatbotData();
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [kw, setKw] = useState("");
  const [editing, setEditing] = useState<CustomQA | null>(null);

  // Unmatched questions (no confident answer) — training opportunities.
  const unmatched = logs.filter((l) => !l.matched);

  const resetForm = () => {
    setQ("");
    setA("");
    setKw("");
    setEditing(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim() || !a.trim()) return;
    const keywords = kw.split(",").map((k) => k.trim()).filter(Boolean);
    if (editing) {
      chatbotApi.updateQA(editing.id, { question: q, answer: a, keywords });
    } else {
      chatbotApi.addQA(q, a, keywords);
    }
    resetForm();
  };

  const startEdit = (item: CustomQA) => {
    setEditing(item);
    setQ(item.question);
    setA(item.answer);
    setKw((item.keywords || []).join(", "));
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: add / edit form */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-[#050505]/8 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF6B00]" />
              <h2 className="font-sans text-lg font-extrabold tracking-tight text-[#050505]">
                {editing ? "Edit Q&A" : "Add Custom Q&A"}
              </h2>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className={label}>Question *</label>
                <input
                  className={inputBase}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Do you offer monthly maintenance?"
                />
              </div>
              <div>
                <label className={label}>Answer *</label>
                <textarea
                  className={`${inputBase} min-h-[110px] resize-y`}
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  placeholder="Yes — I offer monthly care plans covering updates, backups, and monitoring."
                />
              </div>
              <div>
                <label className={label}>Extra keywords (comma-separated, optional)</label>
                <input
                  className={inputBase}
                  value={kw}
                  onChange={(e) => setKw(e.target.value)}
                  placeholder="maintenance, care plan, retainer, monthly"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#FF6B00] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#050505]"
                >
                  {editing ? "Save Changes" : "Add to Knowledge Base"}
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

        {/* Right: existing Q&A + unmatched */}
        <div className="lg:col-span-7 space-y-8">
          {/* Custom Q&A list */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#5F5F5F]">
                Custom Q&A · {qa.length}
              </h3>
            </div>
            {qa.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#050505]/15 bg-white py-10 text-center text-sm text-[#5F5F5F]">
                No custom entries yet. Add one to train the assistant.
              </p>
            ) : (
              <div className="space-y-3">
                {qa.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-[#050505]/8 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-bold text-[#050505]">{item.question}</p>
                        <p className="mt-1 font-sans text-sm text-[#5F5F5F] leading-relaxed">{item.answer}</p>
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
                          onClick={() => startEdit(item)}
                          title="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F5F5F] transition-colors hover:bg-[#050505]/5 hover:text-[#FF6B00]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => chatbotApi.removeQA(item.id)}
                          title="Delete"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5F5F5F] transition-colors hover:bg-red-50 hover:text-red-500"
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

          {/* Unmatched questions — auto-captured training queue */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-[#5F5F5F]">
                <MessageSquare className="h-3.5 w-3.5 text-[#FF6B00]" />
                Unanswered Questions · {unmatched.length}
              </h3>
              {logs.length > 0 && (
                <button
                  onClick={() => chatbotApi.clearLogs()}
                  className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#5F5F5F] transition-colors hover:text-red-500"
                >
                  <RotateCcw className="h-3 w-3" /> Clear logs
                </button>
              )}
            </div>
            {unmatched.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#050505]/15 bg-white py-8 text-center text-sm text-[#5F5F5F]">
                Nothing unanswered yet. Questions the bot can't confidently answer show up here to train.
              </p>
            ) : (
              <div className="space-y-2">
                {unmatched.slice(0, 20).map((l) => (
                  <div key={l.id}>
                    <UnmatchedRow question={l.question} />
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

/** A captured unanswered question with an inline "teach the answer" action. */
function UnmatchedRow({ question }: { question: string }) {
  const [answering, setAnswering] = useState(false);
  const [draft, setDraft] = useState("");

  const save = () => {
    if (!draft.trim()) return;
    chatbotApi.addQA(question, draft.trim());
    setAnswering(false);
    setDraft("");
  };

  return (
    <div className="rounded-2xl border border-[#050505]/8 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 font-sans text-sm font-semibold text-[#050505]">“{question}”</p>
        {!answering && (
          <button
            onClick={() => setAnswering(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#050505]/12 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#050505] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            <Plus className="h-3 w-3" /> Teach
          </button>
        )}
      </div>
      {answering && (
        <div className="mt-3 flex items-start gap-2">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type the answer to save this as a trained Q&A…"
            className={`${inputBase} min-h-[70px] resize-y`}
          />
          <div className="flex flex-col gap-1">
            <button
              onClick={save}
              title="Save"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B00] text-white transition-colors hover:bg-[#050505]"
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
