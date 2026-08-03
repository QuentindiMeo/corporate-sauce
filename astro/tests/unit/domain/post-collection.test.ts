import { describe, expect, it } from 'vitest';
import { groupByTheme } from '@domain/post-collection';
import { aPost } from '../../helpers/post-factory';

describe('groupByTheme', () => {
	it('groups posts by category in canonical order', () => {
		const rows = groupByTheme([
			aPost({ id: 'a', category: 'UI' }),
			aPost({ id: 'b', category: 'PERF' }),
			aPost({ id: 'c', category: 'A11Y' }),
		]);

		expect(rows.map((r) => r.category)).toEqual(['PERF', 'A11Y', 'UI']);
	});

	it('omits categories with no post', () => {
		const rows = groupByTheme([aPost({ category: 'DX' })]);
		expect(rows).toHaveLength(1);
		expect(rows[0].category).toBe('DX');
	});

	it('sorts posts within a row by order then id', () => {
		const rows = groupByTheme([
			aPost({ id: 'z', category: 'PERF', order: 2 }),
			aPost({ id: 'y', category: 'PERF', order: 1 }),
			aPost({ id: 'x', category: 'PERF', order: 1 }),
		]);

		expect(rows[0].posts.map((p) => p.id)).toEqual(['x', 'y', 'z']);
	});

	it('returns an empty list when there are no posts', () => {
		expect(groupByTheme([])).toEqual([]);
	});

	it('does not mutate the source array', () => {
		const source = [aPost({ category: 'UI' }), aPost({ category: 'PERF' })];
		const copy = [...source];
		groupByTheme(source);
		expect(source).toEqual(copy);
	});
});
