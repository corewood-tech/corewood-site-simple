<!-- Edge labels: near-field relationship labels + spider badges for dense nodes -->
<script lang="ts">
  import { onMount } from 'svelte';

  let { wasmEngine, selectedUid = null, showLabels = false, focusActive = false, fontSize = 9, nearFieldDepth = 0.35, graphGeneration = 0 }: {
    wasmEngine?: any;
    selectedUid: string | null;
    showLabels?: boolean;
    focusActive?: boolean;
    fontSize?: number;
    nearFieldDepth?: number;
    graphGeneration?: number;
  } = $props();

  const BADGE_THRESHOLD = 7; // show badge instead of individual labels above this
  const MAX_LABEL_NODES = 30; // max nodes to label per frame

  interface EdgeLabel {
    x: number;
    y: number;
    text: string;
    alpha: number;
  }

  interface NodeLabel {
    x: number;
    y: number;
    text: string;
    alpha: number;
  }

  interface SpiderBadge {
    x: number;
    y: number;
    uid: string;
    groups: { pred: string; count: number }[];
    total: number;
  }

  let labels: EdgeLabel[] = $state([]);
  let nodeLabels: NodeLabel[] = $state([]);
  let badges: SpiderBadge[] = $state([]);
  let containerEl: HTMLDivElement;

  // Edge cache: uid → edges array (persists across frames)
  const edgeCache = new Map<string, { src: string; tgt: string; pred: string }[]>();

  function getEdges(uid: string): { src: string; tgt: string; pred: string }[] {
    if (edgeCache.has(uid)) return edgeCache.get(uid)!;
    if (!wasmEngine?.get_node_data) return [];
    try {
      const json = wasmEngine.get_node_data(uid);
      const node = JSON.parse(json);
      if (!node.__edges) { edgeCache.set(uid, []); return []; }
      const edges = node.__edges.map((e: any) => ({
        src: e.direction === 'out' ? uid : e.target_uid,
        tgt: e.direction === 'out' ? e.target_uid : uid,
        pred: e.predicate,
      }));
      edgeCache.set(uid, edges);
      return edges;
    } catch { return []; }
  }

  onMount(() => {
    let animId: number;
    let frameCount = 0;

    function update() {
      frameCount++;
      if (frameCount % 6 !== 0) { // ~10fps
        animId = requestAnimationFrame(update);
        return;
      }

      if (!wasmEngine?.get_node_screen_positions || !containerEl) {
        labels = []; nodeLabels = []; badges = [];
        animId = requestAnimationFrame(update);
        return;
      }

      // Nothing to render when labels are off
      if (!showLabels) {
        labels = []; nodeLabels = []; badges = [];
        animId = requestAnimationFrame(update);
        return;
      }

      try {
        const rect = containerEl.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        const posJson = wasmEngine.get_node_screen_positions(w, h);
        const positions: any[] = JSON.parse(posJson || '[]');
        if (positions.length === 0) {
          labels = []; nodeLabels = []; badges = [];
          animId = requestAnimationFrame(update);
          return;
        }

        // Build uid → screen position map
        const posMap: Record<string, { x: number; y: number; depth: number; label: string }> = {};
        let maxDepth = 0;
        for (const p of positions) {
          posMap[p.uid] = { x: p.x, y: p.y, depth: p.depth, label: p.label || '' };
          if (p.depth > maxDepth) maxDepth = p.depth;
        }

        // Determine which nodes get labels.
        // Two independent paths:
        //   1. focusActive — label all nodes in the focus subgraph
        //      (get_node_screen_positions already BFS-filters by focus depth)
        //   2. showLabels — near-field labels based on camera distance
        // Both can be active simultaneously; the union is used.
        const labelNodeUids: string[] = [];
        const labelSet = new Set<string>();

        if (focusActive) {
          for (const p of positions) {
            if (p.x > 0 && p.x < w && p.y > 0 && p.y < h) {
              if (!labelSet.has(p.uid)) { labelNodeUids.push(p.uid); labelSet.add(p.uid); }
            }
          }
        }

        if (showLabels) {
          // Near-field: nearest nodes by camera distance
          const onScreen = positions
            .filter(p => p.x > 0 && p.x < w && p.y > 0 && p.y < h)
            .sort((a, b) => a.depth - b.depth);
          const depthCutoff = maxDepth > 0.01 ? maxDepth * nearFieldDepth : Infinity;
          const nearField = onScreen
            .filter(p => p.depth < depthCutoff)
            .slice(0, MAX_LABEL_NODES);
          // If depth filtering is too aggressive (e.g. 2D overhead), take closest N
          const result = nearField.length > 0 ? nearField : onScreen.slice(0, MAX_LABEL_NODES);
          for (const p of result) {
            if (!labelSet.has(p.uid)) { labelNodeUids.push(p.uid); labelSet.add(p.uid); }
          }
        }

        const newLabels: EdgeLabel[] = [];
        const newBadges: SpiderBadge[] = [];

        for (const uid of labelNodeUids) {
          const edges = getEdges(uid);
          if (edges.length === 0) continue;

          const nodePos = posMap[uid];
          if (!nodePos) continue;

          if (edges.length > BADGE_THRESHOLD) {
            // Spider badge: group predicates by name and count
            const groups: Record<string, number> = {};
            for (const e of edges) {
              groups[e.pred] = (groups[e.pred] || 0) + 1;
            }
            const sorted = Object.entries(groups)
              .map(([pred, count]) => ({ pred, count }))
              .sort((a, b) => b.count - a.count);

            newBadges.push({
              x: nodePos.x,
              y: nodePos.y,
              uid,
              groups: sorted,
              total: edges.length,
            });
          } else {
            // Individual labels at edge midpoints
            for (const edge of edges) {
              const s = posMap[edge.src];
              const t = posMap[edge.tgt];
              if (!s || !t) continue;

              const mx = (s.x + t.x) / 2;
              const my = (s.y + t.y) / 2;
              if (mx < -10 || mx > w + 10 || my < -10 || my > h + 10) continue;

              // Fade by depth
              const edgeDepth = ((s.depth || 0) + (t.depth || 0)) / 2;
              const alpha = Math.max(0.3, 1.0 - (edgeDepth / (maxDepth * nearFieldDepth)) * 0.5);

              newLabels.push({ x: mx, y: my, text: edge.pred, alpha });
            }
          }
        }

        // Node name labels above each labeled node
        const newNodeLabels: NodeLabel[] = [];
        for (const uid of labelNodeUids) {
          const p = posMap[uid];
          if (!p || !p.label) continue;
          const depthAlpha = Math.max(0.4, 1.0 - (p.depth / (maxDepth * nearFieldDepth)) * 0.4);
          newNodeLabels.push({ x: p.x, y: p.y, text: p.label, alpha: depthAlpha });
        }

        labels = newLabels;
        nodeLabels = newNodeLabels;
        badges = newBadges;
      } catch {
        labels = []; badges = [];
      }

      animId = requestAnimationFrame(update);
    }

    update();
    return () => cancelAnimationFrame(animId);
  });

  // Clear edge cache and labels when graph reloads
  $effect(() => {
    graphGeneration; // track
    edgeCache.clear();
    labels = [];
    nodeLabels = [];
    badges = [];
  });
</script>

<div bind:this={containerEl} class="edge-labels">
  {#each nodeLabels as nl}
    <span class="node-label" style="left:{nl.x}px; top:{nl.y}px; opacity:{nl.alpha}; font-size:{fontSize + 1}px">
      {nl.text}
    </span>
  {/each}

  {#each labels as label}
    <span class="edge-label" style="left:{label.x}px; top:{label.y}px; opacity:{label.alpha}; font-size:{fontSize}px">
      {label.text}
    </span>
  {/each}

  {#each badges as badge}
    <div class="spider-badge" style="left:{badge.x}px; top:{badge.y}px">
      <div class="spider-header">{badge.total} relationships</div>
      <div class="spider-groups">
        {#each badge.groups as g}
          <span class="spider-group">
            <span class="spider-pred">{g.pred}</span>
            <span class="spider-count">{g.count}</span>
          </span>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .edge-labels {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 2;
  }
  .node-label {
    position: absolute;
    transform: translate(-50%, -180%);
    font-family: var(--font-body);
    font-weight: 600;
    color: var(--cream-100);
    background: rgba(6, 21, 13, 0.75);
    padding: 1px 6px;
    border-radius: 3px;
    white-space: nowrap;
    pointer-events: none;
    border: 1px solid rgba(250, 247, 240, 0.08);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  .edge-label {
    position: absolute;
    transform: translate(-50%, -50%);
    font-family: var(--font-code);
    font-size: 9px;
    color: var(--morpho-300);
    background: rgba(6, 21, 13, 0.7);
    padding: 1px 5px;
    border-radius: 3px;
    white-space: nowrap;
    pointer-events: none;
    border: 1px solid rgba(42, 149, 200, 0.15);
  }

  /* Spider badge: compact grouped relationship summary */
  .spider-badge {
    position: absolute;
    transform: translate(-50%, -120%);
    background: rgba(6, 21, 13, 0.92);
    border: 1px solid rgba(42, 149, 200, 0.25);
    border-radius: 6px;
    padding: 4px 8px;
    pointer-events: none;
    backdrop-filter: blur(4px);
    max-width: 180px;
  }
  .spider-header {
    font-family: var(--font-code);
    font-size: 8px;
    font-weight: 600;
    color: var(--cream-500);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
    border-bottom: 1px solid rgba(42, 149, 200, 0.12);
    padding-bottom: 2px;
  }
  .spider-groups {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 6px;
  }
  .spider-group {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-family: var(--font-code);
    font-size: 9px;
  }
  .spider-pred {
    color: var(--morpho-300);
  }
  .spider-count {
    color: var(--cream-600);
    background: rgba(42, 149, 200, 0.12);
    border-radius: 3px;
    padding: 0 3px;
    font-size: 8px;
    font-weight: 600;
    min-width: 14px;
    text-align: center;
  }
</style>
