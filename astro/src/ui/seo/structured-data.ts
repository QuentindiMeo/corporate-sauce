import type { PostViewModel } from '@/ui/view-model/post-view-model';

interface GalleryInput {
	siteUrl: string;
	name: string;
	description: string;
	/**
	 * ? Consomme les **view models**, pas les entités : le jour de parution y est déjà projeté (`publishedDayIso`),
	 * ? donc une seule projection sert la vue ET le JSON-LD.
	 */
	posts: readonly PostViewModel[];
}

// ? Rend une URL absolue à partir du site (laisse intactes les URLs déjà absolues)
function absoluteUrl(siteUrl: string, path: string): string {
	if (/^https?:\/\//.test(path)) {
		return path;
	}
	return new URL(path, siteUrl).href;
}

/**
 * ? Données structurées schema.org de la galerie : un `ItemList` dont chaque item
 * ? est un `CreativeWork` (un post). Injecté en `<script type="application/ld+json">`
 * ? dans la page d'accueil (SEO, action.md §7).
 */
export function galleryJsonLd({ siteUrl, name, description, posts }: GalleryInput): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name,
		description,
		numberOfItems: posts.length,
		itemListElement: posts.map((post, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@type': 'CreativeWork',
				name: post.title,
				abstract: post.subtitle,
				url: post.linkedInUrl,
				image: absoluteUrl(siteUrl, post.image.src),
				datePublished: post.publishedDayIso,
				inLanguage: 'fr',
			},
		})),
	};
}
