import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { createLinkedInUrl } from '@domain/linkedin-url';
import type { Post } from '@domain/post';
import type { PostRepository } from '@domain/ports/post-repository';

/** Mappe une entrée de la collection Astro vers l'entité de domaine `Post`. */
function toPost(entry: CollectionEntry<'posts'>): Post {
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
		// `ImageMetadata` d'Astro satisfait structurellement `PostImage`.
		image: data.image,
		imageAlt: data.imageAlt,
		linkedInUrl: createLinkedInUrl(data.linkedInUrl),
		publishedAt: data.publishedAt,
		order: data.order,
	};
}

/** Adaptateur : implémente le port `PostRepository` via les Content Collections. */
export const astroPostRepository: PostRepository = {
	async listPosts() {
		const entries = await getCollection('posts');
		return entries.map(toPost);
	},
	async findById(id) {
		const entry = await getEntry('posts', id);
		return entry ? toPost(entry) : null;
	},
};
