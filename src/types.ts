import victoriasCoffeeImage from "./assets/images/regenerated_image_1780406713775.png";
import technoorUaeImage from "./assets/images/technoor.png";

/**
 * TypeScript definitions and static portfolio data strictly sourced from Aneek Patras's CV.
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  image: string;
  tags: string[];
  performanceMetric: {
    label: string;
    value: string;
  };
  overview: string;
  challenge: string;
  solution: string;
  results: string[];
  completionYear: string;
  link: string;
  github?: string;

  // New CMS requested fields
  slug?: string;
  gallery?: string[];
  heroImage?: string;
  hoverImage?: string; // secondary image shown on card hover (crossfade)
  clientName?: string;
  caseStudyUrl?: string;
  featured?: boolean;
  status?: "published" | "draft";
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SkillItem {
  id: string;
  category: "Development" | "Performance & SEO" | "Tools & Workflow" | "Frontend" | "WordPress" | "Backend" | "SEO" | "Performance" | "Security" | "Tools";
  title: string;
  skillsList: string[];
  iconName: string; // Lucide icon reference
  rating: string;
  displayOrder?: number;
  status?: "published" | "draft";
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string; // Dynamic text e.g., "Dec 2025 – Present"
  highlights: string[];
  
  // New CMS requested fields
  startDate?: string;
  endDate?: string;
  currentPosition?: boolean;
  displayOrder?: number;
  description?: string;
  logo?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  time: string;
  status: "unread" | "read" | "archived" | "deleted";
  createdAt?: any;
}


export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: "victorias-coffee",
    title: "The Victorias Coffee",
    category: "WooCommerce & Custom Theme Engineering",
    subtitle: "Highly-optimized eCommerce rebuild featuring bespoke child theme layouts and ACF product integrations.",
    image: victoriasCoffeeImage,
    tags: ["WooCommerce", "ACF", "Custom CPT", "WP Rocket", "Yoast SEO"],
    hoverImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=1200",
    performanceMetric: {
      label: "PageSpeed Index Rating",
      value: "41 → 88"
    },
    overview: "Formulated a full eCommerce rebuild with custom post types (CPT) to handle seasonal menu scheduling, responsive WooCommerce styling, and deep ACF integration.",
    challenge: "Original site loaded slowly under off-the-shelf theme bloat, causing checkout drop-offs and poor mobile catalog paths.",
    solution: "Re-engineered with a custom light-weight child theme, structured ACF custom fields for seasonal menus, and integrated caching setups.",
    results: [
      "PageSpeed score improved from 41 to 88.",
      "Redesigned checkout flow to reduce drop-offs.",
      "Custom CPT for seasonal menus implemented successfully."
    ],
    completionYear: "2025",
    link: "https://thevictoriascoffee.com/"
  },
  {
    id: "padel-hub",
    title: "Padel Hub",
    category: "Interactive Booking & Elementor Pro Integration",
    subtitle: "A premium physical court booking portal integrated smoothly into an Elementor Pro frontend.",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200",
    hoverImage: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=1200",
    tags: ["WordPress", "Elementor Pro", "Custom CPT", "Yoast SEO", "Booking Integration"],
    performanceMetric: {
      label: "Organic Traffic Lift",
      value: "+45%"
    },
    overview: "A booking-integrated court booking platform equipped with custom post types for responsive scheduling and an elegant, client-manageable Elementor frontend.",
    challenge: "sluggish loading and layout shifting prevented mobile visitors from completing real-time court scheduling.",
    solution: "Developed custom court scheduling integrations paired with solid on-page SEO frameworks from the ground up.",
    results: [
      "Organic sessions increased 45% in the first 90 days post-launch.",
      "Beautiful court booking scheduling system with custom CPT.",
      "Pixel-perfect responsive Elementor layouts."
    ],
    completionYear: "2024",
    link: "https://padelhub.pk"
  },
  {
    id: "technoor-uae",
    title: "Technoor UAE",
    category: "WooCommerce & Full Security Hardening",
    subtitle: "High-tier electronics retail store styled for responsive layout and hardened with full firewall parameters.",
    image: technoorUaeImage,
    hoverImage: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200",
    tags: ["WordPress", "WooCommerce", "Elementor", "Security Hardening", "Wordfence"],
    performanceMetric: {
      label: "Security Incident Rate",
      value: "0% in 12 months"
    },
    overview: "Responsive eCommerce marketplace built for a UAE-based consumer electronics brand. Handled custom payment gateways and full theme adaptation.",
    challenge: "The shop layout was vulnerable to threat injections and required layout synchronization for payment gateway integrations.",
    solution: "Deployed a secure payment gateway flow, developed product visual structures, and locked down site boundaries using Wordfence.",
    results: [
      "Secured zero security incidents in 12 months via Wordfence.",
      "Integrated fast, dynamic payment gateways.",
      "Customized user checkout flow to maximize Conversions."
    ],
    completionYear: "2025",
    link: "https://technoor.me/"
  },
  {
    id: "oz-developers",
    title: "Oz Developers",
    category: "Custom WordPress & Advanced Directory",
    subtitle: "A highly interactive, fast corporate network index featuring directory management tools and dynamic lookups.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    hoverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    tags: ["WordPress", "Custom Post Types", "ACF Pro", "WP Rocket", "SEO Strategy"],
    performanceMetric: {
      label: "Google PageSpeed Mobile",
      value: "91"
    },
    overview: "Engineered from the ground up to allow rapid indexing and streamlined directory updates.",
    challenge: "Excessive database queries caused sluggish catalog lookups and heavy mobile layout shift.",
    solution: "Developed custom child templates and metadata queries mapping dynamically to custom taxonomies.",
    results: [
      "Page Speed improved significantly with PageSpeed scores over 91 on mobile.",
      "Redundant styling databases fully cleaned and optimized."
    ],
    completionYear: "2025",
    link: "https://ozdevelopers.com"
  },
  {
    id: "lahore-sky",
    title: "Lahore Sky",
    category: "Elementor Real Estate Showcase",
    subtitle: "Premium real estate project portal with interactively automated layout hierarchies and optimized visual banners.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    tags: ["WordPress", "Elementor Pro", "SEO Optimization", "Yoast Pro", "Schema Markup"],
    performanceMetric: {
      label: "PageSpeed Index Rating",
      value: "94"
    },
    overview: "High-density property exhibit customized to showcase multi-story layouts fluidly without image drag.",
    challenge: "High resolution images of floorplans and elevations created layout shifts and loading bottlenecks.",
    solution: "Lazyloaded media arrays combined with modern WebP transformation structures.",
    results: [
      "PageSpeed Desktop score stabilized at 94.",
      "On-page metadata setup boosted local organic indexing."
    ],
    completionYear: "2025",
    link: "https://lahoresky.com.pk"
  },
  {
    id: "thanvex",
    title: "Thanvex",
    category: "B2B Wholesale WooCommerce",
    subtitle: "A high-performance bulk order wholesale store featuring advanced pricing grids and lightning fast catalog routes.",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200",
    tags: ["WooCommerce", "B2B Features", "ACF Pro", "Security Hardening"],
    performanceMetric: {
      label: "Client Checkout Conversion",
      value: "+35%"
    },
    overview: "Custom-arranged wholesale checkout platform engineered to scale transaction values smoothly.",
    challenge: "Standard WooCommerce layouts were rigid, slowing catalog inquiries for wholesale clients.",
    solution: "Integrated fast-path ordering systems leveraging specialized ajax calls and custom theme fragments.",
    results: [
      "Completed Checkout timeline sped up by 35%.",
      "Dynamic catalog filters pass-through index in less than 300ms."
    ],
    completionYear: "2024",
    link: "https://thanvex.com"
  },
  {
    id: "i-icecream",
    title: "I Ice Cream",
    category: "Gutenberg Core Layout Retail",
    subtitle: "A playful, modern consumer brand showcase written with native block workflows to guarantee ultra-fast response.",
    image: "https://images.unsplash.com/photo-1501443712940-3decff37ab65?auto=format&fit=crop&q=80&w=1200",
    tags: ["Gutenberg Blocks", "WordPress", "Core Web Vitals", "Custom Palettes"],
    performanceMetric: {
      label: "Mobile PageSpeed Rating",
      value: "97"
    },
    overview: "Lightweight, brand-focused catalog utilizing native WordPress Gutenberg layout tools.",
    challenge: "Bulky background assets and non-system fonts caused layout shifts and slow initial rendering.",
    solution: "Cleaned active stylesheets and embedded critical inline layout styles.",
    results: [
      "Secured PageSpeed score of 97 on mobile devices.",
      "Maintained zero layout shifts (CLS < 0.05) through layout preconditioning."
    ],
    completionYear: "2024",
    link: "https://iicecream.pk"
  },
  {
    id: "my-phonez",
    title: "My Phonez",
    category: "WooCommerce Australasia Portal",
    subtitle: "Refined digital repair queue and device catalog engineered for Sydney-based physical stores.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200",
    tags: ["WooCommerce", "Sydney SEO", "Wordfence", "Elementor Pro"],
    performanceMetric: {
      label: "Organic Lead Generation",
      value: "+50%"
    },
    overview: "A dual service booking and consumer physical sales workspace customized for seamless local delivery.",
    challenge: "Fragmented booking flows led to high consumer lookup leakage and cart abandonment.",
    solution: "Engineered single-step booking taxonomy relationships with quick lead filters.",
    results: [
      "Amplified qualified digital booking requests by 50%.",
      "Hardened administration gates to secure consumer checkout data."
    ],
    completionYear: "2025",
    link: "https://myphonez.com.au"
  },
  {
    id: "az-mobiles",
    title: "AZ Mobiles",
    category: "Multi-Currency Commerce Storefront",
    subtitle: "High-volume consumer electronics store loaded with instant filtering and automated payment checkouts.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200",
    tags: ["WooCommerce", "Payment Gateways", "Australia SEO", "WP Speed"],
    performanceMetric: {
      label: "Bounce Rate Improvement",
      value: "42% → 19%"
    },
    overview: "ECommerce platform tuned for rapid item-to-bag actions with dynamic tax structures and real-time shipping indexes.",
    challenge: "Overloaded asset libraries and complex shipping calculators delayed page rendering for regional clients.",
    solution: "Cached critical checkout logic and offloaded complex calculations to optimized PHP actions.",
    results: [
      "Bounce rate decreased from 42% down to 19%.",
      "Page Weight reduced by 1.2MB for cellular devices."
    ],
    completionYear: "2025",
    link: "https://azmobiles.com.au"
  },
  {
    id: "getmetutor",
    title: "Get Me Tutor",
    category: "E-Learning Taxonomy Directory",
    subtitle: "Dynamic directory platform mapping tutees to certified academic guides via tailored taxonomy profiles.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=1200",
    tags: ["WordPress", "Custom CPT", "Advanced Fields", "Directory Rules"],
    performanceMetric: {
      label: "Search Routing Time",
      value: "<120ms"
    },
    overview: "Academic directories platform leveraging custom lookup indexes to direct prospective students seamlessly.",
    challenge: "Standard database lookups staggered under high student queries, creating database locks.",
    solution: "Tailored custom indexes for postmeta values and cached dynamic queries.",
    results: [
      "Lookups completed globally in less than 120ms.",
      "Enhanced local discoverability by formatting Person schema parameters."
    ],
    completionYear: "2024",
    link: "https://getmetutor.online"
  },
  {
    id: "sialkot-stallionz",
    title: "Sialkot Stallionz",
    category: "Sports Club Schedule Automated CPT",
    subtitle: "Automated media portal organizing game rosters and stats sheets cleanly via custom scheduling models.",
    image: "https://images.unsplash.com/photo-1540747737956-3787217ab2fc?auto=format&fit=crop&q=80&w=1200",
    tags: ["WordPress", "Custom Post Types", "Active Cache", "Responsive CSS"],
    performanceMetric: {
      label: "Dynamic Database Queries",
      value: "112 → 14"
    },
    overview: "Fan platform and team directory driven by custom relationships to keep schedules synchronized without manual intervention.",
    challenge: "Multiple plugins to pull fixture listings overwhelmed CPU cycles and caused frequent site drops.",
    solution: "Developed native WordPress loop actions bypassing external query templates.",
    results: [
      "Reduced dynamic database loads per home request from 112 down to 14.",
      "Optimized score sheets visually on modern mobile devices."
    ],
    completionYear: "2024",
    link: "https://sialkotstallionz.com"
  },
  {
    id: "kssmartbeauty",
    title: "KS Smart Beauty Salon",
    category: "Service Booking & Menu System",
    subtitle: "An elegant, interactive treatment booking interface styled for premium salon locations.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200",
    tags: ["WordPress", "Elementor Styles", "ACF Custom", "Google Analytics"],
    performanceMetric: {
      label: "Booking Automation Rate",
      value: "+75%"
    },
    overview: "Service pricing list and calendar workspace structured for high reservation accuracy and visual luxury.",
    challenge: "Desktop-oriented schedules resulted in slow tablet touch responses and high drop-offs.",
    solution: "Tailored customized responsive touch layouts with instant service confirmation states.",
    results: [
      "Lited automated bookings by over 75% in the first month.",
      "Achieved cohesive typography styling with luxurious element grids."
    ],
    completionYear: "2025",
    link: "https://kssmartbeautysalon.base44.app"
  },
  {
    id: "dynamic-cms-placeholder",
    title: "Dynamic CMS Integration",
    category: "Dynamic WordPress CMS Playground",
    subtitle: "Advanced, clean template repository ready to ingest ACF, Custom Post Type, and WooCommerce databases.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1200",
    tags: ["ACF Pro", "CPT Loop Engine", "Dynamic Queries", "Rest API Friendly"],
    performanceMetric: {
      label: "WP Database Import Time",
      value: "<3 Min"
    },
    overview: "A developer sandbox demonstrating high architectural adaptability for automated WordPress migrations.",
    challenge: "Traditional custom themes require intensive translation of static code blocks into active database loops.",
    solution: "Written with modular clean-code classes mapping exactly to standard field schemas.",
    results: [
      "CMS conversion templates can be imported and paired in under 3 minutes.",
      "Fully responsive and ready for immediate localized custom styling."
    ],
    completionYear: "2026",
    link: "https://thevictoriascoffee.com/"
  }
];

export const SKILL_ITEMS: SkillItem[] = [
  {
    id: "sk-dev",
    category: "Development",
    title: "Advanced Development",
    skillsList: [
      "WordPress",
      "Elementor",
      "Gutenberg",
      "WooCommerce",
      "PHP",
      "MySQL",
      "Custom Post Types (CPT)",
      "ACF",
      "Child Theme Development",
      "Responsive Web Design"
    ],
    iconName: "Code2",
    rating: "Mastery"
  },
  {
    id: "sk-perf",
    category: "Performance & SEO",
    title: "Site Optimization & SEO",
    skillsList: [
      "Core Web Vitals",
      "Page Speed Optimization",
      "Google Search Console",
      "On-Page SEO",
      "Schema Markup",
      "Website Security"
    ],
    iconName: "Zap",
    rating: "95+ Speed"
  },
  {
    id: "sk-tools",
    category: "Tools & Workflow",
    title: "Ecosystem & Workflow",
    skillsList: [
      "Hostinger",
      "WP Rocket",
      "Wordfence",
      "Yoast SEO",
      "Figma",
      "Git"
    ],
    iconName: "Cpu",
    rating: "Reliable"
  }
];

export const EXPERIENCE_TIMELINE: Experience[] = [
  {
    id: "exp-oz",
    company: "Oz Group",
    role: "WordPress Developer",
    period: "Dec 2025 – Present",
    highlights: [
      "Custom WordPress Development",
      "ACF & CPT Architecture",
      "Core Web Vitals Optimization",
      "WooCommerce Enhancements",
      "Managed Multiple Client Websites"
    ]
  },
  {
    id: "exp-yahweh",
    company: "Yahwehroi IT Company",
    role: "WordPress Developer",
    period: "Sep 2024 – Jun 2025",
    highlights: [
      "Responsive Website Development",
      "WooCommerce Projects",
      "SEO Optimization",
      "Website Migration",
      "Performance Improvements"
    ]
  }
];
