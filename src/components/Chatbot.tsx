import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";
import { useProjects } from "../lib/projectStore";
import { useChatbotData, chatbotApi } from "../lib/chatbotStore";
import { answerQuery } from "../lib/chatEngine";

interface Message {
  role: "bot" | "user";
  text: string;
}

const SUGGESTIONS = [
  "What services do you offer?",
  "How much does a website cost?",
  "How do we start?",
  "Can I see your work?",
  "How long does a project take?",
  "Do you build e-commerce websites?",
];

const GREETING: Message = {
  role: "bot",
  text: "Hi 👋 I'm here to help answer common questions about Aneek's work. Tap a question below or type your own.",
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const projects = useProjects();
  const { qa, logs } = useChatbotData();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);

    // Compute the answer, then reveal after a short "typing" delay.
    const result = answerQuery(q, { projects, qa, logs });
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: result.text }]);
      setTyping(false);
      // Log the turn — feeds reinforcement + unmatched-question training.
      chatbotApi.logChat({
        question: q,
        answer: result.text,
        matchedId: result.matchedId,
        matched: result.matched,
      });
    }, 550);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="fixed bottom-6 right-6 z-[9998] hidden sm:block">
      {/* Chat card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 right-0 flex h-[560px] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-[#050505]/8 bg-[#F5F5F3] shadow-[0_25px_70px_-20px_rgba(0,0,0,0.35)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#050505]/8 px-5 py-4">
              <div>
                <h3 className="font-sans text-base font-extrabold tracking-tight text-[#050505]">
                  Ask Aneek
                </h3>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#5F5F5F]">
                    Online · Instant Answers
                  </span>
                </div>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF6B00]/10 text-[#FF6B00]">
                <MessageCircle className="h-4.5 w-4.5" />
              </span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-sans text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#FF6B00] text-white rounded-br-sm"
                        : "bg-white/70 text-[#050505] border border-[#050505]/5 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-[#050505]/5 bg-white/70 px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                        className="h-1.5 w-1.5 rounded-full bg-[#5F5F5F]"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestion chips */}
              {showSuggestions && !typing && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-[#050505]/12 bg-white/60 px-3 py-1.5 font-sans text-xs text-[#050505] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-[#050505]/8 px-4 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                className="flex-1 rounded-full border border-[#FF6B00]/30 bg-white/60 px-4 py-2.5 font-sans text-sm text-[#050505] outline-none transition-colors placeholder:text-[#5F5F5F]/60 focus:border-[#FF6B00]"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || typing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-white transition-all hover:bg-[#050505] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B00] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#050505]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
