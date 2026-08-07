/**
 * ? Logique (pure, testable) du sens de lecture du rail de navigation latéral (`AnchorRail.astro`).
 * ! Le câblage DOM (clic, réordonnancement des `<li>`, `aria-pressed`) vit dans l'îlot `AnchorRail` ; ici, aucun accès DOM.
 *
 * ? `natural` = l'ordre de rendu (curation des rubriques, mois du plus récent au plus ancien) · `reversed` = ce même ordre à l'envers.
 */
export type RailOrder = "natural" | "reversed";

// ? Sens d'entrée : celui du contenu de la page, pour que le rail reflète l'ordre des sections.
export const DEFAULT_RAIL_ORDER: RailOrder = "natural";

// ? Renvoie l'autre sens (pour la bascule).
export function toggleRailOrder(order: RailOrder): RailOrder {
  return order === "natural" ? "reversed" : "natural";
}

/**
 * ? Applique le sens de lecture à une suite de repères, sans muter l'entrée.
 * * Générique : la même règle sert aux `RailItem` (tests) et aux nœuds `<li>` (îlot).
 * @param items  repères dans leur ordre de rendu
 */
export function orderedRailItems<T>(items: readonly T[], order: RailOrder): T[] {
  return order === "reversed" ? [...items].reverse() : [...items];
}

// ? Message poussé dans la région `aria-live` après une bascule : l'inversion est purement visuelle, elle doit donc être annoncée.
export function railOrderAnnouncement(order: RailOrder): string {
  return order === "reversed" ? "Ordre des repères inversé" : "Ordre des repères rétabli";
}
