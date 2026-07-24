/**
 * Rubriques figées de la charte QDM (§5) + COLLAB (7ᵉ ligne, mode liant).
 * L'ordre du tableau = l'ordre d'affichage des lignes thématiques de la grille.
 */
export const RUBRIQUES = ['PERF', 'A11Y', 'DX', 'UI', 'ARCHI', 'HTML', 'COLLAB'] as const;

export type Rubrique = (typeof RUBRIQUES)[number];

export function estRubrique(valeur: string): valeur is Rubrique {
	return (RUBRIQUES as readonly string[]).includes(valeur);
}
