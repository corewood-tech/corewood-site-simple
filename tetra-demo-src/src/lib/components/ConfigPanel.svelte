<!-- Visual configuration panel: Scale, Shape, Color, Focus, Labels -->
<script lang="ts">
  import { loadConfig, saveConfig, applyConfig, type TetraConfig } from '$lib/configStore';

  let { wasmEngine, onchange }: {
    wasmEngine: any;
    onchange: (config: TetraConfig) => void;
  } = $props();

  let config: TetraConfig = $state(loadConfig());
  let openSections: Set<string> = $state(new Set());
  let editingType: string | null = $state(null);

  // Discovered types and numeric properties from WASM
  let types: string[] = $state([]);
  let numericProps: string[] = $state(['connections']);
  let typeColors: Record<string, number[]> = $state({});

  const SHAPE_NAMES = ['Icosahedron', 'Octahedron', 'Dodecahedron', 'Tetrahedron', 'Cube', 'Sphere'];
  const ALGO_LABELS: [string, string][] = [['linear', 'LIN'], ['sqrt', 'SQRT'], ['log', 'LOG'], ['gaussian', 'GAUSS']];

  function isOpen(section: string): boolean { return openSections.has(section); }

  function toggle(section: string) {
    if (openSections.has(section)) {
      openSections.delete(section);
    } else {
      openSections.add(section);
    }
    openSections = new Set(openSections); // trigger reactivity
    // Refresh type/property lists when opening relevant sections
    if (section === 'nodes' && wasmEngine) {
      try { types = JSON.parse(wasmEngine.get_graph_types() || '[]'); } catch {}
      try { typeColors = JSON.parse(wasmEngine.get_graph_colors() || '{}'); } catch {}
      try { numericProps = JSON.parse(wasmEngine.get_numeric_properties() || '["connections"]'); } catch {}
    }
  }

  function update() {
    saveConfig(config);
    onchange(config);
  }

  function setAlgo(algo: string) {
    config.scale.algorithm = algo;
    update();
  }

  function setShape(type: string, idx: number) {
    config.shapes[type] = idx;
    update();
  }

  function setColor(type: string, hex: string) {
    config.colors[type] = hex;
    update();
  }

  function rgbToHex(rgb: number[]): string {
    if (!rgb || rgb.length < 3) return '#808080';
    const r = Math.round(rgb[0] * 255).toString(16).padStart(2, '0');
    const g = Math.round(rgb[1] * 255).toString(16).padStart(2, '0');
    const b = Math.round(rgb[2] * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  function getTypeColor(type: string): string {
    if (config.colors[type]) return config.colors[type];
    if (typeColors[type]) return rgbToHex(typeColors[type]);
    return '#808080';
  }

  function getTypeShape(type: string): number {
    if (config.shapes[type] !== undefined) return config.shapes[type];
    return 5; // default sphere
  }

  // Shape CSS clip-paths matching Legend component
  const SHAPE_CLIPS = [
    'polygon(50% 0%, 100% 38%, 81% 100%, 19% 100%, 0% 38%)',
    'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    'polygon(50% 0%, 100% 100%, 0% 100%)',
    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    'circle(50%)',
  ];
</script>

<div class="config-panel">
  <!-- LAYOUT -->
  <button class="config-header" onclick={() => toggle('layout')}>
    <span class="config-arrow" class:open={isOpen('layout')}>&#9654;</span>
    <span>Layout</span>
  </button>
  {#if isOpen('layout')}
    <div class="config-body">
      <div class="config-row">
        <span class="config-label">Mode</span>
        <div class="algo-btns">
          {#each [['physics', 'FORCE'], ['spherical', 'SPHERE'], ['radial', 'RADIAL']] as [val, label]}
            <button class="algo-btn" class:active={config.layout.mode === val}
              onclick={() => { config.layout.mode = val; update(); }}>{label}</button>
          {/each}
        </div>
      </div>
      {#if config.layout.mode === 'physics'}
        <div class="config-row">
          <span class="config-label">Repulsion</span>
          <input type="range" min="0.1" max="5" step="0.1"
            bind:value={config.layout.repulsionMult} onchange={update} />
          <span class="config-val">{config.layout.repulsionMult.toFixed(1)}x</span>
        </div>
        <div class="config-row">
          <span class="config-label">Springs</span>
          <input type="range" min="0.1" max="5" step="0.1"
            bind:value={config.layout.springMult} onchange={update} />
          <span class="config-val">{config.layout.springMult.toFixed(1)}x</span>
        </div>
        <div class="config-row">
          <span class="config-label">Damping</span>
          <input type="range" min="0.1" max="3" step="0.1"
            bind:value={config.layout.dampingMult} onchange={update} />
          <span class="config-val">{config.layout.dampingMult.toFixed(1)}x</span>
        </div>
        <div class="config-row">
          <span class="config-label">Center</span>
          <input type="range" min="0" max="5" step="0.1"
            bind:value={config.layout.centerMult} onchange={update} />
          <span class="config-val">{config.layout.centerMult.toFixed(1)}x</span>
        </div>
      {:else if config.layout.mode === 'spherical'}
        <div class="config-row">
          <span class="config-label">Size</span>
          <input type="range" min="0.3" max="3" step="0.1"
            bind:value={config.layout.sphereRadius} onchange={update} />
          <span class="config-val">{config.layout.sphereRadius.toFixed(1)}x</span>
        </div>
        <div class="config-row">
          <span class="config-label">Spacing</span>
          <input type="range" min="0.5" max="3" step="0.1"
            bind:value={config.layout.sphereSpacing} onchange={update} />
          <span class="config-val">{config.layout.sphereSpacing.toFixed(1)}x</span>
        </div>
      {:else if config.layout.mode === 'radial'}
        <div class="config-row">
          <span class="config-label">Spread</span>
          <input type="range" min="0.3" max="3" step="0.1"
            bind:value={config.layout.radialSpacing} onchange={update} />
          <span class="config-val">{config.layout.radialSpacing.toFixed(1)}x</span>
        </div>
      {/if}
    </div>
  {/if}

  <!-- NODES (size + color + shape per type) -->
  <button class="config-header" onclick={() => toggle('nodes')}>
    <span class="config-arrow" class:open={isOpen('nodes')}>&#9654;</span>
    <span>Nodes</span>
  </button>
  {#if isOpen('nodes')}
    <div class="config-body">
      {#if !config.scale.enabled}
        <div class="config-row">
          <span class="config-label">Size</span>
          <input type="range" min="0.5" max="20" step="0.5"
            bind:value={config.scale.minRadius} onchange={update} />
          <span class="config-val">{config.scale.minRadius}</span>
        </div>
      {/if}
      <div class="config-row">
        <label class="config-check">
          <input type="checkbox" bind:checked={config.scale.enabled} onchange={update} />
          <span>Scale by property</span>
        </label>
      </div>
      {#if config.scale.enabled}
        <div class="config-row config-sub">
          <span class="config-label">Property</span>
          <select class="config-select" bind:value={config.scale.property} onchange={update}>
            {#each numericProps as prop}
              <option value={prop}>{prop}</option>
            {/each}
          </select>
        </div>
        <div class="config-row config-sub">
          <span class="config-label">Algorithm</span>
          <div class="algo-btns">
            {#each ALGO_LABELS as [val, label]}
              <button class="algo-btn" class:active={config.scale.algorithm === val}
                onclick={() => setAlgo(val)}>{label}</button>
            {/each}
          </div>
        </div>
        <div class="config-row config-sub">
          <span class="config-label">Min</span>
          <input type="range" min="0.5" max="10" step="0.5"
            bind:value={config.scale.minRadius} onchange={update} />
          <span class="config-val">{config.scale.minRadius}</span>
        </div>
        <div class="config-row config-sub">
          <span class="config-label">Max</span>
          <input type="range" min="2" max="50" step="1"
            bind:value={config.scale.maxRadius} onchange={update} />
          <span class="config-val">{config.scale.maxRadius}</span>
        </div>
      {/if}

      <div class="nodes-divider"></div>

      <div class="type-list">
        {#each types as type}
          <div class="type-row">
            <div class="type-shape-preview" style="clip-path: {SHAPE_CLIPS[getTypeShape(type)]}; background: {getTypeColor(type)}"></div>
            <span class="type-name">{type}</span>
            <button class="type-edit-btn" onclick={() => editingType = editingType === type ? null : type}
              title="Edit color & shape">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          {#if editingType === type}
            <div class="type-editor">
              <div class="editor-section">
                <span class="editor-label">Color</span>
                <div class="editor-color-row">
                  <input type="color" value={getTypeColor(type)}
                    onchange={(e) => setColor(type, e.currentTarget.value)} />
                  <span class="editor-hex">{getTypeColor(type)}</span>
                </div>
              </div>
              <div class="editor-section">
                <span class="editor-label">Shape</span>
                <div class="editor-shape-grid">
                  {#each SHAPE_CLIPS as clip, i}
                    <button class="editor-shape-btn" class:active={getTypeShape(type) === i}
                      onclick={() => setShape(type, i)}
                      title={SHAPE_NAMES[i]}>
                      <div class="editor-shape-swatch" style="clip-path: {clip}; background: {getTypeColor(type)}"></div>
                      <span class="editor-shape-name">{SHAPE_NAMES[i]}</span>
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <!-- EDGES -->
  <button class="config-header" onclick={() => toggle('edges')}>
    <span class="config-arrow" class:open={isOpen('edges')}>&#9654;</span>
    <span>Edges</span>
  </button>
  {#if isOpen('edges')}
    <div class="config-body">
      <div class="config-row">
        <span class="config-label">Route</span>
        <div class="algo-btns">
          {#each [['straight', 'STRAIGHT'], ['angled', 'ANGLED'], ['curved', 'CURVED']] as [val, label]}
            <button class="algo-btn" class:active={config.edges.routeStyle === val}
              onclick={() => { config.edges.routeStyle = val; update(); }}>{label}</button>
          {/each}
        </div>
      </div>
      <div class="config-row">
        <label class="config-check">
          <input type="checkbox" bind:checked={config.edges.useNodeColors} onchange={update} />
          <span>Node colors</span>
        </label>
      </div>
      <div class="config-row" class:dimmed={config.edges.useNodeColors}>
        <span class="config-label">Source</span>
        <input type="color" value={config.edges.sourceColor}
          disabled={config.edges.useNodeColors}
          onchange={(e) => { config.edges.sourceColor = e.currentTarget.value; update(); }} />
        <span class="config-label" style="min-width:32px">Dest</span>
        <input type="color" value={config.edges.destColor}
          disabled={config.edges.useNodeColors}
          onchange={(e) => { config.edges.destColor = e.currentTarget.value; update(); }} />
      </div>
      <div class="config-row">
        <span class="config-label">Gradient</span>
        <input type="range" min="0.1" max="0.95" step="0.05"
          bind:value={config.edges.gradientPoint} onchange={update} />
        <span class="config-val">{Math.round(config.edges.gradientPoint * 100)}%</span>
      </div>
      <div class="config-row">
        <span class="config-label">Arrow</span>
        <div class="algo-btns">
          {#each [['none', 'NONE'], ['cone', 'CONE'], ['pyramid', 'PYRAMID']] as [val, label]}
            <button class="algo-btn" class:active={config.edges.arrowStyle === val}
              onclick={() => { config.edges.arrowStyle = val; update(); }}>{label}</button>
          {/each}
        </div>
      </div>
      {#if config.edges.arrowStyle !== 'none'}
        <div class="config-row config-sub">
          <span class="config-label">Size</span>
          <input type="range" min="0.25" max="5" step="0.25"
            bind:value={config.edges.arrowSize} onchange={update} />
          <span class="config-val">{config.edges.arrowSize.toFixed(1)}</span>
        </div>
      {/if}
      <div class="config-row">
        <span class="config-label">Opacity</span>
        <input type="range" min="0.1" max="1.0" step="0.05"
          bind:value={config.edges.opacity} onchange={update} />
        <span class="config-val">{Math.round(config.edges.opacity * 100)}%</span>
      </div>
      <div class="config-row">
        <span class="config-label">Thickness</span>
        <input type="range" min="0" max="5" step="0.25"
          bind:value={config.edges.thickness} onchange={update} />
        <span class="config-val">{config.edges.thickness.toFixed(1)}</span>
      </div>
    </div>
  {/if}

  <!-- LABELS -->
  <button class="config-header" onclick={() => toggle('labels')}>
    <span class="config-arrow" class:open={isOpen('labels')}>&#9654;</span>
    <span>Labels</span>
    <span class="config-toggle" onclick={(e) => e.stopPropagation()} role="presentation">
      <span class="toggle-switch toggle-sm" class:active={config.labels.enabled}
        onclick={() => { config.labels.enabled = !config.labels.enabled; update(); }}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); config.labels.enabled = !config.labels.enabled; update(); }}}
        role="switch" aria-checked={config.labels.enabled} tabindex="0">
        <span class="toggle-knob"></span>
      </span>
    </span>
  </button>
  {#if isOpen('labels')}
    <div class="config-body" class:dimmed={!config.labels.enabled}>
      <div class="config-row">
        <span class="config-label">Size</span>
        <input type="range" min="7" max="16" step="1"
          bind:value={config.labels.fontSize} onchange={update} />
        <span class="config-val">{config.labels.fontSize}px</span>
      </div>
      <div class="config-row">
        <span class="config-label">Distance</span>
        <input type="range" min="0.1" max="1.0" step="0.05"
          bind:value={config.labels.nearFieldDepth} onchange={update} />
        <span class="config-val">{Math.round(config.labels.nearFieldDepth * 100)}%</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .config-panel {
    display: flex;
    flex-direction: column;
    gap: 0;
    border-top: 1px solid rgba(42,149,200,0.06);
    border-bottom: 1px solid rgba(42,149,200,0.06);
  }

  .config-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: none;
    border: none;
    border-bottom: 1px solid rgba(42,149,200,0.04);
    color: var(--cream-400);
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: color 0.15s;
    width: 100%;
    text-align: left;
  }
  .config-header:hover { color: var(--morpho-400); }
  .config-arrow { font-size: 7px; transition: transform 0.15s; display: inline-block; }
  .config-arrow.open { transform: rotate(90deg); }
  .config-toggle { margin-left: auto; cursor: pointer; display: flex; align-items: center; }
  .config-toggle :global(.toggle-sm) { width: 28px; height: 16px; }
  .config-toggle :global(.toggle-sm .toggle-knob) { width: 12px; height: 12px; }
  .config-toggle :global(.toggle-sm.active .toggle-knob) { transform: translateX(12px); }

  .config-body {
    padding: 4px 14px 8px 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: opacity 0.15s;
  }
  .config-body.dimmed { opacity: 0.3; pointer-events: none; }
  .config-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .config-row.config-sub { padding-left: 12px; }
  .config-row.dimmed { opacity: 0.3; pointer-events: none; }
  .config-check {
    display: flex; align-items: center; gap: 4px;
    font-size: 9px; color: var(--cream-500); cursor: pointer;
    text-transform: uppercase; letter-spacing: 0.3px; font-weight: 500;
  }
  .config-check input { accent-color: var(--morpho-500); width: 12px; height: 12px; cursor: pointer; }
  .config-label {
    font-size: 9px;
    color: var(--cream-600);
    min-width: 48px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    font-weight: 500;
  }
  .config-val {
    font-family: var(--font-code);
    font-size: 9px;
    color: var(--cream-500);
    min-width: 30px;
    text-align: right;
  }
  .config-select {
    flex: 1;
    background: var(--forest-900);
    color: var(--cream-200);
    border: 1px solid rgba(42,149,200,0.12);
    border-radius: 3px;
    padding: 2px 4px;
    font-family: var(--font-code);
    font-size: 9px;
  }
  input[type="range"] {
    flex: 1;
    accent-color: var(--morpho-500);
    height: 4px;
  }

  .algo-btns {
    display: flex;
    gap: 2px;
  }
  .algo-btn {
    padding: 2px 6px;
    font-family: var(--font-code);
    font-size: 8px;
    font-weight: 600;
    background: rgba(15,59,36,0.5);
    border: 1px solid rgba(42,149,200,0.12);
    border-radius: 3px;
    color: var(--cream-600);
    cursor: pointer;
    transition: all 0.15s;
  }
  .algo-btn:hover { background: rgba(42,149,200,0.1); color: var(--morpho-400); }
  .algo-btn.active { background: rgba(26,92,53,0.7); border-color: var(--morpho-400); color: var(--cream-100); }

  .nodes-divider {
    height: 1px;
    background: rgba(42,149,200,0.08);
    margin: 4px 0;
  }
  .type-list {
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .type-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 0;
  }
  .type-shape-preview {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
  }
  .type-name {
    flex: 1;
    font-family: var(--font-code);
    font-size: 9px;
    color: var(--cream-400);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .type-edit-btn {
    width: 18px;
    height: 18px;
    padding: 2px;
    background: none;
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
    color: var(--cream-700);
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .type-edit-btn svg { width: 11px; height: 11px; }
  .type-edit-btn:hover { color: var(--morpho-400); border-color: rgba(42,149,200,0.2); }

  .type-editor {
    padding: 6px 0 6px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-left: 2px solid rgba(42,149,200,0.12);
    margin-left: 5px;
  }
  .editor-section {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .editor-label {
    font-size: 8px;
    color: var(--cream-700);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
  .editor-color-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .editor-color-row input[type="color"] {
    width: 28px;
    height: 20px;
    border: 1px solid rgba(42,149,200,0.15);
    border-radius: 3px;
    padding: 0;
    cursor: pointer;
    background: none;
  }
  .editor-hex {
    font-family: var(--font-code);
    font-size: 9px;
    color: var(--cream-600);
  }
  .editor-shape-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .editor-shape-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 5px;
    background: rgba(15,59,36,0.3);
    border: 1px solid rgba(42,149,200,0.08);
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s;
    color: var(--cream-600);
  }
  .editor-shape-btn:hover { background: rgba(42,149,200,0.08); border-color: rgba(42,149,200,0.2); }
  .editor-shape-btn.active { background: rgba(26,92,53,0.5); border-color: var(--morpho-400); color: var(--cream-200); }
  .editor-shape-swatch {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
  }
  .editor-shape-name {
    font-family: var(--font-code);
    font-size: 7px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  input[type="color"] {
    width: 24px;
    height: 18px;
    border: 1px solid rgba(42,149,200,0.12);
    border-radius: 3px;
    padding: 0;
    cursor: pointer;
    background: none;
  }
</style>
