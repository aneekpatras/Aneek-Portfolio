import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ApproachProps {
  lang?: "en" | "ur";
}

/**
 * Homepage "How We Work / Our Approach" section — sleek, minimal, editorial.
 * Two text columns (Our Approach / What to Expect) with a single action button
 * that routes to the dedicated Skills page.
 */
export default function Approach({ lang: _lang = "en" }: ApproachProps) {
  return (
    <section
      id="approach"
      className="relative w-full mt-16 md:mt-24 py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-[#F5F5F3] border-t border-[#050505]/5"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8"
      >
        {/* Left label */}
        <div className="lg:col-span-3">
          <span className="inline-flex items-center gap-2 font-sans text-sm font-bold tracking-tight text-[#050505]">
            <ArrowRight className="w-4 h-4 text-[#FF6B00]" />
            How we work
          </span>
        </div>

        {/* Our Approach */}
        <div className="lg:col-span-5 lg:col-start-4 flex flex-col text-start">
          <h2 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-[#050505] mb-4">
            Our Approach
          </h2>
          <p className="font-sans text-sm md:text-base text-[#5F5F5F] leading-relaxed max-w-md">
            I keep the process simple: strategy first, build second. Every project starts with a
            deep dive into your goals, your users, and your current performance — so the work is
            grounded in evidence, not guesswork, and set up for remarkable results.
          </p>

          {/* Action button → dedicated Skills page */}
          <Link
            to="/about"
            className="group mt-8 inline-flex items-center gap-2.5 self-start rounded-full bg-[#050505] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#FF6B00]"
          >
            Explore My Skills
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] transition-colors duration-300 group-hover:bg-white" />
          </Link>
        </div>

        {/* What to Expect */}
        <div className="lg:col-span-4 lg:col-start-9 flex flex-col text-start">
          <h2 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-[#050505] mb-4">
            What to Expect
          </h2>
          <p className="font-sans text-sm md:text-base text-[#5F5F5F] leading-relaxed">
            Clear communication, clean code, and measurable outcomes. You get faster load times,
            hardened security, and a site that's genuinely easy to manage — delivered on time and
            fully handed over, with zero lock-in.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
