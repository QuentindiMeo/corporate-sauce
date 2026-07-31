import { groupByTheme, type ThemeRow } from '@domain/post-collection';
import type { PostRepository } from '@domain/ports/post-repository';

/**
 * Cas d'usage : construit les lignes thématiques de la grille à partir d'un
 * dépôt de posts. Le tri et le regroupement sont délégués au domaine.
 */
export async function listPostsByTheme(repository: PostRepository): Promise<ThemeRow[]> {
	const posts = await repository.listPosts();
	return groupByTheme(posts);
}
