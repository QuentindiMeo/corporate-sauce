import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import CategoryNav from '@/components/CategoryNav.astro';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

describe('CategoryNav', () => {
	it('est un repère de navigation étiqueté', async () => {
		const html = await container.renderToString(CategoryNav, {
			props: { categories: ['PERF', 'A11Y'] },
		});
		expect(html).toMatch(/<nav[^>]+aria-label="[^"]+"/);
	});

	it('rend un lien d’ancre vers chaque rubrique', async () => {
		const html = await container.renderToString(CategoryNav, {
			props: { categories: ['PERF', 'UI'] },
		});
		expect(html).toContain('href="#category-perf"');
		expect(html).toContain('href="#category-ui"');
		expect(html).toContain('PERF');
		expect(html).toContain('UI');
	});

	it('donne à chaque lien un libellé accessible humain (tout en gardant le code visible)', async () => {
		const html = await container.renderToString(CategoryNav, {
			props: { categories: ['PERF'] },
		});
		expect(html).toMatch(/aria-label="Aller à la rubrique Performance \(PERF\)"/);
		// Le code court reste le texte visible (label-in-name respecté).
		expect(html).toContain('>PERF<');
	});

	it('ne rend rien sans rubrique', async () => {
		const html = await container.renderToString(CategoryNav, { props: { categories: [] } });
		expect(html).not.toContain('<nav');
	});
});
