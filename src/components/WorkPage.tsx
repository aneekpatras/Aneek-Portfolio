import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Project } from "../types";
import { useProjects } from "../lib/projectStore";
import { TRANSLATIONS } from "../utils";
import WorkProjectCard from "./WorkProjectCard";
import ProjectModal from "./ProjectModal";
import Header from "./Header";
import PageHero from "./PageHero";
import Footer from "./Footer";

/**
 * Dedicated "Work" page — reached via the header nav or the homepage
 * "View All" button (route: #/work). Renders every published project in a
 * clean 2-column grid with normal page scrolling.
 */
export default function WorkPage() {
  const t = TRANSLATIONS["en"];
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const allProjects = useProjects();
  const visibleProjects = allProjects.filter((p) => p.status !== "draft");

  // Land at the top and ensure body scroll is unlocked when arriving here.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "";
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#050505] font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* Grain texture to match the site */}
      <div className="fixed inset-0 z-40 pointer-events-none grain-overlay" />

      {/* Full persistent site header (fixed) */}
      <Header activeSection="/work" />

      {/* Hero band (soft dark-grain) */}
      <PageHero
        eyebrow={t.projectsPre}
        title="Selected Work"
        subtitle={t.projectsSub}
        meta={
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-white/70">
            {visibleProjects.length} Projects
          </span>
        }
      />

      {/* Content */}
      <main className="relative z-10 px-6 md:px-12 lg:px-24 pt-4 pb-16 md:pb-24">
        {visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-7xl mx-auto">
            {visibleProjects.map((project) => (
              // display:contents wrapper carries the list key without affecting grid layout
              <div key={project.id} className="contents">
                <WorkProjectCard project={project} onSelect={setSelectedProject} />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto rounded-3xl border border-dashed border-[#050505]/15 bg-white py-24 text-center">
            <p className="text-sm font-semibold text-[#5F5F5F]">No published projects yet.</p>
          </div>
        )}

        {/* CTA back to contact */}
        <div className="max-w-7xl mx-auto mt-20 flex flex-col items-center gap-5 text-center">
          <p className="font-sans text-lg md:text-xl font-bold text-[#050505]">
            Have a project that deserves this treatment?
          </p>
          <a
            href="https://wa.me/923199154505?text=Hello%20Aneek%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#FF6B00] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#050505]"
          >
            Start a Conversation
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </main>

      <Footer />

      {/* Shared case study modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
