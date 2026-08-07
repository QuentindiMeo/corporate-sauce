import type { PostRepository } from "@domain/ports/post-repository";
import type { PostImage } from "@domain/post";
import { groupByMonth, type MonthRow } from "@domain/post-collection";

/**
 * ? Cas d'usage : construit le flux chronologique de la galerie (un groupe par mois, du plus récent au plus ancien).
 * * Miroir de `listPostsByTheme` — même port, même délégation du tri et du regroupement au domaine.
 */
export async function listPostsByMonth<TImage extends PostImage>(
  repository: PostRepository<TImage>
): Promise<MonthRow<TImage>[]> {
  const posts = await repository.listPosts();
  return groupByMonth(posts);
}
