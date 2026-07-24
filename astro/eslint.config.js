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
		// Le cœur hexagonal ne doit jamais importer Astro ni l'infrastructure.
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
					],
				},
			],
		},
	},
);
