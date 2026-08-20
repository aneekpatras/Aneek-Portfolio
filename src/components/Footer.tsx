import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowUp, Linkedin, Github, Instagram } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { text: "Home", href: "#/" },
    { text: "About", href: "#/about" },
    { text: "Work", href: "#/work" },
    { text: "Experience", href: "#/experience" },
    { text: "Contact", href: "#/contact" },
  ];

  const socials = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/aneek-patras", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/aneekpatras", label: "GitHub" },
    { icon: Instagram, href: "https://www.instagram.com/aneek_khokhar?igsh=c3F2YmRvdWQ1c25u", label: "Instagram" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Home always routes to "/" (or scrolls to top if already there), instead of
    // following the hash-fragment scheme the other route links use.
    if (href === "#/") {
      e.preventDefault();
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      return;
    }

    // Route links (#/about, #/work, …) navigate to another view — let the hash change through.
    if (href.startsWith("#/")) return;

    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    } else {
      window.location.hash = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      id="site-footer"
      className="relative w-full overflow-hidden bg-[#F5F5F3] px-4 md:px-8 lg:px-12 pt-6 pb-10"
    >
      {/* Faint oversized brand watermark behind the card */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-hidden">
        <span className="select-none font-sans font-black tracking-tighter leading-none text-[22vw] text-[#050505]/[0.035] translate-y-[28%]">
          ANEEK
        </span>
      </div>

      {/* Floating rounded card */}
      <div className="relative z-10 mx-auto max-w-[100rem]">
        <div className="rounded-[2rem] border border-[#050505]/8 bg-white/50 backdrop-blur-sm shadow-[0_25px_70px_-30px_rgba(0,0,0,0.18)] px-8 md:px-12 lg:px-16 py-12 md:py-16">
          {/* Top: brand + navigation */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Brand */}
            <div className="lg:col-span-6 max-w-md">
              <div className="flex items-center gap-2">
                <span className="font-sans text-2xl tracking-tighter font-extrabold text-[#050505]">
                  ANEEK
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
              </div>
              <p className="mt-4 max-w-sm font-sans text-sm text-[#5F5F5F] leading-relaxed">
                High-performance WordPress &amp; frontend engineering — fast, secure, and built to convert.
              </p>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#050505]/10 bg-white/40 text-[#050505]/70 transition-all duration-300 hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="lg:col-span-6 lg:justify-self-end">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5F5F5F] font-bold">
                Core Structure
              </span>
              <nav className="mt-5 grid grid-cols-2 gap-x-12 gap-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group inline-flex w-fit items-center gap-2 font-sans text-sm text-[#5F5F5F] transition-colors duration-300 hover:text-[#FF6B00]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#FF6B00]/0 transition-colors duration-300 group-hover:bg-[#FF6B00]" />
                    {link.text}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Elegant divider */}
          <div className="mt-12 mb-6 h-px w-full bg-[#050505]/8" />

          {/* Bottom: copyright + credit + back to top */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="font-sans text-xs text-[#5F5F5F]">
              © 2026 Aneek. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5F5F5F]">
                Design &amp; Development by <span className="font-bold text-[#050505]">ANEEK</span>
              </p>
              <button
                onClick={handleScrollToTop}
                aria-label="Back to top"
                className="group flex h-8 w-8 items-center justify-center rounded-full border border-[#050505]/15 text-[#5F5F5F] transition-all duration-300 hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
