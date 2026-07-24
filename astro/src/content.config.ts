import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { MODES } from './domain/mode';
import { RUBRIQUES } from './domain/rubrique';

/**
 * Collection `posts` — chargée depuis `src/data/posts.json` (source versionnée,
 * mise à jour sans redéploiement de code). Le vocabulaire (rubriques, modes)
 * vient du domaine : une seule source de vérité. Voir action.md §2.
 */
const posts = defineCollection({
	loader: file('src/data/posts.json'),
	schema: ({ image }) =>
		z.object({
			rubrique: z.enum(RUBRIQUES),
			mode: z.enum(MODES),
			titre: z.string(),
			accroche: z.string(),
			corps: z.string(),
			takeaway: z.string().optional(),
			cta: z.string().optional(),
			image: image(),
			imageAlt: z.string(),
			lienLinkedIn: z.string(),
			datePublication: z.coerce.date(),
			ordre: z.number().int().positive(),
		}),
});

export const collections = { posts };
