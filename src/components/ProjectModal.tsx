import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, CheckCircle2, Clock, Target, X, Gauge } from "lucide-react";
import { Project } from "../types";
import { getUnsplashUrl, getUnsplashSrcSet } from "../utils";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

/** Shared case-study detail overlay used by the homepage preview and the Work page. */
export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100000] overflow-y-auto bg-[#050505]/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#F5F5F3] text-[#050505] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#050505]/10 font-sans"
          >
            {/* Image banner inside modal */}
            <div className="h-64 md:h-80 w-full relative">
              <picture>
                {project.image.includes("unsplash.com") && (
                  <source srcSet={getUnsplashSrcSet(project.image, "avif")} type="image/avif" />
                )}
                {project.image.includes("unsplash.com") && (
                  <source srcSet={getUnsplashSrcSet(project.image, "webp")} type="image/webp" />
                )}
                <img
                  src={project.image.includes("unsplash.com") ? getUnsplashUrl(project.image, { width: 1200, format: "webp" }) : project.image}
                  srcSet={getUnsplashSrcSet(project.image)}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  alt={project.title}
                  width={1200}
                  height={750}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F3] to-transparent/30" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs hover:bg-[#FF6B00] hover:text-white text-[#050505] flex items-center justify-center transition-all border border-[#050505]/10 cursor-pointer z-20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 md:left-12 text-left">
                <span className="font-mono text-[10px] uppercase font-bold text-[#FF6B00] bg-white/95 px-3 py-1.5 rounded-lg shadow-xs">
                  {project.completionYear} Core Deploy
                </span>
                <h4 className="font-sans text-2xl md:text-4xl font-extrabold text-[#050505] mt-3">
                  {project.title}
                </h4>
              </div>
            </div>

            {/* Modal Core Content */}
            <div className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 text-start">
              {/* Left block: stats and tags */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <div>
                  <span className="font-mono text-[10px] text-[#5F5F5F] uppercase block mb-1 font-bold">
                    DELIVERABLE CATEGORY
                  </span>
                  <p className="font-sans font-bold text-sm text-[#050505]">{project.category}</p>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-[#5F5F5F] uppercase block mb-1 font-bold">
                    CORE SPEED METRIC
                  </span>
                  <div className="inline-flex items-center gap-1.5 bg-[#FF6B00]/10 border border-[#FF6B00]/15 px-3 py-1.5 rounded-xl text-[#FF6B00] font-mono text-xs font-bold">
                    <Gauge className="w-4 h-4" />
                    {project.performanceMetric.value}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-[#5F5F5F] uppercase block mb-2 font-bold">
                    DEPLOYED TECHNOLOGIES
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono uppercase bg-[#050505]/5 border border-[#050505]/5 px-2.5 py-1 rounded-md text-[#050505] font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right block: Narrative Case Study */}
              <div className="md:col-span-8 flex flex-col gap-6 text-start">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F5F5F] mb-2 flex items-center gap-2 font-bold">
                    <Target className="w-3.5 h-3.5 text-[#FF6B00]" />
                    Project Overview
                  </span>
                  <p className="font-sans text-sm md:text-base text-[#5F5F5F] leading-relaxed">
                    {project.overview}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F5F5F] mb-2 flex items-center gap-2 font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
                    Discovery & Challenge
                  </span>
                  <p className="font-sans text-sm text-[#5F5F5F] leading-relaxed">
                    {project.challenge}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#5F5F5F] mb-2 flex items-center gap-2 font-bold">
                    <Gauge className="w-3.5 h-3.5 text-[#FF6B00]" />
                    Engineering & Solution
                  </span>
                  <p className="font-sans text-sm text-[#5F5F5F] leading-relaxed">
                    {project.solution}
                  </p>
                </div>

                <div className="border-t border-[#050505]/5 pt-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF6B00] block mb-3 font-bold">
                    VERIFIED OUTCOME RESULTS
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {project.results.map((res, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-sm font-sans font-medium text-[#050505]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating footer close action */}
            <div className="p-6 bg-white/50 border-t border-[#050505]/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto rounded-full bg-[#FF6B00] text-white hover:bg-[#050505] text-xs uppercase font-bold tracking-widest px-6 py-3.5 transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                Visit Live Website
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto rounded-full bg-[#050505] text-white hover:bg-[#FF6B00] text-xs uppercase font-bold tracking-widest px-6 py-3.5 transition-all duration-300 border border-transparent cursor-pointer"
              >
                Close Case Study
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
