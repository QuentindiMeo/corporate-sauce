import type { PostRepository } from "@domain/ports/post-repository";
import type { PostImage } from "@domain/post";
import { groupByTheme, type ThemeRow } from "@domain/post-collection";

// ? Construit les lignes thématiques de la grille à partir d'un dépôt de posts.
export async function listPostsByTheme<TImage extends PostImage>(
  repository: PostRepository<TImage>
): Promise<ThemeRow<TImage>[]> {
  const posts = await repository.listPosts();
  return groupByTheme(posts);
}
