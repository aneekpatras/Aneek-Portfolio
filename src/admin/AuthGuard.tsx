import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Status = "loading" | "signedOut" | "denied" | "ok";

const shell = "flex min-h-screen items-center justify-center bg-[#F5F5F3] px-5 font-sans text-[#050505]";
const card = "w-full max-w-sm rounded-3xl border border-[#050505]/10 bg-white p-7 shadow-xl";
const btn =
  "w-full rounded-full bg-[#FF6B00] px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#050505] disabled:opacity-50";
const input =
  "w-full rounded-full border border-[#050505]/12 bg-[#F5F5F3] px-4 py-3 text-sm outline-none transition-colors focus:border-[#FF6B00]";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify(session: Session | null) {
    if (!supabase) return;
    if (!session) {
      setRole(null);
      setStatus("signedOut");
      return;
    }
    const { data, error: roleError } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!roleError && data && (data.role === "owner" || data.role === "admin")) {
      setRole(data.role);
      setStatus("ok");
    } else {
      setRole(null);
      setStatus("denied");
    }
  }

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer: never call other Supabase APIs directly inside this callback.
      setTimeout(() => {
        void verify(session);
      }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (signInError) setError("Invalid email or password.");
    else setPassword("");
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
  }

  if (!supabase) {
    return (
      <div className={shell}>
        <div className={card}>
          <h1 className="text-lg font-extrabold">Admin unavailable</h1>
          <p className="mt-2 text-sm text-[#5F5F5F]">Login is not configured for this build.</p>
          <Link to="/" className="mt-5 block text-center text-xs font-bold uppercase tracking-widest text-[#FF6B00]">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className={shell}>
        <p className="font-mono text-xs uppercase tracking-widest text-[#5F5F5F]">Loading…</p>
      </div>
    );
  }

  if (status === "signedOut") {
    return (
      <div className={shell}>
        <form onSubmit={signIn} className={card}>
          <h1 className="text-xl font-extrabold tracking-tight">Admin login</h1>
          <p className="mt-1 text-sm text-[#5F5F5F]">Sign in to manage your portfolio.</p>
          <div className="mt-5 space-y-3">
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={input}
            />
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={input}
            />
          </div>
          {error && <p className="mt-3 text-xs font-semibold text-red-500">{error}</p>}
          <button type="submit" disabled={busy} className={`${btn} mt-5`}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <Link to="/" className="mt-4 block text-center text-xs font-bold uppercase tracking-widest text-[#5F5F5F] hover:text-[#FF6B00]">
            Back to site
          </Link>
        </form>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className={shell}>
        <div className={card}>
          <h1 className="text-lg font-extrabold">Access denied</h1>
          <p className="mt-2 text-sm text-[#5F5F5F]">This account does not have admin access.</p>
          <button onClick={signOut} className={`${btn} mt-5`}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-full border border-[#050505]/10 bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#5F5F5F]">{role}</span>
        <button
          onClick={signOut}
          className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B00] hover:text-[#050505]"
        >
          Sign out
        </button>
      </div>
    </>
  );
}