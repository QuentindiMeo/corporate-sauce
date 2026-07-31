import { describe, expect, it } from 'vitest';
import { getPostDetail } from '@application/get-post-detail';
import { fakePostRepository } from '../../helpers/fake-post-repository';
import { aPost } from '../../helpers/post-factory';

describe('getPostDetail', () => {
	it('retourne le post correspondant à l’identifiant', async () => {
		const repository = fakePostRepository([aPost({ id: 'cible' }), aPost({ id: 'autre' })]);

		const post = await getPostDetail(repository, 'cible');

		expect(post?.id).toBe('cible');
	});

	it('retourne null pour un identifiant inconnu', async () => {
		const repository = fakePostRepository([aPost({ id: 'cible' })]);
		expect(await getPostDetail(repository, 'fantome')).toBeNull();
	});
});
