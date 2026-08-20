import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

interface TestimonialsProps {
  lang: "en" | "ur";
}

export default function Testimonials({ lang }: TestimonialsProps) {
  const isUrdu = lang === "ur";

  // Localized copy
  const content = {
    en: {
      badge: "● TESTIMONIALS",
      title: "What our clients are saying",
      metrics: [
        {
          value: "92%",
          label: "of our clients return for a second project",
          percentage: 92,
        },
        {
          value: "87%",
          label: "reported a stronger brand perception",
          percentage: 87,
        },
        {
          value: "100%",
          label: "speed and performance score achieved",
          percentage: 100,
        },
      ],
      highlight: {
        quote: "Working with Aneek felt less like hiring a developer and more like gaining a strategic partner forever.",
        author: "Harold Mercer",
        role: "Investor & Founder",
      },
      cards: [
        {
          quote: "Our WooCommerce store load times dropped from 4.8s to 1.1s. Conversion rates went up by 34% in the first month alone.",
          author: "Sarah Jenkins",
          role: "CEO at BloomStore",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
        },
        {
          quote: "Aneek's custom WordPress architecture and security audit hardened our platform completely. A master of speed and clean engineering.",
          author: "David Chen",
          role: "CTO at TechPulse",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
        },
      ],
    },
    ur: {
      badge: "● کلائنٹس کی رائے",
      title: "ہمارے کلائنٹس ہمارے کام کے بارے میں کیا کہتے ہیں",
      metrics: [
        {
          value: "92٪",
          label: "کلائنٹس دوسرے پروجیکٹ کے لیے دوبارہ رجوع کرتے ہیں",
          percentage: 92,
        },
        {
          value: "87٪",
          label: "نے برانڈ کی مضبوط اور بہتر کارکردگی کی رپورٹ دی",
          percentage: 87,
        },
        {
          value: "100٪",
          label: "پیج اسپیڈ اور سپیڈ بینچ مارک ہمیشہ حاصل کیا گیا",
          percentage: 100,
        },
      ],
      highlight: {
        quote: "انیق کے ساتھ کام کرنا کسی ڈویلپر کی خدمات حاصل کرنے جیسا نہیں، بلکہ ہمیشہ کے لیے ایک اسٹریٹجک شراکت دار حاصل کرنے جیسا محسوس ہوا۔",
        author: "ہیرالڈ مرسر",
        role: "سرمایہ کار اور بانی",
      },
      cards: [
        {
          quote: "ہمارے وہ کامرس اسٹور کا لوڈنگ ٹائم 4.8 سیکنڈ سے کم ہو کر 1.1 سیکنڈ رہ گیا۔ پہلے ہی مہینے میں ہماری فروخت میں 34٪ اضافہ ہوا۔",
          author: "سارہ جینکنز",
          role: "سی ای او، بلوم اسٹور",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
        },
        {
          quote: "انیق کے کسٹم ورڈپریس فن تعمیر اور سیکیورٹی آڈٹ نے ہمارے پورٹل کو مکمل طور پر محفوظ بنا دیا۔ رفتار اور بہترین انجینئرنگ کے حقیقی ماہر۔",
          author: "ڈیوڈ چین",
          role: "سی ٹی او، ٹیک پلس",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
        },
      ],
    },
  };

  const t = content[isUrdu ? "ur" : "en"];

  return (
    <section
      id="testimonials"
      className="relative w-full py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-[#FAFAF9] border-t border-[#050505]/5"
    >
      {/* Background grid indicators matching rest of layout */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-between px-6 md:px-12 lg:px-24">
        <div className="w-[1px] h-full bg-[#050505]/2" />
        <div className="hidden md:block w-[1px] h-full bg-[#050505]/2" />
        <div className="hidden lg:block w-[1px] h-full bg-[#050505]/2" />
        <div className="w-[1px] h-full bg-[#050505]/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Heading and metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`lg:col-span-4 flex flex-col justify-between ${isUrdu ? "text-right" : "text-left"}`}
          >
            <div>
              <div className={`flex items-center gap-2 mb-4 ${isUrdu ? "justify-end" : "justify-start"}`}>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF6B00] font-bold">
                  {t.badge}
                </span>
              </div>
              <h2 className="font-sans text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#050505] leading-[1.15] mb-6">
                {t.title}
              </h2>
            </div>

            {/* Metrics List with Animated Progress Lines */}
            <div className="space-y-5 mt-8 lg:mt-0">
              {t.metrics.map((m, idx) => (
                <div key={idx} className="space-y-2">
                  <div className={`flex items-baseline justify-between ${isUrdu ? "flex-row-reverse" : ""}`}>
                    <span className="font-sans text-xl font-black text-[#FF6B00] tracking-tight">
                      {m.value}
                    </span>
                    <span className="font-sans text-xs md:text-sm text-[#5F5F5F] font-semibold">
                      {m.label}
                    </span>
                  </div>
                  <div className="w-full h-[3px] bg-stone-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: idx * 0.15, ease: "easeOut" }}
                      className="h-full bg-[#FF6B00] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Center Column: Highlight Card with beautiful layout */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col"
          >
            <div className="relative flex-1 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#121211] via-[#1C1C1A] to-[#0A0A09] text-white flex flex-col justify-between overflow-hidden group shadow-xl">
              {/* Premium radial glowing accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#FF6B00]/15 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />

              {/* Quotes decorative icon */}
              <div className={`relative z-10 opacity-10 flex ${isUrdu ? "justify-start" : "justify-end"}`}>
                <Quote className="w-12 h-12 text-white" />
              </div>

              <div className="relative z-10 mt-8 flex flex-col justify-end">
                {/* 5 solid gold stars */}
                <div className={`flex gap-1 mb-5 ${isUrdu ? "justify-end" : "justify-start"}`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className={`font-sans text-base md:text-lg font-medium tracking-tight text-white leading-relaxed mb-6 ${isUrdu ? "text-right" : "text-left"}`}>
                  "{t.highlight.quote}"
                </p>

                <div className={`border-t border-white/10 pt-5 flex items-center gap-4 ${isUrdu ? "flex-row-reverse text-right" : "text-left"}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-inner">
                    HM
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-white">
                      {t.highlight.author}
                    </h4>
                    <p className="font-sans text-xs text-[#A8A29E] mt-0.5">
                      {t.highlight.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Stacked standard review cards */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            {t.cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-2xl p-6 bg-white border border-[#050505]/5 shadow-sm hover:border-[#FF6B00]/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[48%] ${
                  isUrdu ? "text-right" : "text-left"
                }`}
              >
                <div>
                  {/* Stars */}
                  <div className={`flex gap-1 mb-4 ${isUrdu ? "justify-end" : "justify-start"}`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                    ))}
                  </div>

                  <p className="font-sans text-sm text-[#3A3A3A] leading-relaxed italic mb-6">
                    "{card.quote}"
                  </p>
                </div>

                <div className={`flex items-center gap-3 pt-4 border-t border-[#050505]/5 ${isUrdu ? "flex-row-reverse text-right" : "text-left"}`}>
                  <img
                    src={card.avatar}
                    alt={card.author}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-[#050505]/10"
                  />
                  <div>
                    <h4 className="font-sans text-xs md:text-sm font-bold text-[#050505]">
                      {card.author}
                    </h4>
                    <p className="font-sans text-[10px] md:text-xs text-[#5F5F5F] mt-0.5">
                      {card.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
