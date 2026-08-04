import type { Post } from '@domain/post';

import { toIsoDate } from '@/ui/format/date';

interface GalleryInput {
	siteUrl: string;
	name: string;
	description: string;
	posts: readonly Post[];
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
				datePublished: toIsoDate(post.publishedAt),
				inLanguage: 'fr',
			},
		})),
	};
}
