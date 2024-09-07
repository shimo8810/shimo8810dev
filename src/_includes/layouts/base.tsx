export default (data: Lume.Data, _helpers: Lume.Helpers) => {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <title>{data.title}</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <meta name="description" content={data.description} />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </header>
        <main>{data.content}</main>
        <footer>
          <p>&copy; {new Date().getFullYear()} My Site</p>
        </footer>
      </body>
    </html>
  );
};
