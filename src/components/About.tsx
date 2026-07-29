import { motion } from "motion/react";
import { Zap, ShieldCheck, ShoppingBag, Clock } from "lucide-react";
import { TRANSLATIONS, calculateReadingTime } from "../utils";

interface AboutProps {
  lang: "en" | "ur";
}

// Editorial copy for the "About / Behind the Stacks" section (English-first).
const CONTENT = {
  pre: "THE ARCHITECT BEHIND HIGH-SPEED WEBSITES",
  title: "Turning Slow, Frustrating Websites into High-Converting Business Assets.",
  p1: "Slow websites kill traffic, drop Google rankings, and bleed sales. I am Aneek — a WordPress Developer & Frontend Architect on a mission to turn your website into your best-performing salesperson.",
  p2: "By combining lightweight, lightning-fast modern design with custom WordPress engineering, I build digital experiences that load instantly, keep visitors engaged, and look stunning on every single screen.",
  featuresHeading: "What This Means For Your Business:",
  craftPre: "THE BUSINESS BENCHMARK",
  craftTitle: "“A Fast Website Makes More Money Than Paid Ads.”",
  craftDesc:
    "Speeding up your site by even a fraction of a second can boost your Google rankings and online sales overnight.",
  trackRecordHeading: "Track Record That Speaks Volumes:",
};

export default function About({ lang }: AboutProps) {
  const t = TRANSLATIONS[lang];

  const stats = [
    { value: "1.5+", label: lang === "ur" ? "سال کا تجربہ" : "Years Experience" },
    { value: "20+", label: lang === "ur" ? "مکمل کردہ پروجیکٹس" : "Projects Delivered" },
    { value: "99%", label: lang === "ur" ? "کور ویب وائٹلز پاس ریٹ" : "Core Web Vitals Pass Rate" },
    { value: "100%", label: lang === "ur" ? "اعلیٰ کسٹمر اطمینان" : "Satisfaction Commitment" },
  ];

  const highlights = [
    {
      icon: Zap,
      title: "Instant Load Speeds",
      desc: "Say goodbye to heavy page builders that lag. I use clean, modern architecture so your pages load in a blink.",
    },
    {
      icon: ShieldCheck,
      title: "Bulletproof Security",
      desc: "Enterprise-grade protection set up at the database and firewall levels to keep hackers and downtime away.",
    },
    {
      icon: ShoppingBag,
      title: "Sales-Driven Checkouts",
      desc: "Frictionless WooCommerce checkout flows and smart product filtering built specifically to turn browsers into buyers.",
    },
  ];

  // Business-benchmark vitals — green dots = excellent, orange = brand-accent status.
  const vitals = [
    { label: "Page Load Speed", value: "< 1.2s", note: "Instant access for users", dot: "bg-emerald-500", pulse: true },
    { label: "Visual Stability", value: "0.00", note: "Zero annoying layout shifts while loading", dot: "bg-emerald-500", pulse: true },
    { label: "Server Response", value: "< 150ms", note: "Lightning-fast server reply", dot: "bg-[#FF6B00]", pulse: false },
  ];

  // Dynamic Reading Time Calculation
  const wordsToCalculate = [
    CONTENT.title,
    CONTENT.p1,
    CONTENT.p2,
    ...highlights.map((h) => h.desc),
    CONTENT.craftDesc,
  ];
  const minsToRead = calculateReadingTime(wordsToCalculate);

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-white border-t border-[#050505]/5 overflow-hidden"
    >
      {/* Background soft layout lines */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-between px-6 md:px-12 lg:px-24">
        <div className="w-[1px] h-full bg-[#050505]/2" />
        <div className="hidden md:block w-[1px] h-full bg-[#050505]/2" />
        <div className="hidden lg:block w-[1px] h-full bg-[#050505]/2" />
        <div className="w-[1px] h-full bg-[#050505]/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-startOfColumn">

          {/* Left Panel: Narrative Editorial */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full text-start">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-[#FF6B00]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
                    {CONTENT.pre}
                  </span>
                </div>

                {/* Estimate Section Reading Time badge */}
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#5F5F5F] bg-[#050505]/5 px-2.5 py-1 rounded-full select-none">
                  <Clock className="w-3 h-3 text-[#FF6B00]" />
                  <span>{minsToRead} {t.readingTime}</span>
                </div>
              </div>

              <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#050505] leading-tight mb-8">
                {CONTENT.title}
              </h2>

              <p className="font-sans text-lg text-[#5F5F5F] leading-relaxed mb-6">
                {CONTENT.p1}
              </p>

              <p className="font-sans text-lg text-[#5F5F5F] leading-relaxed mb-12">
                {CONTENT.p2}
              </p>
            </div>

            {/* Business benefit heading */}
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#050505] font-bold mt-4 mb-6">
              {CONTENT.featuresHeading}
            </h3>

            {/* Highlights Grid */}
            <div className="flex flex-col gap-6">
              {highlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    whileInView={{ x: [ lang === "ur" ? 10 : -10, 0 ], opacity: [ 0, 1 ] }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    key={item.title}
                    className="flex gap-4 items-start"
                  >
                    <div className="mt-1 flex items-center justify-center w-10 h-10 rounded-lg bg-[#FF6B00]/5 text-[#FF6B00] shrink-0 border border-[#FF6B00]/10">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-base text-[#050505]">{item.title}</h4>
                      <p className="font-sans text-sm text-[#5F5F5F] mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Showcase Graphic / Metric Grid */}
          <div className="lg:col-span-6 flex flex-col gap-8 ltr:lg:pl-6 rtl:lg:pr-6 w-full text-start">
            {/* The Luxury Graphic Card */}
            <div className="relative group rounded-3xl overflow-hidden glass-card bg-[#F5F5F3]/50 p-8 md:p-12 shadow-sm transition-all duration-500 hover:shadow-lg">
              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B00]/5 via-transparent to-pink-500/5 pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[300px]">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
                    {CONTENT.craftPre}
                  </span>
                  <h3 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-[#050505] mt-4 leading-tight">
                    {CONTENT.craftTitle}
                  </h3>
                  <p className="font-sans text-sm text-[#5F5F5F] mt-4 leading-relaxed max-w-md">
                    {CONTENT.craftDesc}
                  </p>
                </div>

                {/* Simulated Web Audit Metrics UI */}
                <div className="mt-8 border-t border-[#050505]/5 pt-6 flex flex-wrap gap-x-8 gap-y-5 items-start">
                  {vitals.map((v) => (
                    <div key={v.label} className="flex items-start gap-2">
                      <span className={`mt-1 w-3 h-3 rounded-full ${v.dot} ${v.pulse ? "animate-pulse" : ""}`} />
                      <div className="leading-tight">
                        <span className="font-mono text-xs text-[#050505] font-bold block">
                          {v.label}: {v.value}
                        </span>
                        <span className="font-mono text-[10px] text-[#5F5F5F] mt-1 block">
                          {v.note}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Track record heading */}
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#050505] font-bold -mb-2">
              {CONTENT.trackRecordHeading}
            </h3>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  key={stat.label}
                  className="rounded-2xl p-6 glass-card bg-[#F5F5F3]/40 hover:bg-[#F5F5F3]/80 transition-colors duration-300 flex flex-col justify-center"
                >
                  <p className="font-sans text-4xl md:text-5xl font-extrabold text-[#FF6B00] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="font-sans text-xs md:text-sm text-[#5F5F5F] font-bold mt-2 leading-tight uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </motion.div>
    </section>
  );
}
