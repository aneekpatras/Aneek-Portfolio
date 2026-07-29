import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Project } from "../types";
import { useProjects } from "../lib/projectStore";
import { TRANSLATIONS } from "../utils";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

interface ProjectsProps {
  lang?: "en" | "ur";
}

// Exactly 4 primary feature cards in the homepage horizontal section.
const FEATURE_COUNT = 4;
// Below this width we skip scroll-locking (touch devices get a native swipe row).
const LOCK_MIN_WIDTH = 1024;
// Horizontal easing toward the wheel target (lower = smoother/slower).
const LERP = 0.14;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export default function Projects({ lang: _lang = "en" }: ProjectsProps) {
  const t = TRANSLATIONS["en"];
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const allProjects = useProjects();
  const visibleProjects = allProjects.filter((p) => p.status !== "draft");
  const featured = visibleProjects.slice(0, FEATURE_COUNT);

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [enableLock, setEnableLock] = useState(false);

  // Mutable state that the wheel/keyboard handlers read without re-rendering.
  const targetRef = useRef(0); // where the track wants to be (px)
  const currentRef = useRef(0); // current animated position (px)
  const maxRef = useRef(0); // max horizontal travel (px)
  const lockedRef = useRef(false);
  const rafRef = useRef(0);
  const releasedAtRef = useRef(0); // timestamp of last release (kills inertia re-lock)

  // Enable the wheel scroll-lock only on desktop widths (touch = native swipe).
  useEffect(() => {
    const check = () => setEnableLock(window.innerWidth >= LOCK_MIN_WIDTH);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!enableLock || !track || !section) {
      if (track) track.style.transform = "translate3d(0,0,0)";
      return;
    }

    const measure = () => {
      maxRef.current = Math.max(0, track.scrollWidth - track.clientWidth);
      targetRef.current = clamp(targetRef.current, 0, maxRef.current);
      currentRef.current = clamp(currentRef.current, 0, maxRef.current);
    };
    measure();
    const settle = window.setTimeout(measure, 200);

    // rAF loop — eases the track toward the wheel target for a smooth glide.
    const tick = () => {
      const next = currentRef.current + (targetRef.current - currentRef.current) * LERP;
      currentRef.current = Math.abs(targetRef.current - next) < 0.5 ? targetRef.current : next;
      track.style.transform = `translate3d(${-currentRef.current}px,0,0)`;
      rafRef.current =
        currentRef.current !== targetRef.current ? requestAnimationFrame(tick) : 0;
    };
    const ensureTick = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const drive = (delta: number): boolean => {
      // Returns true if the delta was consumed (locked), false to release.
      const max = maxRef.current;
      const atEnd = targetRef.current >= max && delta > 0;
      const atStart = targetRef.current <= 0 && delta < 0;
      if (atEnd || atStart) {
        // Reached a boundary in the direction of travel → release the lock and
        // let vertical scrolling resume. Pin the track exactly to the boundary
        // so there's never a residual mismatch or stuck state.
        lockedRef.current = false;
        releasedAtRef.current = performance.now();
        targetRef.current = clamp(targetRef.current, 0, max);
        return false;
      }
      // Precisely follow the wheel delta in both directions (down = forward,
      // up = reverse), clamped to the track bounds.
      targetRef.current = clamp(targetRef.current + delta, 0, max);
      ensureTick();
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      const max = maxRef.current;
      if (max <= 0) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const delta = e.deltaY;

      if (!lockedRef.current) {
        // Ignore residual trackpad inertia right after a release so the lock
        // doesn't immediately re-engage and flicker.
        if (performance.now() - releasedAtRef.current < 220) return;

        // Entering downward: section top just reached the viewport top.
        const enterDown =
          delta > 0 && targetRef.current < max && rect.top <= 0 && rect.top > -vh * 0.6;
        // Re-entering upward: section is nearly filling the viewport again.
        const enterUp =
          delta < 0 && targetRef.current > 0 && rect.top <= 0 && rect.top > -120;
        if (enterDown || enterUp) {
          lockedRef.current = true;
          // Snap the section flush to the top so it fills the viewport.
          window.scrollTo({ top: window.scrollY + rect.top });
        } else {
          return; // not locking → let the page scroll normally
        }
      }

      if (drive(delta)) e.preventDefault();
    };

    const onKey = (e: KeyboardEvent) => {
      if (!lockedRef.current) return;
      const forwardKeys = ["ArrowRight", "ArrowDown", "PageDown", " ", "Spacebar"];
      const backKeys = ["ArrowLeft", "ArrowUp", "PageUp"];
      const isForward = forwardKeys.includes(e.key);
      const isBack = backKeys.includes(e.key);
      if (!isForward && !isBack) return;
      const step = e.key.startsWith("Page") ? 480 : 160;
      if (drive(isForward ? step : -step)) e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey, { passive: false });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
      window.clearTimeout(settle);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      lockedRef.current = false;
    };
  }, [enableLock, featured.length]);

  // Shared intro block (title + View All) — stays locked with the cards.
  const header = (
    <div className="px-6 md:px-12 lg:px-24 shrink-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-[1px] bg-[#FF6B00]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
            {t.projectsPre}
          </span>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#050505] leading-none mb-4">
              {t.projectsTitle}
            </h2>
            <p className="font-sans text-sm md:text-base text-[#5F5F5F] leading-relaxed">
              {t.projectsSub}
            </p>
          </div>
          <a
            href="#/work"
            className="group shrink-0 inline-flex items-center gap-2.5 rounded-full bg-[#050505] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#FF6B00] shadow-sm"
          >
            View All Work
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );

  const cards = featured.map((project, idx) => (
    <div key={project.id} className="flex-none w-[85vw] sm:w-[420px] lg:w-[440px]">
      <ProjectCard project={project} index={idx} onSelect={setSelectedProject} />
    </div>
  ));

  return (
    <section id="projects" className="relative bg-white border-t border-[#050505]/5">
      {enableLock ? (
        // Desktop: exactly one viewport tall; wheel drives the horizontal track.
        <div ref={sectionRef} className="relative h-screen overflow-hidden">
          <div className="h-full flex flex-col justify-center gap-6">
            {header}
            <div
              ref={trackRef}
              className="flex gap-6 pl-6 md:pl-12 lg:pl-24 pr-[10vw] will-change-transform"
            >
              {cards}
            </div>
          </div>
        </div>
      ) : (
        // Mobile/tablet: normal flow with a native horizontal swipe row.
        <div className="pt-24 md:pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {header}
          </motion.div>
          <div className="no-scrollbar overflow-x-auto mt-8">
            <div className="flex gap-6 px-6 md:px-12 w-max">{cards}</div>
          </div>
        </div>
      )}

      {/* Shared case study modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
