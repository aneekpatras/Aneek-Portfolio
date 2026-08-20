import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
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

export default function Projects({ lang: _lang = "en" }: ProjectsProps) {
  const t = TRANSLATIONS["en"];
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const allProjects = useProjects();
  const visibleProjects = allProjects.filter((p) => p.status !== "draft");
  const featured = visibleProjects.slice(0, FEATURE_COUNT);

  // 300vh scroll container — its scroll progress (0 → 1) drives the horizontal track.
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [totalDistance, setTotalDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  // Measure how far the track overflows the viewport so the transform's end
  // value always lines up with the last card's edge, on any screen size.
  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setTotalDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [featured.length]);

  // Shared intro block (title + View All) — stays pinned above the track.
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
          <Link
            to="/work"
            className="group shrink-0 inline-flex items-center gap-2.5 rounded-full bg-[#050505] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#FF6B00] shadow-sm"
          >
            View All Work
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );

  const cards = featured.map((project, idx) => (
    <div key={project.id} className="flex-none w-[85vw] md:w-[50vw] lg:w-[40vw] h-[480px] md:h-[520px] max-h-[60vh]">
      <ProjectCard project={project} index={idx} onSelect={setSelectedProject} />
    </div>
  ));

  return (
    <section
      id="projects"
      className="relative z-10 w-full bg-white border-t border-[#050505]/5"
    >
      <div ref={containerRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center gap-6 py-12 md:py-16">
          {header}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex items-center gap-8 lg:gap-12 pl-6 md:pl-12 lg:pl-24 pr-[10vw] will-change-transform"
          >
            {cards}
          </motion.div>
        </div>
      </div>

      {/* Shared case study modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
