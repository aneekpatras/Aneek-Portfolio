import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  Linkedin
} from "lucide-react";
import { TRANSLATIONS } from "../utils";

interface ContactProps {
  lang: "en" | "ur";
  hideHeader?: boolean;
}

export default function Contact({ lang, hideHeader = false }: ContactProps) {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert(lang === "ur" ? "براہ کرم تمام مطلوبہ فیلڈز پُر کریں۔" : "Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // Formspree endpoint URL. Swap "your-form-id" with your actual Formspree form ID.
    // E.g., "https://formspree.io/f/mleypbgn"
    const formspreeEndpoint = "https://formspree.io/f/xvzjzvbp";

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        setLoading(false);
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          message: ""
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Formspree submission error");
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to submit message:", error);
      alert(
        lang === "ur" 
          ? "پیغام بھیجنے میں خرابی پیش آئی۔ براہ کرم دوبارہ کوشش کریں یا براہ راست ای میل کریں۔" 
          : "Failed to send message via serverless provider. Please try again or email me directly at aneekkhokhar2@gmail.com."
      );
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#F5F5F3] border-t border-[#050505]/5"
    >
      {/* Background help lines */}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
          
          {/* Left Column: Freelance details */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full text-start">
            {!hideHeader && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-[1px] bg-[#FF6B00]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00] font-bold">
                  {t.contactPre}
                </span>
              </div>

              <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#050505] leading-tight mb-8">
                {t.contactTitle}
              </h2>

              <p className="font-sans text-base md:text-lg text-[#5F5F5F] leading-relaxed mb-6 font-medium">
                {t.contactSub}
              </p>

              <p className="font-sans text-sm md:text-base text-[#5F5F5F] leading-relaxed mb-12">
                {lang === "ur"
                  ? "براہ کرم فارم پُر کریں تاکہ ہم فوری طور پر ای میل کے ذریعے پروجیکٹ شروع سکیں اور اپنی ضرورت کے سنگ میل طے کر سکیں۔"
                  : "Provide your core details, name, and project message, and I'll establish direct lines with you right away."}
              </p>
            </div>
            )}

            {/* Support Metrics assurances */}
            <div className="flex flex-col gap-6 mb-12">
              <div className="flex gap-3.5 items-center">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-[#050505]">
                    {lang === "ur" ? "ایک کاروباری دن میں مکمل جواب" : "One Business Day Response SLA"}
                  </h4>
                </div>
              </div>
              <div className="flex gap-3.5 items-center">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-[#050505]">
                    {lang === "ur" ? "زیرو ڈاؤن ٹائم کیشنگ منتقلی" : "Zero Down-time Migration Guarantee"}
                  </h4>
                </div>
              </div>
            </div>

            {/* Social channels profile links */}
            <div>
              <span className="font-mono text-xs text-[#5F5F5F] uppercase tracking-widest block mb-4">
                {t.contactDetailTitle}
              </span>
              <div className="flex flex-col gap-4 text-sm font-sans mb-8">
                <a 
                  href="mailto:aneekkhokhar2@gmail.com" 
                  className="flex items-center gap-3 text-[#050505] hover:text-[#FF6B00] font-semibold transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-[#FF6B00]" />
                  aneekkhokhar2@gmail.com
                </a>
                <a 
                  href="https://wa.me/923199154505?text=Hello%20Aneek%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project." 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#050505] hover:text-[#FF6B00] font-semibold transition-colors duration-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                  +92 3199154505
                </a>
                <div className="flex items-center gap-3 text-[#5F5F5F]">
                  <Calendar className="w-4 h-4 text-[#FF6B00]" />
                  {t.contactLocVal}
                </div>
              </div>

              {/* Dynamic luxury vector icon reference link */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://linkedin.com/in/aneek-patras" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-full border border-[#050505]/10 hover:border-[#FF6B00] hover:text-[#FF6B00] flex items-center justify-center text-[#050505] transition-all bg-white font-mono text-xs font-semibold"
                  aria-label="Linkedin profile link"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://wa.me/923199154505?text=Hello%20Aneek%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project." 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-full border border-[#050505]/10 hover:border-[#FF6B00] hover:text-[#FF6B00] flex items-center justify-center text-[#050505] transition-all bg-white font-mono text-xs font-bold"
                  aria-label="WhatsApp chat link"
                >
                  WA
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Custom Interactive Form Card */}
          <div className="lg:col-span-7 w-full text-start">
            <div className="rounded-3xl p-8 md:p-12 glass-card bg-white/40 shadow-sm relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="consultation-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name input */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="form-name" className="font-mono text-xs font-bold text-[#050505] uppercase tracking-wider">
                          {t.contactFormName} *
                        </label>
                        <input
                          id="form-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={lang === "ur" ? "جین ڈو" : "Jane Doe"}
                          className="w-full bg-[#F5F5F3] border border-[#050505]/5 rounded-xl px-4 py-3.5 text-sm font-sans placeholder:text-stone-400 focus:outline-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] focus:bg-white transition-all duration-300"
                        />
                      </div>

                      {/* Email Input */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="form-email" className="font-mono text-xs font-bold text-[#050505] uppercase tracking-wider">
                          {t.contactFormEmail} *
                        </label>
                        <input
                          id="form-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jane@company.com"
                          className="w-full bg-[#F5F5F3] border border-[#050505]/5 rounded-xl px-4 py-3.5 text-sm font-sans placeholder:text-stone-400 focus:outline-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] focus:bg-white transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Scope narrative / message */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="form-message" className="font-mono text-xs font-bold text-[#050505] uppercase tracking-wider">
                        {t.contactFormMsg} *
                      </label>
                      <textarea
                        id="form-message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={lang === "ur" ? "پروجیکٹ کی ضرورت، ورڈپریس منتقلی یا رفتار کے بارے میں تفصیل..." : "Detail the speed benchmarks or WooCommerce requirements you would like to discuss..."}
                        className="w-full bg-[#F5F5F3] border border-[#050505]/5 rounded-xl px-4 py-3.5 text-sm font-sans placeholder:text-stone-400 focus:outline-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] focus:bg-white transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Consent parameter info banner */}
                    <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/10 p-4 rounded-xl flex gap-3 items-start">
                      <ShieldCheck className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                      <p className="font-sans text-xs text-[#5F5F5F] leading-relaxed">
                        {lang === "ur" 
                          ? "آپ کے رابطے کی تفصیلات مکمل محفوظ اور خفیہ رکھی جا رہی ہیں۔ یہاں کوئی اسپام یا فالتو لسٹیں نہیں ہیں۔" 
                          : "By submitting this project intake, your credentials are encrypted securely under private security policies. Zero spam or third-party mailing lists."}
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative overflow-hidden rounded-full bg-[#050505] hover:bg-[#FF6B00] text-white font-sans text-xs font-bold uppercase tracking-widest py-4 px-8 self-start transition-colors duration-300 w-full md:w-auto cursor-pointer"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? t.contactSubmitting : t.contactSubmitLabel}
                        <Send className={`w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${lang === "ur" ? "rotate-180" : ""}`} />
                      </span>
                    </button>

                  </motion.form>
                ) : (
                  // Success State screen
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-16 px-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 animate-bounce" />
                    </div>

                    <span className="font-mono text-xs uppercase font-bold text-[#FF6B00] tracking-widest mb-2 block">
                      {lang === "ur" ? "سیکیورڈ ٹرانزیکشن" : "TRANSMISSION COMPLETED"}
                    </span>
                    <h3 className="font-sans text-3xl font-bold tracking-tight text-[#050505] mb-4">
                      {lang === "ur" ? "شکریہ! ٹرانزیکشن رجسٹرڈ" : "Thank You, Scope Secured."}
                    </h3>
                    <p className="font-sans text-slate-500 text-sm max-w-sm leading-relaxed mb-8">
                      {t.contactSuccess}
                    </p>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="rounded-full border border-[#050505]/10 hover:border-[#FF6B00] px-6 py-2.5 text-[#050505] hover:text-[#FF6B00] font-sans text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer"
                    >
                      {lang === "ur" ? "نیا پیغام شروع کریں" : "Submit Duplicate Intent"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
