/**
 * Rubriques figées de la charte QDM (§5) + COLLAB (7ᵉ ligne, mode liant).
 * L'ordre du tableau = l'ordre d'affichage des lignes thématiques de la grille.
 */
export const CATEGORIES = ["PERF", "A11Y", "DX", "UI", "ARCHI", "HTML", "COLLAB"] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
