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
          surface1: "#08080A",
          surface2: "#0F0F13",
          surface3: "#16161C",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          bright: "rgba(255, 255, 255, 0.16)",
          subtle: "rgba(255, 255, 255, 0.05)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#9E9EA8",
          tertiary: "#5A5A66",
        },
        accent: {
          silver: "#E2E0DC",
          titanium: "#9CA8B8",
          champagne: "#E4C8A6",
        },
        status: {
          success: "#25D366",
          error: "#FF4D70",
          warning: "#E5A83B",
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "Cinzel", "serif"],
        sans: ["var(--font-jakarta)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        wide: "0.08em",
        widest: "0.18em",
      },
      boxShadow: {
        'luxury-glow': '0 0 50px -10px rgba(255, 255, 255, 0.05)',
        'card-subtle': '0 20px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'elevated': '0 24px 60px -12px rgba(0, 0, 0, 0.95), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
