export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "tetra-demo/_app",
	assets: new Set(["assets/img/og-tetra.png","corewood-logo.png","corewood-symbol.png","data.json","favicon.ico","favicon.jpg","favicon.png","fonts/hk-grotesk-pro-bold.woff2","fonts/hk-grotesk-pro-medium.woff2","fonts/hk-grotesk-pro-regular.woff2","fonts/roca-two-bold.woff2","fonts/roca-two-thin.woff2","sample-graph.json","tetra-logo.svg","verdant-logo.png","wasm/pkg/.gitignore","wasm/pkg/package.json","wasm/pkg/retina_wasm.d.ts","wasm/pkg/retina_wasm.js","wasm/pkg/retina_wasm_bg.wasm","wasm/pkg/retina_wasm_bg.wasm.d.ts"]),
	mimeTypes: {".png":"image/png",".json":"application/json",".jpg":"image/jpeg",".woff2":"font/woff2",".svg":"image/svg+xml",".ts":"video/mp2t",".js":"text/javascript",".wasm":"application/wasm"},
	_: {
		client: {start:"_app/immutable/entry/start.JfCyS-v4.js",app:"_app/immutable/entry/app.DkaQ68IX.js",imports:["_app/immutable/entry/start.JfCyS-v4.js","_app/immutable/chunks/DY4Jf6pv.js","_app/immutable/chunks/Br4PySCk.js","_app/immutable/entry/app.DkaQ68IX.js","_app/immutable/chunks/DY4Jf6pv.js","_app/immutable/chunks/Dj6f-nJM.js","_app/immutable/chunks/DEDqjojZ.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
