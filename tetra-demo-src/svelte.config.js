// Source: 0x84 — Retina svelte.config.js
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: '/tetra-demo'
		},
		prerender: {
			entries: ['/']
		}
	}
};

export default config;
