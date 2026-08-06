import type { Post, PostImage } from '@domain/post';
import type { PostRepository } from '@domain/ports/post-repository';

// ? Cas d'usage : récupère un post par son identifiant (contenu de la modale). Retourne `null` si aucun post ne correspond.
export async function getPostDetail<TImage extends PostImage>(
	repository: PostRepository<TImage>,
	id: string,
): Promise<Post<TImage> | null> {
	return repository.findById(id);
}
