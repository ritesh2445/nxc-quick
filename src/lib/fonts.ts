export interface LaserFontOption {
  name: string;
  family: string;
  category: "serif" | "sans" | "mono" | "display";
  categoryLabel: string;
  badge: string;
  description: string;
  letterSpacing?: string;
}

export const GOOGLE_LASER_FONTS: LaserFontOption[] = [
  // Luxury Serif
  {
    name: "Cinzel",
    family: "'Cinzel', serif",
    category: "serif",
    categoryLabel: "Luxury Serif",
    badge: "ROYAL ROMAN",
    description: "Imperial Roman inscriptions. Timeless European prestige and regal poise.",
    letterSpacing: "0.14em",
  },
  {
    name: "Playfair Display",
    family: "'Playfair Display', serif",
    category: "serif",
    categoryLabel: "Luxury Serif",
    badge: "HIGH FASHION",
    description: "Influenced by 18th-century European Enlightenment. Vogue editorial luxury.",
    letterSpacing: "0.12em",
  },
  {
    name: "Cormorant Garamond",
    family: "'Cormorant Garamond', serif",
    category: "serif",
    categoryLabel: "Luxury Serif",
    badge: "HAUTE HORLOGERIE",
    description: "French classical elegance reminiscent of Patek Philippe and fine timepiece dials.",
    letterSpacing: "0.15em",
  },
  {
    name: "Bodoni Moda",
    family: "'Bodoni Moda', serif",
    category: "serif",
    categoryLabel: "Luxury Serif",
    badge: "VOGUE LUXE",
    description: "Extreme contrast between thick and hair-thin strokes. Pure Milanese couture.",
    letterSpacing: "0.12em",
  },
  {
    name: "Prata",
    family: "'Prata', serif",
    category: "serif",
    categoryLabel: "Luxury Serif",
    badge: "TEARDROP SERIF",
    description: "Soft aesthetic with elegant teardrop terminals and graceful neoclassical balance.",
    letterSpacing: "0.14em",
  },
  {
    name: "Italiana",
    family: "'Italiana', serif",
    category: "serif",
    categoryLabel: "Luxury Serif",
    badge: "FLORENTINE",
    description: "Conceived for luxury Italian craft calligraphy, private banking, and wine estates.",
    letterSpacing: "0.16em",
  },
  {
    name: "DM Serif Display",
    family: "'DM Serif Display', serif",
    category: "serif",
    categoryLabel: "Luxury Serif",
    badge: "EDITORIAL NOBLE",
    description: "High-contrast display serif with sharp, deep-milled letter definitions.",
    letterSpacing: "0.12em",
  },
  {
    name: "Marcellus",
    family: "'Marcellus', serif",
    category: "serif",
    categoryLabel: "Luxury Serif",
    badge: "BRONZE TITLING",
    description: "Flared titling serif inspired by Roman architecture and ancient bronze tablets.",
    letterSpacing: "0.16em",
  },

  // Modern Sans
  {
    name: "Plus Jakarta Sans",
    family: "'Plus Jakarta Sans', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "TECH EXECUTIVE",
    description: "Geometric and contemporary, favored by tech founders, angels, and innovators.",
    letterSpacing: "0.08em",
  },
  {
    name: "Montserrat",
    family: "'Montserrat', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "ARCHITECTURAL",
    description: "Clean geometric sans rooted in urban architecture and mid-century modernism.",
    letterSpacing: "0.10em",
  },
  {
    name: "Outfit",
    family: "'Outfit', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "SILICON MINIMAL",
    description: "Modern geometric font with clean apexes and effortless executive presence.",
    letterSpacing: "0.08em",
  },
  {
    name: "Inter",
    family: "'Inter', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "SILICON VALLEY",
    description: "The global benchmark of precision digital interfaces and crisp legibility.",
    letterSpacing: "0.08em",
  },
  {
    name: "Syne",
    family: "'Syne', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "AVANT-GARDE",
    description: "Bold, eccentric Parisian design studio proportions for creative directors.",
    letterSpacing: "0.10em",
  },
  {
    name: "Space Grotesk",
    family: "'Space Grotesk', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "AEROSPACE MODERN",
    description: "Proportional sans-serif variant rooted in deep space telemetry aesthetics.",
    letterSpacing: "0.08em",
  },
  {
    name: "Urbanist",
    family: "'Urbanist', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "METROPOLITAN",
    description: "Low-contrast, clean geometric typography with international cosmopolitan flair.",
    letterSpacing: "0.09em",
  },
  {
    name: "DM Sans",
    family: "'DM Sans', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "EXECUTIVE SUITE",
    description: "Geometric sans with meticulous optical balance and understated authority.",
    letterSpacing: "0.08em",
  },
  {
    name: "Raleway",
    family: "'Raleway', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "DISTINGUISHED",
    description: "Refined sans with high tracking and distinguished geometric proportions.",
    letterSpacing: "0.12em",
  },
  {
    name: "Tenor Sans",
    family: "'Tenor Sans', sans-serif",
    category: "sans",
    categoryLabel: "Modern Sans",
    badge: "MILAN COUTURE",
    description: "Subtle flared stems blending the poise of a serif with the clarity of a sans.",
    letterSpacing: "0.14em",
  },

  // Technical & Monospace
  {
    name: "JetBrains Mono",
    family: "'JetBrains Mono', monospace",
    category: "mono",
    categoryLabel: "Technical & Mono",
    badge: "PRECISION CNC",
    description: "Engineered specifically for developers, hackers, and precision machining.",
    letterSpacing: "0.12em",
  },
  {
    name: "Space Mono",
    family: "'Space Mono', monospace",
    category: "mono",
    categoryLabel: "Technical & Mono",
    badge: "CYBERNETIC",
    description: "Geometric, fixed-width typeface inspired by 1960s space flight telemetry.",
    letterSpacing: "0.12em",
  },
  {
    name: "Orbitron",
    family: "'Orbitron', sans-serif",
    category: "mono",
    categoryLabel: "Technical & Mono",
    badge: "FUTURIST CNC",
    description: "Geometric display font with hard angular CNC contours and sci-fi aesthetic.",
    letterSpacing: "0.14em",
  },
  {
    name: "Share Tech Mono",
    family: "'Share Tech Mono', monospace",
    category: "mono",
    categoryLabel: "Technical & Mono",
    badge: "AEROSPACE MONO",
    description: "Clean fixed-pitch monospace tailored for hardware terminal interfaces.",
    letterSpacing: "0.12em",
  },

  // Editorial & Bold Display
  {
    name: "Oswald",
    family: "'Oswald', sans-serif",
    category: "display",
    categoryLabel: "Editorial & Bold",
    badge: "CONDENSED STATELY",
    description: "Tall condensed gothic style with commanding presence on brushed steel.",
    letterSpacing: "0.14em",
  },
  {
    name: "Bebas Neue",
    family: "'Bebas Neue', sans-serif",
    category: "display",
    categoryLabel: "Editorial & Bold",
    badge: "MONOLITHIC",
    description: "All-caps monumental display font with clean lines and sharp laser edges.",
    letterSpacing: "0.12em",
  },
  {
    name: "Cinzel Decorative",
    family: "'Cinzel Decorative', serif",
    category: "display",
    categoryLabel: "Editorial & Bold",
    badge: "BAROQUE ROYAL",
    description: "Flourished classical swashes and serif ornamentation for private bespoke cards.",
    letterSpacing: "0.14em",
  },
  {
    name: "Unna",
    family: "'Unna', serif",
    category: "display",
    categoryLabel: "Editorial & Bold",
    badge: "CLASSICAL CHIC",
    description: "Delicate and graceful classic serifs with understated quiet-luxury poise.",
    letterSpacing: "0.12em",
  },
];

/**
 * Dynamically injects a Google Font into the page document head if not already loaded.
 */
export function loadGoogleFont(fontName: string): void {
  if (typeof document === "undefined" || !fontName) return;

  const cleanName = fontName.trim();
  const fontId = `gfont-${cleanName.replace(/\s+/g, "-").toLowerCase()}`;

  if (document.getElementById(fontId)) return;

  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
