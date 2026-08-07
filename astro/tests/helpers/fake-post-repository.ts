import type { PostRepository } from "@domain/ports/post-repository";
import type { Post, PostImage } from "@domain/post";

// ? Dépôt en mémoire pour tester les cas d'usage sans infrastructure.
export function fakePostRepository<TImage extends PostImage = PostImage>(
  posts: Post<TImage>[]
): PostRepository<TImage> {
  return {
    async listPosts() {
      return [...posts];
    },
    async findById(id) {
      return posts.find((post) => post.id === id) ?? null;
    },
  };
}
