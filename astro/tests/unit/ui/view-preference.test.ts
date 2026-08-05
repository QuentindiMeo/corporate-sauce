import { describe, expect, it } from 'vitest';

import {
	DEFAULT_VIEW,
	VIEW_STORAGE_KEY,
	resolveInitialView,
	toggleView,
	viewAnnouncement,
	type GalleryView,
} from '@/ui/view/view-preference';

describe('Feature: resolve initial gallery view', () => {
	it('Given a valid stored view, When the initial view is resolved, Then the stored view is preferred', () => {
		expect(resolveInitialView('date')).toBe<GalleryView>('date');
		expect(resolveInitialView('theme')).toBe<GalleryView>('theme');
	});

	it('Given no stored choice, When the initial view is resolved, Then the gallery opens by theme', () => {
		expect(resolveInitialView(null)).toBe<GalleryView>('theme');
		expect(DEFAULT_VIEW).toBe<GalleryView>('theme');
	});

	it('Given an invalid stored value, When the initial view is resolved, Then it falls back to the default view', () => {
		expect(resolveInitialView('chronologie')).toBe<GalleryView>('theme');
		expect(resolveInitialView('')).toBe<GalleryView>('theme');
	});
});

describe('Feature: toggle gallery view', () => {
	it('Given a view, When it is toggled, Then it switches between theme and date', () => {
		expect(toggleView('theme')).toBe<GalleryView>('date');
		expect(toggleView('date')).toBe<GalleryView>('theme');
	});
});

describe('Feature: announce the active view', () => {
	it('Given a view, When it is announced, Then the message names the layout in French', () => {
		expect(viewAnnouncement('theme')).toBe('Galerie par rubrique');
		expect(viewAnnouncement('date')).toBe('Galerie par date, du plus récent au plus ancien');
	});
});

describe('Feature: view storage key', () => {
	it('Given VIEW_STORAGE_KEY, Then it is a stable key, distinct from the theme key', () => {
		expect(VIEW_STORAGE_KEY).toBe('qdm-view');
	});
});
