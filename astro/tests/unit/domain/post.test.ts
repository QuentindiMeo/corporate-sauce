import { isCarousel } from '@domain/post';
import { describe, expect, it } from 'vitest';

import { aPost } from '../../helpers/post-factory';

const page = { image: { src: '/p.webp', width: 1, height: 1, format: 'webp' }, alt: 'p' };

describe('isCarousel', () => {
	it('is false without pages', () => {
		expect(isCarousel(aPost())).toBe(false);
	});

	it('is false with a single page', () => {
		expect(isCarousel(aPost({ pages: [page] }))).toBe(false);
	});

	it('is true from two pages onward', () => {
		expect(isCarousel(aPost({ pages: [page, page] }))).toBe(true);
		expect(isCarousel(aPost({ pages: [page, page, page] }))).toBe(true);
	});
});
