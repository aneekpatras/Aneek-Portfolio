import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { TRANSLATIONS } from "../utils";

interface HeaderProps {
  activeSection: string;
}

export default function Header({ activeSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const t = TRANSLATIONS["en"];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: t.navAbout, href: "#/about" },
    { name: "Work", href: "#/work" },
    { name: t.navExperience, href: "#/experience" },
    { name: t.navContact, href: "#/contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Route links (e.g. #/work) navigate to another view — let the hash change
    // through so main.tsx's router picks it up instead of trying to scroll.
    if (href.startsWith("#/")) {
      setIsOpen(false);
      return;
    }
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const topOffset = targetElement.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth"
      });
    } else {
      // Target section isn't on the current view (e.g. logo → #hero from a
      // sub-page) → route back to the homepage.
      window.location.hash = "";
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <>
      <motion.header
        id="site-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-4 px-6 md:px-12 ${
          scrolled 
            ? "bg-[#F5F5F3]/80 backdrop-blur-md border-b border-[#050505]/5 py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Personal Brand */}
          <a 
            href="#hero" 
            onClick={(e) => handleNavClick(e, "#hero")}
            className="group flex items-center gap-3 font-sans"
          >
            <div className="w-8 h-8 bg-[#050505] rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <div className="w-2.5 h-2.5 bg-[#FF6B00] rounded-full"></div>
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-[#050505]">ANEEK</span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative font-sans text-sm font-medium tracking-wide transition-colors duration-300 py-1 ${
                    isActive 
                      ? "text-[#FF6B00]" 
                      : "text-[#5F5F5F] hover:text-[#050505]"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeSubbar"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-[#FF6B00]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Call to action & Live Clock */}
          <div className="hidden md:flex items-center gap-4">
            {/* Live Digital Clock */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#050505]/5 rounded-full border border-[#050505]/5 font-mono text-[11px] text-[#5F5F5F] select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold tracking-tight text-[#050505]/85">
                {time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>

            <a
              href="#/contact"
              onClick={(e) => handleNavClick(e, "#/contact")}
              className="relative overflow-hidden group rounded-full border border-[#050505]/15 px-5 py-2.5 text-xs font-semibold tracking-wider text-[#050505] transition-all duration-500 hover:border-[#FF6B00] hover:text-[#050505]"
            >
              <div className="absolute inset-0 w-0 bg-[#FF6B00]/5 transition-all duration-300 group-hover:w-full" />
              <span className="relative flex items-center gap-1.5">
                {t.letsTalk} <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </span>
            </a>
          </div>

          {/* Hamburger Menu Mobile Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Live Digital Clock for Mobile */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.25 bg-[#050505]/5 rounded-full border border-[#050505]/5 font-mono text-[10px] text-[#5F5F5F] select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-[#050505]/85">
                {time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#050505] hover:text-[#FF6B00] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer (Glassmorphism & Staggered items) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-[60px] z-40 bg-[#F5F5F3]/95 backdrop-blur-lg md:hidden flex flex-col px-8 py-12 gap-8 border-t border-[#050505]/5"
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`font-sans text-xl font-bold tracking-tight transition-all ${
                      isActive ? "text-[#FF6B00]" : "text-[#5F5F5F]"
                    }`}
                  >
                    {item.name}
                  </motion.a>
                );
              })}
            </nav>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto border-t border-[#050505]/10 pt-8"
            >
              <p className="font-mono text-xs text-[#5F5F5F] uppercase tracking-widest mb-4">{t.availableContracts}</p>
              <a
                href="https://wa.me/923199154505?text=Hello%20Aneek%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#050505] hover:bg-[#FF6B00] text-white py-4 font-sans font-medium text-sm transition-colors duration-300"
              >
                {t.hireMe} <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
