import type { Post } from './post';
import { RUBRIQUES, type Rubrique } from './rubrique';

/** Une ligne de la grille : une rubrique et ses posts, triés. */
export interface LigneThematique {
	readonly rubrique: Rubrique;
	readonly posts: readonly Post[];
}

/**
 * Regroupe les posts en lignes thématiques, dans l'ordre canonique des rubriques
 * ({@link RUBRIQUES}). Chaque ligne est triée par `ordre` puis `id`.
 * Les rubriques sans post sont omises (la grille reste extensible).
 */
export function grouperParTheme(posts: readonly Post[]): LigneThematique[] {
	const lignes: LigneThematique[] = [];

	for (const rubrique of RUBRIQUES) {
		const duTheme = posts
			.filter((post) => post.rubrique === rubrique)
			.sort((a, b) => a.ordre - b.ordre || a.id.localeCompare(b.id));

		if (duTheme.length > 0) {
			lignes.push({ rubrique, posts: duTheme });
		}
	}

	return lignes;
}
