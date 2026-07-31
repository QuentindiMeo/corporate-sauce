import { describe, expect, it } from 'vitest';
import { listPostsByTheme } from '@application/list-posts-by-theme';
import { fakePostRepository } from '../../helpers/fake-post-repository';
import { aPost } from '../../helpers/post-factory';

describe('listPostsByTheme', () => {
	it('retourne les lignes thématiques regroupées depuis le dépôt', async () => {
		const repository = fakePostRepository([
			aPost({ id: 'a', category: 'UI' }),
			aPost({ id: 'b', category: 'PERF' }),
		]);

		const rows = await listPostsByTheme(repository);

		expect(rows.map((r) => r.category)).toEqual(['PERF', 'UI']);
	});

	it('retourne une liste vide si le dépôt est vide', async () => {
		const rows = await listPostsByTheme(fakePostRepository([]));
		expect(rows).toEqual([]);
	});
});
