import type { Post } from '@domain/post';
import type { PostRepository } from '@domain/ports/post-repository';

/** Dépôt en mémoire pour tester les cas d'usage sans infrastructure. */
export function fakePostRepository(posts: Post[]): PostRepository {
	return {
		async listPosts() {
			return [...posts];
		},
		async findById(id) {
			return posts.find((post) => post.id === id) ?? null;
		},
	};
}
