import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size standard
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Custom margin and spacing coordinate math
  let y = height - 50;
  const x = 50;
  
  const drawText = (text, options = {}) => {
    const size = options.size || 9.5;
    const isBold = options.bold || false;
    const color = options.color || rgb(0.02, 0.02, 0.02);
    const f = isBold ? boldFont : font;
    
    page.drawText(text, {
      x,
      y,
      size,
      font: f,
      color,
    });
    y -= (options.lineGap || size * 1.35);
  };

  // Header Title
  drawText("ANEEK PATRAS", { size: 22, bold: true, color: rgb(0.02, 0.02, 0.02), lineGap: 16 });
  drawText("WordPress Developer & WooCommerce Performance Specialist", { size: 10.5, bold: true, color: rgb(1, 0.42, 0), lineGap: 14 });
  drawText("Central Park Housing Scheme Lahore, Pakistan  |  +92 3199154505  |  aneekkhokhar2@gmail.com  |  linkedin.com/in/aneek-patras", { size: 7.5, color: rgb(0.35, 0.35, 0.35), lineGap: 20 });
  
  // Summary Title
  drawText("SUMMARY", { size: 10, bold: true, color: rgb(0.02, 0.02, 0.02), lineGap: 12 });
  page.drawLine({
    start: { x: 50, y: y + 4 },
    end: { x: 562, y: y + 4 },
    thickness: 0.75,
    color: rgb(0.85, 0.85, 0.85),
  });
  
  const summaryText = "WordPress Developer with 1.5+ years of hands-on experience building responsive business websites, landing pages, WooCommerce eCommerce stores, and executing full website migrations. Proficient in Elementor, Gutenberg, custom post types (CPT), ACF, child theme dev, Core Web Vitals optimization, and PHP/MySQL fundamentals. Delivered measurable improvements in page speed, SEO performance, and uptime across 15+ client projects in Pakistan and Australia.";
  
  const wrapText = (text, widthLimit, fontSize) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > widthLimit) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };
  
  const widthLimit = 512;
  const summaryLines = wrapText(summaryText, widthLimit, 8.5);
  summaryLines.forEach(line => drawText(line, { size: 8.5, color: rgb(0.3, 0.3, 0.3), lineGap: 11.5 }));
  y -= 8;
  
  // Experience Title
  drawText("EXPERIENCE", { size: 10, bold: true, color: rgb(0.02, 0.02, 0.02), lineGap: 12 });
  page.drawLine({
    start: { x: 50, y: y + 4 },
    end: { x: 562, y: y + 4 },
    thickness: 0.75,
    color: rgb(0.85, 0.85, 0.85),
  });
  
  // Role 1
  drawText("Oz Group  ·  WordPress Developer", { size: 9.5, bold: true, color: rgb(0.05, 0.05, 0.05), lineGap: 11 });
  drawText("Dec 2025 - Present", { size: 8, color: rgb(0.5, 0.5, 0.5), lineGap: 11 });
  const ozAchievements = [
    "Reduced average page load time by 55% across 4 client websites by implementing Core Web Vitals best practices, lazy loading, and WP Rocket caching — lifting Google PageSpeed scores from ~45 to 85+.",
    "Built and documented an internal Elementor onboarding programme for 2 junior developers, compressing ramp-up time from 14 days to 5 — a process later adopted as the team standard.",
    "Developed and deployed 3 custom WordPress themes with child theme architecture and ACF (Advanced Custom Fields) integration, cutting client content update time by 40%.",
    "Architected custom post types (CPT) and taxonomy structures for 2 eCommerce clients, reducing catalogue update time by 60% and eliminating recurring developer involvement for day-to-day content changes.",
    "Maintained 8+ WordPress websites hosted on Hostinger with 99.9% uptime via weekly backup routines, database optimisation, and proactive plugin update schedules."
  ];
  ozAchievements.forEach(ach => {
    const lines = wrapText(`•  ${ach}`, widthLimit, 8);
    lines.forEach(line => drawText(line, { size: 8, color: rgb(0.25, 0.25, 0.25), lineGap: 11 }));
  });
  y -= 8;
  
  // Role 2
  drawText("Yahwehroi IT Company  ·  WordPress Developer", { size: 9.5, bold: true, color: rgb(0.05, 0.05, 0.05), lineGap: 11 });
  drawText("Sep 2024 - Jun 2025", { size: 8, color: rgb(0.5, 0.5, 0.5), lineGap: 11 });
  const yahwehAchievements = [
    "Built 6 responsive WordPress websites for retail and service businesses — including 2 WooCommerce stores with payment gateway integration — reducing client go-live timelines by 20% through reusable component libraries.",
    "Built and documented an Elementor best-practices guide for 2 junior teammates, cutting onboarding time from 2 weeks to 5 days and establishing a repeatable handoff process across the team.",
    "Executed 4 full website migrations with zero data loss by standardising the workflow across staging environments, cutting migration-related downtime by 70%.",
    "Improved organic search visibility for 3 client sites via on-page SEO fundamentals — meta tags, schema markup, Google Search Console setup — delivering a 30%+ increase in indexed pages within 60 days.",
    "Audited and streamlined plugin stacks across 6 sites — cutting average active plugins from 28 to 14 — reducing page weight by ~30% and eliminating all recurring plugin conflict incidents."
  ];
  yahwehAchievements.forEach(ach => {
    const lines = wrapText(`•  ${ach}`, widthLimit, 8);
    lines.forEach(line => drawText(line, { size: 8, color: rgb(0.25, 0.25, 0.25), lineGap: 11 }));
  });
  y -= 8;
  
  // Core Skills Title
  drawText("CORE SKILLS", { size: 10, bold: true, color: rgb(0.02, 0.02, 0.02), lineGap: 12 });
  page.drawLine({
    start: { x: 50, y: y + 4 },
    end: { x: 562, y: y + 4 },
    thickness: 0.75,
    color: rgb(0.85, 0.85, 0.85),
  });
  
  drawText("Development: WordPress  ·  Elementor  ·  Gutenberg (Block Editor)  ·  WooCommerce  ·  PHP/MySQL  ·  Custom Post Types (CPT)  ·  ACF  ·  Child Theme Development  ·  Responsive Web Design", { size: 8, color: rgb(0.2, 0.2, 0.2), lineGap: 11 });
  drawText("Performance & SEO: Core Web Vitals  ·  Page Speed Optimisation  ·  Google Search Console  ·  On-Page SEO  ·  Schema Markup  ·  Website Security", { size: 8, color: rgb(0.2, 0.2, 0.2), lineGap: 11 });
  drawText("Tools & Workflow: Hostinger  ·  WP Rocket  ·  Wordfence  ·  Yoast SEO  ·  Figma (handoff)  ·  Git (fundamentals)", { size: 8, color: rgb(0.2, 0.2, 0.2), lineGap: 11 });
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('./public/Aneek_Patras_Resume.pdf', pdfBytes);
  console.log('PDF Resume built successfully at ./public/Aneek_Patras_Resume.pdf!');
}

createPdf().catch(console.error);
