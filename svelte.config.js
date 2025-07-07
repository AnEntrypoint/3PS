import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Determine if we're building for GitHub Pages subdirectory
const dev = process.argv.includes('dev');
const ghPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-static for GitHub Pages deployment
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		files: {
			assets: 'static'
		},
		// Set base path for GitHub Pages subdirectory when not using custom domain
		paths: {
			base: dev ? '' : ghPages ? '/3PS' : ''
		},
		// Prerender configuration for static generation
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			entries: ['*']
		}
	}
};

export default config;
