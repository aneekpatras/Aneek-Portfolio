import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  LayoutGrid,
  List as ListIcon,
  Search,
  ExternalLink,
  Github,
  Star,
  Download,
  Upload,
  RotateCcw,
  Eye,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { Project } from "../types";
import { useProjects, projectApi } from "../lib/projectStore";
import ProjectForm from "./ProjectForm";
import ChatbotTraining from "./ChatbotTraining";

type ViewMode = "grid" | "list";
type AdminTab = "projects" | "chatbot";

export default function AdminDashboard() {
  const projects = useProjects();
  const [view, setView] = useState<ViewMode>("list");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>("projects");
  const fileInput = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? projects.filter((p) =>
        `${p.title} ${p.category} ${p.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : projects;

  // Drag-and-drop reordering is only safe on the full, unfiltered list.
  const dragEnabled = query.trim() === "";

  const handleSave = (project: Project) => {
    if (editing) projectApi.update(editing.id, project);
    else projectApi.add(project);
    setEditing(null);
    setCreating(false);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(projectApi.getAll(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-projects.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data)) throw new Error("Not an array");
        projectApi.replaceAll(data as Project[]);
      } catch {
        alert("Invalid JSON file. Expected an array of projects.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans text-[#050505]">
      {/* ---------------------------------------------------------------- */}
      {/* Top bar                                                          */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[#050505]/8 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6B00] text-white">
              <LayoutGrid className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-extrabold leading-none tracking-tight">
                Projects Admin
              </h1>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#5F5F5F]">
                {projects.length} project{projects.length === 1 ? "" : "s"} · saved locally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#050505]/12 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#050505] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
            >
              <Eye className="h-3.5 w-3.5" /> View Site
            </Link>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#050505]"
            >
              <Plus className="h-4 w-4" /> Add Project
            </button>
          </div>
        </div>
      </header>

      {/* Tab switcher */}
      <div className="mx-auto max-w-6xl px-5 pt-6">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("projects")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
              tab === "projects"
                ? "bg-[#050505] text-white"
                : "border border-[#050505]/12 bg-white text-[#5F5F5F] hover:text-[#050505]"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Projects
          </button>
          <button
            onClick={() => setTab("chatbot")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
              tab === "chatbot"
                ? "bg-[#050505] text-white"
                : "border border-[#050505]/12 bg-white text-[#5F5F5F] hover:text-[#050505]"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" /> Chatbot Training
          </button>
        </div>
      </div>

      {tab === "chatbot" ? (
        <ChatbotTraining />
      ) : (
      <>
      {/* ---------------------------------------------------------------- */}
      {/* Toolbar                                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="mx-auto max-w-6xl px-5 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F5F5F]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-full border border-[#050505]/12 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#FF6B00]"
            />
          </div>

          {/* View toggle */}
          <div className="flex overflow-hidden rounded-full border border-[#050505]/12 bg-white">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                view === "list" ? "bg-[#050505] text-white" : "text-[#5F5F5F] hover:text-[#050505]"
              }`}
            >
              <ListIcon className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => setView("grid")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                view === "grid" ? "bg-[#050505] text-white" : "text-[#5F5F5F] hover:text-[#050505]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Grid
            </button>
          </div>

          {/* Data actions */}
          <button
            onClick={handleExport}
            title="Export JSON"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#050505]/12 bg-white text-[#5F5F5F] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            title="Import JSON"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#050505]/12 bg-white text-[#5F5F5F] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            <Upload className="h-4 w-4" />
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={() => {
              if (
                confirm(
                  "Reset to the original code-defined projects? This discards all local changes."
                )
              )
                projectApi.reset();
            }}
            title="Reset to defaults"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#050505]/12 bg-white text-[#5F5F5F] transition-colors hover:border-red-400 hover:text-red-500"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {query.trim() && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#5F5F5F]">
            Reordering is disabled while searching · clear search to drag
          </p>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Project list / grid                                              */}
      {/* ---------------------------------------------------------------- */}
      <main className="mx-auto max-w-6xl px-5 py-6">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#050505]/15 bg-white py-20 text-center">
            <p className="text-sm font-semibold text-[#5F5F5F]">
              {query.trim() ? "No projects match your search." : "No projects yet."}
            </p>
            {!query.trim() && (
              <button
                onClick={() => setCreating(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#050505]"
              >
                <Plus className="h-4 w-4" /> Add your first project
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-3"
            }
          >
            {filtered.map((project, index) => {
              const isDragOver = dragOverId === project.id && dragId !== project.id;
              return (
                <article
                  key={project.id}
                  draggable={dragEnabled}
                  onDragStart={() => setDragId(project.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setDragOverId(null);
                  }}
                  onDragOver={(e) => {
                    if (!dragEnabled || !dragId) return;
                    e.preventDefault();
                    setDragOverId(project.id);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragId) projectApi.reorder(dragId, project.id);
                    setDragId(null);
                    setDragOverId(null);
                  }}
                  className={`group relative flex gap-4 rounded-2xl border bg-white p-3 transition-all ${
                    view === "list" ? "flex-row items-center" : "flex-col"
                  } ${
                    isDragOver
                      ? "border-[#FF6B00] ring-2 ring-[#FF6B00]/30"
                      : "border-[#050505]/8 hover:border-[#050505]/20"
                  } ${dragId === project.id ? "opacity-40" : "opacity-100"}`}
                >
                  {/* Drag handle + order index */}
                  {dragEnabled && (
                    <div
                      className={`flex items-center gap-1 text-[#5F5F5F] ${
                        view === "grid" ? "absolute left-3 top-3 z-10 rounded-md bg-white/90 px-1 py-0.5" : ""
                      }`}
                      title="Drag to reorder"
                    >
                      <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
                      <span className="font-mono text-[11px] font-bold">{index + 1}</span>
                    </div>
                  )}

                  {/* Thumbnail */}
                  <div
                    className={`overflow-hidden rounded-xl bg-[#F5F5F3] ${
                      view === "list" ? "h-16 w-24 shrink-0" : "aspect-[16/10] w-full"
                    }`}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase text-[#5F5F5F]/50">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-bold leading-tight text-[#050505]">
                        {project.title || "Untitled"}
                      </h3>
                      {project.featured && (
                        <Star className="h-3.5 w-3.5 shrink-0 fill-[#FF6B00] text-[#FF6B00]" />
                      )}
                      {project.status === "draft" && (
                        <span className="shrink-0 rounded bg-[#050505]/8 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#5F5F5F]">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-[#FF6B00]">
                      {project.category || "—"}
                    </p>
                    {view === "grid" && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-[#5F5F5F]">
                        {project.subtitle}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, view === "list" ? 4 : 6).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-[#050505]/5 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#5F5F5F]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex shrink-0 items-center gap-1 ${
                      view === "grid" ? "border-t border-[#050505]/6 pt-2" : ""
                    }`}
                  >
                    <IconBtn
                      title="Move up"
                      disabled={index === 0 || !dragEnabled}
                      onClick={() => projectApi.move(project.id, -1)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn
                      title="Move down"
                      disabled={index === filtered.length - 1 || !dragEnabled}
                      onClick={() => projectApi.move(project.id, 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </IconBtn>
                    {project.link && (
                      <IconBtn title="Open live demo" as="a" href={project.link}>
                        <ExternalLink className="h-4 w-4" />
                      </IconBtn>
                    )}
                    {project.github && (
                      <IconBtn title="Open GitHub" as="a" href={project.github}>
                        <Github className="h-4 w-4" />
                      </IconBtn>
                    )}
                    <IconBtn title="Edit" onClick={() => setEditing(project)}>
                      <Pencil className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn
                      title="Delete"
                      danger
                      onClick={() => setConfirmDelete(project)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Modals                                                           */}
      {/* ---------------------------------------------------------------- */}
      {(creating || editing) && (
        <ProjectForm
          initial={editing}
          onSave={handleSave}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#050505]/70 p-4 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl border border-[#050505]/10 bg-[#F5F5F3] p-6 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold">Delete this project?</h3>
            <p className="mt-1.5 text-sm text-[#5F5F5F]">
              <span className="font-bold text-[#050505]">{confirmDelete.title}</span>{" "}
              will be permanently removed from your portfolio.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-full border border-[#050505]/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#050505] transition-colors hover:bg-[#050505]/5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  projectApi.remove(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="flex-1 rounded-full bg-red-500 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------- small action button --------------------------- */

interface IconBtnProps {
  children: ReactNode;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  as?: "button" | "a";
  href?: string;
}

function IconBtn({ children, title, onClick, disabled, danger, as = "button", href }: IconBtnProps) {
  const cls = `flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[#5F5F5F] transition-colors ${
    disabled
      ? "cursor-not-allowed opacity-30"
      : danger
      ? "hover:bg-red-50 hover:text-red-500"
      : "hover:bg-[#050505]/5 hover:text-[#FF6B00]"
  }`;

  if (as === "a") {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" title={title} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
