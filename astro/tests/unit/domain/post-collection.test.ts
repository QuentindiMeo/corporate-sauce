import { describe, expect, it } from 'vitest';
import { groupByTheme } from '@domain/post-collection';
import { aPost } from '../../helpers/post-factory';

describe('groupByTheme', () => {
	it('regroupe les posts par rubrique dans l’ordre canonique', () => {
		const rows = groupByTheme([
			aPost({ id: 'a', category: 'UI' }),
			aPost({ id: 'b', category: 'PERF' }),
			aPost({ id: 'c', category: 'A11Y' }),
		]);

		expect(rows.map((r) => r.category)).toEqual(['PERF', 'A11Y', 'UI']);
	});

	it('omet les rubriques sans post', () => {
		const rows = groupByTheme([aPost({ category: 'DX' })]);
		expect(rows).toHaveLength(1);
		expect(rows[0].category).toBe('DX');
	});

	it('trie les posts d’une ligne par ordre puis id', () => {
		const rows = groupByTheme([
			aPost({ id: 'z', category: 'PERF', order: 2 }),
			aPost({ id: 'y', category: 'PERF', order: 1 }),
			aPost({ id: 'x', category: 'PERF', order: 1 }),
		]);

		expect(rows[0].posts.map((p) => p.id)).toEqual(['x', 'y', 'z']);
	});

	it('retourne une liste vide sans posts', () => {
		expect(groupByTheme([])).toEqual([]);
	});

	it('ne modifie pas le tableau source', () => {
		const source = [aPost({ category: 'UI' }), aPost({ category: 'PERF' })];
		const copy = [...source];
		groupByTheme(source);
		expect(source).toEqual(copy);
	});
});
