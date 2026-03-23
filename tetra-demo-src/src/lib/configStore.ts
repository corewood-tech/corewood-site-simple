const STORAGE_KEY = 'tetra-config';

export interface LayoutConfig {
	mode: string; // "physics" | "spherical" | "radial"
	// Physics (force-directed) params
	repulsionMult: number; // 0.1 - 5.0, multiplier on base repulsion
	springMult: number; // 0.1 - 5.0
	dampingMult: number; // 0.1 - 3.0
	centerMult: number; // 0.0 - 5.0
	// Spherical params
	sphereRadius: number; // 0.3 - 3.0, sphere size
	sphereSpacing: number; // 0.5 - 3.0, node spread / min spacing
	// Radial params
	radialSpacing: number; // 0.3 - 3.0, ring-to-ring distance
}

export interface ScaleConfig {
	enabled: boolean;
	property: string; // "connections" | any numeric prop
	algorithm: string; // "linear" | "sqrt" | "log" | "gaussian"
	minRadius: number;
	maxRadius: number;
}

export interface LabelConfig {
	enabled: boolean;
	fontSize: number;
	nearFieldDepth: number;
}

export interface FocusConfig {
	enabled: boolean;
	depth: number;
}

export interface EdgeConfig {
	sourceColor: string;   // hex color for edge origin
	destColor: string;     // hex color for edge tip
	gradientPoint: number; // 0.0-1.0, where color transition / arrowhead begins
	arrowStyle: string;    // "none" | "cone" | "pyramid"
	opacity: number;       // 0.0-1.0, base opacity multiplier
	useNodeColors: boolean; // use source/target node colors instead of fixed colors
	thickness: number;     // 0.0-5.0, edge thickness multiplier
	arrowSize: number;     // 0.0-5.0, size of 3D arrowhead
	routeStyle: string;    // "straight" | "angled" | "curved"
}

export interface TetraConfig {
	layout: LayoutConfig;
	scale: ScaleConfig;
	shapes: Record<string, number>; // type -> shape index 0-5
	colors: Record<string, string>; // type -> hex color
	edges: EdgeConfig;
	focus: FocusConfig;
	labels: LabelConfig;
	backlight: boolean;
}

export const DEFAULT_CONFIG: TetraConfig = {
	layout: {
		mode: 'physics',
		repulsionMult: 1.0,
		springMult: 1.0,
		dampingMult: 1.0,
		centerMult: 1.0,
		sphereRadius: 1.0,
		sphereSpacing: 1.0,
		radialSpacing: 1.0
	},
	scale: {
		enabled: true,
		property: 'connections',
		algorithm: 'gaussian',
		minRadius: 3.0,
		maxRadius: 25.0
	},
	shapes: {},
	colors: {},
	edges: {
		sourceColor: '#2A95C8',
		destColor: '#E23D28',
		gradientPoint: 0.80,
		arrowStyle: 'none',
		opacity: 1.0,
		useNodeColors: false,
		thickness: 0,
		arrowSize: 1.0,
		routeStyle: 'straight',
	},
	focus: { enabled: false, depth: 3 },
	labels: { enabled: false, fontSize: 9, nearFieldDepth: 0.35 },
	backlight: true
};

export function loadConfig(): TetraConfig {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return structuredClone(DEFAULT_CONFIG);
		const saved = JSON.parse(raw);
		// Merge with defaults to handle missing keys from older configs
		return {
			layout: { ...DEFAULT_CONFIG.layout, ...saved.layout },
			scale: { ...DEFAULT_CONFIG.scale, ...saved.scale },
			shapes: { ...saved.shapes },
			colors: { ...saved.colors },
			edges: { ...DEFAULT_CONFIG.edges, ...saved.edges },
			focus: { ...DEFAULT_CONFIG.focus, ...saved.focus, enabled: false },
			labels: { ...DEFAULT_CONFIG.labels, ...saved.labels },
			backlight: saved.backlight ?? DEFAULT_CONFIG.backlight
		};
	} catch {
		return structuredClone(DEFAULT_CONFIG);
	}
}

export function saveConfig(config: TetraConfig): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	} catch {
		// localStorage full or unavailable — non-fatal
	}
}

/** Apply persisted shape/color/scale config to the WASM engine after graph load.
 *  skipLayout: true when restoring after load (layout is already set by load_graph).
 *  Only apply layout mode from explicit user interaction in the ConfigPanel. */
let _lastLayoutMode = '';

export function applyConfig(config: TetraConfig, wasmEngine: any, skipLayout = false): void {
	if (!wasmEngine) return;

	// Apply scale + scale config FIRST — before layout, shapes, or rebuild
	// so any subsequent rebuild_and_upload uses the correct scale_by_connections flag
	try {
		wasmEngine.set_scale_config(
			config.scale.property,
			config.scale.algorithm,
			config.scale.minRadius,
			config.scale.maxRadius
		);
	} catch {}
	try {
		wasmEngine.set_config('scale', config.scale.enabled ? '1' : '0');
	} catch {}

	// Apply backlight
	try {
		wasmEngine.set_config('backlight', config.backlight ? '1' : '0');
	} catch {}

	// Apply shapes
	for (const [type, shapeIdx] of Object.entries(config.shapes)) {
		try {
			wasmEngine.set_type_shape(type, shapeIdx);
		} catch {}
	}

	// Apply colors
	for (const [type, hex] of Object.entries(config.colors)) {
		try {
			const r = parseInt(hex.slice(1, 3), 16) / 255;
			const g = parseInt(hex.slice(3, 5), 16) / 255;
			const b = parseInt(hex.slice(5, 7), 16) / 255;
			wasmEngine.set_type_color(type, r, g, b);
		} catch {}
	}

	// Apply edge style
	try {
		const ec = config.edges;
		const sr = parseInt(ec.sourceColor.slice(1, 3), 16) / 255;
		const sg = parseInt(ec.sourceColor.slice(3, 5), 16) / 255;
		const sb = parseInt(ec.sourceColor.slice(5, 7), 16) / 255;
		const dr = parseInt(ec.destColor.slice(1, 3), 16) / 255;
		const dg = parseInt(ec.destColor.slice(3, 5), 16) / 255;
		const db = parseInt(ec.destColor.slice(5, 7), 16) / 255;
		const arrowIdx = ec.arrowStyle === 'cone' ? 1 : ec.arrowStyle === 'pyramid' ? 2 : 0;
		const routeIdx = ec.routeStyle === 'angled' ? 1 : ec.routeStyle === 'curved' ? 2 : 0;
		wasmEngine.set_edge_style(sr, sg, sb, dr, dg, db, ec.gradientPoint, arrowIdx, ec.opacity, ec.useNodeColors, ec.thickness, ec.arrowSize, routeIdx);
	} catch {}

	// Layout (may call rebuild_and_upload internally — scale is already set above)
	if (!skipLayout && config.layout.mode !== _lastLayoutMode) {
		_lastLayoutMode = config.layout.mode;
		try {
			wasmEngine.set_layout(config.layout.mode);
		} catch {}
	}

	// Apply per-mode layout parameters
	if (config.layout.mode === 'physics') {
		try {
			wasmEngine.set_physics(
				config.layout.repulsionMult,
				config.layout.springMult,
				config.layout.dampingMult,
				config.layout.centerMult
			);
		} catch {}
	} else {
		try {
			wasmEngine.set_layout_params(
				config.layout.sphereRadius,
				config.layout.sphereSpacing,
				config.layout.radialSpacing
			);
		} catch {}
	}

	// Final rebuild to pick up shapes/colors
	try {
		wasmEngine.set_config('rebuild', '1');
	} catch {}
}
