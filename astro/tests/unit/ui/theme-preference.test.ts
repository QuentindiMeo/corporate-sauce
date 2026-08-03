import { describe, expect, it } from 'vitest';
import {
	THEME_STORAGE_KEY,
	toggleTheme,
	resolveInitialTheme,
	type Theme,
} from '@/ui/theme/theme-preference';

describe('resolveInitialTheme', () => {
	it('prefers the stored theme when valid', () => {
		expect(resolveInitialTheme('light', true)).toBe('light');
		expect(resolveInitialTheme('dark', false)).toBe('dark');
	});

	it('follows the system preference when no choice is stored', () => {
		expect(resolveInitialTheme(null, true)).toBe('dark');
		expect(resolveInitialTheme(null, false)).toBe('light');
	});

	it('ignores an invalid stored value and falls back to the system', () => {
		expect(resolveInitialTheme('bleu', true)).toBe('dark');
		expect(resolveInitialTheme('', false)).toBe('light');
	});
});

describe('toggleTheme', () => {
	it('toggles between light and dark', () => {
		expect(toggleTheme('dark')).toBe<Theme>('light');
		expect(toggleTheme('light')).toBe<Theme>('dark');
	});
});

describe('THEME_STORAGE_KEY', () => {
	it('is a stable key', () => {
		expect(THEME_STORAGE_KEY).toBe('qdm-theme');
	});
});
