import { describe, expect, it } from 'vitest';
import { galleryJsonLd } from '@/ui/seo/structured-data';
import { aPost } from '../../helpers/post-factory';

const base = {
	siteUrl: 'https://qdm.example',
	name: 'Galerie QDM',
	description: 'Les posts LinkedIn QDM.',
};

describe('galleryJsonLd', () => {
	it('produit un ItemList schema.org', () => {
		const data = galleryJsonLd({ ...base, posts: [aPost()] }) as Record<string, unknown>;
		expect(data['@context']).toBe('https://schema.org');
		expect(data['@type']).toBe('ItemList');
		expect(data.name).toBe('Galerie QDM');
	});

	it('liste un CreativeWork par post, position croissante', () => {
		const posts = [aPost({ id: 'a', title: 'Titre A' }), aPost({ id: 'b', title: 'Titre B' })];
		const data = galleryJsonLd({ ...base, posts }) as {
			itemListElement: Array<{ position: number; item: Record<string, unknown> }>;
		};

		expect(data.itemListElement).toHaveLength(2);
		expect(data.itemListElement.map((e) => e.position)).toEqual([1, 2]);
		expect(data.itemListElement[0].item['@type']).toBe('CreativeWork');
		expect(data.itemListElement[0].item.name).toBe('Titre A');
	});

	it('reprend le lien LinkedIn comme URL de l’item', () => {
		const post = aPost();
		const data = galleryJsonLd({ ...base, posts: [post] }) as {
			itemListElement: Array<{ item: { url: string } }>;
		};
		expect(data.itemListElement[0].item.url).toBe(post.linkedInUrl);
	});

	it('rend l’URL de l’image absolue à partir du site', () => {
		const post = aPost({ image: { src: '/_astro/x.webp', width: 1, height: 1, format: 'webp' } });
		const data = galleryJsonLd({ ...base, posts: [post] }) as {
			itemListElement: Array<{ item: { image: string } }>;
		};
		expect(data.itemListElement[0].item.image).toBe('https://qdm.example/_astro/x.webp');
	});

	it('conserve une URL d’image déjà absolue', () => {
		const post = aPost({
			image: { src: 'https://cdn.example/x.webp', width: 1, height: 1, format: 'webp' },
		});
		const data = galleryJsonLd({ ...base, posts: [post] }) as {
			itemListElement: Array<{ item: { image: string } }>;
		};
		expect(data.itemListElement[0].item.image).toBe('https://cdn.example/x.webp');
	});
});
