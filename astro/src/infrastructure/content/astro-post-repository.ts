import type { ImageMetadata } from 'astro';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

import { createLinkedInUrl } from '@domain/linkedin-url';
import type { PostRepository } from '@domain/ports/post-repository';
import type { Post } from '@domain/post';

/**
 * ? Mappe une entrée de la collection Astro vers l'entité de domaine `Post`.
 * ! C'est ICI que le type de visuel est fixé : `Post<ImageMetadata>`. Le domaine ne connaît qu'une borne structurelle (`PostImage`) ;
 * ! l'adaptateur, lui, sait que ce sont des `ImageMetadata` d'Astro. Le type circule ensuite intact jusqu'à la vue — plus aucun cast.
 */
function toPost(entry: CollectionEntry<'posts'>): Post<ImageMetadata> {
	const data = entry.data;
	return {
		id: entry.id,
		category: data.category,
		mode: data.mode,
		title: data.title,
		subtitle: data.subtitle,
		body: data.body,
		takeaway: data.takeaway,
		cta: data.cta,
		image: data.image,
		imageAlt: data.imageAlt,
		linkedInUrl: createLinkedInUrl(data.linkedInUrl),
		publishedAt: data.publishedAt,
		order: data.order,
		// ! Ne PAS annoter `page` : son type est inféré de la collection Astro (validée par Zod).
		// ! Une annotation avec un type de présentation ferait dépendre l'infrastructure de la vue —
		// ! inversion de la règle hexagonale, et cycle de couches.
		pages: data.pages?.map((page) => ({ image: page.image, alt: page.alt })),
		hashtags: data.hashtags,
	};
}

export const astroPostRepository: PostRepository<ImageMetadata> = {
	async listPosts() {
		const entries = await getCollection('posts');
		return entries.map(toPost);
	},
	async findById(id) {
		const entry = await getEntry('posts', id);
		return entry ? toPost(entry) : null;
	},
};
