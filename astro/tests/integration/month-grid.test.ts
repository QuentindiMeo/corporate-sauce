import type { ImageMetadata } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';

import visual from '@/assets/posts/01-virtualisation.png';
import MonthGrid from '@/components/MonthGrid.astro';
import MonthRow from '@/components/MonthRow.astro';
import { aPost } from '../helpers/post-factory';
import { aMonthRowVm } from '../helpers/view-model-factory';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

const createMonthRow = (monthKey: string, n: number) => {
	return aMonthRowVm(
		monthKey,
		Array.from({ length: n }, (_, i) =>
			aPost<ImageMetadata>({
				id: `${monthKey}-${i}`,
				image: visual,
				publishedAt: new Date(`${monthKey}-1${i}T00:00:00Z`),
			}),
		),
	);
}

describe('Feature: MonthRow component', () => {
	it('Given a month row, When it is rendered, Then it shows the French month label and one card per post', async () => {
		const html = await container.renderToString(MonthRow, {
			props: { row: createMonthRow('2026-08', 3) },
		});

		expect(html).toContain('août 2026');
		expect((html.match(/data-post-id=/g) ?? []).length).toBe(3);
	});

	it('Given a month row, When it is rendered, Then it is a region landmark labelled by its month (a11y)', async () => {
		const html = await container.renderToString(MonthRow, {
			props: { row: createMonthRow('2026-07', 1) },
		});

		expect(html).toMatch(/<section[^>]+aria-labelledby="month-2026-07"/);
		expect(html).toContain('id="month-2026-07"');
	});

	it('Given a month row, When it is rendered, Then the month is machine-readable for assistive tech', async () => {
		const html = await container.renderToString(MonthRow, {
			props: { row: createMonthRow('2026-07', 1) },
		});

		expect(html).toMatch(/<time[^>]+datetime="2026-07"/);
	});
});

describe('Feature: MonthGrid component', () => {
	it('Given several month rows, When the flow is rendered, Then months appear in the given order', async () => {
		const rows = [createMonthRow('2026-08', 2), createMonthRow('2026-07', 1), createMonthRow('2026-06', 4)];
		const html = await container.renderToString(MonthGrid, { props: { rows } });

		const positions = ['month-2026-08', 'month-2026-07', 'month-2026-06'].map((k) =>
			html.indexOf(k),
		);
		expect(positions.every((p) => p >= 0)).toBe(true);
		expect(positions).toEqual([...positions].sort((a, b) => a - b));
	});

	it('Given several month rows, When the flow is rendered, Then every post has a card', async () => {
		const rows = [createMonthRow('2026-08', 2), createMonthRow('2026-06', 4)];
		const html = await container.renderToString(MonthGrid, { props: { rows } });

		expect((html.match(/data-post-id=/g) ?? []).length).toBe(6);
	});

	it('Given no month row, When the flow is rendered, Then no card is output', async () => {
		const html = await container.renderToString(MonthGrid, { props: { rows: [] } });
		expect(html).not.toContain('data-post-id=');
	});
});
