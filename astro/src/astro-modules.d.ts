// Permet à un `tsc --noEmit` brut de résoudre les imports de composants `.astro`
// (ex. Container API dans les tests). `astro check` les résout précisément via
// son serveur de langage — cette déclaration wildcard n'entre en jeu que pour tsc.
// Type conforme au paramètre `component` de `renderToString` (API Container).
declare module "*.astro" {
  const Component: import("astro/runtime/server/index.js").AstroComponentFactory;
  export default Component;
}
