import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { creerLienLinkedIn } from '@domain/lien-linkedin';
import type { Post } from '@domain/post';
import type { PostRepository } from '@domain/ports/post-repository';

/** Mappe une entrée de la collection Astro vers l'entité de domaine `Post`. */
function versPost(entry: CollectionEntry<'posts'>): Post {
	const data = entry.data;
	return {
		id: entry.id,
		rubrique: data.rubrique,
		mode: data.mode,
		titre: data.titre,
		accroche: data.accroche,
		corps: data.corps,
		takeaway: data.takeaway,
		cta: data.cta,
		// `ImageMetadata` d'Astro satisfait structurellement `PostImage`.
		image: data.image,
		imageAlt: data.imageAlt,
		lienLinkedIn: creerLienLinkedIn(data.lienLinkedIn),
		datePublication: data.datePublication,
		ordre: data.ordre,
	};
}

/** Adaptateur : implémente le port `PostRepository` via les Content Collections. */
export const astroPostRepository: PostRepository = {
	async listerPosts() {
		const entries = await getCollection('posts');
		return entries.map(versPost);
	},
	async trouverParId(id) {
		const entry = await getEntry('posts', id);
		return entry ? versPost(entry) : null;
	},
};
