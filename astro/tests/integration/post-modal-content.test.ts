import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';

import visual from '@/assets/posts/01-virtualisation.png';
import PostModalContent from '@/components/PostModalContent.astro';
import { publicationInstant } from '@domain/publication-time';
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

/*
 * ! Les DEUX mentions (« À venir — » / « Posté le ») sont désormais toujours rendues : c'est CSS,
 * ! via `data-scheduled`, qui n'en montre qu'une — pour que le contrôleur client n'ait qu'un
 * ! attribut à basculer à l'heure du navigateur. Les tests portent donc sur l'ÉTAT, plus sur
 * ! l'absence d'un texte. La visibilité effective, elle, est couverte en e2e (CSS appliqué).
 */
describe('Feature: publication date in the modal', () => {
	it('Given an already-published post, When the modal is rendered, Then it is not marked scheduled', async () => {
		const html = await modal({ publishedAt: publicationInstant('2026-07-21') }, { now });
		expect(html).toContain('21 juillet 2026');
		expect(html).not.toMatch(/<article[^>]+data-scheduled/);
	});

	it('Given a post still to be published, When the modal is rendered, Then it is marked scheduled', async () => {
		const html = await modal({ publishedAt: publicationInstant('2026-09-02') }, { now });
		expect(html).toContain('2 septembre 2026');
		expect(html).toMatch(/<article[^>]+data-scheduled/);
	});

	it('Given any post, When the modal is rendered, Then both mentions ship so CSS alone can switch them', async () => {
		const html = await modal({ publishedAt: publicationInstant('2026-07-21') }, { now });
		expect(html).toMatch(/data-when="scheduled"[^>]*>À venir/);
		expect(html).toMatch(/data-when="published"[^>]*>Posté le/);
	});

	it('Given a post, When the modal is rendered, Then the date is a <time> carrying the machine-readable day', async () => {
		const html = await modal({ publishedAt: publicationInstant('2026-07-21') }, { now });
		expect(html).toMatch(/<time[^>]+class="[^"]*modal-post__date/);
		expect(html).toMatch(/<time[^>]+datetime="2026-07-21"/);
	});

	it('Given a post out at 11 h Paris this morning, Then by midday it already counts as published', async () => {
		// ! Régression : `posts.json` ne porte que le jour ; la parution est à 11 h Paris (09:00Z l'été).
		// ! À 12:00Z le même jour, le post est paru — il l'était déjà à 09:00Z.
		const html = await modal({ publishedAt: publicationInstant('2026-08-04') }, { now });
		expect(html).not.toMatch(/<article[^>]+data-scheduled/);
	});

	it('Given the morning before 11 h Paris, Then a post of the day still counts as scheduled', async () => {
		const avant = new Date('2026-08-04T07:00:00Z'); // 09 h à Paris, avant la parution
		const html = await modal({ publishedAt: publicationInstant('2026-08-04') }, { now: avant });
		expect(html).toMatch(/<article[^>]+data-scheduled/);
	});

	it('Given the instant is exposed in the markup, Then the client controller can recompute it', async () => {
		const html = await modal({ publishedAt: publicationInstant('2026-08-04') }, { now });
		expect(html).toMatch(/data-published-at="2026-08-04T09:00:00\.000Z"/);
	});

	it('Given no explicit reference instant, When the modal is rendered, Then it falls back to the build date', async () => {
		// Une date volontairement lointaine reste « à venir » quel que soit le moment du build.
		const html = await modal({ publishedAt: publicationInstant('2999-01-01') });
		expect(html).toMatch(/<article[^>]+data-scheduled/);
	});
});
