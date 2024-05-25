import attributes from "lume/plugins/attributes.ts";
import highlight from "lume/plugins/code_highlight.ts";
import date from "lume/plugins/date.ts";
import lume from "lume/mod.ts";
import postcss from "lume/plugins/postcss.ts";

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
  .use(date())
  .use(postcss())
  .use(
    highlight({
      theme: {
        name: "nord",
        path: "/_includes/css/code_theme.css",
      },
    })
  );
