import { describe, expect, it } from 'vitest';

import { isCarousel, isScheduled } from '@domain/post';
import { aPost } from '../../helpers/post-factory';

const page = { image: { src: '/p.webp', width: 1, height: 1, format: 'webp' }, alt: 'p' };
const now = new Date('2026-08-04T12:00:00Z');

describe('Feature: carousel detection', () => {
	it('Given a post without pages, Then it is not a carousel', () => {
		expect(isCarousel(aPost())).toBe(false);
	});

	it('Given a post with a single page, Then it is not a carousel', () => {
		expect(isCarousel(aPost({ pages: [page] }))).toBe(false);
	});

	it('Given a post with two or more pages, Then it is a carousel', () => {
		expect(isCarousel(aPost({ pages: [page, page] }))).toBe(true);
		expect(isCarousel(aPost({ pages: [page, page, page] }))).toBe(true);
	});
});

describe('Feature: scheduled post detection', () => {
	it('Given a post published in the past, Then it is not scheduled', () => {
		expect(isScheduled(aPost({ publishedAt: new Date('2026-07-21T00:00:00Z') }), now)).toBe(false);
	});

	it('Given a post whose publication date is still ahead, Then it is scheduled', () => {
		expect(isScheduled(aPost({ publishedAt: new Date('2026-09-02T00:00:00Z') }), now)).toBe(true);
	});

	it('Given a post published earlier the same day, Then it is not scheduled', () => {
		// ? La date vient de posts.json à minuit UTC : le jour même, le post est déjà paru.
		expect(isScheduled(aPost({ publishedAt: new Date('2026-08-04T00:00:00Z') }), now)).toBe(false);
	});
});
