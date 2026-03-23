<!-- Source: 0x2711 Node Modal + 0x2715 Pinning + 0x2712 Dragging + 0x2716 Collapsing -->
<script lang="ts">
  let {
    node,
    onclose,
    onpin,
    onflyto,
    onfocusnode,
    isPinned = false,
    pinnedCount = 0,
    focusMode = false
  }: {
    node: any;
    onclose: () => void;
    onpin: () => void;
    onflyto?: (uid: string) => void;
    onfocusnode?: (uid: string) => void;
    isPinned?: boolean;
    pinnedCount?: number;
    focusMode?: boolean;
  } = $props();

  let collapsed = $state(false);
  // svelte-ignore state_referenced_locally
  let edgesOpen = $state(focusMode);
  let modalEl: HTMLDivElement;

  // Position state — start at bottom-right, switch to top-left on first drag
  // svelte-ignore state_referenced_locally
  let posStyle = $state(`bottom: ${24 + pinnedCount * 20}px; right: ${24 + pinnedCount * 20}px;`);
  let hasSwitchedToAbsolute = false;

  function startDrag(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('.modal-btn') || target.closest('.modal-flyto')) return;

    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    // On first drag, switch from bottom/right to top/left positioning
    if (!hasSwitchedToAbsolute && modalEl) {
      const rect = modalEl.getBoundingClientRect();
      posStyle = `top: ${rect.top}px; left: ${rect.left}px;`;
      hasSwitchedToAbsolute = true;
    }

    // Parse current top/left from posStyle
    const topMatch = posStyle.match(/top:\s*([\d.]+)px/);
    const leftMatch = posStyle.match(/left:\s*([\d.]+)px/);
    const startTop = topMatch ? parseFloat(topMatch[1]) : 0;
    const startLeft = leftMatch ? parseFloat(leftMatch[1]) : 0;

    function onMove(ev: MouseEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      posStyle = `top: ${startTop + dy}px; left: ${startLeft + dx}px;`;
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function flyTo() {
    if (onflyto && node.uid) onflyto(node.uid);
  }

  let copied = $state(false);

  function navigateToNode(uid: string) {
    if (onfocusnode) onfocusnode(uid);
  }

  function buildMarkdown(): string {
    const lines: string[] = [];
    lines.push(`# ${nodeLabel}`);
    lines.push('');
    lines.push(`| Property | Value |`);
    lines.push(`|----------|-------|`);
    lines.push(`| uid | \`${node.uid}\` |`);
    if (nodeType) lines.push(`| type | ${nodeType} |`);
    for (const [key, value] of scalarProps) {
      lines.push(`| ${key} | ${value} |`);
    }
    if (edges.length > 0) {
      lines.push('');
      lines.push(`## Edges (${edges.length})`);
      lines.push('');
      lines.push('| Dir | Predicate | Target |');
      lines.push('|-----|-----------|--------|');
      for (const edge of edges) {
        const dir = edge.direction === 'in' ? '<-' : '->';
        lines.push(`| ${dir} | ${edge.predicate} | ${edge.targetLabel} (\`${edge.targetUid}\`) |`);
      }
    }
    return lines.join('\n');
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(buildMarkdown());
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    } catch {}
  }

  // Extract scalar properties
  function getScalarProps(n: any): [string, string][] {
    if (!n) return [];
    const skip = new Set(['uid', 'id', 'type', 'dgraph.type', '__edges', 'pinned']);
    const props: [string, string][] = [];
    for (const [k, v] of Object.entries(n)) {
      if (skip.has(k)) continue;
      if (typeof v === 'object' && v !== null) continue;
      const s = String(v);
      if (s.length > 200) {
        props.push([k, s.slice(0, 200) + '…']);
      } else {
        props.push([k, s]);
      }
    }
    return props;
  }

  // Extract edges from __edges array
  function getEdges(n: any): { predicate: string; targetUid: string; targetLabel: string; direction: string }[] {
    if (!n?.__edges) return [];
    return (n.__edges as any[]).map(e => ({
      predicate: e.predicate,
      targetUid: e.target_uid,
      targetLabel: e.target_label || e.target_uid,
      direction: e.direction || 'out'
    })).sort((a, b) => {
      // Outgoing first, then incoming
      if (a.direction === 'out' && b.direction === 'in') return -1;
      if (a.direction === 'in' && b.direction === 'out') return 1;
      return a.predicate.localeCompare(b.predicate);
    });
  }

  const scalarProps = $derived(getScalarProps(node));
  const edges = $derived(getEdges(node));
  const nodeLabel = $derived(node?.name || node?.label || node?.title || node?.uid || 'Node');
  const nodeType = $derived(node?.type || node?.['dgraph.type']?.[0] || '');
</script>

<div
  bind:this={modalEl}
  class="node-modal"
  class:pinned={isPinned}
  class:collapsed
  style={posStyle}
  data-uid={node.uid}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-header" onmousedown={startDrag}>
    <div class="modal-title-wrap">
      <h3 title={nodeLabel}>{nodeLabel}</h3>
      {#if node.external}
        <span class="external-badge">not displayed</span>
      {:else if onflyto}
        <button class="modal-flyto" onclick={flyTo}>fly to</button>
      {/if}
    </div>
    <button class="modal-btn collapse-btn" class:rotated={collapsed}
      onclick={() => collapsed = !collapsed} title="Collapse">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
    <button class="modal-btn" onclick={copyToClipboard} title="Copy as markdown">
      {#if copied}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      {/if}
    </button>
    <button class="modal-btn pinned-btn" class:active={isPinned}
      onclick={onpin} title={isPinned ? 'Unpin' : 'Pin'}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="17" x2="12" y2="22"/>
        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
      </svg>
    </button>
    <button class="modal-btn" onclick={onclose} title="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>

  {#if !collapsed}
    <div class="modal-body">
      <div class="prop-row">
        <span class="prop-key">uid</span>
        <span class="prop-val">{node.uid}</span>
      </div>
      {#if nodeType}
        <div class="prop-row">
          <span class="prop-key">type</span>
          <span class="prop-val">{nodeType}</span>
        </div>
      {/if}
      {#each scalarProps as [key, value]}
        <div class="prop-row">
          <span class="prop-key">{key}</span>
          <span class="prop-val" title={value}>{value}</span>
        </div>
      {/each}

      {#if node.connections?.length > 0}
        <!-- External node: show server-hydrated connections -->
        <div class="edges-disclosure">
          <button class="edges-toggle open" onclick={() => {}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <span>Connections ({node.connections.length})</span>
          </button>
          <div class="edges-list">
            {#each node.connections as conn}
              {#if conn.inView}
                <button class="edge-item focus-edge"
                  onclick={() => navigateToNode(conn.uid)}>
                  <span class="edge-pred">{conn.type}</span>
                  <span class="edge-target-label">{conn.name}</span>
                </button>
              {:else}
                <div class="edge-item edge-dim">
                  <span class="edge-pred">{conn.type}</span>
                  <span class="edge-target-label">{conn.name}</span>
                  <span class="ext-marker-sm">*</span>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {:else if edges.length > 0}
        <div class="edges-disclosure">
          <button class="edges-toggle" class:open={edgesOpen}
            onclick={() => edgesOpen = !edgesOpen}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <span>Edges ({edges.length})</span>
          </button>
          {#if edgesOpen}
            <div class="edges-list" class:focus-nav={focusMode}>
              {#each edges as edge}
                <button class="edge-item" class:focus-edge={focusMode}
                  onclick={() => navigateToNode(edge.targetUid)}>
                  <span class="edge-dir">{edge.direction === 'in' ? '←' : '→'}</span>
                  <span class="edge-pred">{edge.predicate}</span>
                  <span class="edge-target-label">{edge.targetLabel}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .node-modal {
    position: fixed; z-index: 200;
    width: 340px; min-width: 220px; max-height: 80vh;
    overflow: hidden; resize: both;
    background: rgba(11,43,26,0.95); backdrop-filter: blur(12px);
    border: 1px solid rgba(250,247,240,0.1); border-radius: 12px;
    padding: 16px; font-size: 12px; color: var(--cream-100);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 48px rgba(42,149,200,0.06);
    animation: modal-in 0.2s ease-out;
    display: flex; flex-direction: column;
  }
  .node-modal.pinned {
    border-color: var(--morpho-500);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 6px rgba(42,149,200,0.2);
  }
  .node-modal.collapsed { height: auto !important; min-height: 0; resize: none; }

  .modal-header {
    display: flex; align-items: center; gap: 6px;
    cursor: grab; user-select: none; flex-shrink: 0;
  }
  .modal-header:active { cursor: grabbing; }
  .modal-title-wrap { flex: 1; min-width: 0; }
  .modal-title-wrap h3 {
    color: var(--morpho-300); font-size: 14px; font-weight: 700; margin: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .modal-flyto {
    font-size: 10px; color: var(--morpho-500); text-decoration: underline;
    cursor: pointer; opacity: 0.7; transition: opacity 0.15s; line-height: 1;
    background: none; border: none; padding: 0; font-family: inherit;
  }
  .modal-flyto:hover { opacity: 1; color: var(--morpho-glow); }
  .external-badge { font-size: 9px; color: #c44; font-style: italic; opacity: 0.8; }
  .edge-dim { opacity: 0.5; cursor: default; }
  .ext-marker-sm { color: #c44; font-size: 9px; margin-left: auto; }
  .modal-body { overflow-y: auto; flex: 1; margin-top: 10px; }
  .modal-btn {
    background: none; border: none; color: var(--cream-600); cursor: pointer;
    padding: 3px; border-radius: 4px; transition: all 0.15s; line-height: 0; flex-shrink: 0;
  }
  .modal-btn:hover { color: var(--morpho-400); background: rgba(250,247,240,0.06); }
  .modal-btn svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 2; fill: none; }
  .modal-btn.pinned-btn.active { color: var(--morpho-400); }
  .collapse-btn svg { transition: transform 0.2s; }
  .collapse-btn.rotated svg { transform: rotate(180deg); }

  .prop-row { display: flex; padding: 4px 0; border-bottom: 1px solid rgba(250,247,240,0.06); }
  .prop-key { color: var(--forest-300); min-width: 90px; margin-right: 8px; font-weight: 500; }
  .prop-val { color: var(--cream-200); word-break: break-all; }

  .edges-disclosure { margin-top: 12px; border-top: 1px solid rgba(250,247,240,0.08); padding-top: 8px; }
  .edges-toggle {
    display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none;
    background: none; border: none; color: var(--cream-500); font-family: inherit;
    font-size: 12px; font-weight: 600; padding: 4px 0; width: 100%; transition: color 0.15s;
  }
  .edges-toggle:hover { color: var(--morpho-400); }
  .edges-toggle svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 2; fill: none; transition: transform 0.2s; }
  .edges-toggle.open svg { transform: rotate(180deg); }
  .edges-list { margin-top: 4px; }
  .edge-item {
    display: flex; align-items: baseline; gap: 6px; padding: 4px 6px;
    border: none; border-bottom: 1px solid rgba(250,247,240,0.03);
    font-size: 11px; font-family: inherit; text-align: left;
    width: 100%; background: none; cursor: pointer;
    border-radius: 4px; transition: background 0.1s;
    color: inherit;
  }
  .edge-item:hover { background: rgba(42,149,200,0.08); }
  .edge-item.focus-edge { padding: 6px 8px; }
  .edge-item.focus-edge:hover { background: rgba(42,149,200,0.15); }
  .edge-dir { color: var(--cream-700); font-size: 10px; width: 12px; flex-shrink: 0; }
  .edge-pred { color: var(--forest-300); font-weight: 500; min-width: 80px; }
  .edge-target-label { color: var(--morpho-400); }
  .edge-item:hover .edge-target-label { color: var(--morpho-300); }
  .focus-nav .edge-dir { font-size: 12px; }
  .focus-nav .edge-target-label { text-decoration: underline; }

  @keyframes modal-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
