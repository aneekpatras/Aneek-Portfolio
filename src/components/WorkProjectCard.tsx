import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Project } from "../types";
import { getUnsplashUrl, getUnsplashSrcSet } from "../utils";

interface WorkProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  index?: number;
}

// Diameter of the cursor-following "View" bubble — matches the homepage card.
const BUBBLE = 88;

function resolveSrc(url: string) {
  return url.includes("unsplash.com")
    ? getUnsplashUrl(url, { width: 1200, format: "webp" })
    : url;
}

/**
 * Work page grid card. Mirrors the homepage ProjectCard interaction exactly:
 * the whole card opens the case-study modal on click/tap, and on hover
 * (desktop) the image crossfades to its secondary preview while a
 * cursor-following "View" bubble appears. Tag pills sit over the image so
 * category info and the tap target stay visible on mobile too.
 */
export default function WorkProjectCard({ project, onSelect, index = 0 }: WorkProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 350, damping: 30, mass: 0.4 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const primarySrc = resolveSrc(project.image);
  const hoverRaw = project.hoverImage || project.gallery?.[0] || project.image;
  const hoverSrc = resolveSrc(hoverRaw);
  const isUnsplash = project.image.includes("unsplash.com");

  const handleMove = (e: { currentTarget: HTMLElement; clientX: number; clientY: number }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - BUBBLE / 2);
    y.set(e.clientY - rect.top - BUBBLE / 2);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(project)}
      className="group w-full flex flex-col cursor-pointer"
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMove}
        className="relative overflow-hidden rounded-3xl bg-[#F5F5F3] border border-[#050505]/5 h-[260px] sm:h-[320px] md:h-[380px] shadow-xs transition-shadow duration-500 group-hover:shadow-xl md:cursor-none"
      >
        {/* Primary image */}
        <img
          src={primarySrc}
          srcSet={getUnsplashSrcSet(project.image)}
          sizes="(max-width: 768px) 92vw, 46vw"
          alt={project.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />

        {/* Secondary image — crossfades in on hover */}
        <img
          src={hoverSrc}
          srcSet={isUnsplash ? getUnsplashSrcSet(hoverRaw) : undefined}
          sizes="(max-width: 768px) 92vw, 46vw"
          alt=""
          aria-hidden="true"
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover scale-[1.05] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        />

        {/* Subtle darkening so the bubble/tags read on any image */}
        <div className="absolute inset-0 bg-[#050505]/0 transition-colors duration-500 group-hover:bg-[#050505]/15" />

        {/* Tag pills, always visible so mobile keeps the same info as desktop hover */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-[85%]">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/90 backdrop-blur-xs px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-[#050505] shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Cursor-following "View" bubble (desktop only) */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="view-bubble"
              className="pointer-events-none absolute top-0 left-0 z-20 hidden md:flex items-center justify-center rounded-full bg-[#FF6B00] text-white shadow-lg"
              style={{ x: sx, y: sy, width: BUBBLE, height: BUBBLE }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
                View
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Static tap affordance for touch devices, since there's no hover state there */}
        <div className="md:hidden absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00] text-white px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest shadow-lg">
          View
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>

      <h3 className="shrink-0 mt-3 px-1 font-sans text-base md:text-lg font-semibold tracking-tight text-[#050505] transition-colors duration-300 group-hover:text-[#FF6B00]">
        {project.title}
      </h3>
      <p className="px-1 font-mono text-[11px] uppercase tracking-widest text-[#5F5F5F] font-semibold mt-1">
        {project.category}
      </p>
    </motion.article>
  );
}
