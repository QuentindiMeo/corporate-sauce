import { describe, expect, it } from 'vitest';
import { grouperParTheme } from '@domain/post-collection';
import { unPost } from '../../helpers/post-factory';

describe('grouperParTheme', () => {
	it('regroupe les posts par rubrique dans l’ordre canonique', () => {
		const lignes = grouperParTheme([
			unPost({ id: 'a', rubrique: 'UI' }),
			unPost({ id: 'b', rubrique: 'PERF' }),
			unPost({ id: 'c', rubrique: 'A11Y' }),
		]);

		expect(lignes.map((l) => l.rubrique)).toEqual(['PERF', 'A11Y', 'UI']);
	});

	it('omet les rubriques sans post', () => {
		const lignes = grouperParTheme([unPost({ rubrique: 'DX' })]);
		expect(lignes).toHaveLength(1);
		expect(lignes[0].rubrique).toBe('DX');
	});

	it('trie les posts d’une ligne par ordre puis id', () => {
		const lignes = grouperParTheme([
			unPost({ id: 'z', rubrique: 'PERF', ordre: 2 }),
			unPost({ id: 'y', rubrique: 'PERF', ordre: 1 }),
			unPost({ id: 'x', rubrique: 'PERF', ordre: 1 }),
		]);

		expect(lignes[0].posts.map((p) => p.id)).toEqual(['x', 'y', 'z']);
	});

	it('retourne une liste vide sans posts', () => {
		expect(grouperParTheme([])).toEqual([]);
	});

	it('ne modifie pas le tableau source', () => {
		const source = [unPost({ rubrique: 'UI' }), unPost({ rubrique: 'PERF' })];
		const copie = [...source];
		grouperParTheme(source);
		expect(source).toEqual(copie);
	});
});
