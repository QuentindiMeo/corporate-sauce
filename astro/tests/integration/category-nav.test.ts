import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';

import CategoryNav from '@/components/CategoryNav.astro';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

describe('Feature: CategoryNav component', () => {
	it('Given categories, When the nav is rendered, Then it is a labelled navigation landmark', async () => {
		const html = await container.renderToString(CategoryNav, {
			props: { categories: ['PERF', 'A11Y'] },
		});
		expect(html).toMatch(/<nav[^>]+aria-label="[^"]+"/);
	});

	it('Given categories, When the nav is rendered, Then an anchor link points to each category', async () => {
		const html = await container.renderToString(CategoryNav, {
			props: { categories: ['PERF', 'UI'] },
		});
		expect(html).toContain('href="#category-perf"');
		expect(html).toContain('href="#category-ui"');
		expect(html).toContain('PERF');
		expect(html).toContain('UI');
	});

	it('Given a category, When the nav is rendered, Then its link has a human accessible label while keeping the visible code', async () => {
		const html = await container.renderToString(CategoryNav, {
			props: { categories: ['PERF'] },
		});
		expect(html).toMatch(/aria-label="Aller à la rubrique Performance \(PERF\)"/);
		expect(html).toContain('>PERF<'); // ? Le code court reste le texte visible (label-in-name respecté).
	});

	it('Given no categories, When the nav is rendered, Then nothing is output', async () => {
		const html = await container.renderToString(CategoryNav, { props: { categories: [] } });
		expect(html).not.toContain('<nav');
	});

	it('Given the rail, When it is rendered, Then it declares the view it belongs to and its section prefix', async () => {
		const html = await container.renderToString(CategoryNav, {
			props: { categories: ['PERF'] },
		});

		expect(html).toContain('data-rail-view="theme"');
		expect(html).toContain('data-rail-prefix="category-"');
	});
});
