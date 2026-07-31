import { createLinkedInUrl } from '@domain/linkedin-url';
import type { Post } from '@domain/post';

let counter = 0;

/** Fabrique un Post valide pour les tests ; surcharger les champs au besoin. */
export function aPost(overrides: Partial<Post> = {}): Post {
	counter += 1;
	const id = overrides.id ?? `post-${counter}`;
	return {
		id,
		category: 'PERF',
		mode: 'sombre',
		title: `Titre ${id}`,
		subtitle: `Accroche ${id}`,
		body: `Corps ${id}`,
		image: { src: `/${id}.webp`, width: 1080, height: 1350, format: 'webp' },
		imageAlt: `Visuel ${id}`,
		linkedInUrl: createLinkedInUrl('https://www.linkedin.com/posts/qdm'),
		publishedAt: new Date('2026-01-01T00:00:00Z'),
		order: 1,
		...overrides,
	};
}
