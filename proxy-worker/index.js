/**
 * PostHog Reverse Proxy Worker
 *
 * Runs on: helper.corewood.io
 *
 * Bypasses ad blockers by making PostHog requests appear as first-party.
 * Accepts events from corewood.io, corewood.tech, corewood.info, corewood.cloud.
 *
 * Based on: https://posthog.com/docs/advanced/proxy/cloudflare
 */

const POSTHOG_API_HOST = "us.i.posthog.com";
const POSTHOG_ASSET_HOST = "us-assets.i.posthog.com";

const ALLOWED_ORIGINS = [
	"https://corewood.io",
	"https://www.corewood.io",
	"https://corewood.tech",
	"https://www.corewood.tech",
	"https://corewood.info",
	"https://www.corewood.info",
	"https://corewood.cloud",
	"https://www.corewood.cloud"
];

function getCorsOrigin(request) {
	const origin = request.headers.get("Origin") || "";
	return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

function corsHeaders(request) {
	return {
		"Access-Control-Allow-Origin": getCorsOrigin(request),
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400"
	};
}

async function handleRequest(request, ctx) {
	const url = new URL(request.url);
	const pathname = url.pathname;
	const search = url.search;
	const pathWithParams = pathname + search;

	if (request.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders(request) });
	}

	if (pathname.startsWith("/static/")) {
		return retrieveStatic(request, pathWithParams, ctx);
	}

	return forwardRequest(request, pathWithParams);
}

async function retrieveStatic(request, pathname, ctx) {
	let response = await caches.default.match(request);

	if (!response) {
		response = await fetch(`https://${POSTHOG_ASSET_HOST}${pathname}`);

		const headers = new Headers(response.headers);
		headers.set("Cache-Control", "public, max-age=86400");

		response = new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers
		});

		ctx.waitUntil(caches.default.put(request, response.clone()));
	}

	return response;
}

async function forwardRequest(request, pathWithSearch) {
	const ip = request.headers.get("CF-Connecting-IP") || "";

	const originHeaders = new Headers(request.headers);
	originHeaders.delete("cookie");
	originHeaders.set("X-Forwarded-For", ip);

	const originRequest = new Request(`https://${POSTHOG_API_HOST}${pathWithSearch}`, {
		method: request.method,
		headers: originHeaders,
		body: request.body,
		redirect: request.redirect
	});

	const response = await fetch(originRequest);

	const responseHeaders = new Headers(response.headers);
	const cors = corsHeaders(request);
	for (const [key, value] of Object.entries(cors)) {
		responseHeaders.set(key, value);
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders
	});
}

export default {
	async fetch(request, env, ctx) {
		return handleRequest(request, ctx);
	}
};
