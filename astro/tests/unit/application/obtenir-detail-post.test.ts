import { describe, expect, it } from 'vitest';
import { obtenirDetailPost } from '@application/obtenir-detail-post';
import { fakePostRepository } from '../../helpers/fake-post-repository';
import { unPost } from '../../helpers/post-factory';

describe('obtenirDetailPost', () => {
	it('retourne le post correspondant à l’identifiant', async () => {
		const depot = fakePostRepository([unPost({ id: 'cible' }), unPost({ id: 'autre' })]);

		const post = await obtenirDetailPost(depot, 'cible');

		expect(post?.id).toBe('cible');
	});

	it('retourne null pour un identifiant inconnu', async () => {
		const depot = fakePostRepository([unPost({ id: 'cible' })]);
		expect(await obtenirDetailPost(depot, 'fantome')).toBeNull();
	});
});
