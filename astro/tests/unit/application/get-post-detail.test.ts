import { describe, expect, it } from 'vitest';
import { getPostDetail } from '@application/get-post-detail';
import { fakePostRepository } from '../../helpers/fake-post-repository';
import { aPost } from '../../helpers/post-factory';

describe('getPostDetail', () => {
	it('returns the post matching the id', async () => {
		const repository = fakePostRepository([aPost({ id: 'cible' }), aPost({ id: 'autre' })]);

		const post = await getPostDetail(repository, 'cible');

		expect(post?.id).toBe('cible');
	});

	it('returns null for an unknown id', async () => {
		const repository = fakePostRepository([aPost({ id: 'cible' })]);
		expect(await getPostDetail(repository, 'fantome')).toBeNull();
	});
});
