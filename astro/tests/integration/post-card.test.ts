import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';

import visual from '@/assets/posts/01-virtualisation.png';
import PostCard from '@/components/PostCard.astro';
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
	it('renders an image with the alt text', async () => {
		const html = await card();
		expect(html).toMatch(/<img[^>]+alt="Description accessible du visuel"/);
	});

	it('exposes the real post mode and applies the contrasting palette (inverted header)', async () => {
		const html = await card({ mode: 'clair' });
		expect(html).toContain('data-mode="clair"');
		expect(html).toContain('--bg:#120A07');
	});

	it('exposes a secure LinkedIn link', async () => {
		const html = await card();
		expect(html).toMatch(/<a[^>]+href="https:\/\/www\.linkedin\.com/);
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it('carries the post id (modal hook, Phase 4)', async () => {
		const html = await card({ id: 'demo-card' });
		expect(html).toContain('data-post-id="demo-card"');
	});

	it('shows the post title above the image (no overlaid tag)', async () => {
		const html = await card({ title: 'Un titre de post accrocheur' });
		expect(html).toContain('Un titre de post accrocheur');
		expect(html).toMatch(/class="[^"]*post-card__title/);
		// Le titre précède l'image dans le flux (au-dessus).
		expect(html.indexOf('post-card__title')).toBeLessThan(html.indexOf('<img'));
		// Plus de tag rubrique en surimpression sur la vignette.
		expect(html).not.toMatch(/class="[^"]*post-card__tag/);
	});

	it('renders a fard for a carousel post', async () => {
		const page = { image: visual, alt: 'Page du carrousel' };
		const html = await card({ pages: [page, page, page] });
		expect(html).toContain('data-fard');
		expect((html.match(/class="[^"]*fard__page/g) ?? []).length).toBe(3);
		expect(html).toContain('3 pages');
	});

	it('stays a simple thumbnail (no fard) without pages', async () => {
		const html = await card();
		expect(html).not.toContain('data-fard');
	});
});
