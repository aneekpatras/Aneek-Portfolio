import { motion } from "motion/react";
import { Link } from "react-router-dom";

/**
 * Homepage closing CTA — a wide, grainy dark glass banner that sits between
 * the FAQ section and the footer, with texture/depth so it reads distinctly
 * from the flat-black footer below.
 */
export default function CTABanner() {
  return (
    <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 bg-[#F5F5F3]">
      <div className="mx-auto max-w-[100rem]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0F0F0F]/80 backdrop-blur-2xl px-8 md:px-16 py-16 md:py-24 text-center shadow-2xl"
        >
          {/* Depth gradient (keeps it from reading flat/black) */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#1c1c1c] via-[#0F0F0F] to-[#070707] opacity-90" />

          {/* Warm orange glow accent */}
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] max-w-full rounded-full bg-[#FF6B00]/12 blur-[120px] pointer-events-none z-0" />

          {/* Film-grain / noise texture */}
          <div className="absolute inset-0 z-0 pointer-events-none grain-overlay opacity-[0.7]" />

          {/* Glass top highlight */}
          <div className="absolute inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="font-sans text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#F5F5F3] leading-[1.12]">
              <span className="block">Start your project</span>
              <span className="block">with Aneek</span>
            </h2>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[#F5F5F3] px-8 py-4 text-sm font-bold tracking-tight text-[#050505] transition-all duration-300 hover:bg-[#FF6B00] hover:text-white"
            >
              Contact Us
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] transition-colors duration-300 group-hover:bg-white" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
