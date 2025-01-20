export const layout = "./base.tsx";

export default (data: Lume.Data, _helpers: Lume.Helpers) => {
  return <article className="prose">{data.children}</article>;
};
