module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        admin: { DEFAULT: "#1E3A8A", light: "#3B82F6" },
        teacher: { DEFAULT: "#065F46", light: "#10B981" },
        student: { DEFAULT: "#92400E", light: "#F59E0B" },
        principal: { DEFAULT: "#7C3AED", light: "#A78BFA" },
      },
    },
  },
  plugins: [],
};
