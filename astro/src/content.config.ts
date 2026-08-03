import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

import { CATEGORIES } from './domain/category';
import { MODES } from './domain/mode';

/**
 * ? Collection `posts` — chargée depuis `src/data/posts.json` (source versionnée, mise à jour sans redéploiement
 * * de code). Le vocabulaire (rubriques, modes) vient du domaine : une seule source de vérité. Voir action.md §2.
 */
const posts = defineCollection({
	loader: file('src/data/posts.json'),
	schema: ({ image }) =>
		z.object({
			category: z.enum(CATEGORIES),
			mode: z.enum(MODES),
			title: z.string(),
			subtitle: z.string(),
			body: z.string(),
			takeaway: z.string().optional(),
			cta: z.string().optional(),
			image: image(),
			imageAlt: z.string(),
			linkedInUrl: z.string(),
			publishedAt: z.coerce.date(),
			order: z.number().int().positive(),

			// ? Carrousel : au moins deux pages (visuel + alt par page).
			pages: z
				.array(z.object({ image: image(), alt: z.string() }))
				.min(2)
				.optional(),
		}),
});

export const collections = { posts };
