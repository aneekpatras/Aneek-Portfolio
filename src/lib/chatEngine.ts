import { Project, EXPERIENCE_TIMELINE, SKILL_ITEMS } from "../types";
import type { CustomQA, ChatLog } from "./chatbotStore";

/**
 * Lightweight, fully client-side retrieval engine. It assembles a knowledge
 * base from admin Q&A + live portfolio data, then answers a question by
 * keyword/synonym overlap scoring, reinforced by past successful matches.
 */

export interface KBEntry {
  id: string;
  keywords: string[];
  answer: string;
  source: "custom" | "project" | "experience" | "skills" | "baseline";
}

export interface Answer {
  text: string;
  matchedId: string | null;
  matched: boolean;
}

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "do", "does", "you", "your", "i", "we", "to", "of",
  "for", "and", "or", "in", "on", "with", "how", "what", "can", "me", "my", "it",
  "this", "that", "about", "tell", "please", "have", "has", "will", "would", "there",
]);

// Expand common terms so users' phrasing still matches the KB.
const SYNONYMS: Record<string, string[]> = {
  cost: ["price", "pricing", "budget", "charge", "rate", "quote", "expensive"],
  price: ["cost", "pricing", "budget"],
  ecommerce: ["e-commerce", "shop", "store", "woocommerce", "cart", "checkout", "online store"],
  woocommerce: ["ecommerce", "shop", "store"],
  fast: ["speed", "performance", "quick", "load", "optimize", "optimization"],
  speed: ["fast", "performance", "core web vitals", "optimization"],
  secure: ["security", "safe", "hardening", "protection", "hacker"],
  work: ["projects", "portfolio", "case study", "examples"],
  project: ["work", "build", "website", "site"],
  start: ["begin", "hire", "get started", "kick off", "onboard"],
  contact: ["reach", "email", "message", "talk", "connect"],
  time: ["timeline", "long", "duration", "deadline", "weeks"],
  service: ["services", "offer", "provide", "do"],
  skill: ["skills", "tech", "stack", "technologies", "tools", "expertise"],
  experience: ["history", "background", "worked", "job", "career"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function expand(tokens: string[]): Set<string> {
  const out = new Set(tokens);
  for (const t of tokens) {
    (SYNONYMS[t] || []).forEach((s) => s.split(/\s+/).forEach((w) => out.add(w)));
  }
  return out;
}

/** Baseline facts about services / process — mirrors the site FAQ. */
const BASELINE: KBEntry[] = [
  {
    id: "base-services",
    keywords: tokenize(
      "what services do you offer provide services custom wordpress development woocommerce frontend react speed security seo migration"
    ),
    answer:
      "I offer custom WordPress engineering (themes, ACF, Custom Post Types), WooCommerce e-commerce builds, high-performance frontend development (React/JS, Gutenberg, Elementor without bloat), Core Web Vitals & speed optimization, security hardening, and full site migrations.",
    source: "baseline",
  },
  {
    id: "base-cost",
    keywords: tokenize("how much does a website cost price pricing budget quote charge"),
    answer:
      "It depends on scope — every project is unique. After a short discovery chat about your goals, I send a clear fixed-price proposal with no hidden fees.",
    source: "baseline",
  },
  {
    id: "base-timeline",
    keywords: tokenize("how long does a project take timeline duration weeks deadline"),
    answer:
      "A custom WordPress build or full overhaul typically takes about 2–4 weeks from kickoff to launch. Smaller speed or frontend tweaks are usually much quicker.",
    source: "baseline",
  },
  {
    id: "base-ecommerce",
    keywords: tokenize("do you build ecommerce e-commerce online store shop woocommerce cart checkout"),
    answer:
      "Yes — I build high-converting WooCommerce stores with custom checkout flows, smart product filtering, payment gateway integration, and security hardening.",
    source: "baseline",
  },
  {
    id: "base-start",
    keywords: tokenize("how do we start get started begin hire kick off onboard next steps"),
    answer:
      'Easy — tap "Let\'s Talk" in the menu or open the Contact page and send a short note about your project. I reply within one business day to set up a quick call.',
    source: "baseline",
  },
  {
    id: "base-contact",
    keywords: tokenize("how do i contact reach email message get in touch talk connect"),
    answer:
      "Head to the Contact page and submit the form — it opens a pre-filled email draft. I respond within one business day.",
    source: "baseline",
  },
  {
    id: "base-work",
    keywords: tokenize("can i see your work projects portfolio case studies examples"),
    answer:
      "Absolutely — visit the Work page to browse selected projects, or ask me about a specific one (e.g. Victorias Coffee, Padel Hub, Technoor UAE).",
    source: "baseline",
  },
  {
    id: "base-international",
    keywords: tokenize("international clients remote worldwide global time zone"),
    answer:
      "Yes, I work with clients worldwide — smooth async updates, Loom walkthroughs, and calls scheduled to fit your time zone.",
    source: "baseline",
  },
];

export function buildKnowledgeBase(projects: Project[], qa: CustomQA[]): KBEntry[] {
  const kb: KBEntry[] = [];

  // 1) Admin custom Q&A (highest signal)
  for (const q of qa) {
    kb.push({
      id: q.id,
      keywords: [...tokenize(q.question), ...(q.keywords || []).map((k) => k.toLowerCase())],
      answer: q.answer,
      source: "custom",
    });
  }

  // 2) Projects
  for (const p of projects.filter((x) => x.status !== "draft")) {
    const result = p.results?.[0] ? ` ${p.results[0]}` : "";
    kb.push({
      id: `project-${p.id}`,
      keywords: tokenize(`${p.title} ${p.category} ${p.subtitle} ${p.tags.join(" ")}`),
      answer: `${p.title} — ${p.subtitle}${result} (${p.category}, ${p.completionYear}). Live: ${p.link}`,
      source: "project",
    });
  }

  // 3) Experience
  for (const exp of EXPERIENCE_TIMELINE) {
    kb.push({
      id: `exp-${exp.id}`,
      keywords: tokenize(`${exp.company} ${exp.role} ${exp.period} experience work history ${exp.highlights.join(" ")}`),
      answer: `${exp.role} at ${exp.company} (${exp.period}): ${exp.highlights.slice(0, 3).join("; ")}.`,
      source: "experience",
    });
  }

  // 4) Skills (one combined entry)
  const skillList = SKILL_ITEMS.map((s) => `${s.title}: ${s.skillsList.join(", ")}`).join(" | ");
  kb.push({
    id: "skills-all",
    keywords: tokenize(
      `skills tech stack technologies tools expertise ${SKILL_ITEMS.flatMap((s) => s.skillsList).join(" ")}`
    ),
    answer: `Core expertise — ${skillList}.`,
    source: "skills",
  });

  // 5) Baseline facts
  kb.push(...BASELINE);

  return kb;
}

export function answerQuery(
  question: string,
  ctx: { projects: Project[]; qa: CustomQA[]; logs: ChatLog[] }
): Answer {
  const kb = buildKnowledgeBase(ctx.projects, ctx.qa);
  const qTokens = expand(tokenize(question));
  if (qTokens.size === 0) {
    return {
      text: "Could you rephrase that? Ask me about services, pricing, timelines, or my projects.",
      matchedId: null,
      matched: false,
    };
  }

  // Reinforcement: how often each entry was a successful match before.
  const hits = new Map<string, number>();
  for (const l of ctx.logs) {
    if (l.matched && l.matchedId) hits.set(l.matchedId, (hits.get(l.matchedId) || 0) + 1);
  }

  let best: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of kb) {
    const kw = new Set(entry.keywords);
    let overlap = 0;
    for (const t of qTokens) if (kw.has(t)) overlap++;
    if (overlap === 0) continue;

    // Normalize by query size; weight custom answers; add reinforcement boost.
    let score = overlap / qTokens.size;
    if (entry.source === "custom") score *= 1.4;
    score += Math.min(hits.get(entry.id) || 0, 10) * 0.03;

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  // Threshold guards against weak/irrelevant matches.
  if (best && bestScore >= 0.18) {
    return { text: best.answer, matchedId: best.id, matched: true };
  }

  return {
    text:
      "I don't have a confident answer for that yet — but I'm always learning. For specifics, reach out via the Contact page and Aneek will reply within one business day.",
    matchedId: null,
    matched: false,
  };
}
