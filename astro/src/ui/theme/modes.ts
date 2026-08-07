import type { Mode } from "@domain/mode";

/**
 * ? Jetons de couleur des trois modes de la charte QDM (§2), source de vérité unique.
 * ? Appliqués en variables CSS inline sur le conteneur d'un post (via {@link styleFromMode})
 * ? pour garantir l'application sans dépendre d'une feuille de style externe.
 *
 * * `--ink2` (charte §11) = texte SECONDAIRE sur un aplat plein. Sa valeur dépend de
 * * l'aplat que le mode remplit (rust / ambre / abricot), pas du fond du mode. À utiliser
 * * à la place d'une `opacity` sur `--acc-ink`, qui ferait tomber le contraste sous 4,5:1.
 */
export const MODE_TOKENS: Record<Mode, Record<string, string>> = {
  // ! SOMBRE — Rust : accroche / opinion tranchée.
  sombre: {
    "--bg": "#120A07",
    "--panel": "rgba(255,90,54,.05)",
    "--border": "#331c14",
    "--acc": "#FF5A36",
    "--acc-text": "#FF734F",
    "--acc-ink": "#120A07",
    "--ink2": "#4A1D10", // ? sur aplat rust #FF5A36 — 4,6:1
    "--fg": "#F5E9E2",
    "--muted": "#b09a8b",
    "--kicker": "#c9b3a3",
    "--glow": "rgba(255,90,54,.26)",
  },
  // ! CLAIR — Ambre : pédagogie / comparaison.
  clair: {
    "--bg": "#F6ECD4",
    "--panel": "#EEE1BE",
    "--border": "#D9C79A",
    "--acc": "#F5A300",
    "--acc-text": "#8A5A00",
    "--acc-ink": "#2a1c00",
    "--ink2": "#5A3D00", // ? sur aplat ambre #F5A300 — 4,8:1
    "--fg": "#221B0E",
    "--muted": "#63563b",
  },
  // ! LIANT — Forêt & Abricot : collaboration inter-métiers (deux accents).
  liant: {
    "--bg": "#0F1712",
    "--panel": "rgba(79,176,122,.06)",
    "--border": "#1D2B23",
    "--cool": "#4FB07A",
    "--cool-text": "#6BC291",
    "--warm": "#F2A65A",
    "--warm-text": "#F5B778",
    "--ink": "#0F1712",
    "--ink2": "#5A4020", // ? sur aplat abricot #F2A65A — 4,7:1
    "--fg": "#E7F0E9",
    "--muted": "#8DA697",
  },
};

// ? Jetons de signal sémantique ✓/✕, communs aux trois modes (charte §2).
export const SIGNAL_TOKENS: Record<string, string> = {
  "--ok": "#2E6A46",
  "--ok-text": "#276039",
  "--bad": "#B23415",
};

export function styleFromMode(mode: Mode): string {
  return Object.entries(MODE_TOKENS[mode])
    .map(([nom, valeur]) => `${nom}:${valeur}`)
    .join(";")
    .concat(";");
}
