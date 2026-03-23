import "../../chunks/internal.js";
import "../../chunks/environment.js";
import "../../chunks/routing.js";
import { b as escape_html, i as ensure_array_like, n as attr_style, o as stringify, r as derived, t as attr_class, y as attr } from "../../chunks/server.js";
import "../../chunks/paths.js";
//#region src/lib/components/AlgorithmPanel.svelte
function AlgorithmPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { wasmEngine, onfocusnode, oninspectexternal, onpickstart, onpickend, pickedNode, onalgoselect, onalgodeselect, ondiscoverynodes, oncleardiscovery, demoMode = false } = $$props;
		const ALGO_REGISTRY = {
			centrality: {
				label: "Centrality",
				algorithms: [
					{
						id: "degree",
						label: "Degree Centrality",
						mode: "gradient",
						params: [],
						help: "Ranks nodes by their number of connections. Highly connected nodes score higher."
					},
					{
						id: "betweenness",
						label: "Betweenness Centrality",
						mode: "gradient",
						params: [],
						help: "Finds bridge nodes that sit on the shortest paths between other nodes. High scores indicate gatekeepers."
					},
					{
						id: "closeness",
						label: "Closeness Centrality",
						mode: "gradient",
						params: [],
						help: "Measures how close a node is to all others. High scores mean a node can reach the rest of the graph quickly."
					},
					{
						id: "pagerank",
						label: "PageRank",
						mode: "gradient",
						params: [{
							name: "damping",
							type: "number",
							label: "Damping",
							min: .1,
							max: 1,
							step: .05,
							default: .85
						}, {
							name: "iterations",
							type: "number",
							label: "Iterations",
							min: 1,
							max: 100,
							step: 1,
							default: 30
						}],
						help: "Ranks nodes by the quality and quantity of incoming links. A node linked by other important nodes scores higher."
					},
					{
						id: "hits",
						label: "HITS",
						mode: "gradient",
						params: [{
							name: "metric",
							type: "select",
							label: "Metric",
							options: [{
								value: "authority",
								label: "Authorities"
							}, {
								value: "hub",
								label: "Hubs"
							}],
							default: "authority"
						}, {
							name: "iterations",
							type: "number",
							label: "Iterations",
							min: 1,
							max: 100,
							step: 1,
							default: 20
						}],
						help: "Identifies two kinds of important nodes: Authorities (pointed to by many hubs) and Hubs (pointing to many authorities)."
					},
					{
						id: "eigenvector",
						label: "Eigenvector",
						mode: "gradient",
						params: [{
							name: "iterations",
							type: "number",
							label: "Iterations",
							min: 1,
							max: 100,
							step: 1,
							default: 30
						}],
						help: "Ranks nodes by recursive influence — a node scores high if its neighbors also score high. Similar to PageRank but without damping."
					},
					{
						id: "clustering",
						label: "Clustering Coefficient",
						mode: "gradient",
						params: [],
						help: "Measures how tightly clustered each node's neighbors are. High scores indicate nodes in dense cliques."
					},
					{
						id: "eccentricity",
						label: "Eccentricity",
						mode: "gradient",
						params: [],
						help: "Inverse of max distance to any other node. High scores = central nodes that can reach everything quickly."
					}
				]
			},
			community: {
				label: "Community",
				algorithms: [{
					id: "label_propagation",
					label: "Label Propagation",
					mode: "community",
					params: [{
						name: "iterations",
						type: "number",
						label: "Iterations",
						min: 1,
						max: 100,
						step: 1,
						default: 20
					}],
					help: "Groups tightly connected nodes into communities. Each node adopts the most common label among its neighbors."
				}]
			},
			structure: {
				label: "Structure",
				algorithms: [{
					id: "kcore",
					label: "K-Core",
					mode: "binary",
					params: [{
						name: "k",
						type: "number",
						label: "K value",
						min: 1,
						max: 50,
						step: 1,
						default: 2
					}],
					help: "Finds the densest subgraph where every node has at least K connections. Higher K = denser core."
				}, {
					id: "components",
					label: "Connected Components",
					mode: "community",
					params: [],
					help: "Finds isolated clusters — groups of nodes that are connected to each other but not to the rest of the graph."
				}]
			},
			path: {
				label: "Path",
				algorithms: [
					{
						id: "shortest",
						label: "Shortest Path",
						mode: "path",
						params: [{
							name: "source",
							type: "nodeSelect",
							label: "Source Node"
						}, {
							name: "target",
							type: "nodeSelect",
							label: "Target Node"
						}],
						help: "Finds the fewest hops between two nodes. Click a node to copy its UID into the source or target field."
					},
					{
						id: "ego",
						label: "Ego Network",
						mode: "binary",
						params: [{
							name: "center",
							type: "nodeSelect",
							label: "Center Node"
						}, {
							name: "radius",
							type: "number",
							label: "Radius",
							min: 1,
							max: 10,
							step: 1,
							default: 2
						}],
						help: "Shows all nodes within N hops of a center node — its local neighborhood."
					},
					{
						id: "bridges",
						label: "Articulation Points",
						mode: "path",
						params: [],
						help: "Finds bridge nodes whose removal would split the graph into disconnected pieces. Critical structural nodes."
					},
					{
						id: "triangle_list",
						label: "Triangle List",
						mode: "path",
						serverOnly: true,
						params: [{
							name: "limit",
							type: "number",
							label: "Max triangles",
							min: 1,
							max: 1e4,
							step: 10,
							default: 100
						}],
						help: "Enumerates actual triangles and highlights the nodes involved. Use to inspect which specific clusters form tight three-way connections."
					}
				]
			},
			metric: {
				label: "Metric",
				algorithms: [
					{
						id: "density",
						label: "Network Density",
						mode: "scalar",
						params: [],
						help: "Ratio of actual edges to possible edges. 0 = no edges, 1 = every node connected to every other."
					},
					{
						id: "triangle_count",
						label: "Triangle Count",
						mode: "scalar",
						params: [],
						help: "Total number of triangles (3-node cycles) in the graph. Measures overall clustering density."
					},
					{
						id: "diameter",
						label: "Graph Diameter",
						mode: "scalar",
						params: [],
						help: "The longest shortest path between any two nodes. Measures how \"spread out\" the graph is."
					}
				]
			},
			diffusion: {
				label: "Diffusion",
				algorithms: [
					{
						id: "diffusion",
						label: "Influence Spread",
						mode: "gradient",
						serverOnly: true,
						params: [
							{
								name: "source",
								type: "nodeSelect",
								label: "Seed Node"
							},
							{
								name: "scale",
								type: "number",
								label: "Scale",
								min: .1,
								max: 10,
								step: .1,
								default: 1
							},
							{
								name: "order",
								type: "number",
								label: "Precision",
								min: 5,
								max: 50,
								step: 1,
								default: 20
							}
						],
						help: "Simulates influence spreading from a seed node through the network. High scores = most reachable at the given scale. Use to model information flow, contagion, or influence reach."
					},
					{
						id: "anomaly",
						label: "Anomaly Detection",
						mode: "gradient",
						serverOnly: true,
						params: [{
							name: "scale",
							type: "number",
							label: "Scale",
							min: .1,
							max: 10,
							step: .1,
							default: 2
						}, {
							name: "order",
							type: "number",
							label: "Precision",
							min: 5,
							max: 50,
							step: 1,
							default: 20
						}],
						help: "Detects structurally anomalous nodes whose local connectivity deviates from neighborhood norms. Use to find outliers, unusual bridges, or structural irregularities."
					},
					{
						id: "wavelet_embed",
						label: "Structural Fingerprint",
						mode: "gradient",
						serverOnly: true,
						params: [{
							name: "dims",
							type: "number",
							label: "Dimensions",
							min: 2,
							max: 16,
							step: 1,
							default: 4
						}, {
							name: "order",
							type: "number",
							label: "Precision",
							min: 5,
							max: 50,
							step: 1,
							default: 20
						}],
						help: "Computes multi-scale structural fingerprints for each node. Score reflects overall structural complexity. Use to find structurally significant or unique nodes across multiple scales."
					}
				]
			}
		};
		let panelCollapsed = true;
		let selectedCategory = "centrality";
		let selectedAlgoIdx = 0;
		Object.keys(ALGO_REGISTRY).filter((cat) => {
			if (!demoMode) return true;
			return ALGO_REGISTRY[cat].algorithms.some((a) => !a.serverOnly);
		});
		const currentAlgos = derived(() => (ALGO_REGISTRY[selectedCategory]?.algorithms || []).filter((a) => !demoMode || !a.serverOnly));
		const currentAlgo = derived(() => currentAlgos()[selectedAlgoIdx]);
		derived(() => currentAlgo()?.params || []);
		$$renderer.push(`<div${attr_class("algo-panel svelte-1hrafuv", void 0, { "collapsed": panelCollapsed })}><button class="algo-header svelte-1hrafuv"><h3 class="svelte-1hrafuv">Analyze</h3> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-1hrafuv"><polyline points="6 9 12 15 18 9"></polyline></svg></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/configStore.ts
var STORAGE_KEY = "tetra-config";
var DEFAULT_CONFIG = {
	layout: {
		mode: "physics",
		repulsionMult: 1,
		springMult: 1,
		dampingMult: 1,
		centerMult: 1,
		sphereRadius: 1,
		sphereSpacing: 1,
		radialSpacing: 1
	},
	scale: {
		enabled: true,
		property: "connections",
		algorithm: "gaussian",
		minRadius: 3,
		maxRadius: 25
	},
	shapes: {},
	colors: {},
	edges: {
		sourceColor: "#2A95C8",
		destColor: "#E23D28",
		gradientPoint: .8,
		arrowStyle: "none",
		opacity: 1,
		useNodeColors: false,
		thickness: 0,
		arrowSize: 1,
		routeStyle: "straight"
	},
	focus: {
		enabled: false,
		depth: 3
	},
	labels: {
		enabled: false,
		fontSize: 9,
		nearFieldDepth: .35
	},
	backlight: true
};
function loadConfig() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return structuredClone(DEFAULT_CONFIG);
		const saved = JSON.parse(raw);
		return {
			layout: {
				...DEFAULT_CONFIG.layout,
				...saved.layout
			},
			scale: {
				...DEFAULT_CONFIG.scale,
				...saved.scale
			},
			shapes: { ...saved.shapes },
			colors: { ...saved.colors },
			edges: {
				...DEFAULT_CONFIG.edges,
				...saved.edges
			},
			focus: {
				...DEFAULT_CONFIG.focus,
				...saved.focus,
				enabled: false
			},
			labels: {
				...DEFAULT_CONFIG.labels,
				...saved.labels
			},
			backlight: saved.backlight ?? DEFAULT_CONFIG.backlight
		};
	} catch {
		return structuredClone(DEFAULT_CONFIG);
	}
}
function saveConfig(config) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	} catch {}
}
/** Apply persisted shape/color/scale config to the WASM engine after graph load.
*  skipLayout: true when restoring after load (layout is already set by load_graph).
*  Only apply layout mode from explicit user interaction in the ConfigPanel. */
var _lastLayoutMode = "";
function applyConfig(config, wasmEngine, skipLayout = false) {
	if (!wasmEngine) return;
	try {
		wasmEngine.set_scale_config(config.scale.property, config.scale.algorithm, config.scale.minRadius, config.scale.maxRadius);
	} catch {}
	try {
		wasmEngine.set_config("scale", config.scale.enabled ? "1" : "0");
	} catch {}
	try {
		wasmEngine.set_config("backlight", config.backlight ? "1" : "0");
	} catch {}
	for (const [type, shapeIdx] of Object.entries(config.shapes)) try {
		wasmEngine.set_type_shape(type, shapeIdx);
	} catch {}
	for (const [type, hex] of Object.entries(config.colors)) try {
		const r = parseInt(hex.slice(1, 3), 16) / 255;
		const g = parseInt(hex.slice(3, 5), 16) / 255;
		const b = parseInt(hex.slice(5, 7), 16) / 255;
		wasmEngine.set_type_color(type, r, g, b);
	} catch {}
	try {
		const ec = config.edges;
		const sr = parseInt(ec.sourceColor.slice(1, 3), 16) / 255;
		const sg = parseInt(ec.sourceColor.slice(3, 5), 16) / 255;
		const sb = parseInt(ec.sourceColor.slice(5, 7), 16) / 255;
		const dr = parseInt(ec.destColor.slice(1, 3), 16) / 255;
		const dg = parseInt(ec.destColor.slice(3, 5), 16) / 255;
		const db = parseInt(ec.destColor.slice(5, 7), 16) / 255;
		const arrowIdx = ec.arrowStyle === "cone" ? 1 : ec.arrowStyle === "pyramid" ? 2 : 0;
		const routeIdx = ec.routeStyle === "angled" ? 1 : ec.routeStyle === "curved" ? 2 : 0;
		wasmEngine.set_edge_style(sr, sg, sb, dr, dg, db, ec.gradientPoint, arrowIdx, ec.opacity, ec.useNodeColors, ec.thickness, ec.arrowSize, routeIdx);
	} catch {}
	if (!skipLayout && config.layout.mode !== _lastLayoutMode) {
		_lastLayoutMode = config.layout.mode;
		try {
			wasmEngine.set_layout(config.layout.mode);
		} catch {}
	}
	if (config.layout.mode === "physics") try {
		wasmEngine.set_physics(config.layout.repulsionMult, config.layout.springMult, config.layout.dampingMult, config.layout.centerMult);
	} catch {}
	else try {
		wasmEngine.set_layout_params(config.layout.sphereRadius, config.layout.sphereSpacing, config.layout.radialSpacing);
	} catch {}
	try {
		wasmEngine.set_config("rebuild", "1");
	} catch {}
}
//#endregion
//#region src/lib/components/Legend.svelte
function Legend($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { wasmEngine } = $$props;
		let edgeSourceColor = "#2A95C8";
		let edgeDestColor = "#E23D28";
		let edgeGradientPoint = .8;
		const FALLBACK_PALETTE = [
			"#4e79a7",
			"#f28e2b",
			"#e15759",
			"#76b7b2",
			"#59a14f",
			"#edc948",
			"#b07aa1",
			"#ff9da7",
			"#9c755f",
			"#bab0ac"
		];
		const SHAPE_CLIPS = [
			"polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
			"polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
			"polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
			"polygon(50% 0%, 100% 100%, 0% 100%)",
			"none",
			"circle(50%)"
		];
		let types = [];
		let shapeMap = {};
		let colorMap = {};
		/** Convert [r,g,b] floats (0-1) to hex string */
		function rgbToHex(rgb) {
			const r = Math.round(rgb[0] * 255);
			const g = Math.round(rgb[1] * 255);
			const b = Math.round(rgb[2] * 255);
			return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
		}
		function swatchStyle(type, colorIdx) {
			const color = colorMap[type] ? rgbToHex(colorMap[type]) : FALLBACK_PALETTE[colorIdx % FALLBACK_PALETTE.length];
			const shapeIdx = shapeMap[type] ?? 5;
			const clip = SHAPE_CLIPS[shapeIdx] ?? "circle(50%)";
			let style = `background: ${color};`;
			if (shapeIdx === 4) style += " border-radius: 2px;";
			else style += ` clip-path: ${clip}; border-radius: 0;`;
			return style;
		}
		$$renderer.push(`<div class="legend svelte-1wfxrff"><div class="legend-header svelte-1wfxrff">Types</div> `);
		if (types.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="legend-items svelte-1wfxrff"><!--[-->`);
			const each_array = ensure_array_like(types);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let type = each_array[i];
				$$renderer.push(`<div class="legend-item svelte-1wfxrff"><span class="legend-swatch svelte-1wfxrff"${attr_style(swatchStyle(type, i))}></span> <span class="legend-label svelte-1wfxrff">${escape_html(type)}</span></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="legend-empty svelte-1wfxrff">No data loaded</div>`);
		}
		$$renderer.push(`<!--]--> <div class="legend-header edge-header svelte-1wfxrff">Edges</div> <div class="edge-key svelte-1wfxrff">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<svg class="edge-sample svelte-1wfxrff" viewBox="0 0 120 12" preserveAspectRatio="none"><defs><linearGradient id="edge-grad" x1="0" x2="1" y1="0" y2="0"><stop offset="0%"${attr("stop-color", edgeSourceColor)}></stop><stop${attr("offset", `${stringify(Math.round(edgeGradientPoint * 100))}%`)}${attr("stop-color", edgeSourceColor)}></stop><stop offset="100%"${attr("stop-color", edgeDestColor)}></stop></linearGradient></defs><rect x="0" y="3" width="120" height="6" rx="2" fill="url(#edge-grad)"></rect></svg>`);
		$$renderer.push(`<!--]--> <div class="edge-labels svelte-1wfxrff"><span class="edge-from svelte-1wfxrff"${attr_style(`color: ${stringify(edgeSourceColor)}`)}>source</span> <span class="edge-arrow svelte-1wfxrff">direction →</span> <span class="edge-to svelte-1wfxrff"${attr_style(`color: ${stringify(edgeDestColor)}`)}>target</span></div></div></div>`);
	});
}
//#endregion
//#region src/lib/components/Gizmo.svelte
function Gizmo($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { wasmEngine, backlight = true, onbacklight } = $$props;
		$$renderer.push(`<div class="gizmo-wrap svelte-1fhgdbm"><canvas class="gizmo svelte-1fhgdbm"></canvas> <button${attr_class("backlight-btn svelte-1fhgdbm", void 0, { "active": backlight })}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg> <div${attr_class("bl-toggle svelte-1fhgdbm", void 0, { "on": backlight })}><div class="bl-knob svelte-1fhgdbm"></div></div> <span class="bl-label svelte-1fhgdbm">Camera backlight</span></button></div>`);
	});
}
//#endregion
//#region src/lib/components/ConfigPanel.svelte
function ConfigPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { wasmEngine, onchange } = $$props;
		let config = loadConfig();
		let openSections = /* @__PURE__ */ new Set();
		let editingType = null;
		let types = [];
		let numericProps = ["connections"];
		let typeColors = {};
		const SHAPE_NAMES = [
			"Icosahedron",
			"Octahedron",
			"Dodecahedron",
			"Tetrahedron",
			"Cube",
			"Sphere"
		];
		const ALGO_LABELS = [
			["linear", "LIN"],
			["sqrt", "SQRT"],
			["log", "LOG"],
			["gaussian", "GAUSS"]
		];
		function isOpen(section) {
			return openSections.has(section);
		}
		function update() {
			saveConfig(config);
			onchange(config);
		}
		function rgbToHex(rgb) {
			if (!rgb || rgb.length < 3) return "#808080";
			return `#${Math.round(rgb[0] * 255).toString(16).padStart(2, "0")}${Math.round(rgb[1] * 255).toString(16).padStart(2, "0")}${Math.round(rgb[2] * 255).toString(16).padStart(2, "0")}`;
		}
		function getTypeColor(type) {
			if (config.colors[type]) return config.colors[type];
			if (typeColors[type]) return rgbToHex(typeColors[type]);
			return "#808080";
		}
		function getTypeShape(type) {
			if (config.shapes[type] !== void 0) return config.shapes[type];
			return 5;
		}
		const SHAPE_CLIPS = [
			"polygon(50% 0%, 100% 38%, 81% 100%, 19% 100%, 0% 38%)",
			"polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
			"polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
			"polygon(50% 0%, 100% 100%, 0% 100%)",
			"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
			"circle(50%)"
		];
		$$renderer.push(`<div class="config-panel svelte-wzegms"><button class="config-header svelte-wzegms"><span${attr_class("config-arrow svelte-wzegms", void 0, { "open": isOpen("layout") })}>▶</span> <span>Layout</span></button> `);
		if (isOpen("layout")) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="config-body svelte-wzegms"><div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Mode</span> <div class="algo-btns svelte-wzegms"><!--[-->`);
			const each_array = ensure_array_like([
				["physics", "FORCE"],
				["spherical", "SPHERE"],
				["radial", "RADIAL"]
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let [val, label] = each_array[$$index];
				$$renderer.push(`<button${attr_class("algo-btn svelte-wzegms", void 0, { "active": config.layout.mode === val })}>${escape_html(label)}</button>`);
			}
			$$renderer.push(`<!--]--></div></div> `);
			if (config.layout.mode === "physics") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Repulsion</span> <input type="range" min="0.1" max="5" step="0.1"${attr("value", config.layout.repulsionMult)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.layout.repulsionMult.toFixed(1))}x</span></div> <div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Springs</span> <input type="range" min="0.1" max="5" step="0.1"${attr("value", config.layout.springMult)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.layout.springMult.toFixed(1))}x</span></div> <div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Damping</span> <input type="range" min="0.1" max="3" step="0.1"${attr("value", config.layout.dampingMult)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.layout.dampingMult.toFixed(1))}x</span></div> <div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Center</span> <input type="range" min="0" max="5" step="0.1"${attr("value", config.layout.centerMult)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.layout.centerMult.toFixed(1))}x</span></div>`);
			} else if (config.layout.mode === "spherical") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Size</span> <input type="range" min="0.3" max="3" step="0.1"${attr("value", config.layout.sphereRadius)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.layout.sphereRadius.toFixed(1))}x</span></div> <div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Spacing</span> <input type="range" min="0.5" max="3" step="0.1"${attr("value", config.layout.sphereSpacing)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.layout.sphereSpacing.toFixed(1))}x</span></div>`);
			} else if (config.layout.mode === "radial") {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`<div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Spread</span> <input type="range" min="0.3" max="3" step="0.1"${attr("value", config.layout.radialSpacing)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.layout.radialSpacing.toFixed(1))}x</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button class="config-header svelte-wzegms"><span${attr_class("config-arrow svelte-wzegms", void 0, { "open": isOpen("nodes") })}>▶</span> <span>Nodes</span></button> `);
		if (isOpen("nodes")) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="config-body svelte-wzegms">`);
			if (!config.scale.enabled) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Size</span> <input type="range" min="0.5" max="20" step="0.5"${attr("value", config.scale.minRadius)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.scale.minRadius)}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="config-row svelte-wzegms"><label class="config-check svelte-wzegms"><input type="checkbox"${attr("checked", config.scale.enabled, true)} class="svelte-wzegms"/> <span>Scale by property</span></label></div> `);
			if (config.scale.enabled) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="config-row config-sub svelte-wzegms"><span class="config-label svelte-wzegms">Property</span> `);
				$$renderer.select({
					class: "config-select",
					value: config.scale.property,
					onchange: update
				}, ($$renderer) => {
					$$renderer.push(`<!--[-->`);
					const each_array_1 = ensure_array_like(numericProps);
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let prop = each_array_1[$$index_1];
						$$renderer.option({ value: prop }, ($$renderer) => {
							$$renderer.push(`${escape_html(prop)}`);
						});
					}
					$$renderer.push(`<!--]-->`);
				}, "svelte-wzegms");
				$$renderer.push(`</div> <div class="config-row config-sub svelte-wzegms"><span class="config-label svelte-wzegms">Algorithm</span> <div class="algo-btns svelte-wzegms"><!--[-->`);
				const each_array_2 = ensure_array_like(ALGO_LABELS);
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let [val, label] = each_array_2[$$index_2];
					$$renderer.push(`<button${attr_class("algo-btn svelte-wzegms", void 0, { "active": config.scale.algorithm === val })}>${escape_html(label)}</button>`);
				}
				$$renderer.push(`<!--]--></div></div> <div class="config-row config-sub svelte-wzegms"><span class="config-label svelte-wzegms">Min</span> <input type="range" min="0.5" max="10" step="0.5"${attr("value", config.scale.minRadius)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.scale.minRadius)}</span></div> <div class="config-row config-sub svelte-wzegms"><span class="config-label svelte-wzegms">Max</span> <input type="range" min="2" max="50" step="1"${attr("value", config.scale.maxRadius)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.scale.maxRadius)}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="nodes-divider svelte-wzegms"></div> <div class="type-list svelte-wzegms"><!--[-->`);
			const each_array_3 = ensure_array_like(types);
			for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
				let type = each_array_3[$$index_4];
				$$renderer.push(`<div class="type-row svelte-wzegms"><div class="type-shape-preview svelte-wzegms"${attr_style(`clip-path: ${stringify(SHAPE_CLIPS[getTypeShape(type)])}; background: ${stringify(getTypeColor(type))}`)}></div> <span class="type-name svelte-wzegms">${escape_html(type)}</span> <button class="type-edit-btn svelte-wzegms" title="Edit color &amp; shape"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-wzegms"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button></div> `);
				if (editingType === type) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="type-editor svelte-wzegms"><div class="editor-section svelte-wzegms"><span class="editor-label svelte-wzegms">Color</span> <div class="editor-color-row svelte-wzegms"><input type="color"${attr("value", getTypeColor(type))} class="svelte-wzegms"/> <span class="editor-hex svelte-wzegms">${escape_html(getTypeColor(type))}</span></div></div> <div class="editor-section svelte-wzegms"><span class="editor-label svelte-wzegms">Shape</span> <div class="editor-shape-grid svelte-wzegms"><!--[-->`);
					const each_array_4 = ensure_array_like(SHAPE_CLIPS);
					for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
						let clip = each_array_4[i];
						$$renderer.push(`<button${attr_class("editor-shape-btn svelte-wzegms", void 0, { "active": getTypeShape(type) === i })}${attr("title", SHAPE_NAMES[i])}><div class="editor-shape-swatch svelte-wzegms"${attr_style(`clip-path: ${stringify(clip)}; background: ${stringify(getTypeColor(type))}`)}></div> <span class="editor-shape-name svelte-wzegms">${escape_html(SHAPE_NAMES[i])}</span></button>`);
					}
					$$renderer.push(`<!--]--></div></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button class="config-header svelte-wzegms"><span${attr_class("config-arrow svelte-wzegms", void 0, { "open": isOpen("edges") })}>▶</span> <span>Edges</span></button> `);
		if (isOpen("edges")) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="config-body svelte-wzegms"><div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Route</span> <div class="algo-btns svelte-wzegms"><!--[-->`);
			const each_array_5 = ensure_array_like([
				["straight", "STRAIGHT"],
				["angled", "ANGLED"],
				["curved", "CURVED"]
			]);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let [val, label] = each_array_5[$$index_5];
				$$renderer.push(`<button${attr_class("algo-btn svelte-wzegms", void 0, { "active": config.edges.routeStyle === val })}>${escape_html(label)}</button>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="config-row svelte-wzegms"><label class="config-check svelte-wzegms"><input type="checkbox"${attr("checked", config.edges.useNodeColors, true)} class="svelte-wzegms"/> <span>Node colors</span></label></div> <div${attr_class("config-row svelte-wzegms", void 0, { "dimmed": config.edges.useNodeColors })}><span class="config-label svelte-wzegms">Source</span> <input type="color"${attr("value", config.edges.sourceColor)}${attr("disabled", config.edges.useNodeColors, true)} class="svelte-wzegms"/> <span class="config-label svelte-wzegms" style="min-width:32px">Dest</span> <input type="color"${attr("value", config.edges.destColor)}${attr("disabled", config.edges.useNodeColors, true)} class="svelte-wzegms"/></div> <div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Gradient</span> <input type="range" min="0.1" max="0.95" step="0.05"${attr("value", config.edges.gradientPoint)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(Math.round(config.edges.gradientPoint * 100))}%</span></div> <div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Arrow</span> <div class="algo-btns svelte-wzegms"><!--[-->`);
			const each_array_6 = ensure_array_like([
				["none", "NONE"],
				["cone", "CONE"],
				["pyramid", "PYRAMID"]
			]);
			for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
				let [val, label] = each_array_6[$$index_6];
				$$renderer.push(`<button${attr_class("algo-btn svelte-wzegms", void 0, { "active": config.edges.arrowStyle === val })}>${escape_html(label)}</button>`);
			}
			$$renderer.push(`<!--]--></div></div> `);
			if (config.edges.arrowStyle !== "none") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="config-row config-sub svelte-wzegms"><span class="config-label svelte-wzegms">Size</span> <input type="range" min="0.25" max="5" step="0.25"${attr("value", config.edges.arrowSize)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.edges.arrowSize.toFixed(1))}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Opacity</span> <input type="range" min="0.1" max="1.0" step="0.05"${attr("value", config.edges.opacity)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(Math.round(config.edges.opacity * 100))}%</span></div> <div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Thickness</span> <input type="range" min="0" max="5" step="0.25"${attr("value", config.edges.thickness)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.edges.thickness.toFixed(1))}</span></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button class="config-header svelte-wzegms"><span${attr_class("config-arrow svelte-wzegms", void 0, { "open": isOpen("labels") })}>▶</span> <span>Labels</span> <span class="config-toggle svelte-wzegms" role="presentation"><span${attr_class("toggle-switch toggle-sm", void 0, { "active": config.labels.enabled })} role="switch"${attr("aria-checked", config.labels.enabled)} tabindex="0"><span class="toggle-knob"></span></span></span></button> `);
		if (isOpen("labels")) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class("config-body svelte-wzegms", void 0, { "dimmed": !config.labels.enabled })}><div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Size</span> <input type="range" min="7" max="16" step="1"${attr("value", config.labels.fontSize)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(config.labels.fontSize)}px</span></div> <div class="config-row svelte-wzegms"><span class="config-label svelte-wzegms">Distance</span> <input type="range" min="0.1" max="1.0" step="0.05"${attr("value", config.labels.nearFieldDepth)} class="svelte-wzegms"/> <span class="config-val svelte-wzegms">${escape_html(Math.round(config.labels.nearFieldDepth * 100))}%</span></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/Sidebar.svelte
function Sidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { status = "", onquery, onopenquery, onopenschema, onclear, wasmEngine, focusNode, onfocustoggle, ondepthchange, ontogglefullscreen, onlabelstoggle, onfocuslabelstoggle, oncommunityselect, oncommunitydeselect, ondiscoverynodes, oncleardiscovery, oninspectexternal, isFullscreen = false, onpickstart, onpickend, pickedNode, initialDepth = 3, protocol = "dql", demoMode = false } = $$props;
		let backlightOn = loadConfig().backlight;
		let collapsed = false;
		let focusMode = false;
		let focusLabels = false;
		let is3D = true;
		let glowDepth = initialDepth;
		let searchQuery = "";
		function handleConfigChange(cfg) {
			applyConfig(cfg, wasmEngine);
			backlightOn = cfg.backlight;
			if (onlabelstoggle) onlabelstoggle(cfg.labels.enabled);
		}
		$$renderer.push(`<div id="sidebar"${attr_class("svelte-129hoe0", void 0, {
			"collapsed": collapsed,
			"demo-mode": demoMode
		})}><div class="sidebar-header svelte-129hoe0"><img${attr("src", demoMode ? "/tetra-demo/tetra-logo.svg" : "/tetra-logo.svg")} alt="Tetra" class="sidebar-logo svelte-129hoe0"/> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="query-area svelte-129hoe0">`);
		if (!demoMode) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="btn-row svelte-129hoe0"><button class="btn btn-primary svelte-129hoe0"><svg viewBox="0 0 24 24" class="svelte-129hoe0"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Query</button> <button class="btn svelte-129hoe0"><svg viewBox="0 0 24 24" class="svelte-129hoe0"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> All</button> <button class="btn svelte-129hoe0"><svg viewBox="0 0 24 24" class="svelte-129hoe0"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> Schema</button></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="btn-row svelte-129hoe0"><button class="btn svelte-129hoe0"><svg viewBox="0 0 24 24" class="svelte-129hoe0"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg> Reset</button> `);
		if (!demoMode) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="btn svelte-129hoe0"><svg viewBox="0 0 24 24" class="svelte-129hoe0"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg> Clear</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="search-bar svelte-129hoe0"><svg class="search-icon svelte-129hoe0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> <input type="text" class="search-input svelte-129hoe0" placeholder="Find node..."${attr("value", searchQuery)}/> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="toggle-row svelte-129hoe0"><span${attr_class("toggle-label svelte-129hoe0", void 0, { "active": false })}>2D</span> <button type="button"${attr_class("toggle-switch", void 0, { "active": is3D })} role="switch"${attr("aria-checked", is3D)} aria-label="Toggle 3D mode"><div class="toggle-knob"></div></button> <span${attr_class("toggle-label svelte-129hoe0", void 0, { "active": is3D })}>3D</span> <button class="fullscreen-btn svelte-129hoe0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-129hoe0">`);
		if (isFullscreen) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>`);
		}
		$$renderer.push(`<!--]--></svg> ${escape_html(isFullscreen ? "Exit" : "Fullscreen")}</button></div> <div class="toggle-row svelte-129hoe0"><button type="button"${attr_class("toggle-switch", void 0, { "active": focusMode })} role="switch"${attr("aria-checked", focusMode)} aria-label="Toggle focus mode"><div class="toggle-knob"></div></button> <span${attr_class("toggle-label svelte-129hoe0", void 0, { "active": focusMode })}>Focus</span> <div${attr_class("depth-control svelte-129hoe0", void 0, { "disabled": true })}><div class="depth-stepper svelte-129hoe0"><button class="depth-step svelte-129hoe0"${attr("disabled", glowDepth <= 1, true)} aria-label="Decrease focus depth"><svg viewBox="0 0 24 24" class="svelte-129hoe0"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button> <span class="depth-value svelte-129hoe0">${escape_html(glowDepth)}</span> <button class="depth-step svelte-129hoe0"${attr("disabled", glowDepth >= 20, true)} aria-label="Increase focus depth"><svg viewBox="0 0 24 24" class="svelte-129hoe0"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button></div></div> <div${attr_class("focus-labels-toggle svelte-129hoe0", void 0, { "disabled": true })}><button type="button"${attr_class("toggle-switch toggle-sm", void 0, { "active": focusLabels })} role="switch"${attr("aria-checked", focusLabels)} aria-label="Toggle focus labels"><div class="toggle-knob"></div></button> <span class="toggle-label-sm svelte-129hoe0">Labels</span></div></div></div>`);
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="sidebar-status svelte-129hoe0">${escape_html(status)}</div> `);
		AlgorithmPanel($$renderer, {
			wasmEngine,
			onfocusnode: focusNode,
			oninspectexternal,
			onpickstart,
			onpickend,
			pickedNode,
			onalgoselect: oncommunityselect,
			onalgodeselect: oncommunitydeselect,
			ondiscoverynodes,
			oncleardiscovery,
			demoMode
		});
		$$renderer.push(`<!----> `);
		ConfigPanel($$renderer, {
			wasmEngine,
			onchange: handleConfigChange
		});
		$$renderer.push(`<!----> <div class="sidebar-section gizmo-section svelte-129hoe0">`);
		Gizmo($$renderer, {
			wasmEngine,
			backlight: backlightOn,
			onbacklight: (on) => {
				backlightOn = on;
				const cfg = loadConfig();
				cfg.backlight = on;
				saveConfig(cfg);
				applyConfig(cfg, wasmEngine);
			}
		});
		$$renderer.push(`<!----></div> <div class="sidebar-section svelte-129hoe0">`);
		Legend($$renderer, { wasmEngine });
		$$renderer.push(`<!----></div> <div class="sidebar-bottom svelte-129hoe0"><button class="hint-toggle svelte-129hoe0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-129hoe0">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<polyline points="18 15 12 9 6 15"></polyline>`);
		$$renderer.push(`<!--]--></svg> <span>Controls</span></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="sidebar-copyright svelte-129hoe0">© Corewood LLC 2026</div></div>`);
		$$renderer.push(`<!--]--></div> <button${attr_class("sidebar-tab svelte-129hoe0", void 0, { "tab-collapsed": collapsed })} title="Toggle sidebar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-129hoe0">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<polyline points="15 18 9 12 15 6"></polyline>`);
		$$renderer.push(`<!--]--></svg></button>`);
	});
}
//#endregion
//#region src/lib/components/NodeModal.svelte
function NodeModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { node, onclose, onpin, onflyto, onfocusnode, isPinned = false, pinnedCount = 0, focusMode = false } = $$props;
		let collapsed = false;
		let edgesOpen = focusMode;
		let posStyle = `bottom: ${24 + pinnedCount * 20}px; right: ${24 + pinnedCount * 20}px;`;
		function getScalarProps(n) {
			if (!n) return [];
			const skip = new Set([
				"uid",
				"id",
				"type",
				"dgraph.type",
				"__edges",
				"pinned"
			]);
			const props = [];
			for (const [k, v] of Object.entries(n)) {
				if (skip.has(k)) continue;
				if (typeof v === "object" && v !== null) continue;
				const s = String(v);
				if (s.length > 200) props.push([k, s.slice(0, 200) + "…"]);
				else props.push([k, s]);
			}
			return props;
		}
		function getEdges(n) {
			if (!n?.__edges) return [];
			return n.__edges.map((e) => ({
				predicate: e.predicate,
				targetUid: e.target_uid,
				targetLabel: e.target_label || e.target_uid,
				direction: e.direction || "out"
			})).sort((a, b) => {
				if (a.direction === "out" && b.direction === "in") return -1;
				if (a.direction === "in" && b.direction === "out") return 1;
				return a.predicate.localeCompare(b.predicate);
			});
		}
		const scalarProps = derived(() => getScalarProps(node));
		const edges = derived(() => getEdges(node));
		const nodeLabel = derived(() => node?.name || node?.label || node?.title || node?.uid || "Node");
		const nodeType = derived(() => node?.type || node?.["dgraph.type"]?.[0] || "");
		$$renderer.push(`<div${attr_class("node-modal svelte-14rxm01", void 0, {
			"pinned": isPinned,
			"collapsed": collapsed
		})}${attr_style(posStyle)}${attr("data-uid", node.uid)}><div class="modal-header svelte-14rxm01"><div class="modal-title-wrap svelte-14rxm01"><h3${attr("title", nodeLabel())} class="svelte-14rxm01">${escape_html(nodeLabel())}</h3> `);
		if (node.external) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="external-badge svelte-14rxm01">not displayed</span>`);
		} else if (onflyto) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<button class="modal-flyto svelte-14rxm01">fly to</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <button${attr_class("modal-btn collapse-btn svelte-14rxm01", void 0, { "rotated": collapsed })} title="Collapse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-14rxm01"><polyline points="6 9 12 15 18 9"></polyline></svg></button> <button class="modal-btn svelte-14rxm01" title="Copy as markdown">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-14rxm01"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`);
		$$renderer.push(`<!--]--></button> <button${attr_class("modal-btn pinned-btn svelte-14rxm01", void 0, { "active": isPinned })}${attr("title", isPinned ? "Unpin" : "Pin")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-14rxm01"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg></button> <button class="modal-btn svelte-14rxm01" title="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-14rxm01"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="modal-body svelte-14rxm01"><div class="prop-row svelte-14rxm01"><span class="prop-key svelte-14rxm01">uid</span> <span class="prop-val svelte-14rxm01">${escape_html(node.uid)}</span></div> `);
			if (nodeType()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="prop-row svelte-14rxm01"><span class="prop-key svelte-14rxm01">type</span> <span class="prop-val svelte-14rxm01">${escape_html(nodeType())}</span></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <!--[-->`);
			const each_array = ensure_array_like(scalarProps());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let [key, value] = each_array[$$index];
				$$renderer.push(`<div class="prop-row svelte-14rxm01"><span class="prop-key svelte-14rxm01">${escape_html(key)}</span> <span class="prop-val svelte-14rxm01"${attr("title", value)}>${escape_html(value)}</span></div>`);
			}
			$$renderer.push(`<!--]--> `);
			if (node.connections?.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="edges-disclosure svelte-14rxm01"><button class="edges-toggle open svelte-14rxm01"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-14rxm01"><polyline points="6 9 12 15 18 9"></polyline></svg> <span>Connections (${escape_html(node.connections.length)})</span></button> <div class="edges-list svelte-14rxm01"><!--[-->`);
				const each_array_1 = ensure_array_like(node.connections);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let conn = each_array_1[$$index_1];
					if (conn.inView) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<button class="edge-item focus-edge svelte-14rxm01"><span class="edge-pred svelte-14rxm01">${escape_html(conn.type)}</span> <span class="edge-target-label svelte-14rxm01">${escape_html(conn.name)}</span></button>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div class="edge-item edge-dim svelte-14rxm01"><span class="edge-pred svelte-14rxm01">${escape_html(conn.type)}</span> <span class="edge-target-label svelte-14rxm01">${escape_html(conn.name)}</span> <span class="ext-marker-sm svelte-14rxm01">*</span></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else if (edges().length > 0) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="edges-disclosure svelte-14rxm01"><button${attr_class("edges-toggle svelte-14rxm01", void 0, { "open": edgesOpen })}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-14rxm01"><polyline points="6 9 12 15 18 9"></polyline></svg> <span>Edges (${escape_html(edges().length)})</span></button> `);
				if (edgesOpen) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div${attr_class("edges-list svelte-14rxm01", void 0, { "focus-nav": focusMode })}><!--[-->`);
					const each_array_2 = ensure_array_like(edges());
					for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
						let edge = each_array_2[$$index_2];
						$$renderer.push(`<button${attr_class("edge-item svelte-14rxm01", void 0, { "focus-edge": focusMode })}><span class="edge-dir svelte-14rxm01">${escape_html(edge.direction === "in" ? "←" : "→")}</span> <span class="edge-pred svelte-14rxm01">${escape_html(edge.predicate)}</span> <span class="edge-target-label svelte-14rxm01">${escape_html(edge.targetLabel)}</span></button>`);
					}
					$$renderer.push(`<!--]--></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/StatusBar.svelte
function StatusBar($$renderer, $$props) {
	let { status = "", activeLabel = "" } = $$props;
	$$renderer.push(`<div class="status-bar svelte-1piydef"><span class="status-text svelte-1piydef">${escape_html(status)}</span> `);
	if (activeLabel) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span class="active-badge svelte-1piydef">${escape_html(activeLabel)}</span>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
//#region src/lib/components/ModalConnections.svelte
function ModalConnections($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { modals = [], wasmEngine } = $$props;
		let lines = [];
		$$renderer.push(`<svg class="modal-connections svelte-1sryue2"><defs><marker id="conn-arrow" viewBox="0 0 10 6" refX="10" refY="3" markerWidth="10" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,3 L0,6" fill="var(--morpho-400)"></path></marker></defs><!--[-->`);
		const each_array = ensure_array_like(lines);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let line = each_array[$$index];
			$$renderer.push(`<line${attr("x1", line.x1)}${attr("y1", line.y1)}${attr("x2", line.x2)}${attr("y2", line.y2)} stroke="var(--morpho-500)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#conn-arrow)" opacity="0.6"></line><text${attr("x", line.mx)}${attr("y", line.my - 6)} text-anchor="middle" fill="var(--morpho-400)" font-size="10" font-family="var(--font-code)">${escape_html(line.label)}</text>`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region src/lib/components/EdgeLabels.svelte
function EdgeLabels($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { wasmEngine, selectedUid = null, showLabels = false, focusActive = false, fontSize = 9, nearFieldDepth = .35, graphGeneration = 0 } = $$props;
		let labels = [];
		let nodeLabels = [];
		let badges = [];
		$$renderer.push(`<div class="edge-labels svelte-pu86ay"><!--[-->`);
		const each_array = ensure_array_like(nodeLabels);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let nl = each_array[$$index];
			$$renderer.push(`<span class="node-label svelte-pu86ay"${attr_style(`left:${stringify(nl.x)}px; top:${stringify(nl.y)}px; opacity:${stringify(nl.alpha)}; font-size:${stringify(fontSize + 1)}px`)}>${escape_html(nl.text)}</span>`);
		}
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_1 = ensure_array_like(labels);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let label = each_array_1[$$index_1];
			$$renderer.push(`<span class="edge-label svelte-pu86ay"${attr_style(`left:${stringify(label.x)}px; top:${stringify(label.y)}px; opacity:${stringify(label.alpha)}; font-size:${stringify(fontSize)}px`)}>${escape_html(label.text)}</span>`);
		}
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_2 = ensure_array_like(badges);
		for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
			let badge = each_array_2[$$index_3];
			$$renderer.push(`<div class="spider-badge svelte-pu86ay"${attr_style(`left:${stringify(badge.x)}px; top:${stringify(badge.y)}px`)}><div class="spider-header svelte-pu86ay">${escape_html(badge.total)} relationships</div> <div class="spider-groups svelte-pu86ay"><!--[-->`);
			const each_array_3 = ensure_array_like(badge.groups);
			for (let $$index_2 = 0, $$length = each_array_3.length; $$index_2 < $$length; $$index_2++) {
				let g = each_array_3[$$index_2];
				$$renderer.push(`<span class="spider-group svelte-pu86ay"><span class="spider-pred svelte-pu86ay">${escape_html(g.pred)}</span> <span class="spider-count svelte-pu86ay">${escape_html(g.count)}</span></span>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/Compass.svelte
function Compass($$renderer, $$props) {
	let { angle = 0, onreset } = $$props;
	$$renderer.push(`<button class="compass svelte-2s2ljs" title="Reset rotation" aria-label="Reset canvas rotation"><svg viewBox="0 0 60 60" width="60" height="60"${attr_style(`transform: rotate(${stringify(-angle)}deg)`)}><circle cx="30" cy="30" r="27" fill="none" stroke="rgba(250,247,240,0.15)" stroke-width="1.5"></circle><!--[-->`);
	const each_array = ensure_array_like([
		0,
		90,
		180,
		270
	]);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let tick = each_array[$$index];
		$$renderer.push(`<line x1="30" y1="5" x2="30"${attr("y2", tick === 0 ? 10 : 8)}${attr("stroke", tick === 0 ? "rgba(42,149,200,0.9)" : "rgba(250,247,240,0.3)")}${attr("stroke-width", tick === 0 ? 2 : 1)}${attr("transform", `rotate(${stringify(tick)} 30 30)`)}></line>`);
	}
	$$renderer.push(`<!--]--><polygon points="30,6 27,16 33,16" fill="rgba(42,149,200,0.85)"></polygon><polygon points="30,54 27,44 33,44" fill="rgba(250,247,240,0.2)"></polygon><circle cx="30" cy="30" r="2.5" fill="rgba(250,247,240,0.25)"></circle></svg></button>`);
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let wasmEngine = null;
		let status = "Initializing...";
		let focusModeEnabled = false;
		let focusSubgraphActive = false;
		let glowDepth = loadConfig().focus.depth;
		let selectedUid = null;
		let pickMode = false;
		let pickedNode = null;
		let labelCfg = loadConfig().labels;
		let showLabels = labelCfg.enabled;
		let focusLabelsEnabled = false;
		let communityActive = false;
		let communityUids = [];
		let algoLabel = "";
		let focusNodeCount = 0;
		let effectiveShowLabels = derived(() => communityActive ? false : focusModeEnabled && focusSubgraphActive ? focusLabelsEnabled : showLabels);
		let activeLabel = derived(() => communityActive ? `${communityUids.length} active nodes · ${algoLabel}` : focusModeEnabled && focusSubgraphActive ? `${focusNodeCount} active nodes · focus depth ${glowDepth}` : "");
		let graphGeneration = 0;
		let is2D = false;
		let compassAngle = 0;
		let compassInterval = null;
		function startCompassPoll() {
			if (compassInterval) return;
			compassInterval = setInterval(() => {}, 50);
		}
		function stopCompassPoll() {
			if (compassInterval) {
				clearInterval(compassInterval);
				compassInterval = null;
			}
			compassAngle = 0;
		}
		function handleModeChange(v) {
			is2D = v;
			if (v) startCompassPoll();
			else stopCompassPoll();
		}
		function resetRotation() {
			compassAngle = 0;
		}
		let modals = [];
		let modalCounter = 0;
		function fetchNodeData(uid) {
			return { uid };
		}
		function handleNodeClick(uid) {
			if (pickMode && uid) {
				pickedNode = uid;
				return;
			}
			if (!uid) {
				modals = modals.filter((m) => m.pinned);
				selectedUid = null;
				return;
			}
			if (communityActive) {
				selectedUid = uid;
				if (modals.find((m) => m.uid === uid)) return;
				modals = modals.filter((m) => m.pinned);
				const nodeData = fetchNodeData(uid);
				modals = [...modals, {
					...nodeData,
					id: ++modalCounter,
					pinned: false
				}];
				return;
			}
			if (focusModeEnabled && wasmEngine?.is_in_focus && selectedUid) {
				if (!wasmEngine.is_in_focus(uid)) {
					modals = modals.filter((m) => m.pinned);
					selectedUid = null;
					wasmEngine.clear_selected_node();
					wasmEngine.clear_focus();
					focusSubgraphActive = false;
					return;
				}
			}
			selectedUid = uid;
			if (modals.find((m) => m.uid === uid)) return;
			modals = modals.filter((m) => m.pinned);
			const nodeData = fetchNodeData(uid);
			modals = [...modals, {
				...nodeData,
				id: ++modalCounter,
				pinned: false
			}];
		}
		function closeModal(id) {
			modals = modals.filter((m) => m.id !== id);
		}
		function togglePin(id) {
			modals = modals.map((m) => m.id === id ? {
				...m,
				pinned: !m.pinned
			} : m);
		}
		function flyToNode(uid) {}
		function focusNode(uid) {
			handleNodeClick(uid);
			flyToNode(uid);
		}
		function clearForNewQuery() {
			modals = modals.filter((m) => m.pinned);
			selectedUid = null;
			focusSubgraphActive = false;
			communityActive = false;
			communityUids = [];
			graphGeneration++;
		}
		function handleCommunitySelect(uids, label) {
			communityActive = true;
			communityUids = uids;
			algoLabel = label;
			focusSubgraphActive = false;
		}
		function handleCommunityDeselect() {
			communityActive = false;
			communityUids = [];
			algoLabel = "";
		}
		let isFullscreen = false;
		function toggleFullscreen() {
			if (!document.fullscreenElement) document.documentElement.requestFullscreen();
			else document.exitFullscreen();
		}
		{
			$$renderer.push("<!--[-1-->");
			Sidebar($$renderer, {
				status,
				wasmEngine,
				onclear: clearForNewQuery,
				focusNode,
				initialDepth: glowDepth,
				protocol: "cypher",
				demoMode: true,
				onfocustoggle: (v) => {
					if (v === focusModeEnabled) return;
					focusModeEnabled = v;
				},
				ondepthchange: (d) => {
					if (d === glowDepth) return;
					glowDepth = d;
					const cfg = loadConfig();
					cfg.focus.depth = d;
					saveConfig(cfg);
				},
				onlabelstoggle: (v) => {
					showLabels = v;
					labelCfg = loadConfig().labels;
				},
				onfocuslabelstoggle: (v) => {
					focusLabelsEnabled = v;
				},
				oncommunityselect: handleCommunitySelect,
				oncommunitydeselect: handleCommunityDeselect,
				ontogglefullscreen: toggleFullscreen,
				isFullscreen,
				onmodechange: handleModeChange,
				onpickstart: () => {
					pickMode = true;
					pickedNode = null;
				},
				onpickend: () => {
					pickMode = false;
					pickedNode = null;
				},
				pickedNode
			});
			$$renderer.push(`<!----> <div id="graph-container"${attr_class("svelte-1uha8ag", void 0, { "pick-mode": pickMode })}><canvas id="graph-canvas" class="svelte-1uha8ag"></canvas> `);
			EdgeLabels($$renderer, {
				wasmEngine,
				selectedUid,
				showLabels: effectiveShowLabels(),
				focusActive: focusSubgraphActive,
				fontSize: labelCfg.fontSize,
				nearFieldDepth: labelCfg.nearFieldDepth,
				graphGeneration
			});
			$$renderer.push(`<!----> `);
			StatusBar($$renderer, {
				status,
				activeLabel: activeLabel()
			});
			$$renderer.push(`<!----> `);
			if (is2D) {
				$$renderer.push("<!--[0-->");
				Compass($$renderer, {
					angle: compassAngle,
					onreset: resetRotation
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			ModalConnections($$renderer, {
				modals,
				wasmEngine
			});
			$$renderer.push(`<!----> <!--[-->`);
			const each_array = ensure_array_like(modals);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let modal = each_array[i];
				NodeModal($$renderer, {
					node: modal,
					pinnedCount: i,
					isPinned: modal.pinned,
					focusMode: focusModeEnabled,
					onclose: () => closeModal(modal.id),
					onpin: () => togglePin(modal.id),
					onflyto: flyToNode,
					onfocusnode: focusNode
				});
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
