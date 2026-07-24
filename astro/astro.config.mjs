// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Galerie statique déployée sur Cloudflare Pages (repli GitHub Pages).
	site: 'https://example.com',
	output: 'static',
	integrations: [mdx(), sitemap()],
	// Typographie de la charte QDM (§3), self-hostée au build (pas de CDN à l'exécution).
	fonts: [
		{
			// Titres & corps
			provider: fontProviders.google(),
			name: 'Space Grotesk',
			cssVariable: '--font-title',
			weights: [400, 500, 700],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
			display: 'swap',
		},
		{
			// Chiffres-choc, tags, logotype, légendes
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-mono',
			weights: [700, 800],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['ui-monospace', 'monospace'],
			display: 'swap',
		},
		{
			// Corps long alternatif (mode clair dense)
			provider: fontProviders.google(),
			name: 'Hanken Grotesk',
			cssVariable: '--font-body',
			weights: [400, 500, 700],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
			display: 'swap',
		},
	],
});
