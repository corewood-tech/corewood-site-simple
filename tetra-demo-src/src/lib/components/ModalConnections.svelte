<!-- Source: 0x2713 Modal Connection Lines — SVG overlay between pinned modals -->
<script lang="ts">
  import { onMount } from 'svelte';

  let { modals = [], wasmEngine }: {
    modals: any[];
    wasmEngine: any;
  } = $props();

  let svgEl: SVGSVGElement;
  let lines: { x1: number; y1: number; x2: number; y2: number; label: string; mx: number; my: number }[] = $state([]);

  function clipToRect(cx: number, cy: number, tx: number, ty: number, rect: DOMRect) {
    const dx = tx - cx, dy = ty - cy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    const hw = rect.width / 2, hh = rect.height / 2;
    const mx = rect.left + hw, my = rect.top + hh;
    const scaleX = Math.abs(dx) > 0 ? hw / Math.abs(dx) : Infinity;
    const scaleY = Math.abs(dy) > 0 ? hh / Math.abs(dy) : Infinity;
    const t = Math.min(scaleX, scaleY);
    return { x: mx + dx * t, y: my + dy * t };
  }

  function updateConnections() {
    if (modals.length < 2 || !wasmEngine) { lines = []; return; }

    // Get modal elements and their UIDs
    const modalEls = document.querySelectorAll('.node-modal');
    const uidToRect: Record<string, DOMRect> = {};
    modalEls.forEach(el => {
      const uid = (el as HTMLElement).dataset?.uid;
      if (uid) uidToRect[uid] = el.getBoundingClientRect();
    });

    const uids = Object.keys(uidToRect);
    if (uids.length < 2) { lines = []; return; }

    // Find edges between open modals
    const newLines: typeof lines = [];
    const drawn = new Set<string>();

    for (const modal of modals) {
      if (!modal.__edges) continue;
      for (const edge of modal.__edges) {
        const sid = modal.uid;
        const tid = edge.target_uid;
        if (!uidToRect[sid] || !uidToRect[tid]) continue;

        const key = [sid, tid, edge.predicate].sort().join('|');
        if (drawn.has(key)) continue;
        drawn.add(key);

        const r1 = uidToRect[sid];
        const r2 = uidToRect[tid];
        const cx1 = r1.left + r1.width / 2, cy1 = r1.top + r1.height / 2;
        const cx2 = r2.left + r2.width / 2, cy2 = r2.top + r2.height / 2;

        const p1 = clipToRect(cx1, cy1, cx2, cy2, r1);
        const p2 = clipToRect(cx2, cy2, cx1, cy1, r2);

        newLines.push({
          x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
          label: edge.predicate,
          mx: (p1.x + p2.x) / 2, my: (p1.y + p2.y) / 2
        });
      }
    }

    lines = newLines;
  }

  // Update on any modal change
  $effect(() => {
    // Track modals array to trigger re-render
    const _ = modals.length;
    // Small delay to let DOM update positions
    const id = setTimeout(updateConnections, 50);
    return () => clearTimeout(id);
  });

  // Also update periodically (for drag)
  onMount(() => {
    const interval = setInterval(updateConnections, 200);
    return () => clearInterval(interval);
  });
</script>

<svg bind:this={svgEl} class="modal-connections">
  <defs>
    <marker id="conn-arrow" viewBox="0 0 10 6" refX="10" refY="3"
      markerWidth="10" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,3 L0,6" fill="var(--morpho-400)"/>
    </marker>
  </defs>
  {#each lines as line}
    <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
      stroke="var(--morpho-500)" stroke-width="1.5" stroke-dasharray="4 3"
      marker-end="url(#conn-arrow)" opacity="0.6" />
    <text x={line.mx} y={line.my - 6} text-anchor="middle"
      fill="var(--morpho-400)" font-size="10" font-family="var(--font-code)">
      {line.label}
    </text>
  {/each}
</svg>

<style>
  .modal-connections {
    position: fixed;
    inset: 0;
    z-index: 199;
    pointer-events: none;
    overflow: visible;
  }
</style>
