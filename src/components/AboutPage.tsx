import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  Code2,
  Ban,
  Smartphone,
  Boxes,
  Zap,
  ShieldCheck,
  Network,
  Handshake,
  TrendingUp,
  Repeat,
  ArrowUpRight,
} from "lucide-react";
import PageShell from "./PageShell";
import PageHero from "./PageHero";

const PRINCIPLES = [
  {
    icon: Code2,
    title: "Clean Architecture",
    desc: "Modular, readable, maintainable code — structured to scale, with no spaghetti and no shortcuts.",
  },
  {
    icon: Ban,
    title: "Zero Bloatware",
    desc: "No heavy page builders dragging down your site. Just lightweight, hand-crafted markup that loads instantly.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Responsiveness",
    desc: "Designed for the smallest screen first, then scaled up — flawless and fast on every device.",
  },
];

const PILLARS = [
  {
    id: "P01",
    icon: Boxes,
    title: "Custom Themes",
    desc: "Hand-built WordPress theme architecture and custom ACF data models built to spec.",
    tags: ["PHP", "MySQL", "ACF Pro", "Custom Post Types", "Child Themes"],
  },
  {
    id: "P02",
    icon: Zap,
    title: "Modern Frontend",
    desc: "Sub-second loading interfaces with React, Gutenberg, and bloat-free Elementor layouts.",
    tags: ["React", "JavaScript", "Tailwind CSS", "Gutenberg", "Elementor"],
  },
  {
    id: "P03",
    icon: ShieldCheck,
    title: "Performance & Security",
    desc: "45 → 85+ PageSpeed lifts, Core Web Vitals optimization, and hardened database security.",
    tags: ["Core Web Vitals", "WP Rocket", "Wordfence", "Schema Markup", "On-Page SEO"],
  },
  {
    id: "P04",
    icon: Network,
    title: "E-Commerce & Headless",
    desc: "Scalable WooCommerce setups, payment gateway integrations, and REST API workflows.",
    tags: ["WooCommerce", "REST API", "Git", "Figma"],
  },
];

const WORKING = [
  {
    icon: Handshake,
    title: "Close Collaboration",
    desc: "Clear, async communication with a one-business-day response — you're always in the loop.",
  },
  {
    icon: TrendingUp,
    title: "Conversion-Focused",
    desc: "Every decision ladders up to your goal: turning visitors into paying customers.",
  },
  {
    icon: Repeat,
    title: "Long-Term Scalability",
    desc: "Clean handover, full documentation, and zero lock-in — built to grow with you.",
  },
];

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const cardTag =
  "font-mono text-[10px] tracking-wider uppercase opacity-70 bg-black/5 px-2 py-0.5 rounded";

export default function AboutPage() {
  return (
    <PageShell>
      {/* Intro hero (soft dark-grain, compact) */}
      <PageHero
        compact
        eyebrow="About Me"
        title="I bridge the gap between heavy, slow platforms and lightning-fast digital experiences."
        subtitle="As a WordPress Developer & Frontend Architect, I focus on custom clean code, speed optimization, and bulletproof security. I build websites that don't just look stunning on every screen, but actively turn visitors into buyers."
      />

      {/* ---------------------------------------------------------------- */}
      {/* My Engineering Philosophy                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 md:px-12 lg:px-24 py-14 md:py-16 bg-white border-t border-[#050505]/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fade} className="mb-8 md:mb-10 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
              01 — Philosophy
            </span>
            <h2 className="mt-2 font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-[#050505]">
              My Engineering Philosophy
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRINCIPLES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  {...fade}
                  transition={{ ...fade.transition, delay: idx * 0.08 }}
                  className="group relative rounded-3xl p-6 bg-[#F5F5F3] border border-[#050505]/5 hover:shadow-lg transition-all duration-500 overflow-hidden"
                >
                  <span className="absolute inset-0 z-0 bg-gradient-to-tr from-[#FF6B00]/7 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white text-[#050505] group-hover:bg-[#FF6B00] group-hover:text-white transition-colors duration-500 border border-[#050505]/5 mb-5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-sans text-lg font-bold tracking-tight text-[#050505] mb-1.5">
                      {p.title}
                    </h3>
                    <p className="font-sans text-sm text-[#5F5F5F] leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Craft Compass — expertise pillars (2×2) + custom card            */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 md:px-12 lg:px-24 pt-12 lg:pt-16 pb-12 lg:pb-16 bg-[#F5F5F3] border-t border-[#050505]/5">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fade} className="mb-8 md:mb-10 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
              02 — Craft Compass
            </span>
            <h2 className="mt-2 font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-[#050505]">
              Where I Go Deep
            </h2>
            <p className="mt-3 font-sans text-sm md:text-base text-[#5F5F5F] leading-relaxed">
              Four pillars of expertise that turn slow, fragile sites into fast, secure, revenue-driving assets.
            </p>
          </motion.div>

          {/* Expertise pillars — 2×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.id}
                  {...fade}
                  transition={{ ...fade.transition, delay: idx * 0.08 }}
                  className="group rounded-2xl bg-white/30 backdrop-blur-sm border border-black/10 hover:border-black/30 p-6 transition-all"
                >
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#F5F5F3] text-[#050505] group-hover:bg-[#FF6B00] group-hover:text-white transition-colors duration-500 border border-[#050505]/5 mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans text-lg font-bold tracking-tight text-[#050505] mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-xs text-black/60 leading-relaxed">
                    {pillar.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {pillar.tags.map((tag) => (
                      <span key={tag} className={cardTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Beyond the Code / How I Work                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-6 md:px-12 lg:px-24 py-14 md:py-16 bg-white border-t border-[#050505]/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <motion.div {...fade} className="lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
              03 — How I Work
            </span>
            <h2 className="mt-2 font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-[#050505] leading-tight">
              Beyond the Code
            </h2>
            <p className="mt-4 font-sans text-sm md:text-base text-[#5F5F5F] leading-relaxed max-w-md">
              Great engineering is only half the job. The other half is a partnership built on
              clarity, business outcomes, and a site you can rely on long after launch.
            </p>
            <Link
              to="/contact"
              className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#050505] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#FF6B00]"
            >
              Let's Work Together
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          <div className="lg:col-span-7 flex flex-col divide-y divide-[#050505]/8">
            {WORKING.map((w, idx) => {
              const Icon = w.icon;
              return (
                <motion.div
                  key={w.title}
                  {...fade}
                  transition={{ ...fade.transition, delay: idx * 0.08 }}
                  className="flex gap-4 py-5 first:pt-0"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF6B00]/5 text-[#FF6B00] border border-[#FF6B00]/10 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans text-base md:text-lg font-bold tracking-tight text-[#050505] mb-1">
                      {w.title}
                    </h3>
                    <p className="font-sans text-sm text-[#5F5F5F] leading-relaxed">{w.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
