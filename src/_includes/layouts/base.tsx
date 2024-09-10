import Footer from "../templates/footer.tsx";
import Header from "../templates/header.tsx";

export default (data: Lume.Data, _helpers: Lume.Helpers) => {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <title>{data.title}</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      </head>
      <body>
        <Header />
        <main>{data.children}</main>
        <Footer />
      </body>
    </html>
  );
};
