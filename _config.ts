import attributes from "lume/plugins/attributes.ts";
import highlight from "lume/plugins/code_highlight.ts";
import date from "lume/plugins/date.ts";
import eta from "lume/plugins/eta.ts";
import lume from "lume/mod.ts";
import postcss from "lume/plugins/postcss.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";

export default lume({
  src: "./src",
})
  .use(attributes())
  .use(date())
  .use(eta())
  .use(tailwindcss())
  .use(postcss())
  .use(
    highlight({
      theme: {
        name: "nord",
        path: "/_includes/css/code_theme.css",
      },
    })
  );
