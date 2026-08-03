import { describe, expect, it } from 'vitest';
import { CATEGORIES, isCategory } from '@domain/category';
import { isDarkMode, isMode, MODES } from '@domain/mode';

describe('category', () => {
	it('exposes the 7 categories in display order', () => {
		expect(CATEGORIES).toEqual(['PERF', 'A11Y', 'DX', 'UI', 'ARCHI', 'HTML', 'COLLAB']);
	});

	it('accepts a known category and rejects an unknown one', () => {
		expect(isCategory('PERF')).toBe(true);
		expect(isCategory('perf')).toBe(false);
		expect(isCategory('AUTRE')).toBe(false);
	});
});

describe('mode', () => {
	it('exposes the 3 charter modes', () => {
		expect(MODES).toEqual(['sombre', 'clair', 'liant']);
	});

	it('accepts a known mode and rejects an unknown one', () => {
		expect(isMode('liant')).toBe(true);
		expect(isMode('LIANT')).toBe(false);
		expect(isMode('bleu')).toBe(false);
	});

	it('classifies sombre and liant as dark, clair as light', () => {
		expect(isDarkMode('sombre')).toBe(true);
		expect(isDarkMode('liant')).toBe(true);
		expect(isDarkMode('clair')).toBe(false);
	});
});
