import type { Post, PostImage } from "../post";

// ? Port (entrant) : source de posts. Implémenté par l'infrastructure (Content Collections Astro, JSON, API...)
export interface PostRepository<TImage extends PostImage = PostImage> {
  listPosts(): Promise<Post<TImage>[]>;
  findById(id: string): Promise<Post<TImage> | null>;
}
