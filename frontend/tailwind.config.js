module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'IBM Plex Sans'", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        navy: { DEFAULT: "#0F172A", 800: "#1E293B", 700: "#334155" },
        accent: { DEFAULT: "#0284C7", light: "#38BDF8" },
      },
    },
  },
  plugins: [],
};
