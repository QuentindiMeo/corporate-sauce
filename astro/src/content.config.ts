import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

import { CATEGORIES } from './domain/category';
import { MODES } from './domain/mode';
import { publicationInstant } from './domain/publication-time';

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
			hashtags: z.array(z.string()).optional(),
			subtitle: z.string().optional(),
			body: z.string(),
			takeaway: z.string().optional(),
			cta: z.string().optional(),
			image: image(),
			imageAlt: z.string(),
			linkedInUrl: z.string(),
			// ? Le JOUR suffit dans posts.json ; l'heure de parution est une règle métier
			// ? (11 h, heure de Paris), résolue par le domaine — heure d'été/hiver incluse.
			// ! `z.coerce.date()` plaçait la parution à MINUIT UTC, soit 9 à 10 h trop tôt.
			publishedAt: z.string().transform(publicationInstant),
			order: z.number().int().positive(),

			// ? Carrousel : au moins deux pages (visuel + alt par page).
			pages: z
				.array(z.object({ image: image(), alt: z.string() }))
				.min(2)
				.optional(),
		}),
});

export const collections = { posts };
