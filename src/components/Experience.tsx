import { motion } from "motion/react";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { EXPERIENCE_TIMELINE } from "../types";
import { TRANSLATIONS, calculateReadingTime } from "../utils";

interface ExperienceProps {
  lang: "en" | "ur";
  hideHeader?: boolean;
}

export default function Experience({ lang, hideHeader = false }: ExperienceProps) {
  const t = TRANSLATIONS[lang];

  // Localize experiences based on selected locale
  const experiences = EXPERIENCE_TIMELINE.map(item => {
    if (lang === "ur") {
      if (item.id === "exp-oz") {
        return {
          ...item,
          company: "اوز گروپ",
          role: "ورڈپریس ڈویلپر",
          period: "دسمبر ۲۰۲۵ – تاحال",
          highlights: [
            "کسٹم ورڈپریس ڈیولپمنٹ",
            "اے سی ایف اور سی پی ٹی آرکیٹیکچر",
            "کور ویب وائٹلز کی اصلاح",
            "وو کامرس کی بہتری",
            "متعدد کلائنٹ سائٹس کا انتظام"
          ]
        };
      } else {
        return {
          ...item,
          company: "یاہوے روئی آئی ٹی کمپنی",
          role: "ورڈپریس ڈویلپر",
          period: "ستمبر ۲۰۲۴ – جون ۲۰۲۵",
          highlights: [
            "قبول ویب سائٹس کی تعمیر",
            "وو کامرس پروجیکٹس",
            "ایس ای او اصلاح",
            "ویب سائٹ کی منتقلی",
            "کارکردگی کی بہتری"
          ]
        };
      }
    }
    return item;
  });

  // Calculate dynamic reading time of section content
  const expWords = [
    t.expTitle,
    t.expSub,
    ...experiences.map(item => item.role),
    ...experiences.map(item => item.company),
    ...experiences.flatMap(item => item.highlights)
  ];
  const minsToRead = calculateReadingTime(expWords);

  return (
    <section
      id="experience"
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#F5F5F3] border-t border-[#050505]/5"
    >
      {/* Background layout lines */}
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
        className="relative z-10 max-w-7xl mx-auto font-sans"
      >
        
        {/* Section Header */}
        {!hideHeader && (
        <div className="mb-20">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#FF6B00]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
                {t.expPre}
              </span>
            </div>

            {/* Micro Section Reading Time badge */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#5F5F5F] bg-[#050505]/5 px-2.5 py-1 rounded-full select-none">
              <Clock className="w-3 h-3 text-[#FF6B00]" />
              <span>{minsToRead} {t.readingTime}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <h2 className="lg:col-span-8 font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#050505]">
              {t.expTitle}
            </h2>
            <p className="lg:col-span-4 font-sans text-sm text-[#5F5F5F] leading-relaxed">
              {t.expSub}
            </p>
          </div>
        </div>
        )}

        {/* Vertical Timeline Structure */}
        <div className={`relative ${lang === "ur" ? "border-r pr-8 md:pr-16 mr-4 md:mr-12 lg:mr-36 text-right" : "border-l pl-8 md:pl-16 ml-4 md:ml-12 lg:ml-36 text-left"} border-[#050505]/10 flex flex-col gap-12 md:gap-16`}>
          {experiences.map((item, index) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: lang === "ur" ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Bullet node on timeline */}
                <div className={`absolute ${lang === "ur" ? "-right-[41px] md:-right-[73px]" : "-left-[41px] md:-left-[73px]"} top-1.5 flex items-center justify-center`}>
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-[#FF6B00] shadow-sm flex items-center justify-center">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                  </div>
                </div>

                {/* Floating Period Badge on Left/Right block (Large screens) */}
                <div className={`hidden lg:block absolute ${lang === "ur" ? "-right-[250px] text-start" : "-left-[250px] text-right"} top-1.5 w-40`}>
                  <span className="font-mono text-xs font-bold text-[#FF6B00] uppercase tracking-wider block">
                    {item.period}
                  </span>
                  <p className="font-sans text-[10px] text-[#5F5F5F]/60 font-semibold tracking-wider uppercase mt-1">
                    {lang === "ur" ? "براہِ راست نیٹ ورک" : "DIRECT CONTRACTOR"}
                  </p>
                </div>

                {/* Main Content Card */}
                <div className="rounded-2xl p-6 md:p-8 glass-card bg-white/40 overflow-hidden hover:shadow-md transition-all duration-300 relative group">
                  {/* Subtle hover gradient */}
                  <span className="absolute inset-0 bg-gradient-to-tr from-[#FF6B00]/3 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Header metadata inside card */}
                  <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-[#050505]/5 pb-4 text-start">
                    <div>
                      <span className="font-mono text-xs text-[#FF6B00] font-bold uppercase tracking-wider block mb-1">
                        {item.role}
                      </span>
                      <h3 className="font-sans text-xl md:text-2xl font-bold tracking-tight text-[#050505]">
                        {item.company}
                      </h3>
                    </div>

                    {/* Mobile year show */}
                    <div className="lg:hidden flex items-center gap-1.5 bg-[#F5F5F3] border border-[#050505]/5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-[#5F5F5F]">
                      <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
                      {item.period}
                    </div>
                  </div>

                  {/* Key Highlights list replacing long textual paragraphs */}
                  <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-start">
                    {item.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-center bg-white/60 border border-[#050505]/5 p-3.5 rounded-xl hover:border-[#FF6B00]/30 transition-all duration-300"
                        id={`highlight-${item.id}-${idx}`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                        <p className="font-sans text-xs md:text-sm text-[#050505] font-semibold leading-normal">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </motion.div>
    </section>
  );
}
