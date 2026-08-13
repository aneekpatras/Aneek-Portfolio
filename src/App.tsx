/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Approach from "./components/Approach";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CTABanner from "./components/CTABanner";
import Footer from "./components/Footer";

export default function App() {
  // Show the preloader once per browser session — so routing back from the
  // Work page (#/work) reveals the home instantly instead of replaying it.
  const [isLoading, setIsLoading] = useState(
    () => !sessionStorage.getItem("aneek_preloaded")
  );
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const lang = "en";

  // Force document-level layout direction to English (LTR)
  useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  }, []);

  // Lock body scroll while the preloader is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  // Scroll Progress Tracker across viewport
  useEffect(() => {
    const handleScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    handleScrollProgress(); // check initially
    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, []);

  // Section Interaction Tracker to update header link indicators dynamically
  useEffect(() => {
    const sections = ["hero", "projects", "approach", "results", "faq"];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200; // Offset for focus
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader
            key="preloader"
            onComplete={() => {
              sessionStorage.setItem("aneek_preloaded", "1");
              setIsLoading(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative min-h-screen bg-[#F5F5F3] overflow-x-clip selection:bg-[#FF6B00] selection:text-white">
        {/* Subtle Horizontal Scroll Progress Bar */}
        <div
          id="scroll-progress-bar"
          className="fixed top-0 left-0 h-[3px] bg-[#FF6B00] z-[100] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Visual tactile grain overlay across the entire brand portfolio */}
        <div className="fixed inset-0 z-40 pointer-events-none grain-overlay" />

        {/* Portfolio Structural Blocks */}
        <Header activeSection={activeSection} />
        
        <main className="relative z-10 w-full">
          <Hero lang={lang} />
          <Projects lang={lang} />
          <Approach lang={lang} />
          <Testimonials lang={lang} />
          <FAQ lang={lang} />
          <CTABanner />
        </main>

        <Footer lang={lang} />
      </div>
    </>
  );
}
