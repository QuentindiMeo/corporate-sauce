/**
 * ? Logique (pure, testable) du sens de lecture de la vue courante : le rail ET le flux qu'il indexe.
 * ! Le câblage DOM (clic, réordonnancement des nœuds, `aria-pressed`) vit dans l'îlot `AnchorRail` ; ici, aucun accès DOM.
 *
 * ? `natural` = l'ordre de rendu (curation des rubriques, mois du plus récent au plus ancien) · `reversed` = ce même ordre en miroir.
 * ? Le sens s'applique à CHAQUE niveau de la vue active — repères du rail, sections, posts d'une section — pour que le rail et la galerie ne se contredisent jamais.
 */
export type ReadingOrder = "natural" | "reversed";

// ? Sens d'entrée : celui du contenu de la page, tel que le build l'a produit.
export const DEFAULT_READING_ORDER: ReadingOrder = "natural";

// ? Renvoie l'autre sens (pour la bascule).
export function toggleReadingOrder(order: ReadingOrder): ReadingOrder {
  return order === "natural" ? "reversed" : "natural";
}

/**
 * ? Applique le sens de lecture à une suite d'éléments, sans muter l'entrée.
 * * Générique : la même règle sert aux `RailItem` (tests) et aux nœuds DOM — `<li>` du rail, sections, cartes (îlot).
 * @param items  éléments dans leur ordre de rendu
 */
export function inReadingOrder<T>(items: readonly T[], order: ReadingOrder): T[] {
  return order === "reversed" ? [...items].reverse() : [...items];
}

// ? Message poussé dans la région `aria-live` après une bascule : le réagencement est purement visuel, il doit donc être annoncé.
export function readingOrderAnnouncement(order: ReadingOrder): string {
  return order === "reversed" ? "Ordre de lecture inversé" : "Ordre de lecture rétabli";
}
