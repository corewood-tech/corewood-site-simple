<!-- Source: dgraph_viewer #status bar -->
<script lang="ts">
  let { status = '', activeLabel = '' }: { status: string; activeLabel?: string } = $props();
</script>

<div class="status-bar">
  <span class="status-text">{status}</span>
  {#if activeLabel}
    <span class="active-badge">{activeLabel}</span>
  {/if}
</div>

<style>
  .status-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 24px;
    background: rgba(10, 35, 20, 0.55);
    backdrop-filter: blur(16px) saturate(1.3);
    -webkit-backdrop-filter: blur(16px) saturate(1.3);
    border-top: 1px solid rgba(42, 149, 200, 0.10);
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 11px;
    color: var(--cream-600);
    z-index: 5;
    gap: 8px;
  }
  .status-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .active-badge {
    flex-shrink: 0;
    padding: 1px 8px;
    border-radius: 4px;
    background: rgba(42,149,200,0.15);
    color: var(--morpho-400);
    font-weight: 600;
    font-size: 10px;
    letter-spacing: 0.3px;
  }
</style>
