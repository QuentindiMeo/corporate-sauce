/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

// Utilise la config Vite d'Astro → résout les alias tsconfig (@domain, @application…).
export default getViteConfig({
	test: {
		globals: true,
		environment: 'node',
		include: [
			'src/**/*.{test,spec}.ts',
			'tests/unit/**/*.{test,spec}.ts',
			'tests/integration/**/*.{test,spec}.ts',
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			// Cœur testé unitairement. L'infrastructure (adaptateur Astro) sera
			// couverte par les tests d'intégration d'une phase ultérieure.
			include: ['src/domain/**/*.ts', 'src/application/**/*.ts'],
			thresholds: {
				// Cible domaine ≥ 90 % (action.md §8).
				lines: 90,
				functions: 90,
				branches: 80,
				statements: 90,
			},
		},
	},
});
