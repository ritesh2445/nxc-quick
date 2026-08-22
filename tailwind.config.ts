import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#000000",
          surface1: "#060608",
          surface2: "#0B0B0E",
          surface3: "#121217",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          bright: "rgba(255, 255, 255, 0.16)",
          subtle: "rgba(255, 255, 255, 0.05)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#9E9EA8",
          tertiary: "#52525C",
        },
        accent: {
          silver: "#E2E0DC",
          titanium: "#9CA8B8",
          champagne: "#E4C8A6",
        },
        status: {
          success: "#3D7A5F",
          error: "#8B3A3A",
          warning: "#7A6230",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        outfit: ["Outfit", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
        tenor: ["Tenor Sans", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        wide: "0.08em",
        widest: "0.18em",
      },
      boxShadow: {
        'luxury-glow': '0 0 70px -10px rgba(255, 255, 255, 0.07)',
        'gloss-card': '0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 2px 1px rgba(255, 255, 255, 0.18), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
        'gloss-hover': '0 35px 80px -10px rgba(0, 0, 0, 0.98), 0 0 25px 2px rgba(255, 255, 255, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)',
        'card-subtle': '0 20px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'light-sweep': 'sweep 8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'gloss-sweep': 'glossSweep 6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'subtle-pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'card-float': 'cardFloat 7s ease-in-out infinite',
      },
      keyframes: {
        sweep: {
          '0%, 100%': { transform: 'translateX(-100%) rotate(25deg)', opacity: '0' },
          '20%, 60%': { transform: 'translateX(200%) rotate(25deg)', opacity: '0.15' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
