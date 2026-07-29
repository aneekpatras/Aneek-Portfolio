import { useSyncExternalStore } from "react";

/**
 * LocalStorage-backed store for the chatbot's trainable knowledge:
 *  - `qa`   : admin-authored custom Question/Answer pairs (highest priority).
 *  - `logs` : every answered turn, used for reinforcement + unmatched review.
 * Both the widget (reads/logs) and the Admin "Chatbot Training" panel
 * (CRUD) talk to this module, so edits reflect in the bot immediately.
 */

export interface CustomQA {
  id: string;
  question: string;
  answer: string;
  keywords?: string[];
}

export interface ChatLog {
  id: string;
  question: string;
  answer: string;
  matchedId: string | null;
  matched: boolean;
  ts: number;
}

interface ChatbotData {
  qa: CustomQA[];
  logs: ChatLog[];
}

const STORAGE_KEY = "aneek_chatbot_v1";
const MAX_LOGS = 400;

const SEED_QA: CustomQA[] = [
  {
    id: "seed-greeting-name",
    question: "Who are you / who is Aneek?",
    answer:
      "I'm Aneek — a WordPress Developer & Frontend Architect. I build fast, secure, high-converting websites with clean custom code.",
    keywords: ["who", "name", "aneek", "you"],
  },
];

function clone<T>(v: T): T {
  return typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v));
}

function read(): ChatbotData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.qa) || !Array.isArray(parsed.logs)) return null;
    return parsed as ChatbotData;
  } catch {
    return null;
  }
}

function load(): ChatbotData {
  return read() ?? { qa: clone(SEED_QA), logs: [] };
}

let cache: ChatbotData = load();
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ChatbotData {
  return cache;
}

function persist(next: ChatbotData): void {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error("Failed to persist chatbot data:", err);
  }
  listeners.forEach((l) => l());
}

function uid(prefix: string): string {
  const rnd =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${rnd}`;
}

export const chatbotApi = {
  getQA(): CustomQA[] {
    return clone(cache.qa);
  },

  addQA(question: string, answer: string, keywords?: string[]): void {
    const entry: CustomQA = { id: uid("qa"), question, answer, keywords };
    persist({ ...cache, qa: [entry, ...cache.qa] });
  },

  updateQA(id: string, patch: Partial<CustomQA>): void {
    persist({
      ...cache,
      qa: cache.qa.map((q) => (q.id === id ? { ...q, ...patch, id } : q)),
    });
  },

  removeQA(id: string): void {
    persist({ ...cache, qa: cache.qa.filter((q) => q.id !== id) });
  },

  /** Log an answered turn (drives reinforcement + unmatched review). */
  logChat(entry: Omit<ChatLog, "id" | "ts">): void {
    const log: ChatLog = { ...entry, id: uid("log"), ts: Date.now() };
    const logs = [log, ...cache.logs].slice(0, MAX_LOGS);
    persist({ ...cache, logs });
  },

  clearLogs(): void {
    persist({ ...cache, logs: [] });
  },

  /** Promote an unmatched question into a trained Q&A pair. */
  trainFromLog(logId: string, answer: string): void {
    const log = cache.logs.find((l) => l.id === logId);
    if (!log) return;
    chatbotApi.addQA(log.question, answer);
  },

  reset(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    cache = { qa: clone(SEED_QA), logs: [] };
    listeners.forEach((l) => l());
  },
};

export function useChatbotData(): ChatbotData {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
