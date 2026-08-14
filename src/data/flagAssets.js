// Flag SVGs used to be pulled in with a dynamic `require(...)` (webpack).
// Vite has no runtime `require`, so instead we eagerly glob every SVG under
// ./flags at build time and look up the URL by the same relative path.
const flagModules = import.meta.glob("./flags/**/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

export const getFlagUrl = (relativePath) =>
  flagModules[`./flags/${relativePath}.svg`];
