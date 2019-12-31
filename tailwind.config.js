// See https://tailwindcss.com/docs/configuration for details

module.exports = {
  theme: {
    fontFamily: {
      sans: [
        "Avenir",
        "Inter UI",
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
      ],
      mono: [
        "SFMono-Regular",
        "Consolas",
        "Liberation Mono",
        "Menlo",
        "Courier",
        "monospace"
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
