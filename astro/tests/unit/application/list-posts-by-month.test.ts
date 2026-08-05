import { describe, expect, it } from 'vitest';

import { listPostsByMonth } from '@application/list-posts-by-month';
import { fakePostRepository } from '../../helpers/fake-post-repository';
import { aPost } from '../../helpers/post-factory';

const onDay = (id: string, day: string) => aPost({ id, publishedAt: new Date(`${day}T00:00:00Z`) });

describe("Feature: use case 'list posts by month'", () => {
	it('Given a repository of posts, When the month flow is requested, Then rows come back newest month first', async () => {
		const rows = await listPostsByMonth(
			fakePostRepository([onDay('a', '2026-06-10'), onDay('b', '2026-08-04')]),
		);

		expect(rows.map((r) => r.monthKey)).toEqual(['2026-08', '2026-06']);
	});

	it('Given an empty repository, When the month flow is requested, Then no row is produced', async () => {
		expect(await listPostsByMonth(fakePostRepository([]))).toEqual([]);
	});

	it('Given posts spread over categories, When the month flow is requested, Then every post appears exactly once', async () => {
		const rows = await listPostsByMonth(
			fakePostRepository([
				aPost({ id: 'ui', category: 'UI', publishedAt: new Date('2026-08-04T00:00:00Z') }),
				aPost({ id: 'perf', category: 'PERF', publishedAt: new Date('2026-07-21T00:00:00Z') }),
			]),
		);

		expect(rows.flatMap((r) => r.posts.map((p) => p.id)).sort()).toEqual(['perf', 'ui']);
	});
});
