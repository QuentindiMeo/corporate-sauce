import { describe, expect, it } from 'vitest';
import { listPostsByTheme } from '@application/list-posts-by-theme';
import { fakePostRepository } from '../../helpers/fake-post-repository';
import { aPost } from '../../helpers/post-factory';

describe('Feature: list posts by theme (use case)', () => {
	it('Given a repository of posts, When listing by theme, Then the grouped theme rows are returned', async () => {
		const repository = fakePostRepository([
			aPost({ id: 'a', category: 'UI' }),
			aPost({ id: 'b', category: 'PERF' }),
		]);

		const rows = await listPostsByTheme(repository);

		expect(rows.map((r) => r.category)).toEqual(['PERF', 'UI']);
	});

	it('Given an empty repository, When listing by theme, Then an empty list is returned', async () => {
		const rows = await listPostsByTheme(fakePostRepository([]));
		expect(rows).toEqual([]);
	});
});
