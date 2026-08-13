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
    id: "oz-developers",
    title: "Oz Developers",
    category: "Custom WordPress & Advanced Directory",
    subtitle: "A highly interactive, fast corporate network index featuring directory management tools and dynamic lookups.",
    image: "/src/assets/images/ozdevelopers.png",
    hoverImage: "/src/assets/images/ozdevelopershower.png",
    tags: ["WordPress", "Custom Post Types", "ACF Pro", "WP Rocket", "SEO Strategy", "Wp Page Biulder"],
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
    link: "https://ozdevelopers.com",
    displayOrder: 0
  },
  {
    id: "getmetutor",
    title: "Get Me Tutor",
    category: "Web Application / EdTech",
    subtitle: "An online tutoring platform connecting students with qualified tutors, featuring dynamic routing and smooth UI interactions.",
    image: "/src/assets/images/getmetutor.png",
    tags: ["React", "React Router", "Tailwind CSS", "Framer Motion"],
    performanceMetric: {
      label: "Performance & Server",
      value: "LiteSpeed / HTTP/3"
    },
    overview: "Get Me Tutor is a modern online tutoring and educational service portal designed to bridge the gap between students and qualified tutors through an intuitive, interactive interface.",
    challenge: "Creating a fast, accessible user interface with smooth route switching, flexible motion transitions, and optimal rendering performance across devices.",
    solution: "Built a client-side architecture leveraging React and React Router (v7) for seamless navigation, styled with Tailwind CSS for high responsiveness, and enhanced with Framer Motion and Lucide icons for an engaging UI. Deployed on a LiteSpeed web server with HTTP/3 and priority hinting for quick asset loading.",
    results: [
      "Fast interactive UI built with React & Tailwind CSS",
      "Smooth single-page navigation via React Router 7",
      "Optimized web delivery powered by LiteSpeed & HTTP/3",
      "Enhanced user experience with Framer Motion animations"
    ],
    completionYear: "2026",
    link: "https://getmetutor.online",
    displayOrder: 1,
    hoverImage: "/src/assets/images/getmetutorhower.png"
  },
  {
    id: "technoor-uae",
    title: "Technoor UAE",
    category: "WooCommerce & Full Security Hardening",
    subtitle: "High-tier electronics retail store styled for responsive layout and hardened with full firewall parameters.",
    image: "/src/assets/images/technoor..png",
    hoverImage: "/src/assets/images/technoor.png",
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
    link: "https://technoor.me/",
    displayOrder: 2
  },
  {
    id: "oz-techworks",
    title: "OZ Techworks",
    category: "Custom WordPress / E-Waste Website",
    subtitle: "A custom-themed WordPress website built for a E-Waste Management, integrated with Tailwind CSS, dynamic scroll animations, and optimized backend performance.",
    image: "/src/assets/images/gogreen.png",
    tags: ["WordPress", "Custom Theme", "PHP"],
    performanceMetric: {
      label: "Infrastructure & Speed",
      value: "LiteSpeed / PHP 8.3"
    },
    overview: "A high-performance corporate platform built using a fully custom-built WordPress theme tailored specifically for OZ Techworks. It combines modern front-end styling with robust PHP architecture.",
    challenge: "Avoiding heavy page builders to achieve optimal speed, lightweight code delivery, and clean design consistency while maintaining custom dynamic content flexibility.",
    solution: "Engineered a custom WordPress theme from scratch using PHP 8.3 and MySQL. Integrated Tailwind CSS for clean layout utility, AOS for subtle dynamic scroll animations, and hosted on LiteSpeed servers with HTTP/3 support for fast asset delivery.",
    results: [
      "Fully custom-built WordPress theme tailored from scratch",
      "Lightweight utility-first styling powered by Tailwind CSS",
      "High-speed hosting performance via Hostinger & LiteSpeed",
      "Smooth scroll transitions using AOS animations"
    ],
    completionYear: "2026",
    link: "https://oztechworks.com/",
    github: "",
    status: "published",
    featured: false,
    displayOrder: 3,
    hoverImage: "/src/assets/images/gogreenhower.png"
  },
  {
    id: "padel-hub",
    title: "Padel Hub",
    category: "Sports & Entertainment / Booking Website",
    subtitle: "A modern sports club website featuring court booking integrations, event management, cafe details, dynamic sliders, and location mapping.",
    image: "/src/assets/images/Padelhub.png",
    hoverImage: "/src/assets/images/Padelhubhower.png",
    tags: ["WordPress", "Custom CPT", "Yoast SEO", "Booking Integration", "PHP (8.2)"],
    performanceMetric: {
      label: "nfrastructure & Speed",
      value: "LiteSpeed / HTTP/3"
    },
    overview: "The official digital platform for The Padel Hub, designed to provide visitors with court booking access, membership plans, cafe menus, events schedules, and court locations in a sleek, interactive layout.",
    challenge: "Delivering an engaging sports lifestyle experience with fast-loading media sliders, dynamic interactive elements, and seamless map directions without compromising performance.",
    solution: "Built on WordPress using PHP 8.2 and integrated Vue.js with Axios for reactive UI features. Utilized Swiper for smooth hero/gallery sliders, integrated Google Maps API for court navigation, and optimized speed using LiteSpeed server technology with HTTP/3.",
    results: [
      "Interactive UI elements built with Vue.js and AxiosSmooth media carousels powered by SwiperIntegrated Google Maps location finder for visitorsFast response times delivered via LiteSpeed Web Server"
    ],
    completionYear: "2025",
    link: "https://thepadelhub.pk/",
    displayOrder: 4
  },
  {
    id: "lahore-sky",
    title: "Lahore Sky",
    category: "Elementor Real Estate Showcase",
    subtitle: "Premium real estate project portal with interactively automated layout hierarchies and optimized visual banners.",
    image: "/src/assets/images/lahoresky.png",
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
    link: "https://lahoresky.com.pk",
    displayOrder: 5,
    hoverImage: "/src/assets/images/lahoreskyhower.png"
  },
  {
    id: "victorias-coffee",
    title: "The Victorias Coffee",
    category: "WooCommerce & Custom Theme Engineering",
    subtitle: "Highly-optimized eCommerce rebuild featuring bespoke child theme layouts and ACF product integrations.",
    image: "/src/assets/images/regenerated_image_1780406713775.png",
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
    link: "https://thevictoriascoffee.com/",
    displayOrder: 6
  },
  {
    id: "thanvex",
    title: "Wise Wheels Blog",
    category: "Automotive Blog / Content Portal",
    subtitle: "A custom-tailored automotive blog and news platform for Wise Wheels, engineered with custom PHP logic, GeneratePress, and advanced SEO optimization for high-traffic content delivery.",
    image: "/src/assets/images/ww-blogs.png",
    tags: ["WordPress", "Custom PHP (8.3)", "React", "Bootstrap", "RankMath SEO"],
    performanceMetric: {
      label: "Speed & Optimization",
      value: "Nginx / Cloudflare CDN"
    },
    overview: "The official editorial and news sub-system for Wise Wheels. Built using custom PHP integration on top of WordPress to handle automotive news, buying guides, market updates, and featured vehicle listings.",
    challenge: "Ensuring fast page load times and optimal SEO structure for heavy content, high-resolution media, and frequent article updates while maintaining smooth performance under heavy traffic.",
    solution: "Developed custom PHP extensions tailored for editorial layouts, using GeneratePress as a lightweight foundational theme paired with Bootstrap. Enhanced security and speed using Cloudflare CDN with Nginx, integrated React for interactive UI widgets, and optimized search visibility using RankMath SEO.",
    results: [
      "Custom PHP development integrated for specialized blogging workflowsUltra-fast content delivery powered by Nginx and Cloudflare CDNFully SEO-optimized architecture using RankMath SEOResponsive, mobile-first design built with Bootstrap and React widgets"
    ],
    completionYear: "2026",
    link: "https://wisewheels.com.pk/blogs/",
    displayOrder: 7,
    hoverImage: "/src/assets/images/ww-blogshower.png"
  },
  {
    id: "kssmartbeauty",
    title: "Looks Smart Beauty Salon",
    category: "Salon Booking & Management App",
    subtitle: "A luxury salon web application featuring seamless appointment booking, client follow-ups, and a comprehensive admin dashboard to track revenue, leads, and operational schedules.",
    image: "/src/assets/images/lsbs.png",
    tags: ["React", "React Router 6", "Tailwind CSS", "Radix UI", "shadcn/ui", "Base44"],
    performanceMetric: {
      label: "Feature Set",
      value: "Admin Dashboard & Lead Tracking"
    },
    overview: "A modern, Progressive Web App (PWA) built for Looks Smart Beauty Salon. It offers a premium front-end experience for client appointment scheduling alongside a powerful backend administrative portal to manage day-to-day salon operations.",
    challenge: "Designing an elegant, high-end booking flow for salon services while engineering a real-time admin management hub to handle bookings, revenue stats, client leads, and business hours.",
    solution: "Engineered using modern web technologies via Base44 with React and React Router 6. Designed with Tailwind CSS, Radix UI, and shadcn/ui for dynamic components. Integrated a comprehensive admin dashboard to monitor revenue metrics, lead statuses, customer follow-ups, and service schedules, packaged as a PWA with Cloudflare CDN deployment.",
    results: [
      "Full-featured client booking system with custom scheduling",
      "Integrated admin dashboard for revenue tracking and lead follow-ups",
      "PWA support for app-like usability across mobile devices",
      "Modern accessible UI built with Radix UI, shadcn/ui, and Tailwind CSS"
    ],
    completionYear: "2026",
    link: "https://lookssmartbeautysalon.base44.app/",
    displayOrder: 8,
    hoverImage: "/src/assets/images/lsbshower.png",
    featured: true
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
