import React from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Download, Sparkles } from "lucide-react";
import { TRANSLATIONS } from "../utils";

interface HeroProps {
  lang: "en" | "ur";
}

export default function Hero({ lang }: HeroProps) {
  const t = TRANSLATIONS[lang];

  const handleScrollToProjects = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = document.querySelector("#projects");
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector("#contact");
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20 pb-20 overflow-hidden bg-[#F5F5F3]"
    >
      {/* Background Interactive Gradient Balls */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Pink Glow */}
        <div className="absolute top-[10%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-pink-400/10 blur-[120px] animate-float-1" />
        {/* Warm Orange Glow */}
        <div className="absolute bottom-[15%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#FF6B00]/10 blur-[130px] animate-float-2" />
        {/* Purple Accent Ball */}
        <div className="absolute top-[40%] left-[40%] w-[30vh] h-[30vh] rounded-full bg-purple-500/10 blur-[90px] animate-pulse" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-center flex-grow text-start">
        
        {/* Subtle Top Hook Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-1 mb-5"
        >
          <span className="text-[#FF6B00] text-xs font-bold uppercase tracking-[0.4em] block">
            {t.heroTitlePre} • 2026
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5F5F5F] font-bold block">
            {t.availableContracts}
          </span>
        </motion.div>

        {/* Huge Editorial Headline (140px-180px Desktop Scale Theme) */}
        <h1 className="select-none text-start uppercase">
          {lang === "en" ? (
            <div className="font-sans text-6xl sm:text-7xl md:text-[6.5rem] lg:text-[7.5rem] xl:text-[9rem] tracking-[-0.045em] font-black text-[#050505] leading-[0.83] uppercase">
              <div className="overflow-hidden inline-block w-full">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block transform origin-left"
                >
                  Building Fast,
                </motion.span>
              </div>
              
              <div className="overflow-hidden inline-block w-full">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block accent-gradient"
                >
                  Scalable
                </motion.span>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block animate-pulse-slow"
                >
                  &nbsp;&amp;
                </motion.span>
              </div>

              <div className="overflow-hidden inline-block w-full">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  Converting.
                </motion.span>
              </div>
            </div>
          ) : (
            <div className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem] tracking-tight font-extrabold text-[#050505] leading-[1.25]">
              <div className="overflow-hidden inline-block w-full py-1">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {t.heroTitleMain}
                </motion.span>
              </div>
            </div>
          )}
        </h1>

        {/* Short Personal Intro + CTA row */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, x: lang === "ur" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="lg:col-span-5 text-start"
          >
            <p className="font-sans text-xl md:text-2xl font-semibold tracking-tight text-[#050505] leading-snug">
              {lang === "en" ? "Hi, I'm Aneek." : "سلام، میں انیق ہوں۔"}
            </p>
          </motion.div>

          {/* Luxury CTA Actions Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-wrap gap-4 items-center justify-start lg:justify-end"
          >
            <button
              onClick={handleScrollToProjects}
              className="group relative overflow-hidden rounded-full bg-[#050505] px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#F5F5F3] filter transition-all duration-300 hover:bg-[#FF6B00] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t.viewProjects}
                <ArrowUpRight className={`w-4 h-4 transition-transform ${lang === "ur" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"} group-hover:-translate-y-0.5`} />
              </span>
            </button>

            <a
              href="#contact"
              className="group rounded-full border border-[#050505]/15 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#050505] transition-all duration-300 hover:border-[#FF6B00] hover:bg-white"
            >
              <span className="flex items-center gap-2">
                {t.hireMe}
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
              </span>
            </a>

            <a
              href="/Aneek_Patras_Resume.pdf"
              download="Aneek_Patras_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-transparent px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#5F5F5F] hover:text-[#050505] transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              {t.downloadResume}
            </a>
          </motion.div>
        </div>

        {/* Scroll down indicator — in normal flow below the CTA row (no overlap) */}
        <div className="mt-12 md:mt-16 hidden md:flex items-center justify-center gap-3">
          <p className="font-mono text-[9px] tracking-[0.25em] text-[#5F5F5F]/80 uppercase">
            {lang === "en" ? "SCROLL FOR THE DESIGN STORY" : "ڈیزائن کی کہانی کے لیے نیچے سکرول کریں"}
          </p>
          <motion.button
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            onClick={(e) => {
              e.preventDefault();
              const nextSec = document.querySelector("#projects");
              if (nextSec) {
                const offsetTop = nextSec.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
              }
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[#050505]/10 text-[#5F5F5F] hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-white transition-all duration-300 cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
