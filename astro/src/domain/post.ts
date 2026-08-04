import type { Category } from './category';
import type { LinkedInUrl } from './linkedin-url';
import type { Mode } from './mode';

/**
 * ? Référence structurelle à un visuel optimisé.
 * * Volontairement défini dans le domaine (aucun import Astro) ; à l'exécution,
 * * l'infrastructure y injecte l'`ImageMetadata` d'Astro, qui est compatible.
 */
export interface PostImage {
	src: string;
	width: number;
	height: number;
	format: string;
}

// ? Une page d'un post carrousel (visuel + son texte alternatif).
export interface PostPage {
	readonly image: PostImage;
	readonly alt: string;
}

/**
 * ? Entité métier : un post LinkedIn QDM.
 * ! Données pures — aucune dépendance framework. Voir action.md §2.
 */
export interface Post {
	readonly id: string;
	readonly category: Category;
	readonly mode: Mode;
	readonly title: string; // ? Libellé court (punchline / sujet).
	readonly subtitle?: string; // ? Sous-titre.
	readonly body: string; // ? Légende LinkedIn complète (paragraphes).
	readonly takeaway?: string; // ? Phrase-clé encadrée.
	readonly cta?: string; // ? Micro-CTA d'engagement.
	readonly image: PostImage;
	readonly imageAlt: string; // ? Texte alternatif descriptif (obligatoire, a11y).
	readonly linkedInUrl: LinkedInUrl;
	readonly publishedAt: Date;
	readonly order: number; // ? Position au sein de sa ligne thématique.
	readonly hashtags?: readonly string[]; // ? Hashtags de la légende (sans le « # »).
	readonly pages?: readonly PostPage[]; // ? Pages d'un carrousel (≥ 2). Absent pour un post à visuel unique.
}

export function isCarousel(post: Post): boolean {
	return (post.pages?.length ?? 0) >= 2;
}
