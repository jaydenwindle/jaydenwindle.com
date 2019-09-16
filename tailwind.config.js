// See https://tailwindcss.com/docs/configuration for details

module.exports = {
  theme: {
    fontFamily: {
      sans: [
        "Avenir",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol"
      ]
    }
  },
  variants: {},
  plugins: [
    require("tailwindcss-transition")({
      standard: "all 0.1s ease",
      transitions: {}
    })
  ]
};
