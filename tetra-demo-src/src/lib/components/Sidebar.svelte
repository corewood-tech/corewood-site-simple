<!-- Source: 0x272d Sidebar Toggle + 0x2732 Help/Hints + dgraph_viewer layout -->
<script lang="ts">
  import AlgorithmPanel from './AlgorithmPanel.svelte';
  import Legend from './Legend.svelte';
  import Gizmo from './Gizmo.svelte';
  import ConfigPanel from './ConfigPanel.svelte';
  import { applyConfig, loadConfig, saveConfig, type TetraConfig } from '$lib/configStore';

  let { status = '', onquery, onopenquery, onopenschema, onclear, wasmEngine, focusNode, onfocustoggle, ondepthchange, ontogglefullscreen, onlabelstoggle, onfocuslabelstoggle, oncommunityselect, oncommunitydeselect, ondiscoverynodes, oncleardiscovery, oninspectexternal, isFullscreen = false, onpickstart, onpickend, pickedNode, initialDepth = 3, protocol = 'dql', demoMode = false }: {
    status: string;
    onquery?: (q: string) => void;
    onopenquery?: () => void;
    onopenschema?: () => void;
    onclear?: () => void;
    wasmEngine: any;
    focusNode?: (uid: string) => void;
    onfocustoggle?: (enabled: boolean) => void;
    ondepthchange?: (depth: number) => void;
    ontogglefullscreen?: () => void;
    onlabelstoggle?: (enabled: boolean) => void;
    onfocuslabelstoggle?: (enabled: boolean) => void;
    oncommunityselect?: (uids: string[], label: string) => void;
    oncommunitydeselect?: () => void;
    ondiscoverynodes?: (nodes: any[]) => void;
    oncleardiscovery?: () => void;
    oninspectexternal?: (data: any) => void;
    isFullscreen?: boolean;
    onmodechange?: (is2d: boolean) => void;
    onpickstart?: () => void;
    onpickend?: () => void;
    pickedNode?: string | null;
    initialDepth?: number;
    protocol?: string;
    demoMode?: boolean;
  } = $props();

  let controlsOpen = $state(false);
  let backlightOn = $state(loadConfig().backlight);

  let collapsed = $state(false);
  let shapes = $state(true);
  let scaleByConns = $state(true);
  let focusMode = $state(false);
  let focusLabels = $state(false);
  let showLabels = $state(false);
  let is3D = $state(true);
  // svelte-ignore state_referenced_locally
  let glowDepth = $state(initialDepth);

  // Fly-to search
  interface NodeSummary { uid: string; name: string; type: string; }
  let searchQuery = $state('');
  let searchOpen = $state(false);
  let searchNodes: NodeSummary[] = $state([]);
  let searchHighlight = $state(0);

  function refreshSearchNodes() {
    if (!wasmEngine?.get_all_nodes) return;
    try { searchNodes = JSON.parse(wasmEngine.get_all_nodes()); } catch { searchNodes = []; }
  }

  function searchResults(): NodeSummary[] {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return searchNodes.slice(0, 50);
    return searchNodes.filter(n =>
      n.uid.toLowerCase().includes(q) ||
      n.name.toLowerCase().includes(q) ||
      n.type.toLowerCase().includes(q)
    ).slice(0, 50);
  }

  function selectSearchResult(node: NodeSummary) {
    searchQuery = '';
    searchOpen = false;
    if (focusNode) focusNode(node.uid);
  }

  function onSearchKeydown(e: KeyboardEvent) {
    const results = searchResults();
    if (e.key === 'ArrowDown') { e.preventDefault(); searchHighlight = Math.min(searchHighlight + 1, results.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); searchHighlight = Math.max(searchHighlight - 1, 0); }
    else if (e.key === 'Enter' && results.length > 0) { e.preventDefault(); selectSearchResult(results[searchHighlight]); }
    else if (e.key === 'Escape') { searchOpen = false; }
  }

  function toggleSidebar() {
    collapsed = !collapsed;
    setTimeout(() => window.dispatchEvent(new Event('resize')), 320);
  }

  function stepDepth(dir: number) {
    const next = Math.max(1, Math.min(20, glowDepth + dir));
    if (next === glowDepth) return;
    glowDepth = next;
    if (wasmEngine) wasmEngine.set_config('glow_depth', String(glowDepth));
    if (ondepthchange) ondepthchange(glowDepth);
  }

  function onShapesChange() {
    shapes = !shapes;
    if (wasmEngine) {
      wasmEngine.set_config('shapes', shapes ? '1' : '0');
      // TODO: rebuild with different geometries when shape system is implemented
    }
  }
  function onScaleChange() {
    scaleByConns = !scaleByConns;
    if (wasmEngine) {
      wasmEngine.set_config('scale', scaleByConns ? '1' : '0');
      wasmEngine.set_config('rebuild', '1'); // trigger GPU buffer rebuild
    }
  }
  function onFocusChange() {
    focusMode = !focusMode;
    if (wasmEngine) wasmEngine.set_config('focus', focusMode ? '1' : '0');
    if (onfocustoggle) onfocustoggle(focusMode);
  }
  function onLabelsChange() {
    showLabels = !showLabels;
    if (onlabelstoggle) onlabelstoggle(showLabels);
  }
  function switchMode() {
    is3D = !is3D;
    if (wasmEngine) wasmEngine.set_2d_mode(!is3D);
    if (onmodechange) onmodechange(!is3D);
  }

  function handleConfigChange(cfg: TetraConfig) {
    applyConfig(cfg, wasmEngine);
    backlightOn = cfg.backlight;
    if (onlabelstoggle) onlabelstoggle(cfg.labels.enabled);
  }

  function runAll() {
    onquery('MATCH (n)-[r]->(m) RETURN n, r, m');
  }
  function clearGraph() {
    if (wasmEngine) wasmEngine.clear_graph();
    if (onclear) onclear();
  }
  function resetView() {
    if (wasmEngine) wasmEngine.reset_view();
  }
</script>

<div id="sidebar" class:collapsed class:demo-mode={demoMode}>
  <div class="sidebar-header">
    <img src={demoMode ? "/tetra-demo/tetra-logo.svg" : "/tetra-logo.svg"} alt="Tetra" class="sidebar-logo" />
    {#if !collapsed}
      <div class="query-area">
        {#if !demoMode}
        <div class="btn-row">
          <button class="btn btn-primary" onclick={onopenquery}>
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Query
          </button>
          <button class="btn" onclick={runAll}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            All
          </button>
          <button class="btn" onclick={onopenschema}>
            <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Schema
          </button>
        </div>
        {/if}
        <div class="btn-row">
          <button class="btn" onclick={resetView}>
            <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Reset
          </button>
          {#if !demoMode}
          <button class="btn" onclick={clearGraph}>
            <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            Clear
          </button>
          {/if}
        </div>

        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" class="search-input" placeholder="Find node..."
            bind:value={searchQuery}
            oninput={() => { searchOpen = true; searchHighlight = 0; if (searchNodes.length === 0) refreshSearchNodes(); }}
            onfocus={() => { searchOpen = true; if (searchNodes.length === 0) refreshSearchNodes(); }}
            onblur={() => setTimeout(() => { searchOpen = false; }, 150)}
            onkeydown={onSearchKeydown} />
          {#if searchQuery}
            <button class="search-clear" onclick={() => { searchQuery = ''; searchOpen = false; }}>×</button>
          {/if}
          {#if searchOpen && searchQuery}
            {@const results = searchResults()}
            {#if results.length > 0}
              <div class="search-dropdown">
                {#each results as node, i}
                  <button class="search-item" class:highlighted={i === searchHighlight}
                    onmousedown={() => selectSearchResult(node)}>
                    <span class="search-name">{node.name || node.uid}</span>
                    <span class="search-meta">{node.type}</span>
                  </button>
                {/each}
              </div>
            {:else}
              <div class="search-dropdown">
                <div class="search-empty">No matches</div>
              </div>
            {/if}
          {/if}
        </div>

        <div class="toggle-row">
          <span class="toggle-label" class:active={!is3D}>2D</span>
          <button type="button" class="toggle-switch" class:active={is3D} onclick={switchMode} role="switch" aria-checked={is3D} aria-label="Toggle 3D mode">
            <div class="toggle-knob"></div>
          </button>
          <span class="toggle-label" class:active={is3D}>3D</span>
          <button class="fullscreen-btn" onclick={ontogglefullscreen}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              {#if isFullscreen}
                <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
                <line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
              {:else}
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              {/if}
            </svg>
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>

        <div class="toggle-row">
          <button type="button" class="toggle-switch" class:active={focusMode} onclick={onFocusChange} role="switch" aria-checked={focusMode} aria-label="Toggle focus mode">
            <div class="toggle-knob"></div>
          </button>
          <span class="toggle-label" class:active={focusMode}>Focus</span>
          <div class="depth-control" class:disabled={!focusMode}>
            <div class="depth-stepper">
              <button class="depth-step" onclick={() => stepDepth(-1)} disabled={glowDepth <= 1} aria-label="Decrease focus depth">
                <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span class="depth-value">{glowDepth}</span>
              <button class="depth-step" onclick={() => stepDepth(1)} disabled={glowDepth >= 20} aria-label="Increase focus depth">
                <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
          <div class="focus-labels-toggle" class:disabled={!focusMode}>
            <button type="button" class="toggle-switch toggle-sm" class:active={focusLabels}
              onclick={() => { focusLabels = !focusLabels; if (onfocuslabelstoggle) onfocuslabelstoggle(focusLabels); }}
              role="switch" aria-checked={focusLabels} aria-label="Toggle focus labels">
              <div class="toggle-knob"></div>
            </button>
            <span class="toggle-label-sm">Labels</span>
          </div>
        </div>

        <!-- Config options handled by ConfigPanel below -->
      </div>
    {/if}
  </div>
  {#if !collapsed}
    <div class="sidebar-status">{status}</div>

    <AlgorithmPanel {wasmEngine} onfocusnode={focusNode} {oninspectexternal} {onpickstart} {onpickend} {pickedNode} onalgoselect={oncommunityselect} onalgodeselect={oncommunitydeselect} {ondiscoverynodes} {oncleardiscovery} {demoMode} />

    <ConfigPanel {wasmEngine} onchange={handleConfigChange} />

    <div class="sidebar-section gizmo-section">
      <Gizmo {wasmEngine} backlight={backlightOn} onbacklight={(on) => {
        backlightOn = on;
        const cfg = loadConfig();
        cfg.backlight = on;
        saveConfig(cfg);
        applyConfig(cfg, wasmEngine);
      }} />
    </div>

    <div class="sidebar-section">
      <Legend {wasmEngine} />
    </div>

    <div class="sidebar-bottom">
      <button class="hint-toggle" onclick={() => controlsOpen = !controlsOpen}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          {#if controlsOpen}
            <polyline points="6 9 12 15 18 9"/>
          {:else}
            <polyline points="18 15 12 9 6 15"/>
          {/if}
        </svg>
        <span>Controls</span>
      </button>
      {#if controlsOpen}
        <table class="controls-table">
          <thead><tr><th colspan="2">Camera</th></tr></thead>
          <tbody>
            <tr><td>Left-drag</td><td>Orbit</td></tr>
            <tr><td>Shift + drag</td><td>Pan</td></tr>
            <tr><td>Scroll</td><td>Zoom</td></tr>
            <tr><td>Middle-drag</td><td>Tilt</td></tr>
            <tr><td>Ctrl + drag</td><td>Free-look</td></tr>
          </tbody>
          <thead><tr><th colspan="2">Nodes</th></tr></thead>
          <tbody>
            <tr><td>Click</td><td>Select</td></tr>
            <tr><td>Shift + drag</td><td>Move node</td></tr>
            <tr><td>Arrows</td><td>Move X / Y</td></tr>
            <tr><td>Shift + arrows</td><td>Move Z</td></tr>
          </tbody>
        </table>
      {/if}

      <div class="sidebar-copyright">&copy; Corewood LLC 2026</div>
    </div>
  {/if}
</div>

<!-- Tab on the outside edge of the sidebar panel -->
<button class="sidebar-tab" class:tab-collapsed={collapsed} onclick={toggleSidebar} title="Toggle sidebar">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    {#if collapsed}
      <polyline points="9 18 15 12 9 6"/>
    {:else}
      <polyline points="15 18 9 12 15 6"/>
    {/if}
  </svg>
</button>

<style>
  #sidebar {
    width: 340px; min-width: 280px;
    background: linear-gradient(180deg, rgba(11,43,26,0.95) 0%, rgba(6,21,13,0.98) 100%);
    border-right: 1px solid rgba(42,149,200,0.12);
    display: flex; flex-direction: column; z-index: 10;
    transition: width 0.25s ease, min-width 0.25s ease;
    overflow-y: auto; overflow-x: hidden;
  }
  #sidebar.collapsed { width: 0; min-width: 0; border-right: none; overflow: hidden; }

  /* ── Header panel ── */
  .sidebar-header {
    padding: 12px 14px;
    border-bottom: 1px solid rgba(42,149,200,0.08);
  }
  #sidebar.demo-mode .sidebar-header {
    padding-top: 80px;
  }
  .sidebar-logo {
    width: 85%; max-width: 240px; height: auto; margin: 0 auto 4px; display: block;
  }
  .query-area { display: flex; flex-direction: column; gap: 6px; padding: 6px 14px; }

  /* ── Button rows ── */
  .btn-row { display: flex; gap: 4px; }
  .btn {
    flex: 1; padding: 6px 8px;
    border: 1px solid rgba(42,149,200,0.12); border-radius: 4px;
    background: rgba(15,59,36,0.6); color: var(--cream-300);
    font-family: var(--font-body); font-size: 11px; font-weight: 500;
    cursor: pointer; transition: all 0.15s ease;
    display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  }
  .btn svg { width: 12px; height: 12px; stroke: currentColor; stroke-width: 2; fill: none; flex-shrink: 0; }
  .btn:hover { background: rgba(42,149,200,0.1); border-color: var(--morpho-400); color: var(--morpho-300); }
  .btn:hover svg { stroke: var(--morpho-300); }
  .btn-primary { background: rgba(26,92,53,0.7); border-color: rgba(42,149,200,0.2); color: var(--cream-100); }
  .btn-primary:hover { background: rgba(42,149,200,0.15); border-color: var(--morpho-400); box-shadow: 0 0 8px rgba(42,149,200,0.15); }

  /* ── Etched separator ── */
  .query-area > :nth-child(n+2) {
    padding-top: 6px;
  }

  /* ── Search bar ── */
  .search-bar {
    position: relative; display: flex; align-items: center;
    background: rgba(6,21,13,0.6); border: 1px solid rgba(42,149,200,0.12);
    border-radius: 4px; padding: 0 6px; gap: 4px;
  }
  .search-icon { width: 13px; height: 13px; flex-shrink: 0; color: var(--cream-700); }
  .search-input {
    flex: 1; background: none; border: none; outline: none;
    color: var(--cream-200); font-family: var(--font-body); font-size: 11px;
    padding: 5px 0; min-width: 0;
  }
  .search-input::placeholder { color: var(--cream-800); }
  .search-clear {
    background: none; border: none; color: var(--cream-600); cursor: pointer;
    font-size: 14px; padding: 0 2px; line-height: 1;
  }
  .search-clear:hover { color: var(--cream-300); }
  .search-dropdown {
    position: absolute; top: 100%; left: 0; right: 0; z-index: 30;
    background: rgba(11,43,26,0.97); border: 1px solid rgba(42,149,200,0.15);
    border-top: none; border-radius: 0 0 4px 4px;
    max-height: 200px; overflow-y: auto;
    backdrop-filter: blur(8px);
  }
  .search-item {
    display: flex; align-items: center; gap: 6px; width: 100%;
    padding: 5px 8px; background: none; border: none;
    color: var(--cream-300); font-family: var(--font-body); font-size: 11px;
    cursor: pointer; text-align: left; transition: background 0.1s;
  }
  .search-item:hover, .search-item.highlighted { background: rgba(42,149,200,0.12); }
  .search-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .search-meta { font-size: 9px; color: var(--cream-700); flex-shrink: 0; }
  .search-empty { padding: 8px; font-size: 10px; color: var(--cream-700); text-align: center; font-style: italic; }

  /* ── Mode toggle row ── */
  .toggle-row {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 0;
    border-top: 1px solid rgba(42,149,200,0.06);
    border-bottom: 1px solid rgba(42,149,200,0.06);
  }
  .toggle-row .fullscreen-btn { margin-left: auto; }
  .toggle-label { font-size: 11px; color: var(--cream-700); font-weight: 600; transition: color 0.2s; }
  .toggle-label.active { color: var(--morpho-400); }

  /* ── Depth control ── */
  .depth-control {
    display: flex; align-items: center; gap: 2px; margin-left: auto;
    transition: opacity 0.2s;
  }
  .depth-control.disabled { opacity: 0.2; pointer-events: none; }
  .depth-stepper {
    display: flex; align-items: center;
    border: 1px solid rgba(42,149,200,0.15); border-radius: 3px;
    overflow: hidden; background: rgba(6,21,13,0.6);
  }
  .depth-value {
    width: 18px; text-align: center; color: var(--cream-200);
    font-family: var(--font-code); font-size: 11px; font-weight: 600;
  }
  .depth-step {
    display: flex; align-items: center; justify-content: center;
    width: 18px; height: 20px; background: rgba(15,59,36,0.5); color: var(--cream-600);
    border: none; cursor: pointer; transition: all 0.15s; padding: 0;
  }
  .depth-step svg { width: 10px; height: 10px; stroke: currentColor; stroke-width: 2.5; fill: none; }
  .depth-step:hover { background: rgba(42,149,200,0.15); color: var(--morpho-400); }
  .depth-step:disabled { cursor: default; }

  .focus-labels-toggle {
    display: flex; align-items: center; gap: 4px; margin-left: 6px;
    transition: opacity 0.2s;
  }
  .focus-labels-toggle.disabled { opacity: 0.2; pointer-events: none; }
  .toggle-label-sm { font-size: 10px; color: var(--cream-600); font-weight: 500; }

  /* ── Status bar ── */
  .sidebar-status {
    padding: 6px 14px; font-size: 10px; color: var(--cream-700);
    border-bottom: 1px solid rgba(42,149,200,0.06);
    font-family: var(--font-code); letter-spacing: 0.3px;
  }

  /* ── Sidebar sections (legend, controls, footer) ── */
  .sidebar-section {
    padding: 6px 14px;
    border-top: 1px solid rgba(42,149,200,0.06);
  }
  .sidebar-section :global(.legend) {
    position: static; bottom: auto; right: auto;
    background: none; backdrop-filter: none; border: none;
    border-radius: 0; padding: 0; min-width: 0;
  }

  .gizmo-section {
    display: flex; justify-content: center;
    padding: 4px 14px;
  }

  .sidebar-bottom {
    padding: 6px 14px 10px;
    border-top: 1px solid rgba(42,149,200,0.06);
    margin-top: auto;
    display: flex; flex-direction: column; gap: 4px;
  }

  .fullscreen-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 8px; background: rgba(15,59,36,0.6);
    border: 1px solid rgba(42,149,200,0.12); border-radius: 3px;
    color: var(--cream-600); font-family: inherit; font-size: 9px;
    font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;
    cursor: pointer; transition: all 0.15s; align-self: flex-start;
  }
  .fullscreen-btn svg { width: 10px; height: 10px; flex-shrink: 0; }
  .fullscreen-btn:hover { background: rgba(42,149,200,0.1); color: var(--morpho-400); border-color: var(--morpho-400); }

  .hint-toggle {
    display: flex; align-items: center; gap: 6px; width: 100%;
    padding: 4px 0; background: none; border: none;
    color: var(--cream-600); font-family: inherit; font-size: 10px;
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    cursor: pointer; transition: color 0.15s;
  }
  .hint-toggle:hover { color: var(--morpho-400); }
  .hint-toggle svg { width: 10px; height: 10px; flex-shrink: 0; }

  .controls-table {
    width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 4px;
  }
  .controls-table th {
    text-align: left; color: var(--morpho-400); font-size: 9px; font-weight: 600;
    letter-spacing: 0.5px; text-transform: uppercase; padding: 4px 0 2px;
    border-bottom: 1px solid rgba(250,247,240,0.04);
  }
  .controls-table td { padding: 2px 0; color: var(--cream-600); }
  .controls-table td:first-child { color: var(--cream-400); font-weight: 500; padding-right: 12px; white-space: nowrap; }

  .sidebar-copyright {
    font-size: 9px; color: var(--cream-800); text-align: right;
    padding-top: 6px; letter-spacing: 0.3px;
  }

  /* ── Sidebar tab — sticks to the right edge of the panel ── */
  .sidebar-tab {
    position: fixed; top: 25%; z-index: 20;
    left: 340px; /* right edge of sidebar */
    transform: translateY(-50%);
    width: 20px; height: 48px;
    background: rgba(6,21,13,0.9);
    border: 1px solid rgba(42,149,200,0.15);
    border-left: none;
    border-radius: 0 4px 4px 0;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--cream-600); transition: all 0.25s; padding: 0;
  }
  .sidebar-tab.tab-collapsed {
    left: 0;
  }
  .sidebar-tab:hover { background: rgba(42,149,200,0.1); color: var(--morpho-400); border-color: var(--morpho-400); }
  .sidebar-tab svg { width: 12px; height: 12px; stroke: currentColor; stroke-width: 2.5; fill: none; }
</style>
