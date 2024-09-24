export const title = "posts | shimo8810.dev";

export default (data: Lume.Data, _helpers: Lume.Helpers) => {
  return (
    <div className="post-list">
      {data.search.pages("post", "date=desc").map((post) => (
        <div key={post.date.toLocaleDateString("sv-SE")} className="post-link">
          <a href={post.url}>{post.title}</a>
          <span>{post.date.toLocaleDateString("sv-SE")}</span>
        </div>
      ))}
    </div>
  );
};
