import { creerLienLinkedIn } from '@domain/lien-linkedin';
import type { Post } from '@domain/post';

let compteur = 0;

/** Fabrique un Post valide pour les tests ; surcharger les champs au besoin. */
export function unPost(surcharge: Partial<Post> = {}): Post {
	compteur += 1;
	const id = surcharge.id ?? `post-${compteur}`;
	return {
		id,
		rubrique: 'PERF',
		mode: 'sombre',
		titre: `Titre ${id}`,
		accroche: `Accroche ${id}`,
		corps: `Corps ${id}`,
		image: { src: `/${id}.webp`, width: 1080, height: 1350, format: 'webp' },
		imageAlt: `Visuel ${id}`,
		lienLinkedIn: creerLienLinkedIn('https://www.linkedin.com/posts/qdm'),
		datePublication: new Date('2026-01-01T00:00:00Z'),
		ordre: 1,
		...surcharge,
	};
}
