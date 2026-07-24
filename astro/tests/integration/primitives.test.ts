import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BadgeVerdict from '@/components/BadgeVerdict.astro';
import PastilleQDM from '@/components/PastilleQDM.astro';
import Surlignage from '@/components/Surlignage.astro';
import TagRubrique from '@/components/TagRubrique.astro';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

describe('TagRubrique', () => {
	it('affiche la rubrique en majuscules', async () => {
		const html = await container.renderToString(TagRubrique, {
			props: { rubrique: 'PERF' },
		});
		expect(html).toContain('PERF');
		expect(html).toMatch(/class="[^"]*tag-rubrique/);
	});
});

describe('PastilleQDM', () => {
	it('affiche le logotype QDM', async () => {
		const html = await container.renderToString(PastilleQDM);
		expect(html).toContain('QDM');
	});
});

describe('BadgeVerdict', () => {
	it('rend un ✓ avec un libellé accessible pour le verdict positif', async () => {
		const html = await container.renderToString(BadgeVerdict, {
			props: { type: 'ok' },
		});
		expect(html).toContain('✓');
		expect(html).toMatch(/aria-label="[^"]+"/);
	});

	it('rend un ✕ pour le verdict négatif', async () => {
		const html = await container.renderToString(BadgeVerdict, {
			props: { type: 'bad' },
		});
		expect(html).toContain('✕');
	});
});

describe('Surlignage', () => {
	it('entoure le contenu passé en slot', async () => {
		const html = await container.renderToString(Surlignage, {
			slots: { default: 'mot-clé' },
		});
		expect(html).toContain('mot-clé');
		expect(html).toMatch(/class="[^"]*surlignage/);
	});
});
