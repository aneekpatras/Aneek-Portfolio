import { useSyncExternalStore } from "react";
import { Project, PORTFOLIO_PROJECTS } from "../types";

/**
 * LocalStorage-backed data layer for the Projects section.
 *
 * The portfolio's <Projects /> component and the Admin Dashboard both talk to
 * THIS module — never to the static PORTFOLIO_PROJECTS array directly. On first
 * run (empty storage) we seed from PORTFOLIO_PROJECTS so the site looks
 * identical until the admin makes a change. Every write persists to
 * LocalStorage and notifies React via useSyncExternalStore, so the live site
 * updates the instant you save in the dashboard (even in another browser tab).
 */

const STORAGE_KEY = "aneek_portfolio_projects_v1";

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function readStorage(): Project[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Project[]) : null;
  } catch {
    return null;
  }
}

/** Current projects: from LocalStorage if present, otherwise a fresh copy of the seed. */
function loadProjects(): Project[] {
  const stored = readStorage();
  return stored ?? clone(PORTFOLIO_PROJECTS);
}

/**
 * `cache` holds the single source of truth in memory. useSyncExternalStore
 * requires getSnapshot() to return a STABLE reference until data actually
 * changes — so we only ever reassign `cache` on a real mutation.
 */
let cache: Project[] = loadProjects();
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  // Sync across browser tabs / windows.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = loadProjects();
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Project[] {
  return cache;
}

function persist(next: Project[]): void {
  // Stamp displayOrder from array position so the sequence is explicit.
  const ordered = next.map((p, i) => ({ ...p, displayOrder: i }));
  cache = ordered;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordered));
  } catch (err) {
    // Storage full / disabled — keep the in-memory copy so the UI still works.
    console.error("Failed to persist projects to LocalStorage:", err);
  }
  listeners.forEach((l) => l());
}

/* ------------------------------- utilities ------------------------------- */

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
  const existing = new Set(cache.map((p) => p.id));
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

/* ------------------------------- public API ------------------------------ */

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
    persist([...cache, withId]);
  },

  update(id: string, patch: Partial<Project>): void {
    persist(cache.map((p) => (p.id === id ? { ...p, ...patch, id } : p)));
  },

  remove(id: string): void {
    persist(cache.filter((p) => p.id !== id));
  },

  /** Move a single project one slot up (-1) or down (+1). */
  move(id: string, direction: -1 | 1): void {
    const index = cache.findIndex((p) => p.id === id);
    if (index === -1) return;
    const target = index + direction;
    if (target < 0 || target >= cache.length) return;
    const next = [...cache];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  },

  /** Drag-and-drop: place `draggedId` at the position of `targetId`. */
  reorder(draggedId: string, targetId: string): void {
    if (draggedId === targetId) return;
    const from = cache.findIndex((p) => p.id === draggedId);
    const to = cache.findIndex((p) => p.id === targetId);
    if (from === -1 || to === -1) return;
    const next = [...cache];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persist(next);
  },

  /** Replace the entire list (used by JSON import). */
  replaceAll(list: Project[]): void {
    persist(list);
  },

  /** Wipe overrides and fall back to the code-defined seed data. */
  reset(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    cache = clone(PORTFOLIO_PROJECTS);
    listeners.forEach((l) => l());
  },
};

/** React hook — re-renders on any change, in this tab or another. */
export function useProjects(): Project[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
