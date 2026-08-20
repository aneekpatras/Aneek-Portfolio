import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Project } from "../types";
import { getUnsplashUrl, getUnsplashSrcSet } from "../utils";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  index?: number;
}

// Diameter of the cursor-following "View" bubble.
const BUBBLE = 88;

function resolveSrc(url: string) {
  return url.includes("unsplash.com")
    ? getUnsplashUrl(url, { width: 1200, format: "webp" })
    : url;
}

/**
 * Minimalist project card: a rounded image thumbnail + a subtle title.
 * The whole card opens the case study. On hover (desktop) a circular "View"
 * bubble follows the cursor and the image crossfades to its secondary preview.
 */
export default function ProjectCard({ project, onSelect, index = 0 }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  // Raw cursor position → spring-smoothed for a premium trailing feel.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 350, damping: 30, mass: 0.4 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const primarySrc = resolveSrc(project.image);
  // Fallback chain so the swap works the moment a second image exists.
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
      className="group w-full h-full flex flex-col cursor-pointer"
    >
      {/* Image trigger (cursor bubble + hover swap live here) — flexes to fill
          whatever height the card's parent gives it, so object-cover scales
          the image proportionally without ever overflowing the card. */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMove}
        className="relative overflow-hidden rounded-3xl bg-[#F5F5F3] border border-[#050505]/5 flex-1 min-h-0 shadow-xs transition-shadow duration-500 group-hover:shadow-xl md:cursor-none"
      >
        {/* Primary image */}
        <img
          src={primarySrc}
          srcSet={getUnsplashSrcSet(project.image)}
          sizes="(max-width: 640px) 85vw, 440px"
          alt={project.title}
          width={1050}
          height={728}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />

        {/* Secondary image — crossfades in on hover */}
        <img
          src={hoverSrc}
          srcSet={isUnsplash ? getUnsplashSrcSet(hoverRaw) : undefined}
          sizes="(max-width: 640px) 85vw, 440px"
          alt=""
          aria-hidden="true"
          width={1050}
          height={728}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover scale-[1.05] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        />

        {/* Subtle darkening so the orange bubble reads on any image */}
        <div className="absolute inset-0 bg-[#050505]/0 transition-colors duration-500 group-hover:bg-[#050505]/15" />

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
      </div>

      {/* Subtle title */}
      <h3 className="shrink-0 mt-3 px-1 font-sans text-sm md:text-base font-semibold tracking-tight text-[#050505] transition-colors duration-300 group-hover:text-[#FF6B00]">
        {project.title}
      </h3>
    </motion.article>
  );
}
