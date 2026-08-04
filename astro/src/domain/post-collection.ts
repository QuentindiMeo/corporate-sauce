import type { Post } from './post';
import { CATEGORIES, type Category } from './category';

// ? Une ligne de la grille : une rubrique et ses posts, triés.
export interface ThemeRow {
	readonly category: Category;
	readonly posts: readonly Post[];
}

/**
 * ? Regroupe les posts en lignes thématiques, dans l'ordre canonique des rubriques
 * ? ({@link CATEGORIES}). Chaque ligne est triée par `order` puis `id`.
 * * Les rubriques sans post sont omises (la grille reste extensible).
 */
export function groupByTheme(posts: readonly Post[]): ThemeRow[] {
	const rows: ThemeRow[] = [];

	for (const category of CATEGORIES) {
		const inCategory = posts
			.filter((post) => post.category === category)
			.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

		if (inCategory.length > 0) {
			rows.push({ category, posts: inCategory });
		}
	}

	return rows;
}
