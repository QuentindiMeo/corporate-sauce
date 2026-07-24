import { describe, expect, it } from 'vitest';
import { galerieJsonLd } from '@/ui/seo/structured-data';
import { unPost } from '../../helpers/post-factory';

const base = {
	siteUrl: 'https://qdm.example',
	nom: 'Galerie QDM',
	description: 'Les posts LinkedIn QDM.',
};

describe('galerieJsonLd', () => {
	it('produit un ItemList schema.org', () => {
		const data = galerieJsonLd({ ...base, posts: [unPost()] }) as Record<string, unknown>;
		expect(data['@context']).toBe('https://schema.org');
		expect(data['@type']).toBe('ItemList');
		expect(data.name).toBe('Galerie QDM');
	});

	it('liste un CreativeWork par post, position croissante', () => {
		const posts = [
			unPost({ id: 'a', titre: 'Titre A', lienLinkedIn: undefined }),
			unPost({ id: 'b', titre: 'Titre B' }),
		];
		const data = galerieJsonLd({ ...base, posts }) as {
			itemListElement: Array<{ position: number; item: Record<string, unknown> }>;
		};

		expect(data.itemListElement).toHaveLength(2);
		expect(data.itemListElement.map((e) => e.position)).toEqual([1, 2]);
		expect(data.itemListElement[0].item['@type']).toBe('CreativeWork');
		expect(data.itemListElement[0].item.name).toBe('Titre A');
	});

	it('reprend le lien LinkedIn comme URL de l’item', () => {
		const post = unPost({ lienLinkedIn: undefined });
		const data = galerieJsonLd({ ...base, posts: [post] }) as {
			itemListElement: Array<{ item: { url: string } }>;
		};
		expect(data.itemListElement[0].item.url).toBe(post.lienLinkedIn);
	});

	it('rend l’URL de l’image absolue à partir du site', () => {
		const post = unPost({ image: { src: '/_astro/x.webp', width: 1, height: 1, format: 'webp' } });
		const data = galerieJsonLd({ ...base, posts: [post] }) as {
			itemListElement: Array<{ item: { image: string } }>;
		};
		expect(data.itemListElement[0].item.image).toBe('https://qdm.example/_astro/x.webp');
	});

	it('conserve une URL d’image déjà absolue', () => {
		const post = unPost({
			image: { src: 'https://cdn.example/x.webp', width: 1, height: 1, format: 'webp' },
		});
		const data = galerieJsonLd({ ...base, posts: [post] }) as {
			itemListElement: Array<{ item: { image: string } }>;
		};
		expect(data.itemListElement[0].item.image).toBe('https://cdn.example/x.webp');
	});
});
