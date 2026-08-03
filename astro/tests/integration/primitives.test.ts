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
	it('renders the category in uppercase', async () => {
		const html = await container.renderToString(TagCategory, {
			props: { category: 'PERF' },
		});
		expect(html).toContain('PERF');
		expect(html).toMatch(/class="[^"]*tag-category/);
	});
});

describe('QdmBadge', () => {
	it('renders the QDM logotype', async () => {
		const html = await container.renderToString(QdmBadge);
		expect(html).toContain('QDM');
	});
});

describe('VerdictBadge', () => {
	it('renders a ✓ with an accessible label for the positive verdict', async () => {
		const html = await container.renderToString(VerdictBadge, {
			props: { type: 'ok' },
		});
		expect(html).toContain('✓');
		expect(html).toMatch(/aria-label="[^"]+"/);
	});

	it('renders a ✕ for the negative verdict', async () => {
		const html = await container.renderToString(VerdictBadge, {
			props: { type: 'bad' },
		});
		expect(html).toContain('✕');
	});
});

describe('Highlight', () => {
	it('wraps the content passed in the slot', async () => {
		const html = await container.renderToString(Highlight, {
			slots: { default: 'mot-clé' },
		});
		expect(html).toContain('mot-clé');
		expect(html).toMatch(/class="[^"]*highlight/);
	});
});
