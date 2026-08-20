import { ArrowUpRight } from "lucide-react";
import { Project } from "../types";
import { getUnsplashUrl, getUnsplashSrcSet } from "../utils";

interface WorkProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

function resolveSrc(url: string) {
  return url.includes("unsplash.com")
    ? getUnsplashUrl(url, { width: 1200, format: "webp" })
    : url;
}

/**
 * Work page grid card — a 3D flip card. The front is a full image preview;
 * hovering rotates it 180° to reveal the project's details on the back.
 */
export default function WorkProjectCard({ project, onSelect }: WorkProjectCardProps) {
  const primarySrc = resolveSrc(project.image);

  return (
    <div className="group [perspective:1000px]">
      <div className="relative h-[320px] w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] md:h-[420px]">
        {/* Front — full image preview */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-lg [backface-visibility:hidden]">
          <img
            src={primarySrc}
            srcSet={getUnsplashSrcSet(project.image)}
            sizes="(max-width: 768px) 92vw, 46vw"
            alt={project.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Back — project details */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-[#050505] p-6 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00]">
              {project.category}
            </span>
            <h3 className="mt-2 font-sans text-xl font-bold tracking-tight text-white md:text-2xl">
              {project.title}
            </h3>
            <p className="mt-3 font-sans text-sm leading-relaxed text-white/60 line-clamp-4">
              {project.subtitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelect(project)}
              className="group/btn inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[#050505] transition-colors duration-300 hover:bg-[#FF6B00] hover:text-white"
            >
              Case Study
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors duration-300 hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                Live Demo
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
