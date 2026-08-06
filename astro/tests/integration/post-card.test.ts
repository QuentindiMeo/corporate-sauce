import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';

import visual from '@/assets/posts/01-virtualisation.png';
import PostCard from '@/components/PostCard.astro';
import { publicationInstant } from '@domain/publication-time';
import { aPost } from '../helpers/post-factory';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

function card(overrides = {}, extraProps: Record<string, unknown> = {}) {
	const post = aPost({
		id: 'demo-card',
		category: 'PERF',
		mode: 'clair',
		title: 'Un titre de post accrocheur',
		imageAlt: 'Description accessible du visuel',
		image: visual,
		...overrides,
	});
	return container.renderToString(PostCard, { props: { post, ...extraProps } });
}

const now = new Date('2026-08-04T12:00:00Z');

describe('Feature: PostCard component', () => {
	it('Given a post, When the card is rendered, Then the image carries the alt text', async () => {
		const html = await card();
		expect(html).toMatch(/<img[^>]+alt="Description accessible du visuel"/);
	});

	it('Given a post mode, When the card is rendered, Then data-mode is the real mode and the contrasting palette is applied (inverted header)', async () => {
		const html = await card({ mode: 'clair' });
		expect(html).toContain('data-mode="clair"');
		expect(html).toContain('--bg:#120A07');
	});

	it('Given a post, When the card is rendered, Then it exposes a secure LinkedIn link', async () => {
		const html = await card();
		expect(html).toMatch(/<a[^>]+href="https:\/\/www\.linkedin\.com/);
		expect(html).toContain('rel="noopener noreferrer"');
	});

	it('Given a post, When the card is rendered, Then it carries the post id (modal hook)', async () => {
		const html = await card({ id: 'demo-card' });
		expect(html).toContain('data-post-id="demo-card"');
	});

	it('Given a post, When the card is rendered, Then the title shows above the image with no overlaid tag', async () => {
		const html = await card({ title: 'Un titre de post accrocheur' });
		expect(html).toContain('Un titre de post accrocheur');
		expect(html).toMatch(/class="[^"]*post-card__title/);
		// Le titre précède l'image dans le flux (au-dessus).
		expect(html.indexOf('post-card__title')).toBeLessThan(html.indexOf('<img'));
		// Plus de tag rubrique en surimpression sur la vignette.
		expect(html).not.toMatch(/class="[^"]*post-card__tag/);
	});

	it('Given a carousel post, When the card is rendered, Then it shows a fard (stack of pages + badge)', async () => {
		const page = { image: visual, alt: 'Page du carrousel' };
		const html = await card({ pages: [page, page, page] });
		expect(html).toContain('data-fard');
		expect((html.match(/class="[^"]*fard__page/g) ?? []).length).toBe(3);
		expect(html).toContain('3 pages');
	});

	it('Given a post without pages, When the card is rendered, Then it stays a simple thumbnail (no fard)', async () => {
		const html = await card();
		expect(html).not.toContain('data-fard');
	});

	it('Given a post still to be published, When the card is rendered, Then it is marked « à venir »', async () => {
		const html = await card({ publishedAt: new Date('2026-09-02T00:00:00Z') }, { now });
		expect(html).toContain('data-scheduled');
		expect(html).toMatch(/class="[^"]*post-card__scheduled/);
		expect(html).toContain('À venir');
	});

	it('Given a scheduled post, When the card is rendered, Then the state is in the accessible name, not colour alone', async () => {
		const html = await card({ publishedAt: new Date('2026-09-02T00:00:00Z') }, { now });
		expect(html).toMatch(/aria-label="[^"]*\(à venir\)"/);
	});

	it('Given an already-published post, When the card is rendered, Then it is not marked scheduled', async () => {
		const html = await card({ publishedAt: publicationInstant('2026-07-21') }, { now });
		// ! La pastille est TOUJOURS dans le DOM ; c'est `data-scheduled` (posé au build puis
		// ! recalculé à l'heure du navigateur) qui la rend visible via CSS. On teste donc l'état.
		expect(html).not.toMatch(/<article[^>]+data-scheduled/);
		expect(html).toMatch(/class="[^"]*post-card__scheduled/);
	});

	it('Given a card, When it is rendered, Then it exposes the instant and a state-free label base', async () => {
		const html = await card({ publishedAt: publicationInstant('2026-08-04') }, { now });
		// ? Ce que le contrôleur client consomme pour recalculer sans reconstruire de chaîne.
		expect(html).toMatch(/data-published-at="2026-08-04T09:00:00\.000Z"/);
		expect(html).toMatch(/data-aria-base="Ouvrir le post « [^"]*»"/);
	});

	it('Given the morning before 11 h Paris, Then a post of the day is still marked scheduled', async () => {
		const avant = new Date('2026-08-04T07:00:00Z'); // 09 h à Paris
		const html = await card({ publishedAt: publicationInstant('2026-08-04') }, { now: avant });
		expect(html).toMatch(/<article[^>]+data-scheduled/);
	});

	it('Given an already-published post, Then the accessible name states it is published', async () => {
		const html = await card({ publishedAt: new Date('2026-07-21T00:00:00Z') }, { now });
		expect(html).toMatch(/aria-label="[^"]*\(posté\)"/);
	});

	it('Given either state, Then the mention is separated from the title by a space', async () => {
		// Régression : « … »(posté) collé au guillemet fermant s'entend dans un lecteur d'écran.
		const published = await card({ publishedAt: new Date('2026-07-21T00:00:00Z') }, { now });
		const scheduled = await card({ publishedAt: new Date('2026-09-02T00:00:00Z') }, { now });
		expect(published).toContain('» (posté)');
		expect(scheduled).toContain('» (à venir)');
	});
});
