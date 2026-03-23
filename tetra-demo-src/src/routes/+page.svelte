<!-- Tetra Demo — client-side graph visualization -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import NodeModal from '$lib/components/NodeModal.svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';
  import ModalConnections from '$lib/components/ModalConnections.svelte';
  import EdgeLabels from '$lib/components/EdgeLabels.svelte';
  import { loadConfig, saveConfig, applyConfig } from '$lib/configStore';
  import Compass from '$lib/components/Compass.svelte';

  let wasmEngine: any = $state(null);
  let status = $state('Initializing...');
  let noWebGPU = $state(false);

  // Focus mode state
  let focusModeEnabled = $state(false);
  let focusSubgraphActive = $state(false);
  let glowDepth = $state(loadConfig().focus.depth);

  let selectedUid: string | null = $state(null);

  // Graph pick mode for algorithm panel
  let pickMode = $state(false);
  let pickedNode: string | null = $state(null);

  // Labels config
  let labelCfg = $state(loadConfig().labels);
  // svelte-ignore state_referenced_locally
  let showLabels = $state(labelCfg.enabled);
  let focusLabelsEnabled = $state(false);

  // Algorithm selection state
  let communityActive = $state(false);
  let communityUids: string[] = $state([]);
  let algoLabel = $state('');

  let focusNodeCount = $state(0);
  let totalNodeCount = $state(0);
  let totalEdgeCount = $state(0);

  let effectiveShowLabels = $derived(
    communityActive ? false
    : focusModeEnabled && focusSubgraphActive ? focusLabelsEnabled
    : showLabels
  );

  let activeLabel = $derived(
    communityActive ? `${communityUids.length} active nodes · ${algoLabel}`
    : focusModeEnabled && focusSubgraphActive ? `${focusNodeCount} active nodes · focus depth ${glowDepth}`
    : ''
  );

  let graphGeneration = $state(0);

  // 2D mode + compass
  let is2D = $state(false);
  let compassAngle = $state(0);
  let compassInterval: ReturnType<typeof setInterval> | null = null;
  function startCompassPoll() {
    if (compassInterval) return;
    compassInterval = setInterval(() => {
      if (wasmEngine) compassAngle = wasmEngine.get_rotation_2d();
    }, 50);
  }
  function stopCompassPoll() {
    if (compassInterval) { clearInterval(compassInterval); compassInterval = null; }
    compassAngle = 0;
  }
  function handleModeChange(v: boolean) {
    is2D = v;
    if (v) startCompassPoll(); else stopCompassPoll();
  }
  function resetRotation() {
    if (wasmEngine) wasmEngine.set_config('rotation_2d', '0');
    compassAngle = 0;
  }

  // Splash modal
  let tetraSplash = $state(false);

  // Modal management
  let modals: any[] = $state([]);
  let modalCounter = 0;

  function fetchNodeData(uid: string): any {
    let data: any = { uid };
    if (wasmEngine) {
      try {
        const json = wasmEngine.get_node_data(uid);
        data = JSON.parse(json);
      } catch { /* fallback */ }
    }
    return data;
  }

  function handleNodeClick(uid: string | null) {
    if (pickMode && uid) {
      pickedNode = uid;
      return;
    }

    if (!uid) {
      modals = modals.filter(m => m.pinned);
      selectedUid = null;
      if (wasmEngine) {
        wasmEngine.clear_selected_node();
        if (focusModeEnabled && !communityActive) { wasmEngine.clear_focus(); focusSubgraphActive = false; }
      }
      return;
    }

    if (communityActive) {
      selectedUid = uid;
      if (wasmEngine) wasmEngine.set_selected_node(uid);
      const existing = modals.find(m => m.uid === uid);
      if (existing) return;
      modals = modals.filter(m => m.pinned);
      const nodeData = fetchNodeData(uid);
      modals = [...modals, { ...nodeData, id: ++modalCounter, pinned: false }];
      return;
    }

    if (focusModeEnabled && wasmEngine?.is_in_focus && selectedUid) {
      if (!wasmEngine.is_in_focus(uid)) {
        modals = modals.filter(m => m.pinned);
        selectedUid = null;
        wasmEngine.clear_selected_node();
        wasmEngine.clear_focus();
        focusSubgraphActive = false;
        return;
      }
    }

    selectedUid = uid;

    if (focusModeEnabled && wasmEngine) {
      focusNodeCount = wasmEngine.set_focus(uid, glowDepth) ?? 0;
      focusSubgraphActive = true;
    } else if (wasmEngine) {
      wasmEngine.set_selected_node(uid);
    }

    const existing = modals.find(m => m.uid === uid);
    if (existing) return;
    modals = modals.filter(m => m.pinned);
    const nodeData = fetchNodeData(uid);
    modals = [...modals, { ...nodeData, id: ++modalCounter, pinned: false }];
  }

  function closeModal(id: number) {
    modals = modals.filter(m => m.id !== id);
  }

  function togglePin(id: number) {
    modals = modals.map(m => m.id === id ? { ...m, pinned: !m.pinned } : m);
  }

  function flyToNode(uid: string) {
    if (wasmEngine) wasmEngine.fly_to_node(uid);
  }

  function restoreVisualConfig() {
    if (!wasmEngine) return;
    const cfg = loadConfig();
    applyConfig(cfg, wasmEngine, false);
  }

  function focusNode(uid: string) {
    handleNodeClick(uid);
    flyToNode(uid);
  }

  function clearForNewQuery() {
    modals = modals.filter(m => m.pinned);
    selectedUid = null;
    focusSubgraphActive = false;
    communityActive = false;
    communityUids = [];
    graphGeneration++;
  }

  function handleCommunitySelect(uids: string[], label: string) {
    communityActive = true;
    communityUids = uids;
    algoLabel = label;
    focusSubgraphActive = false;
  }

  function handleCommunityDeselect() {
    communityActive = false;
    communityUids = [];
    algoLabel = '';
    if (focusModeEnabled && selectedUid && wasmEngine) {
      focusNodeCount = wasmEngine.set_focus(selectedUid, glowDepth) ?? 0;
      focusSubgraphActive = true;
    }
  }

  // Fullscreen toggle
  let isFullscreen = $state(false);
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  onMount(async () => {
    document.addEventListener('fullscreenchange', () => {
      isFullscreen = !!document.fullscreenElement;
    });

    if (!(navigator as any).gpu) {
      noWebGPU = true;
      status = '';
      return;
    }

    try {
      const canvas = document.getElementById('graph-canvas') as HTMLCanvasElement;
      const container = document.getElementById('graph-container')!;
      canvas.width = container.clientWidth * devicePixelRatio;
      canvas.height = container.clientHeight * devicePixelRatio;

      const wasm = await import(/* @vite-ignore */ '$lib/wasm/pkg/retina_wasm.js');
      await wasm.default();
      await wasm.init('graph-canvas');
      wasmEngine = wasm;

      // Show idle tetrahedron on startup
      wasm.load_idle_tetra();

      wasm.on_node_click((uid: string | null) => {
        if (uid && (uid.startsWith('__tetra_') || uid === '__tetra_face__')) {
          tetraSplash = true;
          return;
        }
        handleNodeClick(uid);
      });

      wasm.on_edge_click((json: string) => {
        try {
          const edge = JSON.parse(json);
          const targetUid = selectedUid === edge.target ? edge.source : edge.target;
          focusNode(targetUid);
        } catch { /* ignore */ }
      });

      // Keyboard node movement
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        const tag = (document.activeElement as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (!selectedUid || !wasmEngine) return;

        const step = 25;
        let dx = 0, dy = 0, dz = 0;
        if (e.key === 'ArrowLeft') { dx = -step; }
        else if (e.key === 'ArrowRight') { dx = step; }
        else if (e.key === 'ArrowUp' && e.shiftKey) { dz = -step; }
        else if (e.key === 'ArrowDown' && e.shiftKey) { dz = step; }
        else if (e.key === 'ArrowUp') { dy = step; }
        else if (e.key === 'ArrowDown') { dy = -step; }
        else { return; }
        e.preventDefault();
        wasmEngine.move_node(selectedUid, dx, dy, dz);
      });

      const ro = new ResizeObserver(() => {
        const w = container.clientWidth * devicePixelRatio;
        const h = container.clientHeight * devicePixelRatio;
        canvas.width = w;
        canvas.height = h;
        if (wasmEngine) wasmEngine.resize(w, h);
      });
      ro.observe(container);

      // Auto-load the demo dataset
      status = 'Loading recommendations dataset...';
      try {
        const resp = await fetch(`${base}/data.json`);
        const raw = await resp.text();
        const data = JSON.parse(raw);

        const t0 = performance.now();
        wasmEngine.load_graph(raw);
        restoreVisualConfig();
        const renderMs = performance.now() - t0;

        const nodeCount = data.results?.[0]?.data?.[0]?.graph?.nodes?.length ?? 0;
        const edgeCount = data.results?.[0]?.data?.[0]?.graph?.relationships?.length ?? 0;
        totalNodeCount = nodeCount;
        totalEdgeCount = edgeCount;
        const types = JSON.parse(wasmEngine.get_graph_types());
        status = `${nodeCount.toLocaleString()} nodes · ${edgeCount.toLocaleString()} edges · ${types.length} types — rendered in ${renderMs.toFixed(0)}ms`;
      } catch (e: any) {
        status = `Failed to load demo data: ${e.message}`;
      }

    } catch (e: any) {
      console.error('WASM init failed:', e);
      status = `WebGPU init failed: ${e.message}`;
    }
  });

</script>

{#if noWebGPU}
<div class="gpu-error">
  <div class="gpu-error-content">
    <div class="gpu-glitch" data-text="WEB GPU">WEB GPU</div>
    <div class="gpu-glitch gpu-glitch-sub" data-text="NOT DETECTED">NOT DETECTED</div>
    <div class="gpu-divider"></div>
    <p class="gpu-msg">You need WebGPU to run TETRA.</p>
    <img src="{base}/tetra-logo.svg" alt="TETRA" class="gpu-logo" />
    <p class="gpu-hint">Try Chrome, Edge, or Safari 18+</p>
    <a href="/tetra/" class="gpu-btn">Back to TETRA &rarr;</a>
  </div>
  <div class="gpu-collab">
    <span>in collaboration with</span>
    <a href="https://www.verdantintel.com/" target="_blank" rel="noopener noreferrer">
      <img src="{base}/verdant-logo.png" alt="Verdant Intelligence" />
    </a>
  </div>
  <div class="gpu-scanlines"></div>
</div>
{:else}
<Sidebar {status} {wasmEngine}
  onclear={clearForNewQuery} {focusNode}
  initialDepth={glowDepth} protocol={'cypher'}
  demoMode={true}
  onfocustoggle={(v) => { if (v === focusModeEnabled) return; focusModeEnabled = v; if (!v && wasmEngine) { wasmEngine.clear_focus(); focusSubgraphActive = false; } }}
  ondepthchange={(d) => { if (d === glowDepth) return; glowDepth = d; const cfg = loadConfig(); cfg.focus.depth = d; saveConfig(cfg); if (focusModeEnabled && selectedUid && wasmEngine) { focusNodeCount = wasmEngine.set_focus_quiet(selectedUid, d) ?? 0; } }}
  onlabelstoggle={(v) => { showLabels = v; labelCfg = loadConfig().labels; }}
  onfocuslabelstoggle={(v) => { focusLabelsEnabled = v; }}
  oncommunityselect={handleCommunitySelect}
  oncommunitydeselect={handleCommunityDeselect}
  ontogglefullscreen={toggleFullscreen} {isFullscreen}
  onmodechange={handleModeChange}
  onpickstart={() => { pickMode = true; pickedNode = null; }}
  onpickend={() => { pickMode = false; pickedNode = null; }}
  {pickedNode} />

<div id="graph-container" class:pick-mode={pickMode}>
  <canvas id="graph-canvas"></canvas>

  <EdgeLabels {wasmEngine} {selectedUid} showLabels={effectiveShowLabels}
    focusActive={focusSubgraphActive}
    fontSize={labelCfg.fontSize} nearFieldDepth={labelCfg.nearFieldDepth}
    {graphGeneration} />
  <StatusBar {status} {activeLabel} />

  {#if is2D}
    <Compass angle={compassAngle} onreset={resetRotation} />
  {/if}
</div>

<!-- Tetra splash modal -->
{#if tetraSplash}
  <div class="load-notice-backdrop" onclick={() => tetraSplash = false}>
    <div class="load-notice tetra-splash" onclick={(e: MouseEvent) => e.stopPropagation()}>
      <a href="https://www.corewood.io/" target="_blank" rel="noopener noreferrer">
        <img src="{base}/corewood-logo.png" alt="Corewood" class="splash-corewood" />
      </a>
      <p class="splash-presents">Corewood presents</p>
      <img src="{base}/tetra-logo.svg" alt="Tetra" style="width: 100px; margin: 0 auto 12px; display: block;" />
      <h3 style="text-align: center; margin-bottom: 8px;">Tetra</h3>
      <p style="text-align: center; color: var(--cream-300); font-size: 14px;">
        A graph data system that runs anywhere.
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <button class="btn btn-primary" onclick={() => tetraSplash = false}>Explore</button>
      </div>
      <div class="splash-collab">
        <span>in collaboration with</span>
        <a href="https://www.verdantintel.com/" target="_blank" rel="noopener noreferrer">
          <img src="{base}/verdant-logo.png" alt="Verdant Intelligence" class="splash-verdant" />
        </a>
      </div>
    </div>
  </div>
{/if}

<!-- Modal connection lines -->
<ModalConnections {modals} {wasmEngine} />

<!-- Node modals -->
{#each modals as modal, i (modal.id)}
  <NodeModal
    node={modal}
    pinnedCount={i}
    isPinned={modal.pinned}
    focusMode={focusModeEnabled}
    onclose={() => closeModal(modal.id)}
    onpin={() => togglePin(modal.id)}
    onflyto={flyToNode}
    onfocusnode={focusNode}
  />
{/each}
{/if}

<style>
  .load-notice-backdrop {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(6,21,13,0.5); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
  }
  .load-notice {
    background: rgba(10, 35, 20, 0.6);
    backdrop-filter: blur(28px) saturate(1.5);
    -webkit-backdrop-filter: blur(28px) saturate(1.5);
    border: 1px solid rgba(42, 149, 200, 0.18);
    border-radius: 16px;
    padding: 24px 32px; max-width: 520px; width: 90%;
    box-shadow: 0 12px 48px rgba(0,0,0,0.6), 0 0 80px rgba(42,149,200,0.06), inset 0 1px 0 rgba(250,247,240,0.08);
    animation: modal-in 0.2s ease-out;
  }
  .load-notice h3 {
    font-family: var(--font-heading); color: var(--morpho-300);
    font-size: 18px; margin-bottom: 8px;
  }
  .load-notice p {
    font-size: 13px; color: var(--cream-300); line-height: 1.5; margin-bottom: 16px;
  }
  .tetra-splash { text-align: center; }
  .splash-corewood {
    width: 64px; margin: 0 auto 8px; display: block;
    filter: drop-shadow(0 2px 12px rgba(250,247,240,0.1));
    opacity: 0.85; transition: opacity 0.2s;
  }
  .splash-corewood:hover { opacity: 1; }
  .splash-presents {
    font-size: 11px; color: var(--cream-600); letter-spacing: 0.08em;
    text-transform: uppercase; text-align: center; margin-bottom: 16px;
  }
  .splash-collab {
    margin-top: 24px; padding-top: 16px;
    border-top: 1px solid rgba(250,247,240,0.06);
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .splash-collab span {
    font-size: 11px; color: var(--cream-600); letter-spacing: 0.05em; text-transform: uppercase;
  }
  .splash-verdant { height: 32px; opacity: 0.85; transition: opacity 0.2s; }
  .splash-verdant:hover { opacity: 1; }
  @keyframes modal-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  :global(#graph-container.pick-mode) { cursor: crosshair; }
  :global(#graph-container.pick-mode canvas) { cursor: crosshair; }

  /* ─── WebGPU error — retro game over screen ─── */
  .gpu-error {
    position: fixed; inset: 0; z-index: 999;
    background: #06150D;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .gpu-scanlines {
    position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.15) 2px,
      rgba(0,0,0,0.15) 4px
    );
    z-index: 1;
  }
  .gpu-error-content {
    text-align: center; z-index: 2; position: relative;
  }
  .gpu-glitch {
    font-family: 'Press Start 2P', 'Courier New', monospace;
    font-size: 48px;
    color: #E23D28;
    text-shadow:
      2px 2px 0 #0B2B1A,
      -1px -1px 0 rgba(0,232,143,0.3),
      3px 0 0 rgba(78,121,167,0.3);
    letter-spacing: 0.15em;
    animation: gpu-flicker 3s infinite;
  }
  .gpu-glitch-sub {
    font-size: 36px;
    margin-top: 8px;
    color: #E85A48;
  }
  @keyframes gpu-flicker {
    0%, 95%, 100% { opacity: 1; }
    96% { opacity: 0.8; }
    97% { opacity: 1; transform: translateX(-2px); }
    98% { opacity: 0.9; transform: translateX(1px); }
    99% { opacity: 1; transform: translateX(0); }
  }
  .gpu-divider {
    width: 200px; height: 2px; margin: 32px auto;
    background: linear-gradient(90deg, transparent, #E23D28, transparent);
  }
  .gpu-msg {
    font-family: 'Press Start 2P', monospace;
    font-size: 14px;
    color: var(--cream-300);
    margin-bottom: 24px;
    line-height: 1.8;
  }
  .gpu-logo {
    width: 120px; height: auto;
    margin: 0 auto 24px; display: block;
    opacity: 0.7;
  }
  .gpu-hint {
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--cream-600);
    margin-bottom: 24px;
  }
  .gpu-btn {
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    display: inline-block;
    padding: 12px 24px;
    color: #00e88f;
    border: 2px solid #00e88f;
    text-decoration: none;
    transition: all 0.2s;
    letter-spacing: 0.05em;
  }
  .gpu-btn:hover {
    background: #00e88f;
    color: #06150D;
    box-shadow: 0 0 20px rgba(0,232,143,0.3);
  }
  .gpu-collab {
    position: absolute; bottom: 24px; right: 28px; z-index: 2;
    display: flex; align-items: center; gap: 8px;
  }
  .gpu-collab span {
    font-size: 9px; color: rgba(245,240,230,0.3);
    letter-spacing: 0.08em; text-transform: uppercase;
    font-family: var(--font-body);
  }
  .gpu-collab img {
    height: 20px; opacity: 0.4; transition: opacity 0.15s;
  }
  .gpu-collab img:hover { opacity: 0.8; }
</style>
