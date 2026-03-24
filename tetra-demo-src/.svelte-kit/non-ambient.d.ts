
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>
		};
		Pathname(): "/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/assets/img/og-tetra.png" | "/corewood-logo.png" | "/corewood-symbol.png" | "/data.json" | "/favicon.ico" | "/favicon.jpg" | "/favicon.png" | "/fonts/hk-grotesk-pro-bold.woff2" | "/fonts/hk-grotesk-pro-medium.woff2" | "/fonts/hk-grotesk-pro-regular.woff2" | "/fonts/roca-two-bold.woff2" | "/fonts/roca-two-thin.woff2" | "/sample-graph.json" | "/tetra-logo.svg" | "/verdant-logo.png" | "/wasm/pkg/.gitignore" | "/wasm/pkg/package.json" | "/wasm/pkg/retina_wasm.d.ts" | "/wasm/pkg/retina_wasm.js" | "/wasm/pkg/retina_wasm_bg.wasm" | "/wasm/pkg/retina_wasm_bg.wasm.d.ts" | string & {};
	}
}