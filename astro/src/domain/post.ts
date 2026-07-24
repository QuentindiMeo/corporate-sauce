import type { LienLinkedIn } from './lien-linkedin';
import type { Mode } from './mode';
import type { Rubrique } from './rubrique';

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
	readonly rubrique: Rubrique;
	readonly mode: Mode;
	/** Punchline / hook. */
	readonly titre: string;
	/** Sous-titre. */
	readonly accroche: string;
	/** Texte complet du post. */
	readonly corps: string;
	/** Phrase-clé encadrée (optionnelle). */
	readonly takeaway?: string;
	/** Micro-CTA d'engagement (optionnel). */
	readonly cta?: string;
	readonly image: PostImage;
	/** Texte alternatif descriptif (obligatoire, a11y). */
	readonly imageAlt: string;
	readonly lienLinkedIn: LienLinkedIn;
	readonly datePublication: Date;
	/** Position au sein de sa ligne thématique. */
	readonly ordre: number;
}
