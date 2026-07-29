import { motion } from "motion/react";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  /** Shorter hero (~35–45vh) with tighter padding — used on the About page. */
  compact?: boolean;
}

// High-contrast fractal-noise grain (crisp & clearly visible over the charcoal glass).
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Inner-page hero band — a compact, translucent dark-charcoal glass card inset
 * on the beige page. Glassmorphism (backdrop-blur + low-opacity fill + soft
 * border) over a prominent film-grain texture for an organic, high-end feel —
 * never pitch black. Light editorial text for contrast.
 */
export default function PageHero({ eyebrow, title, subtitle, meta, compact = false }: PageHeroProps) {
  const heightCls = compact
    ? "min-h-[35vh] md:min-h-[42vh]"
    : "min-h-[42vh] md:min-h-[52vh]";
  const padCls = compact ? "py-9 md:py-12" : "py-12 md:py-16";

  return (
    <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 pb-6 md:pb-8 bg-[#F5F5F3]">
      <div className="mx-auto max-w-[100rem]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`relative flex ${heightCls} flex-col justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#151515]/70 px-8 md:px-14 lg:px-20 ${padCls} shadow-[0_25px_70px_-30px_rgba(0,0,0,0.55)] backdrop-blur-2xl`}
        >
          {/* Teal-tinted charcoal base (never pitch black) */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#182121]/85 via-[#111515]/85 to-[#0c0f0f]/90" />
          {/* Teal gradient glow radiating from the top & bottom edges (dark center) */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_65%_55%_at_50%_-12%,rgba(13,148,136,0.30),transparent_70%)]" />
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_75%_55%_at_50%_112%,rgba(15,118,110,0.24),transparent_70%)]" />
          {/* Subtle warm brand accent */}
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-[#FF6B00]/8 blur-[120px] pointer-events-none z-0" />
          {/* Prominent film-grain texture (two layers for organic density) */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.42] mix-blend-overlay"
            style={{ backgroundImage: GRAIN, backgroundSize: "240px 240px" }}
          />
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-[0.14]"
            style={{ backgroundImage: GRAIN, backgroundSize: "120px 120px" }}
          />

          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-8 h-[1px] bg-[#FF6B00]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
                {eyebrow}
              </span>
            </div>
            <h1 className="font-sans text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F5F3] leading-[1.05]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-5 max-w-2xl font-sans text-sm md:text-base text-white/60 leading-relaxed">
                {subtitle}
              </p>
            )}
            {meta && <div className="mt-8">{meta}</div>}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
