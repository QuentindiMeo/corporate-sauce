import type { Category } from './category';
import type { LinkedInUrl } from './linkedin-url';
import type { Mode } from './mode';

/**
 * ? Exigences du domaine sur un visuel : ce qu'il a besoin de savoir, rien de plus.
 * ! Volontairement défini ici, sans importer Astro. C'est la **borne** du paramètre `TImage`
 * ! de {@link Post} : l'infrastructure y injecte l'`ImageMetadata` d'Astro, qui la satisfait.
 */
export interface PostImage {
	src: string;
	width: number;
	height: number;
	format: string;
}

// ? Une page d'un post carrousel (visuel + son texte alternatif).
export interface PostPage<TImage extends PostImage = PostImage> {
	readonly image: TImage;
	readonly alt: string;
}

/**
 * ? Entité métier : un post LinkedIn QDM.
 * ! Données pures — aucune dépendance framework. Voir action.md §2.
 *
 * ? **Paramétrée par le type de visuel** (`TImage`), borné par {@link PostImage}.
 * ! Raison d'être : le domaine n'importe pas Astro, mais l'infrastructure fournit des `ImageMetadata`. Sans ce
 * ! paramètre, la présentation devait forcer le typage (`as unknown as ImageMetadata`) pour rendre l'image — 4 fois.
 * ! Ici, `astroPostRepository` expose un `PostRepository<ImageMetadata>` et le type circule intact jusqu'à la vue.
 * * Le défaut `PostImage` garde le domaine et ses tests lisibles, sans paramètre explicite.
 */
export interface Post<TImage extends PostImage = PostImage> {
	readonly id: string;
	readonly category: Category;
	readonly mode: Mode;
	readonly title: string; // ? Libellé court (punchline / sujet).
	readonly subtitle?: string; // ? Sous-titre.
	readonly body: string; // ? Légende LinkedIn complète (paragraphes).
	readonly takeaway?: string; // ? Phrase-clé encadrée.
	readonly cta?: string; // ? Micro-CTA d'engagement.
	readonly image: TImage;
	readonly imageAlt: string; // ? Texte alternatif descriptif (obligatoire, a11y).
	readonly linkedInUrl: LinkedInUrl;
	readonly publishedAt: Date;
	readonly order: number; // ? Position au sein de sa ligne thématique.
	readonly hashtags?: readonly string[]; // ? Hashtags de la légende (sans le « # »).
	readonly pages?: readonly PostPage<TImage>[]; // ? Pages d'un carrousel (≥ 2). Absent pour un post à visuel unique.
}

export function isCarousel<TImage extends PostImage>(post: Post<TImage>): boolean {
	return (post.pages?.length ?? 0) > 1;
}

/**
 * ? LA règle : une parution encore à venir à l'instant `now`.
 * ! `now` est passé en paramètre (jamais `new Date()` ici) : le domaine reste pur et testable.
 * * Exprimée sur l'INSTANT plutôt que sur l'entité, afin que la présentation puisse l'appliquer à l'heure du visiteur sans réencoder la comparaison.
 */
export function isScheduledAt(publishedAt: Date, now: Date): boolean {
	return publishedAt.getTime() > now.getTime();
}

// ? Commodité au niveau de l'entité — même règle, appliquée à `publishedAt`.
export function isScheduled<TImage extends PostImage>(post: Post<TImage>, now: Date): boolean {
	return isScheduledAt(post.publishedAt, now);
}
