/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#62b77a",
        foreground: "hsl(var(--foreground))",
        "prm-bkg": "#62b77a",
        "snd-bkg": "#095840",
        "trd-bkg": "#34A283",
        "nav-bkg": "#008BC8",
        "blurb-bkg": "#f6e1f4",
        "head-clr": "#2F4858",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
      },
    },
  },
  // corePlugins: {
  //   preflight: false,
  // },
  plugins: [],
}
