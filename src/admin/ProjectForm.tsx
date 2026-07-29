import { useEffect, useState, type FormEvent } from "react";
import { X, Plus, Star } from "lucide-react";
import { Project } from "../types";
import { emptyProject } from "../lib/projectStore";

interface ProjectFormProps {
  /** Pass a project to edit, or null to create a new one. */
  initial: Project | null;
  onSave: (project: Project) => void;
  onClose: () => void;
}

const inputBase =
  "w-full rounded-xl border border-[#050505]/12 bg-white px-4 py-2.5 text-sm text-[#050505] outline-none transition-colors placeholder:text-[#5F5F5F]/60 focus:border-[#FF6B00]";
const labelBase =
  "block font-mono text-[10px] font-bold uppercase tracking-widest text-[#5F5F5F] mb-1.5";

export default function ProjectForm({ initial, onSave, onClose }: ProjectFormProps) {
  const [form, setForm] = useState<Project>(() => initial ?? emptyProject());
  const [tagDraft, setTagDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addTag = () => {
    const value = tagDraft.trim();
    if (!value) return;
    if (!form.tags.includes(value)) set("tags", [...form.tags, value]);
    setTagDraft("");
  };

  const removeTag = (tag: string) =>
    set("tags", form.tags.filter((t) => t !== tag));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-start justify-center overflow-y-auto bg-[#050505]/70 p-4 backdrop-blur-sm md:p-8"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="relative my-4 w-full max-w-2xl rounded-3xl border border-[#050505]/10 bg-[#F5F5F3] shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-[#050505]/8 bg-[#F5F5F3]/95 px-6 py-4 backdrop-blur-sm">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#FF6B00]">
              {initial ? "Edit Project" : "New Project"}
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-[#050505]">
              {initial ? form.title || "Untitled" : "Add a Project"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#050505]/10 bg-white text-[#050505] transition-colors hover:bg-[#FF6B00] hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6">
          <div>
            <label className={labelBase}>Title *</label>
            <input
              className={inputBase}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="The Victorias Coffee"
              autoFocus
            />
          </div>

          <div>
            <label className={labelBase}>Category</label>
            <input
              className={inputBase}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="WooCommerce & Custom Theme Engineering"
            />
          </div>

          <div>
            <label className={labelBase}>Description (shown on card)</label>
            <textarea
              className={`${inputBase} min-h-[70px] resize-y`}
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Short one-line summary of the project."
            />
          </div>

          {/* Tech Stack tags */}
          <div>
            <label className={labelBase}>Tech Stack</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#050505]/8 bg-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#5F5F5F]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-[#5F5F5F] hover:text-[#FF6B00]"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={inputBase}
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="flex shrink-0 items-center gap-1 rounded-xl border border-[#050505]/12 bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#050505] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Media + links */}
          <div>
            <label className={labelBase}>Image / Thumbnail URL</label>
            <input
              className={inputBase}
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://…/image.jpg"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 h-32 w-full rounded-xl border border-[#050505]/8 object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
                onLoad={(e) => (e.currentTarget.style.display = "block")}
              />
            )}
          </div>

          <div>
            <label className={labelBase}>Hover Image URL (shown on card hover)</label>
            <input
              className={inputBase}
              value={form.hoverImage ?? ""}
              onChange={(e) => set("hoverImage", e.target.value)}
              placeholder="https://…/hover.jpg"
            />
            {form.hoverImage && (
              <img
                src={form.hoverImage}
                alt="Hover preview"
                className="mt-2 h-32 w-full rounded-xl border border-[#050505]/8 object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
                onLoad={(e) => (e.currentTarget.style.display = "block")}
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelBase}>Live Demo Link</label>
              <input
                className={inputBase}
                value={form.link}
                onChange={(e) => set("link", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className={labelBase}>GitHub Link</label>
              <input
                className={inputBase}
                value={form.github ?? ""}
                onChange={(e) => set("github", e.target.value)}
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>

          {/* Performance metric */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelBase}>Metric Label</label>
              <input
                className={inputBase}
                value={form.performanceMetric.label}
                onChange={(e) =>
                  set("performanceMetric", {
                    ...form.performanceMetric,
                    label: e.target.value,
                  })
                }
                placeholder="PageSpeed Index Rating"
              />
            </div>
            <div>
              <label className={labelBase}>Metric Value</label>
              <input
                className={inputBase}
                value={form.performanceMetric.value}
                onChange={(e) =>
                  set("performanceMetric", {
                    ...form.performanceMetric,
                    value: e.target.value,
                  })
                }
                placeholder="41 → 88"
              />
            </div>
          </div>

          {/* Optional case-study details */}
          <details className="rounded-xl border border-[#050505]/8 bg-white/50 px-4 py-3">
            <summary className="cursor-pointer font-mono text-[10px] font-bold uppercase tracking-widest text-[#5F5F5F]">
              Case Study Details (optional)
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelBase}>Overview</label>
                <textarea
                  className={`${inputBase} min-h-[60px] resize-y`}
                  value={form.overview}
                  onChange={(e) => set("overview", e.target.value)}
                />
              </div>
              <div>
                <label className={labelBase}>Challenge</label>
                <textarea
                  className={`${inputBase} min-h-[60px] resize-y`}
                  value={form.challenge}
                  onChange={(e) => set("challenge", e.target.value)}
                />
              </div>
              <div>
                <label className={labelBase}>Solution</label>
                <textarea
                  className={`${inputBase} min-h-[60px] resize-y`}
                  value={form.solution}
                  onChange={(e) => set("solution", e.target.value)}
                />
              </div>
              <div>
                <label className={labelBase}>Results (one per line)</label>
                <textarea
                  className={`${inputBase} min-h-[80px] resize-y`}
                  value={form.results.join("\n")}
                  onChange={(e) =>
                    set(
                      "results",
                      e.target.value.split("\n").map((l) => l.trimEnd()).filter(Boolean)
                    )
                  }
                  placeholder={"PageSpeed score improved from 41 to 88.\nRedesigned checkout flow."}
                />
              </div>
            </div>
          </details>

          {/* Meta */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelBase}>Completion Year</label>
              <input
                className={inputBase}
                value={form.completionYear}
                onChange={(e) => set("completionYear", e.target.value)}
                placeholder="2025"
              />
            </div>
            <div>
              <label className={labelBase}>Status</label>
              <select
                className={inputBase}
                value={form.status ?? "published"}
                onChange={(e) => set("status", e.target.value as Project["status"])}
              >
                <option value="published">Published (visible on site)</option>
                <option value="draft">Draft (hidden)</option>
              </select>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#050505]">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-[#FF6B00]"
            />
            <Star className="h-4 w-4 text-[#FF6B00]" />
            Mark as featured
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 rounded-b-3xl border-t border-[#050505]/8 bg-[#F5F5F3]/95 px-6 py-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#050505]/15 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#050505] transition-colors hover:bg-[#050505]/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-[#FF6B00] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#050505]"
          >
            {initial ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
