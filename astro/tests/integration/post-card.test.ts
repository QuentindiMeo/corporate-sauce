import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import PostCard from '@/components/PostCard.astro';
import visual from '@/assets/posts/01-perf-virtualisation.png';
import { aPost } from '../helpers/post-factory';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

function card(overrides = {}) {
	const post = aPost({
		id: 'demo-card',
		category: 'PERF',
		mode: 'clair',
		title: 'Un titre de post accrocheur',
		imageAlt: 'Description accessible du visuel',
		image: visual,
		...overrides,
	});
	return container.renderToString(PostCard, { props: { post } });
}

describe('PostCard', () => {
	it('rend une image avec le texte alternatif', async () => {
		const html = await card();
		expect(html).toMatch(/<img[^>]+alt="Description accessible du visuel"/);
	});

	it('applique le mode du post (data-mode + variables inline)', async () => {
		const html = await card({ mode: 'clair' });
		expect(html).toContain('data-mode="clair"');
		expect(html).toContain('--bg:#F6ECD4');
	});

	it('expose un lien LinkedIn sécurisé', async () => {
		const html = await card();
		expect(html).toMatch(/<a[^>]+href="https:\/\/www\.linkedin\.com/);
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it('porte l’identifiant du post (accroche de la modale, Phase 4)', async () => {
		const html = await card({ id: 'demo-card' });
		expect(html).toContain('data-post-id="demo-card"');
	});

	it('affiche le titre du post au-dessus de l’image (sans tag en surimpression)', async () => {
		const html = await card({ title: 'Un titre de post accrocheur' });
		expect(html).toContain('Un titre de post accrocheur');
		expect(html).toMatch(/class="[^"]*post-card__title/);
		// Le titre précède l'image dans le flux (au-dessus).
		expect(html.indexOf('post-card__title')).toBeLessThan(html.indexOf('<img'));
		// Plus de tag rubrique en surimpression sur la vignette.
		expect(html).not.toMatch(/class="[^"]*post-card__tag/);
	});
});
