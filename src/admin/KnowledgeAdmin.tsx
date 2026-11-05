import { useCallback, useEffect, useState, type FormEvent } from "react";
import { BookOpen, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";

interface KnowledgeRow {
  id: string;
  source_key: string;
  title: string;
  content: string;
  published: boolean;
  sort_order: number;
}

const inputBase =
  "w-full rounded-xl border border-[#050505]/12 bg-white px-4 py-2.5 text-sm text-[#050505] outline-none transition-colors placeholder:text-[#5F5F5F]/60 focus:border-[#FF6B00]";
const label = "block font-mono text-[10px] font-bold uppercase tracking-widest text-[#5F5F5F] mb-1.5";

export default function KnowledgeAdmin() {
  const [rows, setRows] = useState<KnowledgeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [sourceKey, setSourceKey] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [published, setPublished] = useState(true);
  const [editing, setEditing] = useState<KnowledgeRow | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error: loadError } = await supabase
      .from("chatbot_knowledge")
      .select("id, source_key, title, content, published, sort_order")
      .order("sort_order", { ascending: true });

    if (loadError) setError(`Could not load knowledge rows: ${loadError.message}`);
    else setRows((data ?? []) as KnowledgeRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(action: () => PromiseLike<{
    data: unknown;
    error: { message: string; code?: string } | null;
  }>) {
    setBusy(true);
    setError("");
    try {
      const { data, error: actionError } = await action();
      if (actionError) {
        setError(
          actionError.code === "23505"
            ? "This source key already exists. Edit that row instead."
            : actionError.message
        );
        return false;
      }
      if (Array.isArray(data) && data.length === 0) {
        setError("Nothing was changed. You may not have permission for this action.");
        return false;
      }
      await load();
      return true;
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "The action failed.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const resetForm = () => {
    setSourceKey("");
    setTitle("");
    setContent("");
    setSortOrder("");
    setPublished(true);
    setEditing(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || busy) return;

    const normalizedKey = sourceKey.trim().toLowerCase();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (
      !normalizedKey ||
      !/^[a-z0-9_-]{1,100}$/.test(normalizedKey) ||
      !trimmedTitle ||
      !trimmedContent
    ) {
      return;
    }

    const nextSortOrder = sortOrder.trim()
      ? Number(sortOrder)
      : (rows.length ? Math.max(...rows.map((row) => row.sort_order)) : 0) + 10;
    if (!Number.isInteger(nextSortOrder)) return;

    const ok = editing
      ? await run(() =>
          supabase!
            .from("chatbot_knowledge")
            .update({
              title: trimmedTitle,
              content: trimmedContent,
              published,
              sort_order: nextSortOrder,
              updated_at: new Date().toISOString(),
            })
            .eq("id", editing.id)
            .select("id")
        )
      : await run(() =>
          supabase!
            .from("chatbot_knowledge")
            .insert({
              source_key: normalizedKey,
              title: trimmedTitle,
              content: trimmedContent,
              published,
              sort_order: nextSortOrder,
            })
            .select("id")
        );

    if (ok) resetForm();
  };

  const startEdit = (item: KnowledgeRow) => {
    setEditing(item);
    setSourceKey(item.source_key);
    setTitle(item.title);
    setContent(item.content);
    setSortOrder(String(item.sort_order));
    setPublished(item.published);
  };

  const togglePublish = (item: KnowledgeRow) =>
    run(() =>
      supabase!
        .from("chatbot_knowledge")
        .update({ published: !item.published, updated_at: new Date().toISOString() })
        .eq("id", item.id)
        .select("id")
    );

  const removeRow = (item: KnowledgeRow) => {
    if (!confirm(`Delete this knowledge row?\n\n${item.source_key}`)) return;
    void run(() =>
      supabase!.from("chatbot_knowledge").delete().eq("id", item.id).select("id")
    );
  };

  if (!supabase) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-6">
        <p className="rounded-2xl border border-dashed border-[#050505]/15 bg-white py-10 text-center text-sm text-[#5F5F5F]">
          Supabase is not configured.
        </p>
      </div>
    );
  }

  const publishedCount = rows.filter((row) => row.published).length;

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
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-[#050505]/8 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#FF6B00]" />
              <h2 className="font-sans text-lg font-extrabold tracking-tight text-[#050505]">
                {editing ? "Edit Knowledge" : "Add Knowledge"}
              </h2>
            </div>
            <p className="mb-4 rounded-xl bg-[#F5F5F3] p-3 text-xs leading-relaxed text-[#5F5F5F]">
              The chatbot reads only published rows (max 60). Write short, clear, factual English. Do not put secrets here.
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className={label}>Source key *</label>
                <input
                  className={inputBase}
                  value={sourceKey}
                  maxLength={100}
                  required
                  disabled={Boolean(editing)}
                  onChange={(e) =>
                    setSourceKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                  }
                  placeholder="about-services"
                />
              </div>
              <div>
                <label className={label}>Title *</label>
                <input
                  className={inputBase}
                  value={title}
                  maxLength={200}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Services and expertise"
                />
              </div>
              <div>
                <label className={label}>Content *</label>
                <textarea
                  className={`${inputBase} min-h-[160px] resize-y`}
                  value={content}
                  maxLength={10000}
                  required
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write verified, factual information for the chatbot."
                />
                <p className="mt-1 text-right font-mono text-[10px] text-[#5F5F5F]">
                  {content.length} / 10000
                </p>
              </div>
              <div>
                <label className={label}>Sort order</label>
                <input
                  className={inputBase}
                  type="number"
                  step="1"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="Auto"
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
                  {editing ? "Save Changes" : "Add Knowledge"}
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

        <div className="lg:col-span-7">
          <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-widest text-[#5F5F5F]">
            Knowledge rows · {rows.length}, published {publishedCount}
          </h3>
          {loading ? (
            <p className="py-10 text-center text-sm text-[#5F5F5F]">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[#050505]/15 bg-white py-10 text-center text-sm text-[#5F5F5F]">
              No knowledge rows yet. Add one to inform the chatbot.
            </p>
          ) : (
            <div className="space-y-3">
              {rows.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#050505]/8 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-sans text-sm font-bold text-[#050505]">{item.title}</p>
                        <span className="rounded bg-[#050505]/5 px-1.5 py-0.5 font-mono text-[9px] text-[#5F5F5F]">
                          {item.source_key}
                        </span>
                        {!item.published && (
                          <span className="shrink-0 rounded bg-[#050505]/8 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#5F5F5F]">
                            Unpublished
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#5F5F5F]">
                        {item.content}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => void togglePublish(item)}
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
                        onClick={() => removeRow(item)}
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
      </div>
    </div>
  );
}
