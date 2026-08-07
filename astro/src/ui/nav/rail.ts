/**
 * ? Contrat d'un repère du rail de navigation latéral (`AnchorRail.astro`).
 * * Le rail est générique : il sert la vue par rubrique (repères = rubriques) comme la vue par date (repères = mois).
 */
export interface RailItem {
  anchor: string; // ? `id` de la section cible, sans le « # » — identique à son `aria-labelledby`.
  code: string; // ? Texte visible, court (« PERF », « 08.26 »).
  full: string; // ? Libellé complet, replié par défaut et révélé au survol/focus.

  /**
   * Nom accessible du lien.
   * ! Doit contenir le `code` visible : WCAG 2.5.3 (label-in-name).
   */
  label: string;
}
