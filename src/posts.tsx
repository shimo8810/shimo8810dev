export const title = "posts | shimo8810.dev";

export default (data: Lume.Data, _helpers: Lume.Helpers) => {
  return (
    <div className="flex flex-col m-auto mt-4">
      {data.search.pages("post", "date=desc").map((post) => (
        <div
          key={post.date.toLocaleDateString("sv-SE")}
          className="flex w-full justify-between mt-2"
        >
          <a href={post.url}>{post.title}</a>
          <span className="text-base">
            {post.date.toLocaleDateString("sv-SE")}
          </span>
        </div>
      ))}
    </div>
  );
};
