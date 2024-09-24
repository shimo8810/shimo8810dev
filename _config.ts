import attributes from "lume/plugins/attributes.ts";
import basePath from "lume/plugins/base_path.ts";
import date from "lume/plugins/date.ts";
import highlight from "lume/plugins/code_highlight.ts";
import lume from "lume/mod.ts";
import postcss from "lume/plugins/postcss.ts";
import jsx from "lume/plugins/jsx.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import typography from "npm:@tailwindcss/typography";

export default lume(
  {
    src: "./src",
  },
  {
    markdown: {
      options: {
        breaks: true,
      },
    },
  }
)
  .use(attributes())
  .use(basePath())
  .use(date())
  .use(jsx())
  .use(
    tailwindcss({
      extensions: [".html", ".tsx"],
      options: {
        theme: {
          extend: {
            colors: {
              nord0: "#2E3440",
              nord1: "#3B4252",
              nord2: "#434C5E",
              nord3: "#4C566A",
              nord4: "#D8DEE9",
              nord5: "#E5E9F0",
              nord6: "#ECEFF4",
              nord7: "#8FBCBB",
              nord8: "#88C0D0",
              nord9: "#81A1C1",
              nord10: "#5E81AC",
              nord11: "#BF616A",
              nord12: "#D08770",
              nord13: "#EBCB8B",
              nord14: "#A3BE8C",
              nord15: "#B48EAD",
            },
            fontFamily: {
              mPlus: ["M PLUS Rounded 1c", "sans-serif"],
            },
          },
        },
        plugins: [typography],
      },
    })
  )
  .use(postcss())
  .use(
    highlight({
      theme: {
        name: "nord",
        path: "/_includes/css/code_theme.css",
      },
    })
  )
  .copy("/_includes/favicon.png", "/favicon.png");
