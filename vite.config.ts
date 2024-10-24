/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
	plugins: [solidPlugin()],
	build: {
		target: 'esnext',
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
		// if you have few tests, try commenting this
		// out to improve performance:
		// isolate: false,
		// isolate: true,
	},
});
