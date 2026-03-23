<!-- Instructions panel with persistent tab toggle -->
<script lang="ts">
  let collapsed = $state(true);
</script>

<div class="controls-hint" class:collapsed>
  <button class="hint-tab" onclick={() => collapsed = !collapsed}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      {#if collapsed}
        <polyline points="18 15 12 9 6 15"/>
      {:else}
        <polyline points="6 9 12 15 18 9"/>
      {/if}
    </svg>
    <span>Instructions</span>
  </button>
  {#if !collapsed}
    <div class="hint-body">
      <table>
        <thead>
          <tr><th colspan="2" class="hint-section">Camera</th></tr>
        </thead>
        <tbody>
          <tr><td>Left-drag</td><td>Orbit</td></tr>
          <tr><td>Shift + drag</td><td>Pan</td></tr>
          <tr><td>Scroll</td><td>Zoom / fly through</td></tr>
          <tr><td>Middle-drag</td><td>Tilt</td></tr>
          <tr><td>Ctrl + drag</td><td>Free-look</td></tr>
        </tbody>
        <thead>
          <tr><th colspan="2" class="hint-section">Nodes</th></tr>
        </thead>
        <tbody>
          <tr><td>Click</td><td>Select node</td></tr>
          <tr><td>Shift + drag node</td><td>Move node</td></tr>
          <tr><td>← / →</td><td>Move on X axis</td></tr>
          <tr><td>↑ / ↓</td><td>Move on Y axis</td></tr>
          <tr><td>Shift + ↑ / ↓</td><td>Move on Z axis (3D)</td></tr>
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .controls-hint {
    position: absolute;
    bottom: 28px;
    left: 12px;
    z-index: 5;
    background: rgba(11,43,26,0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(250,247,240,0.1);
    border-radius: 10px;
    overflow: hidden;
    min-width: 200px;
  }
  .controls-hint.collapsed {
    border-radius: 10px 10px 10px 10px;
  }

  .hint-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 6px 12px;
    background: none;
    border: none;
    color: var(--cream-500);
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.15s;
  }
  .hint-tab:hover { color: var(--morpho-400); }
  .hint-tab svg {
    width: 12px;
    height: 12px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
  }

  .hint-body {
    padding: 0 12px 10px;
    border-top: 1px solid rgba(250,247,240,0.06);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }
  th.hint-section {
    text-align: left;
    color: var(--morpho-400);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 6px 0 3px;
    border-bottom: 1px solid rgba(250,247,240,0.06);
  }
  td {
    padding: 3px 0;
    color: var(--cream-600);
  }
  td:first-child {
    color: var(--cream-300);
    font-weight: 500;
    padding-right: 16px;
    white-space: nowrap;
  }
</style>
