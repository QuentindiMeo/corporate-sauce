import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Highlight from '@/components/Highlight.astro';
import QdmBadge from '@/components/QdmBadge.astro';
import TagCategory from '@/components/TagCategory.astro';
import VerdictBadge from '@/components/VerdictBadge.astro';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

describe('TagCategory', () => {
	it('affiche la rubrique en majuscules', async () => {
		const html = await container.renderToString(TagCategory, {
			props: { category: 'PERF' },
		});
		expect(html).toContain('PERF');
		expect(html).toMatch(/class="[^"]*tag-category/);
	});
});

describe('QdmBadge', () => {
	it('affiche le logotype QDM', async () => {
		const html = await container.renderToString(QdmBadge);
		expect(html).toContain('QDM');
	});
});

describe('VerdictBadge', () => {
	it('rend un ✓ avec un libellé accessible pour le verdict positif', async () => {
		const html = await container.renderToString(VerdictBadge, {
			props: { type: 'ok' },
		});
		expect(html).toContain('✓');
		expect(html).toMatch(/aria-label="[^"]+"/);
	});

	it('rend un ✕ pour le verdict négatif', async () => {
		const html = await container.renderToString(VerdictBadge, {
			props: { type: 'bad' },
		});
		expect(html).toContain('✕');
	});
});

describe('Highlight', () => {
	it('entoure le contenu passé en slot', async () => {
		const html = await container.renderToString(Highlight, {
			slots: { default: 'mot-clé' },
		});
		expect(html).toContain('mot-clé');
		expect(html).toMatch(/class="[^"]*highlight/);
	});
});
