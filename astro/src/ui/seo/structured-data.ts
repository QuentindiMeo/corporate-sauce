import type { Post } from '@domain/post';

interface GalerieInput {
	siteUrl: string;
	nom: string;
	description: string;
	posts: readonly Post[];
}

/** Rend une URL absolue à partir du site (laisse intactes les URLs déjà absolues). */
function urlAbsolue(siteUrl: string, chemin: string): string {
	if (/^https?:\/\//.test(chemin)) {
		return chemin;
	}
	return new URL(chemin, siteUrl).href;
}

/**
 * Données structurées schema.org de la galerie : un `ItemList` dont chaque item
 * est un `CreativeWork` (un post). Injecté en `<script type="application/ld+json">`
 * dans la page d'accueil (SEO, action.md §7).
 */
export function galerieJsonLd({ siteUrl, nom, description, posts }: GalerieInput): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: nom,
		description,
		numberOfItems: posts.length,
		itemListElement: posts.map((post, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@type': 'CreativeWork',
				name: post.titre,
				abstract: post.accroche,
				url: post.lienLinkedIn,
				image: urlAbsolue(siteUrl, post.image.src),
				inLanguage: 'fr',
			},
		})),
	};
}
