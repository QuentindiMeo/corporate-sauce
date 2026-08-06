import { CATEGORIES, type Category } from './category';
import type { Post, PostImage } from './post';

// ? Une ligne de la grille : une rubrique et ses posts, triés.
export interface ThemeRow<TImage extends PostImage = PostImage> {
	readonly category: Category;
	readonly posts: readonly Post<TImage>[];
}

/**
 * ? Regroupe les posts en lignes thématiques, dans l'ordre canonique des rubriques
 * ? ({@link CATEGORIES}). Chaque ligne est triée par `order` puis `id`.
 * * Les rubriques sans post sont omises (la grille reste extensible).
 */
export function groupByTheme<TImage extends PostImage>(
	posts: readonly Post<TImage>[],
): ThemeRow<TImage>[] {
	const rows: ThemeRow<TImage>[] = [];

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

// ? Un groupe du flux chronologique : un mois calendaire et ses posts, du plus récent au plus ancien.
export interface MonthRow<TImage extends PostImage = PostImage> {
	readonly monthKey: string; // ? Clé `AAAA-MM` en UTC
	readonly month: Date;	// ? 1er du mois à minuit UTC
	readonly posts: readonly Post<TImage>[];
}

/**
 * ! Tout est calculé en UTC : `publishedAt` vient de `posts.json` en « AAAA-MM-JJ », coercé à minuit UTC.
 * ! `getMonth()` (local) ferait basculer le 1er du mois dans le mois précédent sur tout fuseau derrière Greenwich.
 */
function monthKeyOf(date: Date): string {
	return date.toISOString().slice(0, 7);
}

/**
 * ? Regroupe les posts en un flux chronologique : un groupe par mois **présent** dans les données, du plus récent
 * ? au plus ancien. Le tri intra-mois est décroissant par date, les ex æquo départagés par `id` (déterminisme).
 * * Aucun mois vide n'instancie de ligne. `order` n'intervient pas.
 */
export function groupByMonth<TImage extends PostImage>(
	posts: readonly Post<TImage>[],
): MonthRow<TImage>[] {
	const buckets = new Map<string, Post<TImage>[]>();

	for (const post of posts) {
		const key = monthKeyOf(post.publishedAt);
		const bucket = buckets.get(key);
		if (bucket) {
			bucket.push(post);
		} else {
			buckets.set(key, [post]);
		}
	}

	return [...buckets.keys()]
		.sort((a, b) => b.localeCompare(a))
		.map((monthKey) => ({
			monthKey,
			month: new Date(`${monthKey}-01T00:00:00.000Z`),
			posts: (buckets.get(monthKey) ?? []).sort(
				(a, b) => b.publishedAt.getTime() - a.publishedAt.getTime() || a.id.localeCompare(b.id),
			),
		}));
}
