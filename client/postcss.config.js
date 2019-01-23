const postimport = require("postcss-import")
const tailwindcss = require("tailwindcss")

module.exports = {
  plugins: [
    postimport(),
    tailwindcss("./tailwind.config.js")
  ]
}