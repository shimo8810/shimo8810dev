export default () => {
  const links = [
    { href: "/", label: "home" },
    { href: "/posts", label: "posts" },
    { href: "/notes", label: "notes" },
    { href: "/about", label: "about" },
  ];

  return (
    <header className="p-2 m-0 bg-nord6 border-b-2 border-nord4">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="text-lg my-0 mx-2 py-0.5 px-2 rounded text-nord0 no-underline hover:bg-nord4"
        >
          {link.label}
        </a>
      ))}
    </header>
  );
};
