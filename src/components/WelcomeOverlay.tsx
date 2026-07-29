import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Keyboard } from "lucide-react";

interface WelcomeOverlayProps {
  onComplete: () => void;
  key?: string;
}

interface LanguageItem {
  text: string;
  lang: string;
  code: string;
  rtl?: boolean;
}

// Exactly the 9 requested languages in order
const LANGUAGES_TEXT: LanguageItem[] = [
  { text: "Thank You For Visiting", lang: "English", code: "en" },
  { text: "آپ کی آمد کا شکریہ", lang: "Urdu", code: "ur", rtl: true },
  { text: "شکریہ جی، ساڈی ویب سائٹ تے آؤن لئی", lang: "Punjabi", code: "pa", rtl: true },
  { text: "از بازدید شما سپاسگزاریم", lang: "Persian", code: "fa", rtl: true },
  { text: "مننه چې زموږ ویب پاڼه مو لیدلې", lang: "Pashto", code: "ps", rtl: true },
  { text: "شكراً لزيارتكم", lang: "Arabic", code: "ar", rtl: true },
  { text: "Ziyaretiniz İçin Teşekkürler", lang: "Turkish", code: "tr" },
  { text: "Merci de votre visite", lang: "French", code: "fr" },
  { text: "Vielen Dank für Ihren Besuch", lang: "German", code: "de" }
];

// Precise Timing Constants matching the requested elegant preloader structure
const FADE_DURATION_SEC = 0.12;  // 120ms fade-in / fade-out transition duration
const VISIBLE_DURATION_MS = 300; // 300ms active fully-visible period
const SLIDE_LIFETIME_MS = 420;   // 120ms fade-in + 300ms visible state before triggering complete

interface LanguageSlideProps {
  item: LanguageItem;
  onComplete: () => void;
  key?: string | number;
}

function LanguageSlide({ item, onComplete }: LanguageSlideProps) {
  useEffect(() => {
    // Start timing only after the language slide is successfully mounted and displayed
    const timer = setTimeout(() => {
      onComplete();
    }, SLIDE_LIFETIME_MS);

    return () => clearTimeout(timer);
  }, [item, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      {/* Language Badge */}
      <div className="overflow-hidden mb-8 h-6">
        <motion.div
          initial={{ y: "150%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-150%" }}
          transition={{ duration: FADE_DURATION_SEC, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-[#FF6B00] font-extrabold flex items-center gap-2 justify-center"
        >
          <span>{item.lang}</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">{item.code.toUpperCase()}</span>
        </motion.div>
      </div>

      {/* Translation Heading */}
      <div className="w-full min-h-[140px] md:min-h-[180px] flex items-center justify-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
          transition={{ duration: FADE_DURATION_SEC, ease: [0.16, 1, 0.3, 1] }}
          dir={item.rtl ? "rtl" : "ltr"}
          className={`font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white select-none max-w-2xl ${
            item.rtl ? "font-sans font-bold" : ""
          }`}
        >
          {item.text}
        </motion.h1>
      </div>
    </div>
  );
}

export default function WelcomeOverlay({ onComplete }: WelcomeOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSkipped, setHasSkipped] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Monitor real-time page resource and asset loading completion status
  useEffect(() => {
    if (document.readyState === "complete") {
      setAssetsLoaded(true);
    } else {
      const handleLoad = () => setAssetsLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  const handleSkip = useCallback(() => {
    if (hasSkipped) return;
    setHasSkipped(true);
    onComplete();
  }, [hasSkipped, onComplete]);

  // Handle transitions based on actual asset loading state
  const handleSlideComplete = useCallback(() => {
    if (assetsLoaded) {
      // If assets have finished loading, complete the current active language cycle and close the overlay immediately
      handleSkip();
    } else {
      // If still loading, continue to the next language in the sequence (wrapping around if needed)
      setCurrentIndex((prev) => (prev + 1) % LANGUAGES_TEXT.length);
    }
  }, [assetsLoaded, handleSkip]);

  // Listen to bypass hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Smooth progress bar percentage: moves index progress, but fills to 100% as soon as loaded
  const progressPercent = assetsLoaded 
    ? 100 
    : Math.min(((currentIndex + 1) / LANGUAGES_TEXT.length) * 90, 90);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.02,
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 z-[10000] flex flex-col justify-between bg-[#0F0F0F] text-[#F5F5F5] p-8 md:p-16 select-none font-sans overflow-hidden"
    >
      {/* High-fidelity film-grain layer matched to premium theme design */}
      <div className="fixed inset-0 z-[10001] pointer-events-none grain-overlay opacity-[0.25]" />

      {/* Grid Alignment lines for premium brutalist architecture feeling */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-between px-8 md:px-16 opacity-10">
        <div className="w-[1px] h-full bg-white/10" />
        <div className="hidden md:block w-[1px] h-full bg-white/10" />
        <div className="hidden lg:block w-[1px] h-full bg-white/10" />
        <div className="w-[1px] h-full bg-white/10" />
      </div>

      {/* Top Header section */}
      <div className="relative z-[10002] flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
          <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.25em] text-white/80 uppercase">
            Aneek Patras — Creative System
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[9px] font-bold text-white/50 bg-white/5 px-3 py-1.5 rounded-full">
          <Keyboard className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>Press [Esc] or [Space] to bypass</span>
        </div>
      </div>

      {/* Center Layout: Typography Transition Showcase */}
      <div className="relative z-[10002] my-auto flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto py-12">
        <AnimatePresence mode="wait">
          <LanguageSlide
            key={currentIndex}
            item={LANGUAGES_TEXT[currentIndex]}
            onComplete={handleSlideComplete}
          />
        </AnimatePresence>
      </div>

      {/* Bottom Footer block containing Skip controls and Progress timeline */}
      <div className="relative z-[10002] w-full flex flex-col gap-6">
        
        {/* Progress Bar Timeline with highly interactive visual pacing */}
        <div className="relative w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF6B00] to-[#FFA800] transition-all ease-out"
            style={{ 
              width: `${progressPercent}%`,
              transitionDuration: `${assetsLoaded ? 500 : 300}ms`
            }}
          />
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest leading-none">
              Connecting Portfolio Hub & Datastream
            </span>
            <span className="font-mono text-[9px] text-white/60 uppercase tracking-widest font-bold">
              STATUS: {assetsLoaded ? "SYSTEM_READY" : "LOADING_RESOURCES"} <span className="text-[#FF6B00]">•</span> ACTIVE_FLOW
            </span>
          </div>

          {/* SKIP CTA Button conforming with tactical minimalist aesthetics */}
          <button
            onClick={handleSkip}
            className="group relative flex items-center gap-2.5 px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold text-[#F5F5F5] bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-[#0F0F0F] transition-all duration-300 pointer-events-auto cursor-pointer outline-none focus:ring-1 focus:ring-[#FF6B00]"
            aria-label="Skip introduction screen and visit portfolio"
          >
            <span>Skip Tour</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
