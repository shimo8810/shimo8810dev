export const layout = "./base.tsx";

export default (data: Lume.Data, _helpers: Lume.Helpers) => {
  return <div className="post">{data.children}</div>;
};
