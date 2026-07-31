import { describe, expect, it } from 'vitest';
import {
	THEME_STORAGE_KEY,
	toggleTheme,
	resolveInitialTheme,
	type Theme,
} from '@/ui/theme/theme-preference';

describe('resolveInitialTheme', () => {
	it('privilégie le thème stocké quand il est valide', () => {
		expect(resolveInitialTheme('light', true)).toBe('light');
		expect(resolveInitialTheme('dark', false)).toBe('dark');
	});

	it('suit la préférence système en l’absence de choix stocké', () => {
		expect(resolveInitialTheme(null, true)).toBe('dark');
		expect(resolveInitialTheme(null, false)).toBe('light');
	});

	it('ignore une valeur stockée invalide et retombe sur le système', () => {
		expect(resolveInitialTheme('bleu', true)).toBe('dark');
		expect(resolveInitialTheme('', false)).toBe('light');
	});
});

describe('toggleTheme', () => {
	it('bascule entre clair et sombre', () => {
		expect(toggleTheme('dark')).toBe<Theme>('light');
		expect(toggleTheme('light')).toBe<Theme>('dark');
	});
});

describe('THEME_STORAGE_KEY', () => {
	it('est une clé stable', () => {
		expect(THEME_STORAGE_KEY).toBe('qdm-theme');
	});
});
