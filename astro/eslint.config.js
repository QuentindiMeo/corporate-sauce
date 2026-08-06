// @ts-check
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'dist/**',
			'.astro/**',
			'node_modules/**',
			'coverage/**',
			'playwright-report/**',
			'test-results/**',
		],
	},
	// JS/TS « purs » : recommandations standard. Scopé pour ne pas écraser le
	// parser des fichiers .astro (dont le frontmatter est parsé par le plugin Astro).
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
	},
	// Fichiers .astro : parser dédié (frontmatter TypeScript inclus).
	...astro.configs.recommended,
	{
		files: ['**/*.astro'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.astro'],
			},
		},
	},
	{
		// Le cœur hexagonal ne doit jamais importer Astro, l'infrastructure ni la présentation.
		files: ['src/domain/**/*.ts', 'src/application/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{ group: ['astro', 'astro:*'], message: 'Le cœur ne dépend pas d’Astro.' },
						{
							group: ['@infrastructure/*', '**/infrastructure/*'],
							message: 'Le cœur ne dépend pas de l’infrastructure (règle hexagonale).',
						},
						{
							group: ['@/ui/*', '@/components/*', '@/pages/*'],
							message: 'Le cœur ne dépend pas de la présentation (règle hexagonale).',
						},
					],
				},
			],
		},
	},
	{
		/**
		 * ! L'infrastructure est un adaptateur SECONDAIRE : elle implémente un port du domaine.
		 * ! Elle ne doit donc dépendre ni de la présentation ni des cas d'usage.
		 */
		files: ['src/infrastructure/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['@/ui/*', '@/components/*', '@/pages/*', '**/ui/view-model/*'],
							message:
								'L’infrastructure ne dépend pas de la présentation (règle hexagonale) : annoter avec un type du domaine, ou laisser l’inférence faire.',
						},
						{
							group: ['@application/*', '**/application/*'],
							message: 'L’infrastructure ne dépend pas des cas d’usage : elle implémente un port.',
						},
					],
				},
			],
		},
	},
);
