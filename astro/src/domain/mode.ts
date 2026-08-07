/**
 * Les trois modes de la charte QDM (§1) :
 * - `sombre` (Rust) : accroche / opinion tranchée, chiffre-choc ;
 * - `clair` (Ambre) : pédagogie / comparaison, bonne vs mauvaise pratique ;
 * - `liant` (Forêt & Abricot) : collaboration inter-métiers.
 */
export const MODES = ["sombre", "clair", "liant"] as const;

export type Mode = (typeof MODES)[number];

export function isMode(value: string): value is Mode {
  return (MODES as readonly string[]).includes(value);
}

/**
 * Classification binaire light/dark d'un mode : `sombre` (Rust) et `liant`
 * (Forêt) ont un fond foncé → dark ; `clair` (Ambre) a un fond crème → light.
 */
export function isDarkMode(mode: Mode): boolean {
  return mode !== "clair";
}
