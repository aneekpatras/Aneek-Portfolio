import { useEffect, type ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageShellProps {
  children: ReactNode;
}

/** Derive the active nav key from the current hash, e.g. "#/about" → "/about". */
function currentNavKey(): string {
  const seg = window.location.hash
    .replace(/^#\/?/, "")
    .split(/[/?#]/)[0]
    .toLowerCase();
  return seg ? `/${seg}` : "";
}

/**
 * Shared chrome for the standalone routed pages (About, Skills, Experience,
 * Contact): grain texture, the full persistent site Header, the page content,
 * and the footer. Keeps the header identical to the homepage across all views.
 */
export default function PageShell({ children }: PageShellProps) {
  // Land at the top and make sure body scroll is unlocked when arriving here.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "";
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#050505] font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* Grain texture to match the site */}
      <div className="fixed inset-0 z-40 pointer-events-none grain-overlay" />

      {/* Full persistent site header (fixed) */}
      <Header activeSection={currentNavKey()} />

      {/* Page content */}
      <main className="relative z-10">{children}</main>

      <Footer />
    </div>
  );
}
