import type { Category } from './category';
import type { LinkedInUrl } from './linkedin-url';
import type { Mode } from './mode';

/**
 * Référence structurelle à un visuel optimisé.
 * Volontairement défini dans le domaine (aucun import Astro) ; à l'exécution,
 * l'infrastructure y injecte l'`ImageMetadata` d'Astro, qui est compatible.
 */
export interface PostImage {
	src: string;
	width: number;
	height: number;
	format: string;
}

/**
 * Entité métier : un post LinkedIn QDM.
 * Données pures — aucune dépendance framework. Voir action.md §2.
 */
export interface Post {
	readonly id: string;
	readonly category: Category;
	readonly mode: Mode;
	/** Punchline / hook. */
	readonly title: string;
	/** Sous-titre. */
	readonly subtitle: string;
	/** Texte complet du post. */
	readonly body: string;
	/** Phrase-clé encadrée (optionnelle). */
	readonly takeaway?: string;
	/** Micro-CTA d'engagement (optionnel). */
	readonly cta?: string;
	readonly image: PostImage;
	/** Texte alternatif descriptif (obligatoire, a11y). */
	readonly imageAlt: string;
	readonly linkedInUrl: LinkedInUrl;
	readonly publishedAt: Date;
	/** Position au sein de sa ligne thématique. */
	readonly order: number;
}
