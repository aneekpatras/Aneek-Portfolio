import { useSyncExternalStore } from "react";
import { Project, PORTFOLIO_PROJECTS } from "../types";
import { supabase } from "./supabase";

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

let cache: Project[] = clone(PORTFOLIO_PROJECTS);
const listeners = new Set<() => void>();
const errorListeners = new Set<(message: string) => void>();
let firstSubscriberLoaded = false;
let writeQueue: Promise<void> = Promise.resolve();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

export function onProjectError(listener: (message: string) => void): () => void {
  errorListeners.add(listener);
  return () => errorListeners.delete(listener);
}

function notifyError(message: string): void {
  errorListeners.forEach((listener) => listener(message));
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    if (typeof message === "string") return message;
  }
  return String(error);
}

async function loadRemote(): Promise<void> {
  const client = supabase;
  if (!client) return;

  try {
    const { data, error } = await client
      .from("site_projects")
      .select("id, display_order, published, data")
      .order("display_order", { ascending: true });

    if (error || !data?.length) return;

    const rows = data as Array<{
      id: string;
      display_order: number;
      published: boolean;
      data: Omit<Project, "id" | "status" | "displayOrder">;
    }>;
    const projects = rows.map((row) => ({
      ...row.data,
      id: row.id,
      displayOrder: row.display_order,
      status: row.published ? "published" as const : "draft" as const,
    }));

    if (JSON.stringify(cache) !== JSON.stringify(projects)) {
      cache = projects;
      notifyListeners();
    }
  } catch {
    // Keep the current cache if the remote read is unavailable.
  }
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  if (!firstSubscriberLoaded) {
    firstSubscriberLoaded = true;
    void loadRemote();
  }
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Project[] {
  return cache;
}

type WriteOperation =
  | { type: "upsert"; ids: string[] }
  | { type: "delete"; id: string }
  | { type: "all" }
  | { type: "replaceAll" };

function toRow(project: Project, displayOrder: number) {
  const { id, status, displayOrder: _displayOrder, ...data } = project;
  return {
    id,
    display_order: displayOrder,
    published: status !== "draft",
    data,
    updated_at: new Date().toISOString(),
  };
}

async function requireAdminSession(): Promise<NonNullable<typeof supabase>> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error("Sign in as an admin to save project changes.");
  return supabase;
}

async function writeToRemote(
  operation: WriteOperation,
  projects: Project[]
): Promise<void> {
  const client = await requireAdminSession();
  const ordered = projects.map((project, index) => ({
    ...project,
    displayOrder: index,
  }));

  if (operation.type === "delete") {
    const { error } = await client
      .from("site_projects")
      .delete()
      .eq("id", operation.id);
    if (error) throw error;
    return;
  }

  if (operation.type === "upsert") {
    const rows = ordered
      .filter((project) => operation.ids.includes(project.id))
      .map((project) => toRow(project, project.displayOrder ?? 0));
    const { error } = await client
      .from("site_projects")
      .upsert(rows, { onConflict: "id" });
    if (error) throw error;
    return;
  }

  if (operation.type === "replaceAll") {
    const { data: existingRows, error: selectError } = await client
      .from("site_projects")
      .select("id");
    if (selectError) throw selectError;

    const currentIds = new Set(ordered.map((project) => project.id));
    const removedIds = (existingRows ?? [])
      .map((row) => row.id as string)
      .filter((id) => !currentIds.has(id));

    if (ordered.length) {
      const { error } = await client
        .from("site_projects")
        .upsert(ordered.map((project, index) => toRow(project, index)), {
          onConflict: "id",
        });
      if (error) throw error;
    }

    if (removedIds.length) {
      const { error } = await client
        .from("site_projects")
        .delete()
        .in("id", removedIds);
      if (error) throw error;
    }
    return;
  }

  if (ordered.length) {
    const { error } = await client
      .from("site_projects")
      .upsert(ordered.map((project, index) => toRow(project, index)), {
        onConflict: "id",
      });
    if (error) throw error;
  }
}

async function reloadAfterFailure(operation: string, error: unknown): Promise<void> {
  cache = clone(PORTFOLIO_PROJECTS);
  notifyListeners();
  await loadRemote();
  notifyError(`${operation}: ${errorMessage(error)}`);
}

function persist(next: Project[], operation: WriteOperation): void {
  const ordered = next.map((project, index) => ({ ...project, displayOrder: index }));
  cache = ordered;
  notifyListeners();

  writeQueue = writeQueue.then(async () => {
    try {
      await writeToRemote(operation, ordered);
    } catch (error) {
      await reloadAfterFailure("Failed to save projects", error);
    }
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generate a unique, human-readable id from a title. */
export function newProjectId(title: string): string {
  const base = slugify(title) || "project";
  const existing = new Set(cache.map((project) => project.id));
  if (!existing.has(base)) return base;
  let n = 2;
  while (existing.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** A blank project with sensible defaults for the "Add" form. */
export function emptyProject(): Project {
  return {
    id: "",
    title: "",
    category: "",
    subtitle: "",
    image: "",
    tags: [],
    performanceMetric: { label: "", value: "" },
    overview: "",
    challenge: "",
    solution: "",
    results: [],
    completionYear: String(new Date().getFullYear()),
    link: "",
    github: "",
    status: "published",
    featured: false,
  };
}

export const projectApi = {
  /** Snapshot of the current list (a copy — safe to mutate). */
  getAll(): Project[] {
    return clone(cache);
  },

  add(project: Project): void {
    const withId: Project = {
      ...project,
      id: project.id || newProjectId(project.title),
    };
    persist([...cache, withId], { type: "upsert", ids: [withId.id] });
  },

  update(id: string, patch: Partial<Project>): void {
    persist(
      cache.map((project) => (project.id === id ? { ...project, ...patch, id } : project)),
      { type: "upsert", ids: [id] }
    );
  },

  remove(id: string): void {
    persist(cache.filter((project) => project.id !== id), { type: "delete", id });
  },

  /** Move a single project one slot up (-1) or down (+1). */
  move(id: string, direction: -1 | 1): void {
    const index = cache.findIndex((project) => project.id === id);
    if (index === -1) return;
    const target = index + direction;
    if (target < 0 || target >= cache.length) return;
    const next = [...cache];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next, { type: "all" });
  },

  /** Drag-and-drop: place `draggedId` at the position of `targetId`. */
  reorder(draggedId: string, targetId: string): void {
    if (draggedId === targetId) return;
    const from = cache.findIndex((project) => project.id === draggedId);
    const to = cache.findIndex((project) => project.id === targetId);
    if (from === -1 || to === -1) return;
    const next = [...cache];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persist(next, { type: "all" });
  },

  /** Replace the entire list (used by JSON import). */
  replaceAll(list: Project[]): void {
    persist(list, { type: "replaceAll" });
  },

  /** Seed the database with the code-defined projects. */
  reset(): void {
    writeQueue = writeQueue.then(async () => {
      try {
        const client = await requireAdminSession();
        const { error } = await client
          .from("site_projects")
          .upsert(
            PORTFOLIO_PROJECTS.map((project, index) => toRow(project, index)),
            { onConflict: "id" }
          );
        if (error) throw error;
        await loadRemote();
      } catch (error) {
        await reloadAfterFailure("Failed to seed projects from code", error);
      }
    });
  },
};

if (supabase) {
  supabase.auth.onAuthStateChange(() => {
    void loadRemote();
  });
}

void loadRemote();

/** React hook — re-renders on any change. */
export function useProjects(): Project[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
