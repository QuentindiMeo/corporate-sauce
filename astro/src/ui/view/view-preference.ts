/**
 * ? Logique (pure, testable) de préférence d'agencement de la galerie.
 * ! Le câblage DOM (lecture `localStorage`, pose de `data-view` sur `<html>`) vit dans l'îlot `ViewToggle` et le script anti-flash de `BaseHead` ; ici, aucun accès DOM.
 *
 * ? `theme` = 7 lignes thématiques (curation par `order`) · `date` = flux chronologique groupé par mois, décroissant.
 */
export type GalleryView = "theme" | "date";

export const VIEW_STORAGE_KEY = "qdm-view";

// ? Agencement d'entrée : la vue thématique, qui porte la curation éditoriale.
export const DEFAULT_VIEW: GalleryView = "theme";

function isView(value: string | null): value is GalleryView {
  return value === "theme" || value === "date";
}

/**
 * ? Vue initiale : le choix stocké s'il est valide, sinon la vue par défaut.
 * ! Pas de préférence système à consulter ici (contrairement au thème) : l'agencement n'a pas d'équivalent `prefers-*`.
 * @param stored  valeur lue dans `localStorage` (ou `null`)
 */
export function resolveInitialView(stored: string | null): GalleryView {
  return isView(stored) ? stored : DEFAULT_VIEW;
}

// ? Renvoie l'autre agencement (pour la bascule).
export function toggleView(view: GalleryView): GalleryView {
  return view === "theme" ? "date" : "theme";
}

// ? Message poussé dans la région `aria-live` après une bascule : le changement d'agencement est purement visuel, il doit donc être annoncé.
export function viewAnnouncement(view: GalleryView): string {
  return view === "date" ? "Galerie par date, du plus récent au plus ancien" : "Galerie par rubrique";
}
