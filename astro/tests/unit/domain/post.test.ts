import { isCarousel } from '@domain/post';
import { describe, expect, it } from 'vitest';

import { aPost } from '../../helpers/post-factory';

const page = { image: { src: '/p.webp', width: 1, height: 1, format: 'webp' }, alt: 'p' };

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
