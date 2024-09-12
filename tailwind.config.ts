import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {    
    extend: {
      fontFamily: {
        mulish: ['var(--font-mulish)', 'sans-serif'],
        protestGuerrilla: ['var(--font-protestGuerrilla)', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
          // Bounces 5 times 1s equals 5 seconds
          'bounce-short': 'bounce 1s ease-in-out 5'
        }
    },
  },
  plugins: [],
};
export default config;
