/**
 * Logique (pure, testable) de préférence de thème du chrome du site.
 * Le câblage DOM (lecture `localStorage` / `matchMedia`, application sur `<html>`)
 * vit dans l'îlot `ThemeToggle` et le script anti-flash ; ici, aucun accès DOM.
 */
export type Theme = 'light' | 'dark';

export const CLE_STOCKAGE_THEME = 'qdm-theme';

function estTheme(valeur: string | null): valeur is Theme {
	return valeur === 'light' || valeur === 'dark';
}

/**
 * Thème initial : le choix stocké s'il est valide, sinon la préférence système.
 * @param stocke  valeur lue dans `localStorage` (ou `null`)
 * @param systemeSombre  résultat de `matchMedia('(prefers-color-scheme: dark)')`
 */
export function resoudreThemeInitial(stocke: string | null, systemeSombre: boolean): Theme {
	if (estTheme(stocke)) {
		return stocke;
	}
	return systemeSombre ? 'dark' : 'light';
}

/** Renvoie le thème opposé (pour la bascule). */
export function autreTheme(theme: Theme): Theme {
	return theme === 'dark' ? 'light' : 'dark';
}
