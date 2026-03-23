<!-- Legend: node types with shape/color, edge direction indicator -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { loadConfig } from '$lib/configStore';

  let { wasmEngine }: { wasmEngine?: any } = $props();

  // Edge colors from config (refreshed periodically)
  let edgeSourceColor = $state('#2A95C8');
  let edgeDestColor = $state('#E23D28');
  let edgeUseNodeColors = $state(false);
  let edgeGradientPoint = $state(0.8);

  const FALLBACK_PALETTE = ['#4e79a7','#f28e2b','#e15759','#76b7b2','#59a14f','#edc948','#b07aa1','#ff9da7','#9c755f','#bab0ac'];

  // CSS clip-paths matching 3D shapes (same index order)
  const SHAPE_CLIPS = [
    'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',  // pentagon (icosahedron)
    'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',            // diamond (octahedron)
    'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // hexagon (dodecahedron)
    'polygon(50% 0%, 100% 100%, 0% 100%)',                     // triangle (tetrahedron)
    'none',                                                     // square (cube)
    'circle(50%)',                                              // circle (sphere)
  ];

  let types: string[] = $state([]);
  let shapeMap: Record<string, number> = $state({});
  let colorMap: Record<string, [number, number, number]> = $state({});

  /** Convert [r,g,b] floats (0-1) to hex string */
  function rgbToHex(rgb: [number, number, number]): string {
    const r = Math.round(rgb[0] * 255);
    const g = Math.round(rgb[1] * 255);
    const b = Math.round(rgb[2] * 255);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  function refresh() {
    if (!wasmEngine?.get_graph_types) return;
    try {
      types = JSON.parse(wasmEngine.get_graph_types() || '[]');
    } catch {}
    // Refresh edge config from persisted config
    try {
      const cfg = loadConfig();
      edgeSourceColor = cfg.edges.sourceColor;
      edgeDestColor = cfg.edges.destColor;
      edgeUseNodeColors = cfg.edges.useNodeColors;
      edgeGradientPoint = cfg.edges.gradientPoint;
    } catch {}
    if (wasmEngine?.get_graph_shapes) {
      try {
        shapeMap = JSON.parse(wasmEngine.get_graph_shapes() || '{}');
      } catch {}
    }
    if (wasmEngine?.get_graph_colors) {
      try {
        colorMap = JSON.parse(wasmEngine.get_graph_colors() || '{}');
      } catch {}
    }
  }

  onMount(() => {
    const interval = setInterval(refresh, 1000);
    refresh();
    return () => clearInterval(interval);
  });

  $effect(() => { if (wasmEngine) refresh(); });

  function swatchStyle(type: string, colorIdx: number): string {
    // Use actual engine color if available, fall back to palette
    const color = colorMap[type]
      ? rgbToHex(colorMap[type])
      : FALLBACK_PALETTE[colorIdx % FALLBACK_PALETTE.length];
    const shapeIdx = shapeMap[type] ?? 5;
    const clip = SHAPE_CLIPS[shapeIdx] ?? 'circle(50%)';
    let style = `background: ${color};`;
    if (shapeIdx === 4) {
      style += ' border-radius: 2px;';
    } else {
      style += ` clip-path: ${clip}; border-radius: 0;`;
    }
    return style;
  }
</script>

<div class="legend">
  <div class="legend-header">Types</div>

  {#if types.length > 0}
    <div class="legend-items">
      {#each types as type, i}
        <div class="legend-item">
          <span class="legend-swatch" style={swatchStyle(type, i)}></span>
          <span class="legend-label">{type}</span>
        </div>
      {/each}
    </div>
  {:else}
    <div class="legend-empty">No data loaded</div>
  {/if}

  <div class="legend-header edge-header">Edges</div>
  <div class="edge-key">
    {#if edgeUseNodeColors}
      <div class="edge-node-colors">
        <span class="edge-nc-label">colored by node type</span>
      </div>
    {:else}
      <svg class="edge-sample" viewBox="0 0 120 12" preserveAspectRatio="none">
        <defs>
          <linearGradient id="edge-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stop-color={edgeSourceColor}/>
            <stop offset="{Math.round(edgeGradientPoint * 100)}%" stop-color={edgeSourceColor}/>
            <stop offset="100%" stop-color={edgeDestColor}/>
          </linearGradient>
        </defs>
        <rect x="0" y="3" width="120" height="6" rx="2" fill="url(#edge-grad)"/>
      </svg>
    {/if}
    <div class="edge-labels">
      <span class="edge-from" style="color: {edgeUseNodeColors ? 'var(--cream-500)' : edgeSourceColor}">source</span>
      <span class="edge-arrow">direction &rarr;</span>
      <span class="edge-to" style="color: {edgeUseNodeColors ? 'var(--cream-500)' : edgeDestColor}">target</span>
    </div>
  </div>
</div>

<style>
  .legend {
    position: absolute;
    bottom: 40px; right: 170px; z-index: 5;
    background: rgba(6,21,13,0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(42,149,200,0.12);
    border-radius: 6px;
    padding: 6px 0;
    min-width: 100px;
  }

  .legend-header {
    padding: 2px 10px 3px;
    font-size: 9px; font-weight: 600; color: var(--cream-600);
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .edge-header {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid rgba(42,149,200,0.08);
  }

  .legend-items {
    display: flex; flex-wrap: wrap; gap: 4px 10px;
    padding: 2px 10px 4px;
  }
  .legend-item {
    display: flex; align-items: center; gap: 5px;
  }
  .legend-swatch {
    width: 12px; height: 12px; flex-shrink: 0;
  }
  .legend-label {
    font-size: 11px; color: var(--cream-300); white-space: nowrap;
  }
  .legend-empty {
    padding: 2px 10px; font-size: 10px; color: var(--cream-700); font-style: italic;
  }

  .edge-key {
    padding: 2px 10px 0;
  }
  .edge-node-colors {
    height: 8px; display: flex; align-items: center; justify-content: center;
  }
  .edge-nc-label {
    font-size: 7px; color: var(--cream-600); font-style: italic; letter-spacing: 0.3px;
  }
  .edge-sample {
    width: 100%; height: 8px; display: block;
    border-radius: 2px; overflow: visible;
  }
  .edge-labels {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 1px;
  }
  .edge-from {
    font-size: 8px; font-weight: 500;
  }
  .edge-arrow {
    font-size: 8px; color: var(--cream-700); letter-spacing: 0.3px;
  }
  .edge-to {
    font-size: 8px; font-weight: 500;
  }
</style>
