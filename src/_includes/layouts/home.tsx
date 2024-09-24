export const layout = "./base.tsx";

export default (data: Lume.Data, _helpers: Lume.Helpers) => {
  return (
    <article className="text-center px-1 mt-4 m-auto">{data.children}</article>
  );
};
