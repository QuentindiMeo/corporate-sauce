/**
 * Logique (pure, testable) de préférence de thème du chrome du site.
 * Le câblage DOM (lecture `localStorage` / `matchMedia`, application sur `<html>`)
 * vit dans l'îlot `ThemeToggle` et le script anti-flash ; ici, aucun accès DOM.
 */
export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'qdm-theme';

function isTheme(value: string | null): value is Theme {
	return value === 'light' || value === 'dark';
}

/**
 * Thème initial : le choix stocké s'il est valide, sinon la préférence système.
 * @param stored  valeur lue dans `localStorage` (ou `null`)
 * @param systemPrefersDark  résultat de `matchMedia('(prefers-color-scheme: dark)')`
 */
export function resolveInitialTheme(stored: string | null, systemPrefersDark: boolean): Theme {
	if (isTheme(stored)) {
		return stored;
	}
	return systemPrefersDark ? 'dark' : 'light';
}

/** Renvoie le thème opposé (pour la bascule). */
export function toggleTheme(theme: Theme): Theme {
	return theme === 'dark' ? 'light' : 'dark';
}
