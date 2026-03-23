<!-- 2D compass rose — shows canvas rotation, click to reset -->
<script lang="ts">
  let { angle = 0, onreset }: { angle: number; onreset?: () => void } = $props();
</script>

<button class="compass" onclick={onreset} title="Reset rotation" aria-label="Reset canvas rotation">
  <svg viewBox="0 0 60 60" width="60" height="60" style="transform: rotate({-angle}deg)">
    <!-- Outer ring -->
    <circle cx="30" cy="30" r="27" fill="none" stroke="rgba(250,247,240,0.15)" stroke-width="1.5"/>
    <!-- Tick marks -->
    {#each [0, 90, 180, 270] as tick}
      <line
        x1="30" y1="5" x2="30" y2={tick === 0 ? 10 : 8}
        stroke={tick === 0 ? 'rgba(42,149,200,0.9)' : 'rgba(250,247,240,0.3)'}
        stroke-width={tick === 0 ? 2 : 1}
        transform="rotate({tick} 30 30)"
      />
    {/each}
    <!-- North pointer (triangle) -->
    <polygon points="30,6 27,16 33,16" fill="rgba(42,149,200,0.85)"/>
    <!-- South pointer -->
    <polygon points="30,54 27,44 33,44" fill="rgba(250,247,240,0.2)"/>
    <!-- Center dot -->
    <circle cx="30" cy="30" r="2.5" fill="rgba(250,247,240,0.25)"/>
  </svg>
</button>

<style>
  .compass {
    position: fixed;
    bottom: 48px;
    right: 16px;
    z-index: 5;
    background: rgba(10, 35, 20, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(250,247,240,0.08);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    padding: 0;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .compass:hover {
    border-color: rgba(42,149,200,0.4);
    background: rgba(10, 35, 20, 0.6);
  }
</style>
