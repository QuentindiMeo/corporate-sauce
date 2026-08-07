/**
 * ? Logique (pure, testable) du sens de lecture d'une vue : le rail ET le flux qu'il indexe.
 * ! Le câblage DOM (clic, réordonnancement des nœuds, `aria-pressed`, `localStorage`) vit dans l'îlot `AnchorRail`
 * ! et le script pré-peinture de `Gallery` ; ici, aucun accès DOM.
 *
 * ? `natural` = l'ordre de rendu (curation des rubriques, mois du plus récent au plus ancien) · `reversed` = ce même ordre en miroir.
 * ? Le sens s'applique à CHAQUE niveau de la vue active — repères du rail, sections, posts d'une section — pour que le rail et la galerie ne se contredisent jamais.
 */
import type { GalleryView } from "@/ui/view/view-preference";

export type ReadingOrder = "natural" | "reversed";

// ? Un sens PAR VUE : les deux agencements se règlent séparément, comme ils ont chacun leur rail.
export type ReadingOrders = Record<GalleryView, ReadingOrder>;

export const READING_ORDER_STORAGE_KEY = "qdm-order";

// ? Sens d'entrée : celui du contenu de la page, tel que le build l'a produit.
export const DEFAULT_READING_ORDER: ReadingOrder = "natural";

function isOrder(value: unknown): value is ReadingOrder {
  return value === "natural" || value === "reversed";
}

// ? Renvoie l'autre sens (pour la bascule).
export function toggleReadingOrder(order: ReadingOrder): ReadingOrder {
  return order === "natural" ? "reversed" : "natural";
}

/**
 * ? Met une suite d'éléments en miroir, sans muter l'entrée.
 * * Générique : la même règle sert aux repères (tests) et aux nœuds DOM — `<li>` du rail, sections, cartes (îlot).
 * ! C'est une INVOLUTION : la rejouer redonne l'ordre de départ. L'îlot peut donc miroiter le DOM COURANT à chaque
 * ! bascule, sans mémoriser l'ordre de rendu — et sans jamais dériver, quel que soit le nombre d'aller-retours.
 */
export function mirrored<T>(items: readonly T[]): T[] {
  return [...items].reverse();
}

// ? Message poussé dans la région `aria-live` après une bascule : le réagencement est purement visuel, il doit donc être annoncé.
export function readingOrderAnnouncement(order: ReadingOrder): string {
  return order === "reversed" ? "Ordre de lecture inversé" : "Ordre de lecture rétabli";
}

function parseStored(stored: string | null): Record<string, unknown> {
  if (!stored) {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(stored);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * ? Sens de lecture initial de CHAQUE vue : le choix stocké s'il est valide, sinon l'ordre de rendu.
 * ! Toute valeur douteuse (JSON cassé, vue absente, libellé inconnu) retombe sur `natural` : un stockage
 * ! écrit par une version antérieure — ou à la main — ne doit jamais pouvoir casser l'affichage.
 * @param stored  valeur lue dans `localStorage` (ou `null`)
 */
export function resolveInitialReadingOrders(stored: string | null): ReadingOrders {
  const parsed = parseStored(stored);
  const orderOf = (view: GalleryView): ReadingOrder =>
    isOrder(parsed[view]) ? (parsed[view] as ReadingOrder) : DEFAULT_READING_ORDER;
  return { theme: orderOf("theme"), date: orderOf("date") };
}

// ? Valeur à écrire dans `localStorage` — relue telle quelle par `resolveInitialReadingOrders` et par le script pré-peinture.
export function readingOrdersStorageValue(orders: ReadingOrders): string {
  return JSON.stringify(orders);
}
