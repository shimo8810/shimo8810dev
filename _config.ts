import attributes from "lume/plugins/attributes.ts";
import basePath from "lume/plugins/base_path.ts";
import date from "lume/plugins/date.ts";
import highlight from "lume/plugins/code_highlight.ts";
import lume from "lume/mod.ts";
import postcss from "lume/plugins/postcss.ts";
import jsx from "lume/plugins/jsx.ts";
import favicon from "lume/plugins/favicon.ts";

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
  .use(favicon())
  .use(jsx())
  .use(postcss())
  .use(
    highlight({
      theme: {
        name: "nord",
        path: "/_includes/css/code_theme.css",
      },
    })
  );
