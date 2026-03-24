
import root from '../root.js';
import { set_building, set_prerendering } from '__sveltekit/environment';
import { set_assets } from '$app/paths/internal/server';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	async: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	csrf_trusted_origins: [],
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	service_worker_options: undefined,
	server_error_boundaries: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"utf-8\" />\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t<link rel=\"icon\" type=\"image/png\" href=\"" + assets + "/favicon.png\" />\n\t<link rel=\"icon\" type=\"image/x-icon\" href=\"" + assets + "/favicon.ico\" />\n\t<title>TETRA Demo — Corewood</title>\n\t<meta name=\"description\" content=\"Interactive 3D graph visualization demo. Explore the recommendations dataset with TETRA's WebGPU-powered viewer — 2,330 nodes, 3,506 edges, running entirely in your browser.\" />\n\t<meta property=\"og:title\" content=\"TETRA Demo — Corewood\" />\n\t<meta property=\"og:description\" content=\"Interactive 3D graph visualization. Explore the recommendations dataset in your browser.\" />\n\t<meta property=\"og:image\" content=\"/assets/img/og-tetra.png\" />\n\t<meta property=\"og:type\" content=\"website\" />\n\t<meta name=\"twitter:card\" content=\"summary_large_image\" />\n\t<meta name=\"twitter:image\" content=\"/assets/img/og-tetra.png\" />\n\t" + head + "\n</head>\n<body>\n\t<div id=\"app-shell\">\n\t\t<header class=\"cw-site-header\">\n\t\t\t<div class=\"cw-header-plate\">\n\t\t\t\t<div class=\"cw-rivet cw-rivet-l\"></div>\n\t\t\t\t<div class=\"cw-rivet cw-rivet-r\"></div>\n\t\t\t\t<div class=\"cw-header-inner\">\n\t\t\t\t\t<div class=\"cw-nav-left\">\n\t\t\t\t\t\t<a href=\"/profile/\">Work</a>\n\t\t\t\t\t\t<a href=\"/about/\">About</a>\n\t\t\t\t\t</div>\n\t\t\t\t\t<a href=\"/\" class=\"cw-logo-link\">\n\t\t\t\t\t\t<img src=\"" + assets + "/corewood-symbol.png\" alt=\"Corewood\" class=\"cw-logo-img\" />\n\t\t\t\t\t</a>\n\t\t\t\t\t<div class=\"cw-nav-right\">\n\t\t\t\t\t\t<a href=\"/blog/\">Blog</a>\n\t\t\t\t\t\t<a href=\"/contact/\">Contact</a>\n\t\t\t\t\t\t<span class=\"cw-collab\">\n\t\t\t\t\t\t\t<span class=\"cw-collab-text\">in collaboration with</span>\n\t\t\t\t\t\t\t<a href=\"https://www.verdantintel.com/\" target=\"_blank\" rel=\"noopener noreferrer\">\n\t\t\t\t\t\t\t\t<img src=\"" + assets + "/verdant-logo.png\" alt=\"Verdant Intelligence\" class=\"cw-verdant-logo\" />\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<a href=\"/schedule-meeting/\" class=\"cw-cta\">Schedule a Meeting</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</header>\n\t\t<div id=\"app\">" + body + "</div>\n\t</div>\n</body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "c60zuf"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let handleValidationError;
	let init;
	

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		handleValidationError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation };
