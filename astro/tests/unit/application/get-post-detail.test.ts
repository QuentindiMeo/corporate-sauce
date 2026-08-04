import { describe, expect, it } from 'vitest';
import { getPostDetail } from '@application/get-post-detail';
import { fakePostRepository } from '../../helpers/fake-post-repository';
import { aPost } from '../../helpers/post-factory';

describe('Feature: get post detail (use case)', () => {
	it('Given a known id, When the detail is requested, Then the matching post is returned', async () => {
		const repository = fakePostRepository([aPost({ id: 'cible' }), aPost({ id: 'autre' })]);

		const post = await getPostDetail(repository, 'cible');

		expect(post?.id).toBe('cible');
	});

	it('Given an unknown id, When the detail is requested, Then null is returned', async () => {
		const repository = fakePostRepository([aPost({ id: 'cible' })]);
		expect(await getPostDetail(repository, 'fantome')).toBeNull();
	});
});
