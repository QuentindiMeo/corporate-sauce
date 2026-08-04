import { describe, expect, it } from 'vitest';
import { groupByTheme } from '@domain/post-collection';
import { aPost } from '../../helpers/post-factory';

describe('Feature: grouping posts by theme', () => {
	it('Given posts across categories, When they are grouped, Then rows follow the canonical category order', () => {
		const rows = groupByTheme([
			aPost({ id: 'a', category: 'UI' }),
			aPost({ id: 'b', category: 'PERF' }),
			aPost({ id: 'c', category: 'A11Y' }),
		]);

		expect(rows.map((r) => r.category)).toEqual(['PERF', 'A11Y', 'UI']);
	});

	it('Given a category with no post, When posts are grouped, Then that category is omitted', () => {
		const rows = groupByTheme([aPost({ category: 'DX' })]);
		expect(rows).toHaveLength(1);
		expect(rows[0].category).toBe('DX');
	});

	it('Given posts in the same category, When they are grouped, Then they are sorted by order then id', () => {
		const rows = groupByTheme([
			aPost({ id: 'z', category: 'PERF', order: 2 }),
			aPost({ id: 'y', category: 'PERF', order: 1 }),
			aPost({ id: 'x', category: 'PERF', order: 1 }),
		]);

		expect(rows[0].posts.map((p) => p.id)).toEqual(['x', 'y', 'z']);
	});

	it('Given no posts, When they are grouped, Then the result is empty', () => {
		expect(groupByTheme([])).toEqual([]);
	});

	it('Given a source array, When it is grouped, Then the source array is not mutated', () => {
		const source = [aPost({ category: 'UI' }), aPost({ category: 'PERF' })];
		const copy = [...source];
		groupByTheme(source);
		expect(source).toEqual(copy);
	});
});
