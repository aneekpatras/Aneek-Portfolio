import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface PreloaderProps {
  onComplete: () => void;
  key?: string;
}

// Single unified preloader: counter + bar animate from 0 → 100 over exactly 2s.
const DURATION_MS = 2000;

// Split-curtain slide timing (ease-in-out).
const CURTAIN = { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const };

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let rafId = 0;

    // Warm the two locally-bundled hero images while the counter runs (fire-and-forget).
    [
      "/src/assets/images/regenerated_image_1780406713775.png",
      "/src/assets/images/regenerated_image_1780406745422.png",
    ].forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(Math.floor(pct));

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Hit 100% exactly at the 2s mark — trigger the split-curtain reveal.
        onComplete();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  const isDone = progress >= 100;

  return (
    // Transparent shell — the two panels below carry the dark background so the
    // site behind is revealed as they slide apart. pointer-events-none keeps it
    // from intercepting clicks during the reveal.
    <motion.div
      initial={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none"
    >
      {/* LEFT curtain — clips a viewport-wide copy of the content to the left half. */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={CURTAIN}
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
      >
        <div className="absolute inset-y-0 left-0 w-screen">
          <PanelContent progress={progress} isDone={isDone} />
        </div>
      </motion.div>

      {/* RIGHT curtain — same content copy, anchored right so the halves line up seamlessly. */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={CURTAIN}
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
      >
        <div className="absolute inset-y-0 right-0 w-screen">
          <PanelContent progress={progress} isDone={isDone} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** One full-viewport copy of the preloader UI (rendered inside each curtain panel). */
function PanelContent({ progress, isDone }: { progress: number; isDone: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-[#0F0F0F] text-[#F5F5F5] p-8 md:p-16 font-sans overflow-hidden">
      {/* Film-grain layer matched to the premium theme */}
      <div className="absolute inset-0 z-[1] pointer-events-none grain-overlay opacity-[0.25]" />

      {/* Structural grid alignment lines */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-between px-8 md:px-16 opacity-10">
        <div className="w-[1px] h-full bg-white/10" />
        <div className="hidden md:block w-[1px] h-full bg-white/10" />
        <div className="hidden lg:block w-[1px] h-full bg-white/10" />
        <div className="w-[1px] h-full bg-white/10" />
      </div>

      {/* Top header */}
      <div className="relative z-10 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
          <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.25em] text-white/80 uppercase">
            Aneek Patras — Web Portfolio
          </span>
        </div>
        <span className="font-mono text-[9px] md:text-[10px] text-white/60 font-bold tracking-widest bg-white/5 px-2.5 py-1 rounded-full uppercase whitespace-nowrap">
          STATUS: {isDone ? "SYSTEM_READY" : "INITIALIZING..."}
        </span>
      </div>

      {/* Center: large monospace percentage counter */}
      <div className="relative z-10 my-auto text-left flex flex-col justify-center max-w-lg">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "150%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-7xl md:text-8xl lg:text-[8rem] tracking-tighter font-black text-white leading-none flex items-baseline gap-1"
          >
            <span>{progress}</span>
            <span className="text-[#FF6B00] text-3xl lg:text-5xl">%</span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-sans text-xs uppercase tracking-[0.3em] text-white/50 font-bold mt-4 whitespace-nowrap"
        >
          Thanks For Visiting
        </motion.p>
      </div>

      {/* Bottom: thin horizontal progress bar + tech accents */}
      <div className="relative z-10 w-full">
        <div className="relative w-full h-[1.5px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF6B00] to-[#FFA800] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
          <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
            Optimizing images, compiling layouts
          </span>
          <span className="font-mono text-[9px] tracking-widest uppercase font-bold text-[#FF6B00]">
            INDEX: SPEED_VALIDATED
          </span>
        </div>
      </div>
    </div>
  );
}
