import { describe, expect, it } from 'vitest';
import { listerPostsParTheme } from '@application/lister-posts-par-theme';
import { fakePostRepository } from '../../helpers/fake-post-repository';
import { unPost } from '../../helpers/post-factory';

describe('listerPostsParTheme', () => {
	it('retourne les lignes thématiques regroupées depuis le dépôt', async () => {
		const depot = fakePostRepository([
			unPost({ id: 'a', rubrique: 'UI' }),
			unPost({ id: 'b', rubrique: 'PERF' }),
		]);

		const lignes = await listerPostsParTheme(depot);

		expect(lignes.map((l) => l.rubrique)).toEqual(['PERF', 'UI']);
	});

	it('retourne une liste vide si le dépôt est vide', async () => {
		const lignes = await listerPostsParTheme(fakePostRepository([]));
		expect(lignes).toEqual([]);
	});
});
