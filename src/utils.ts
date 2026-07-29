import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

/**
 * Calculates estimated reading time based on typical 200 words-per-minute speed.
 */
export function calculateReadingTime(texts: string | string[]): number {
  const wordsPerMinute = 200;
  const combined = Array.isArray(texts) ? texts.join(" ") : texts;
  const wordCount = combined.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Translations dictionary for English and Urdu (اردو) locales.
 */
export const TRANSLATIONS = {
  en: {
    navAbout: "About",
    navSkills: "Skills",
    navProjects: "Projects",
    navExperience: "Experience",
    navResults: "Results",
    navContact: "Contact",
    letsTalk: "LET'S TALK",
    hireMe: "Hire Me",
    availableContracts: "AVAILABLE FOR CONTRACTS",
    readingTime: "min read",
    
    // Hero details
    heroTitlePre: "HIGH-PERFORMANCE WORDPRESS",
    heroTitleMain: "Delivering Speed, Hardened Security, and Clean Design",
    heroSub: "I engineering high-performance child themes and WooCommerce portals. Sourced directly from professional performance deliverables, custom ACF lookups, and fast database schemas.",
    downloadResume: "Download Resume",
    viewProjects: "View Projects",
    
    // Results
    resultsTitlePre: "VERIFIABLE LANDMARKS",
    resultsTitleMain: "Optimized Project Deliverables",
    resultsSub: "Active metrics aggregated across live customer sites, verified independently via Lighthouse metrics and database benchmarks.",
    metric1Label: "PageSpeed Index Boost",
    metric1Desc: "Average core speed optimization level across high-density WooCommerce checkout channels.",
    metric2Label: "Load Time Drop",
    metric2Desc: "Load time latency drop via asset deferred bundles and database index optimization.",
    metric3Label: "Firewall Block Rate",
    metric3Desc: "Prevented login intrusions and security spikes through custom cloud policies.",
    metric4Label: "Page Weight Reduction",
    metric4Desc: "Average payload reduction using WebP assets and style database pruning.",

    // About Section
    aboutPre: "THE MAN BEHIND THE STACKS",
    aboutTitle: "Turning Bloated Code Bases into Scalable, Speed-Validated Masterpieces.",
    aboutP1: "In a world crowded by cookie-cutter, slow-loading templates, I choose to craft. I am Aneek, an elite WordPress Developer and Frontend Architect on a mission to eliminate the bloat that costs businesses traffic, indexing, and sales.",
    aboutP2: "My approach is deeply analytical. By merging lightweight modern React/JS elements with advanced WordPress database index customization, I establish digital pipelines that feel lightning-speed and looks visually flawless on every device.",
    aboutHighlight1Title: "Performance Optimizations",
    aboutHighlight1Desc: "Replacing slow page-builder templates with clean-coded Gutenberg or Headless architectures.",
    aboutHighlight2Title: "Hardened Security Policies",
    aboutHighlight2Desc: "Rigorous protection parameters configured at both SQL database and web application firewall layers.",
    aboutHighlight3Title: "WooCommerce Specialized",
    aboutHighlight3Desc: "Crafting optimized checkouts and smooth custom filtering schemas to secure your shopping conversions.",
    aboutCraftPre: "CRAFT BENCHMARK",
    aboutCraftTitle: "Clean Code is Cheaper Than Paid Ads.",
    aboutCraftDesc: "Speeding up your platform by a fraction of a second can lift your organic crawl budgets and conversion yields by double-digit percentages overnight.",

    // Skills Section
    skillsPre: "CRAFT COMPASS",
    skillsTitle: "An Engineering Dialect Sourced in Performance.",
    skillsSub: "I maintain deep fluency in full-stack WordPress architecture and layout layout structures.",
    skillsProLabel: "PRO LEVEL",
    skillsCategory1: "Advanced Development",
    skillsCategory2: "Site Optimization & SEO",
    skillsCategory3: "Ecosystem & Workflow",

    // Projects Section
    projectsPre: "CASE REPOSITORY",
    projectsTitle: "Showcasing Active Commercial Frontends.",
    projectsSub: "Sourced from live projects delivered for consumer portals, real-estate channels, and digital booking platforms.",
    projectCompletion: "Completion Year",
    projectMetrics: "Performance Metric",
    projectChallenge: "The Challenge",
    projectSolution: "The Solution",
    projectResults: "Tangible Results",
    projectVisit: "Visit Live Project",
    showMore: "Show More Projects",
    showLess: "Show Less Projects",

    // Experience Section
    expPre: "PROFESSIONAL TIMELINE",
    expTitle: "Work History & Landmarks.",
    expSub: "Bespoke child-theme architecture, security configuration, and performance deliverables. Focused on implementing clean, modular WordPress systems and premium WooCommerce storefronts.",

    // Contact Section
    contactPre: "LET'S BUILD SOMETHING",
    contactTitle: "Initiate Your Precision Platform Overhaul.",
    contactSub: "Available globally for contracts, theme engineering, and performance consultations. Submit your details to open a pre-filled email draft with your project scope.",
    contactFormName: "Your Brand Name / Full Name",
    contactFormEmail: "Professional Email Address",
    contactFormMsg: "Project Scope / Goals",
    contactSubmitLabel: "GENERATE AND SEND EMAIL DRAFT",
    contactSubmitting: "Generating draft...",
    contactSuccess: "Inbound ticket registered successfully! Opening your default email client as a new tab...",
    contactDetailTitle: "Direct Channels",
    contactLocTitle: "Current Workspace Locale",
    contactLocVal: "Lahore, Pakistan (GMT+5)",
    contactAvailTitle: "Collaboration Availability",
    contactAvailVal: "Accepting select high-priority contracts",
    copyright: "All Rights Reserved"
  },
  ur: {
    navAbout: "تعارف",
    navSkills: "مہارتیں",
    navProjects: "پروجیکٹس",
    navExperience: "تجربہ",
    navResults: "نتائج",
    navContact: "رابطہ",
    letsTalk: "بات کریں",
    hireMe: "مجھے ہائر کریں",
    availableContracts: "معاہدوں کے لیے دستیاب",
    readingTime: "منٹ کا مطالعہ",
    
    // Hero details
    heroTitlePre: "ہائی پرفارمنس ورڈپریس",
    heroTitleMain: "رفتار، فولادی سیکیورٹی، اور بہترین ڈیزائن کی فراہمی",
    heroSub: "میں ہائی پرفارمنس چائلڈ تھیمز اور ای کامرس پورٹلز ڈیزائن کرتا ہوں۔ جو کارکردگی کی فراہمی، کسٹم ACF لک اپس، اور تیز ترین ڈیٹا بیس اسکیموں سے لیس ہیں۔",
    downloadResume: "ریزیومے ڈاؤن لوڈ کریں",
    viewProjects: "پروجیکٹس دیکھیں",
    
    // Results
    resultsTitlePre: "قابل تصدیق سنگ میل",
    resultsTitleMain: "بہترین پروجیکٹ کارکردگی",
    resultsSub: "کسٹمر سائٹس کے اصل اعداد و شمار، جن کی تصدیق ہم نے آزادانہ طور پر لائٹ ہاؤس اور ڈیٹا بیس میٹرکس کے ذریعے کی ہے۔",
    metric1Label: "پیج اسپیڈ انڈیکس میں اضافہ",
    metric1Desc: "ہائی ڈینسٹی وہ کامرس چیک آؤٹ چینلز پر اوسط کوریج اسپیڈ لیول۔",
    metric2Label: "لوڈ ٹائم میں کمی",
    metric2Desc: "اثاثوں کے بنڈلز کو درست طریقے سے لوڈ کرکے اور انڈیکس کو بہتر بنا کر لوڈ ٹائم میں کمی۔",
    metric3Label: "فائر وال بلاک کی شرح",
    metric3Desc: "کسٹم کلاؤڈ پالیسیوں کے ذریعے لاگ ان مداخلت اور مشکوک ٹریفک کو روکا گیا۔",
    metric4Label: "پیج کا وزن کم کرنا",
    metric4Desc: "ویب پی اثاثوں اور فالتو اسٹائل شیٹس کی صفائی کے ذریعے اوسط ڈیٹا سائز میں کمی۔",

    // About Section
    aboutPre: "اسٹیکس کے پیچھے کام کرنے والا ڈویلپر",
    aboutTitle: "سست اور بوجھل سائٹس کو تیز ترین اور منفرد شاہکار میں بدلنا۔",
    aboutP1: "سست لوڈ ہونے والی ٹیمپلیٹس اور روایتی طریقوں کی بھیڑ میں، میں کچھ منفرد بنانا پسند کرتا ہوں۔ میں انیق ہوں، ایک ورڈپریس ڈویلپر اور فرنٹ اینڈ آرکیٹیکٹ جس کا مشن بوجھل کوڈ کو ختم کرنا ہے جو کاروبار کی ٹریفک اور سیلز کو کم کرتا ہے۔",
    aboutP2: "میرا طریقہ کار گہرا اور تجزیاتی ہے۔ جدید لائٹ ویٹ ری ایکٹ ایلیمنٹس کو ورڈپریس ڈیٹا بیس کی اصلاح کے ساتھ ملا کر، میں ایسے ڈیجیٹل شاہکار تخلیق کرتا ہوں جو بجلی کی رفتار سے کام کرتے ہیں۔",
    aboutHighlight1Title: "پرفارمنس کی اصلاح",
    aboutHighlight1Desc: "سست پیج بلڈرز کی جگہ صاف ستھرے گوٹنبرگ یا ہیڈ لیس فن تعمیر کا استعمال۔",
    aboutHighlight2Title: "مضبوط سیکیورٹی پالیسیز",
    aboutHighlight2Desc: "ایس کیو ایل ڈیٹا بیس اور ویب ایپلیکیشن فائر وال کی سطح پر سخت ترین سیکیورٹی۔",
    aboutHighlight3Title: "وہ کامرس اسپیشلائزڈ",
    aboutHighlight3Desc: "آپ کی سیلز کو یقینی بنانے کے لیے تیز رفتار چیک آؤٹس اور کسٹم فلٹرنگ فارمیٹس۔",
    aboutCraftPre: "کرافٹ بینچ مارک",
    aboutCraftTitle: "بہترین صاف کوڈ پیڈ اشتہارات سے کہیں زیادہ سستا ہے۔",
    aboutCraftDesc: "اپنی ویب سائٹ کی رفتار کو سیکنڈ کے کچھ حصوں میں بڑھانے سے آپ کی آرگینک ٹریفک اور سیلز میں نمایاں اضافہ ہو سکتا ہے۔",

    // Skills Section
    skillsPre: "مہارت کا دائرہ",
    skillsTitle: "کارکردگی و رفتار پر مبنی انجینئرنگ مہارت۔",
    skillsSub: "میں ورڈپریس آرکیٹیکٹ اور گوٹ برگ ماڈلز میں گہری مہارت رکھتا ہوں۔",
    skillsProLabel: "پرو لیول",
    skillsCategory1: "اعلی درجے کی ترقی",
    skillsCategory2: "سائٹ کی رفتار اور ایس ای او",
    skillsCategory3: "ٹولز اور ورک فلو",

    // Projects Section
    projectsPre: "کامیاب نمونے",
    projectsTitle: "کمرشل پروجیکٹس کا پورٹ فولیو۔",
    projectsSub: "اصل لائیو پروجیکٹس سے حاصل کردہ جو کسٹمر پورٹلز، رئیل اسٹیٹ اور ڈیجیٹل سروس کے لیے تیار کیے گئے۔",
    projectCompletion: "سالِ تکمیل",
    projectMetrics: "کارکردگی میٹرک",
    projectChallenge: "مسئلہ / چیلنج",
    projectSolution: "حل",
    projectResults: "نمایاں نتائج",
    projectVisit: "لائیو پروجیکٹ دیکھیں",
    showMore: "مزید پروجیکٹس دیکھیں",
    showLess: "کم پروجیکٹس دکھائیں",

    // Experience Section
    expPre: "عمل کا سفر نامہ",
    expTitle: "تجربہ اور سنگ میل۔",
    expSub: "جدید چائلڈ تھیم فن تعمیر، سیکیورٹی کنفیگریشن، اور اعلی پرفارمنس۔ کلین، ماڈیولر ورڈپریس سسٹمز اور پریمیم ای کامرس اسٹورز کی تعمیر پر فوکس۔",

    // Contact Section
    contactPre: "آئیے مل کر کچھ بنائیں",
    contactTitle: "اپنی سائٹ کو بہترین رفتار اور انداز دینے کے لیے رابطہ کریں۔",
    contactSub: "پوری دنیا سے پراجیکٹس اور مشاورت کے لیے دستیاب۔ فوری طور پر ای میل کے ذریعے جڑنے کے لیے فارم پُر کریں۔",
    contactFormName: "آپ کا نام / برانڈ",
    contactFormEmail: "پروفیشنل ای میل ایڈریس",
    contactFormMsg: "پراجیکٹ کی تفصیلات",
    contactSubmitLabel: "ای میل فارمیٹ کا مسودہ بنا کر بھیجیں",
    contactSubmitting: "مسودہ تیار کیا جا رہا ہے...",
    contactSuccess: "شکریہ! پراجیکٹ کا مسودہ تیار ہے، اب ہم آپ کا ای میل سافٹ ویئر کھول رہے ہیں...",
    contactDetailTitle: "رابطے کے ذرائع",
    contactLocTitle: "دفتر کا پتہ",
    contactLocVal: "لاہور، پاکستان (GMT+5)",
    contactAvailTitle: "دستیابی",
    contactAvailVal: "منتخب ہائی ترجیجی معاہدے قبول کر رہا ہوں",
    copyright: "جملہ حقوق محفوظ ہیں"
  }
};

/**
 * Generates an Unsplash URL parameterized with specific width, formats (avif, webp, jpg), and default parameters.
 */
export function getUnsplashUrl(url: string, options: { width?: number; format?: "webp" | "avif" | "jpg"; quality?: number } = {}): string {
  if (!url || !url.includes("unsplash.com")) {
    return url;
  }
  try {
    const urlObj = new URL(url);
    if (options.width) {
      urlObj.searchParams.set("w", options.width.toString());
    }
    if (options.format) {
      urlObj.searchParams.set("fm", options.format);
    }
    if (options.quality) {
      urlObj.searchParams.set("q", options.quality.toString());
    } else {
      urlObj.searchParams.set("q", "80");
    }
    urlObj.searchParams.set("fit", "crop");
    urlObj.searchParams.set("auto", "format");
    return urlObj.toString();
  } catch (e) {
    return url;
  }
}

/**
 * Generates a full responsive srcSet using optimized width increments.
 */
export function getUnsplashSrcSet(url: string, format?: "webp" | "avif" | "jpg"): string | undefined {
  if (!url || !url.includes("unsplash.com")) {
    return undefined;
  }
  const widths = [480, 768, 1024, 1200, 1600];
  return widths
    .map((w) => `${getUnsplashUrl(url, { width: w, format })} ${w}w`)
    .join(", ");
}
