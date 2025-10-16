import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
// https://github.com/shikijs/shiki/issues/1083
// import {
//   transformerNotationDiff,
//   transformerNotationFocus,
//   transformerNotationHighlight,
//   transformerNotationWordHighlight,
//   transformerNotationErrorLevel,
// } from "@shikijs/transformers"

export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "rose-pine-moon",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
