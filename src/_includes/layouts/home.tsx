// ---
// layout: ./base.tsx
// ---
// <div class="home">
// {{ content }}
// </div>

export const layout = "./base.tsx";

export default (data: Lume.Data, _helpers: Lume.Helpers) => {
  return <div className="home">{data.children}</div>;
};
