import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ArrowUpRight } from "lucide-react";

interface FAQProps {
  lang?: "en" | "ur";
}

const FAQS = [
  {
    q: "How much does it cost to work together?",
    a: "It really depends on what you're trying to build! Every project is unique. Once we chat about your goals and what needs to get done, I'll put together a clear, fixed-price proposal so you'll know exactly what to expect — no hidden fees or nasty surprises.",
  },
  {
    q: "How long will my project take?",
    a: "On average, a custom WordPress build or a full site overhaul takes about 2 to 4 weeks from kickoff to launch. If you just need a speed boost or some frontend tweaks, we can usually wrap that up much quicker.",
  },
  {
    q: "Do you take on small projects or work with startups?",
    a: "For sure! I love teaming up with ambitious startups and small businesses. If you care about clean design, speed, and turning visitors into customers, we'll make a great team.",
  },
  {
    q: "What exactly is included in the package?",
    a: "You get the full package from start to finish — custom clean coding, mobile responsiveness, lightning-fast Core Web Vitals optimization, thorough testing, and secure launch. I also make sure everything is properly handed over to you with zero hassle.",
  },
  {
    q: "Are you open to working with international clients?",
    a: "Absolutely! I work with clients all over the world. We keep things smooth and flexible using async updates, quick Loom video walkthroughs, and scheduled calls that fit your time zone.",
  },
  {
    q: "How are you different from hiring a big agency?",
    a: "No middlemen or junior devs handling your project here. You'll work directly with me — an experienced WordPress & Frontend Architect. That means faster communication, better quality control, and zero bloated agency fees.",
  },
  {
    q: "Will I have full ownership of my website?",
    a: "100% yes. Once the project wraps up and final payment is settled, everything belongs to you — all the source code, design files, domain access, and credentials. It's completely yours.",
  },
  {
    q: "How do we get the ball rolling?",
    a: "Super easy! Just hit the \"Let's Talk\" button in the menu or drop me a message via the form below. Tell me a bit about your project, and I'll get back to you within 24 hours so we can set up a quick chat.",
  },
];

/** Homepage FAQ / Common Questions — clean numbered accordion. */
export default function FAQ({ lang: _lang = "en" }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-[#F5F5F3] border-t border-[#050505]/5"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#5F5F5F] font-bold">
              FAQ
            </span>
            <h2 className="mt-2.5 font-sans text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#050505] leading-none">
              Common questions
            </h2>
          </div>
          <a
            href="#/contact"
            className="group inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#5F5F5F] underline underline-offset-4 decoration-[#050505]/20 transition-colors hover:text-[#FF6B00] hover:decoration-[#FF6B00]"
          >
            Still have questions?
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* Accordion */}
        <div className="border-t border-[#050505]/10">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-[#050505]/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-4 md:gap-6 py-4 md:py-5 text-left cursor-pointer"
                >
                  <span className="font-mono text-[11px] font-bold text-[#FF6B00] w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-sans text-sm md:text-base font-bold tracking-tight text-[#050505] transition-colors group-hover:text-[#FF6B00]">
                    {item.q}
                  </span>
                  <Plus
                    className={`w-4 h-4 shrink-0 text-[#050505] transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-[#FF6B00]" : "group-hover:text-[#FF6B00]"
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pl-9 md:pl-12 pr-8 md:pr-16 pb-6 max-w-2xl font-sans text-sm text-[#5F5F5F] leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
