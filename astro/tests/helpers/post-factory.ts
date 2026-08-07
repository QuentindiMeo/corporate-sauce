import { createLinkedInUrl } from "@domain/linkedin-url";
import type { Post, PostImage } from "@domain/post";

let counter = 0;

/**
 * ? Fabrique un `Post` valide pour les tests ; surcharger les champs au besoin.
 *
 * * Générique sur le type de visuel, comme l'entité : `aPost()` suffit aux tests de domaine (visuel structurel),
 * * tandis que `aPost<ImageMetadata>({ image: visuel })` sert aux tests de présentation, qui ont besoin du vrai type d'Astro.
 * ! L'assertion sur le visuel par défaut est le SEUL cast du dépôt : elle ne concerne que la
 * ! valeur de commodité fournie par cette fabrique, jamais du code de production.
 */
export function aPost<TImage extends PostImage = PostImage>(overrides: Partial<Post<TImage>> = {}): Post<TImage> {
  counter += 1;
  const id = overrides.id ?? `post-${counter}`;
  return {
    id,
    category: "PERF",
    mode: "sombre",
    title: `Titre ${id}`,
    subtitle: `Accroche ${id}`,
    body: `Corps ${id}`,
    image: { src: `/${id}.webp`, width: 1080, height: 1350, format: "webp" } as TImage,
    imageAlt: `Visuel ${id}`,
    linkedInUrl: createLinkedInUrl("https://www.linkedin.com/posts/qdm"),
    publishedAt: new Date("2026-01-01T00:00:00Z"),
    order: 1,
    ...overrides,
  };
}
