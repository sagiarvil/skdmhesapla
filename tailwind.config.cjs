/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#213110",
          800: "#5C7A3E",
          950: "#060c04",
          500: "#bdd652",
          100: "#F6F9EF",
          tint: "#c8d6a8",
          mist: "#d9e6b8",
          "mist-light": "#e8f2cf",
        },
        accent: {
          DEFAULT: "#2bb3a3",
          teal: "#2bb3a3",
          green: "#35c98e",
          yellow: "#ffc21c",
        },
        ink: {
          DEFAULT: "#16324a",
          900: "#16324a",
          600: "#44545f",
        },
        soft: {
          from: "#f2f8f5",
          to: "#eef4f7",
        },
        line: "#e3ece8",
        danger: "#ffc21c",
        whatsapp: "#25D366",
      },
      borderRadius: {
        card: "16px",
        ctl: "12px",
        pill: "10px",
        stage: "24px",
      },
      boxShadow: {
        card: "0 8px 30px rgba(22,50,74,.08)",
        header: "0 4px 20px rgba(0,0,0,.25)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono-jb)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        container: "1200px",
      },
      minHeight: {
        ctl: "52px",
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
    },
  },
  plugins: [],
};
