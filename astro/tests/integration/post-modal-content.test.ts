import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';

import visual from '@/assets/posts/01-virtualisation.png';
import PostModalContent from '@/components/PostModalContent.astro';
import { aPost } from '../helpers/post-factory';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

function modal(overrides = {}, extraProps: Record<string, unknown> = {}) {
	const post = aPost({
		id: 'demo-modal',
		category: 'PERF',
		mode: 'clair',
		title: 'Un titre de post accrocheur',
		imageAlt: 'Description accessible du visuel',
		image: visual,
		...overrides,
	});
	return container.renderToString(PostModalContent, { props: { post, ...extraProps } });
}

const now = new Date('2026-08-04T12:00:00Z');

describe('Feature: publication date in the modal', () => {
	it('Given an already-published post, When the modal is rendered, Then the date is prefixed « Posté le »', async () => {
		const html = await modal({ publishedAt: new Date('2026-07-21T00:00:00Z') }, { now });
		expect(html).toContain('Posté le');
		expect(html).toContain('21 juillet 2026');
		expect(html).not.toContain('À venir');
	});

	it('Given a post still to be published, When the modal is rendered, Then the date is prefixed « À venir »', async () => {
		const html = await modal({ publishedAt: new Date('2026-09-02T00:00:00Z') }, { now });
		expect(html).toContain('À venir');
		expect(html).toContain('2 septembre 2026');
		expect(html).not.toContain('Posté le');
	});

	it('Given a post, When the modal is rendered, Then the date is a <time> carrying the machine-readable day', async () => {
		const html = await modal({ publishedAt: new Date('2026-07-21T00:00:00Z') }, { now });
		expect(html).toMatch(/<time[^>]+class="[^"]*modal-post__date/);
		expect(html).toMatch(/<time[^>]+datetime="2026-07-21"/);
	});

	it('Given a post published earlier the same day, Then it already reads « Posté le », not « À venir »', async () => {
		// Régression : la date vient de posts.json à minuit UTC ; le jour même, le post est paru.
		const html = await modal({ publishedAt: new Date('2026-08-04T00:00:00Z') }, { now });
		expect(html).toContain('Posté le');
		expect(html).not.toContain('À venir');
	});

	it('Given no explicit reference instant, When the modal is rendered, Then it falls back to the build date', async () => {
		// Une date volontairement lointaine reste « à venir » quel que soit le moment du build.
		const html = await modal({ publishedAt: new Date('2999-01-01T00:00:00Z') });
		expect(html).toContain('À venir');
	});
});
