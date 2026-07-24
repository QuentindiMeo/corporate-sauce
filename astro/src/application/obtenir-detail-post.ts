import type { Post } from '@domain/post';
import type { PostRepository } from '@domain/ports/post-repository';

/**
 * Cas d'usage : récupère un post par son identifiant (contenu de la modale).
 * Retourne `null` si aucun post ne correspond.
 */
export async function obtenirDetailPost(
	depot: PostRepository,
	id: string,
): Promise<Post | null> {
	return depot.trouverParId(id);
}
