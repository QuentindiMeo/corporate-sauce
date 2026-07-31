import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import PostGrid from '@/components/PostGrid.astro';
import PostRow from '@/components/PostRow.astro';
import type { ThemeRow } from '@domain/post-collection';
import visual from '@/assets/posts/01-perf-virtualisation.png';
import { aPost } from '../helpers/post-factory';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

function row(category: ThemeRow['category'], n: number): ThemeRow {
	return {
		category,
		posts: Array.from({ length: n }, (_, i) =>
			aPost({ id: `${category}-${i}`, category, image: visual }),
		),
	};
}

describe('PostRow', () => {
	it('affiche le tag rubrique et une carte par post', async () => {
		const html = await container.renderToString(PostRow, {
			props: { row: row('PERF', 3) },
		});
		expect(html).toContain('PERF');
		expect((html.match(/data-post-id=/g) ?? []).length).toBe(3);
	});

	it('est un repère de région étiqueté par sa rubrique (a11y)', async () => {
		const html = await container.renderToString(PostRow, {
			props: { row: row('A11Y', 1) },
		});
		expect(html).toMatch(/<section[^>]+aria-labelledby/);
	});
});

describe('PostGrid', () => {
	it('rend chaque ligne dans l’ordre fourni', async () => {
		const rows = [row('PERF', 2), row('A11Y', 1), row('UI', 4)];
		const html = await container.renderToString(PostGrid, { props: { rows } });

		const positions = ['PERF', 'A11Y', 'UI'].map((r) => html.indexOf(r));
		expect(positions).toEqual([...positions].sort((a, b) => a - b));
		expect(positions.every((p) => p >= 0)).toBe(true);
	});

	it('rend le nombre total de cartes attendu', async () => {
		const rows = [row('PERF', 2), row('UI', 4)];
		const html = await container.renderToString(PostGrid, { props: { rows } });
		expect((html.match(/data-post-id=/g) ?? []).length).toBe(6);
	});
});
