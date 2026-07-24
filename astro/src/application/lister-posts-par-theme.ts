import { grouperParTheme, type LigneThematique } from '@domain/post-collection';
import type { PostRepository } from '@domain/ports/post-repository';

/**
 * Cas d'usage : construit les lignes thématiques de la grille à partir d'un
 * dépôt de posts. Le tri et le regroupement sont délégués au domaine.
 */
export async function listerPostsParTheme(
	depot: PostRepository,
): Promise<LigneThematique[]> {
	const posts = await depot.listerPosts();
	return grouperParTheme(posts);
}
