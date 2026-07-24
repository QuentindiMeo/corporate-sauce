import { describe, expect, it } from 'vitest';
import {
	CLE_STOCKAGE_THEME,
	autreTheme,
	resoudreThemeInitial,
	type Theme,
} from '@/ui/theme/theme-preference';

describe('resoudreThemeInitial', () => {
	it('privilégie le thème stocké quand il est valide', () => {
		expect(resoudreThemeInitial('light', true)).toBe('light');
		expect(resoudreThemeInitial('dark', false)).toBe('dark');
	});

	it('suit la préférence système en l’absence de choix stocké', () => {
		expect(resoudreThemeInitial(null, true)).toBe('dark');
		expect(resoudreThemeInitial(null, false)).toBe('light');
	});

	it('ignore une valeur stockée invalide et retombe sur le système', () => {
		expect(resoudreThemeInitial('bleu', true)).toBe('dark');
		expect(resoudreThemeInitial('', false)).toBe('light');
	});
});

describe('autreTheme', () => {
	it('bascule entre clair et sombre', () => {
		expect(autreTheme('dark')).toBe<Theme>('light');
		expect(autreTheme('light')).toBe<Theme>('dark');
	});
});

describe('CLE_STOCKAGE_THEME', () => {
	it('est une clé stable', () => {
		expect(CLE_STOCKAGE_THEME).toBe('qdm-theme');
	});
});
