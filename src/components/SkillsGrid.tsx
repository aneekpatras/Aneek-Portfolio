import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Layout, 
  Code2, 
  ShoppingBag, 
  Zap, 
  Cpu, 
  Search, 
  Lock, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { SKILL_ITEMS } from "../types";
import { TRANSLATIONS } from "../utils";

interface SkillsGridProps {
  lang: "en" | "ur";
}

// Editorial header copy for the Craft Compass / Skills section (English-first).
const CONTENT = {
  pre: "CRAFT COMPASS",
  title: "An Engineering Dialect Sourced in Performance.",
  sub: "I maintain deep fluency in full-stack WordPress architecture and layout structures.",
};

export default function SkillsGrid({ lang }: SkillsGridProps) {
  const t = TRANSLATIONS[lang];
  const skills = SKILL_ITEMS;
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Map icon names to Lucide icons
  const getIcon = (name: string) => {
    switch (name) {
      case "Layout":
        return <Layout className="w-6 h-6" />;
      case "Code2":
        return <Code2 className="w-6 h-6" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-6 h-6" />;
      case "Zap":
        return <Zap className="w-6 h-6" />;
      case "Cpu":
        return <Cpu className="w-6 h-6" />;
      case "Search":
        return <Search className="w-6 h-6" />;
      default:
        return <Lock className="w-6 h-6" />;
    }
  };

  // Assign personalized sizing classes for high-fidelity bento look
  const getBentoClasses = (category: string) => {
    switch (category) {
      case "Development":
        return "md:col-span-8 lg:col-span-8 min-h-[320px] bg-gradient-to-br from-[#050505]/5 via-transparent to-[#FF6B00]/5";
      case "Performance & SEO":
        return "md:col-span-4 lg:col-span-4 min-h-[320px] bg-gradient-to-br from-indigo-500/5 to-[#FF6B00]/5";
      case "Tools & Workflow":
        return "md:col-span-12 lg:col-span-8 min-h-[220px]";
      default:
        return "md:col-span-4 lg:col-span-4 min-h-[200px]";
    }
  };

  const getTranslatedCategory = (category: string) => {
    if (lang === "ur") {
      if (category === "Development") return t.skillsCategory1;
      if (category === "Performance & SEO") return t.skillsCategory2;
      return t.skillsCategory3;
    }
    return category;
  };

  const getTranslatedRating = (rating: string) => {
    if (lang === "ur") {
      if (rating === "Mastery") return "مکمل مہارت";
      if (rating === "95+ Speed") return "95+ رفتار";
      return "قابل اعتماد";
    }
    return rating;
  };

  return (
    <section
      id="skills"
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#F5F5F3] border-t border-[#050505]/5"
    >
      {/* Background layout helper lines */}
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
        
        {/* Editorial Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-[1px] bg-[#FF6B00]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
              {CONTENT.pre}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <h2 className="lg:col-span-7 font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#050505] leading-tight">
              {CONTENT.title}
            </h2>
            <p className="lg:col-span-5 font-sans text-base text-[#5F5F5F] leading-relaxed">
              {CONTENT.sub}
            </p>
          </div>
        </div>

        {/* Bento Grid Layout (12-column grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-fr">
          {skills.map((skill) => {
            const isHovered = hoveredCardId === skill.id;
            const sizeClass = getBentoClasses(skill.category);

            return (
              <motion.div
                key={skill.id}
                onMouseEnter={() => setHoveredCardId(skill.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`relative rounded-3xl p-8 glass-card overflow-hidden transition-all duration-500 hover:shadow-xl flex flex-col justify-between group ${sizeClass}`}
              >
                {/* Glow Backdrop Highlight on Hover */}
                <span
                  className="absolute inset-0 z-0 bg-gradient-to-tr from-[#FF6B00]/7 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                />

                {/* Grid header metric (rating / skill depth indicator) */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F5F5F3] text-[#050505] group-hover:bg-[#FF6B00] group-hover:text-white transition-colors duration-500 border border-[#050505]/5">
                    {getIcon(skill.iconName)}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#5F5F5F]">{lang === "ur" ? "درجہ" : "DEPTH"}</span>
                    <p className="font-mono text-base font-bold text-[#050505] group-hover:text-[#FF6B00] transition-colors">
                      {getTranslatedRating(skill.rating)}
                    </p>
                  </div>
                </div>

                {/* Grid content footer details */}
                <div className="relative z-10 mt-6 text-start">
                  <span className="font-mono text-xs font-bold text-[#FF6B00] uppercase tracking-wider block mb-2">
                    {getTranslatedCategory(skill.category)}
                  </span>
                  <h3 className="font-sans text-xl md:text-2xl font-bold tracking-tight text-[#050505]">
                    {skill.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {skill.skillsList.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#050505] bg-[#F5F5F3]/80 border border-[#050505]/5 px-2.5 py-1.5 rounded-lg group-hover:border-[#FF6B00]/20 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive accent underline */}
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-[#FF6B00] transition-all duration-500" />
              </motion.div>
            );
          })}

          {/* Bonus static CTA grid card inside Bento */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 lg:col-span-4 min-h-[200px] rounded-3xl p-8 bg-[#050505] text-white overflow-hidden relative flex flex-col justify-between group text-start"
          >
            {/* Visual glow background */}
            <span className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-[#FF6B00]/20 blur-[60px]" />
            
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B00] font-bold">
                {lang === "ur" ? "پیشہ ورانہ تعاون کار" : "WORK COLLABORATOR"}
              </span>
              <Sparkles className="w-5 h-5 text-[#FF6B00] animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div className="relative z-10 mt-6">
              <h3 className="font-sans text-xl md:text-2xl font-bold tracking-tight">
                {lang === "ur" ? "کیا آپ کو کسٹم ورڈپریس پلگ انز کی ضرورت ہے؟" : "Need custom WordPress plugins?"}
              </h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                {lang === "ur" 
                  ? "میں باقاعدگی سے اے سی ایف پرو کے اندر اپنی ضرورت کے مطابق کسٹم سی پی ٹی اور ملحقہ افعال ڈیزائن کرتا ہوں۔" 
                  : "I regularly create tailor-made solutions incorporating WP Admin overrides and automated backend synchronizations inside ACF Pro."}
              </p>
            </div>

            <Link
              to="/contact"
              className="relative z-10 font-sans text-xs font-bold uppercase tracking-widest text-[#FF6B00] group-hover:text-white transition-colors duration-300 mt-8 flex items-center gap-2"
            >
              {lang === "ur" ? "رابطہ کریں اور پراجیکٹ کا آغاز کریں" : "Request Custom Work"} 
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${lang === "ur" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
