/**
 * Client for the Supabase `chat-support` Edge Function.
 *
 * - Generates a cryptographically secure visitor token (stored in the browser).
 * - Sends the visitor's question to the backend.
 * - Never throws: always returns a result object so the chatbot can fall back
 *   to the local `answerQuery` engine when the backend is unavailable.
 *
 * Only PUBLIC values are used here (project URL + publishable key).
 * Never put a Gemini key, service_role key, or any secret in a VITE_ variable.
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, "");
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const TOKEN_STORAGE_KEY = "aneek_support_visitor_v1";
const REQUEST_TIMEOUT_MS = 25_000;

export interface SupportResult {
  ok: boolean;
  answer?: string;
  answered?: boolean;
  reason?: "not_configured" | "rate_limited" | "error";
  message?: string;
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  // base64url, 43 characters, matches the backend's token format check.
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function isValidToken(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{32,128}$/.test(value);
}

function getVisitorToken(): string {
  try {
    const saved = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (isValidToken(saved)) return saved;
  } catch {
    /* storage unavailable, fall through */
  }
  const token = generateToken();
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    /* storage unavailable, token lives only for this call */
  }
  return token;
}

function resetVisitorToken(): string {
  const token = generateToken();
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    /* ignore */
  }
  return token;
}

async function post(message: string, token: string): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`${SUPABASE_URL}/functions/v1/chat-support`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: PUBLISHABLE_KEY as string,
      },
      body: JSON.stringify({ message, visitorToken: token }),
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timer);
  }
}

export async function askSupport(message: string): Promise<SupportResult> {
  if (!SUPABASE_URL || !PUBLISHABLE_KEY) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    let response = await post(message, getVisitorToken());

    // The conversation was closed by an admin: start a fresh session once.
    if (response.status === 409) {
      const data = await response.json().catch(() => null);
      if (data?.code === "conversation_closed") {
        response = await post(message, resetVisitorToken());
      }
    }

    if (response.status === 429) {
      const data = await response.json().catch(() => null);
      return {
        ok: false,
        reason: "rate_limited",
        message: typeof data?.error === "string" ? data.error : undefined,
      };
    }

    if (!response.ok) {
      return { ok: false, reason: "error" };
    }

    const data = await response.json().catch(() => null);
    if (typeof data?.answer !== "string" || !data.answer.trim()) {
      return { ok: false, reason: "error" };
    }

    return { ok: true, answer: data.answer, answered: data.answered === true };
  } catch {
    return { ok: false, reason: "error" };
  }
}