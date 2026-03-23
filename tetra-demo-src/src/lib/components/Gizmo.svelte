<!-- 3D minimap gizmo: interactive isometric box with camera arrow, draggable light sources on orbit -->
<script lang="ts">
  import { onMount } from 'svelte';

  let { wasmEngine, backlight = true, onbacklight }: {
    wasmEngine?: any;
    backlight?: boolean;
    onbacklight?: (on: boolean) => void;
  } = $props();
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let size = canvas.clientWidth || 150;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ro = new ResizeObserver(() => {
      size = canvas.clientWidth || 150;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    });
    ro.observe(canvas);

    let animId: number;
    let lastDirX = 0, lastDirY = -1;

    // Gizmo view rotation
    let gizmoYaw = 0.78;
    let gizmoPitch = -0.52;
    let dragging = false;

    // Light sources
    interface Light { yaw: number; pitch: number; enabled: boolean; }
    let lights: Light[] = [{ yaw: 0.98, pitch: 0.84, enabled: true }];
    let dragLight = -1;
    let dragMoved = false;

    // Scales
    const BOX_SCALE_FACTOR = 26;  // shrunk to fit orbit comfortably around cube
    const ORBIT_RADIUS = 2.8;     // orbit well outside the box diagonal

    function lightDir(l: Light): [number, number, number] {
      const cp = Math.cos(l.pitch), sp = Math.sin(l.pitch);
      const cy = Math.cos(l.yaw), sy = Math.sin(l.yaw);
      return [cp * cy, sp, cp * sy];
    }

    function syncLights() {
      if (!wasmEngine?.set_light) return;
      for (let i = 0; i < 2; i++) {
        if (i < lights.length) {
          const d = lightDir(lights[i]);
          wasmEngine.set_light(i, d[0], d[1], d[2], lights[i].enabled);
        } else {
          wasmEngine.set_light(i, 0, 1, 0, false);
        }
      }
    }

    function getScales() {
      const s = size / 150;
      const boxScale = BOX_SCALE_FACTOR * s;
      return { s, boxScale, cx: size / 2, cy: size / 2 };
    }

    function hitTestLight(px: number, py: number): number {
      const viewMat = buildViewMat(gizmoYaw, gizmoPitch);
      const { s, boxScale, cx, cy } = getScales();
      const hitR = 14 * s;
      for (let i = lights.length - 1; i >= 0; i--) {
        const d = lightDir(lights[i]);
        const [sx, sy] = project(viewMat, d[0] * ORBIT_RADIUS, d[1] * ORBIT_RADIUS, d[2] * ORBIT_RADIUS, boxScale);
        const dx = px - (cx + sx), dy = py - (cy + sy);
        if (dx * dx + dy * dy < hitR * hitR) return i;
      }
      return -1;
    }

    function hitTestAdd(px: number, py: number): boolean {
      if (lights.length >= 2) return false;
      const s = size / 150;
      const bx = size - 18 * s, by = size - 18 * s;
      const dx = px - bx, dy = py - by;
      return dx * dx + dy * dy < (10 * s) * (10 * s);
    }

    function onPointerDown(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      if (hitTestAdd(px, py)) {
        lights.push({ yaw: 0.0, pitch: -0.8, enabled: true });
        lights = [...lights];
        syncLights();
        return;
      }

      const li = hitTestLight(px, py);
      if (li >= 0) {
        dragLight = li;
        dragMoved = false;
        canvas.setPointerCapture(e.pointerId);
        return;
      }

      dragging = true;
      canvas.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      if (dragLight >= 0) {
        dragMoved = true;
        if (dragLight === 1) {
          // Light 2 on perpendicular orbit: horizontal drag = pitch, vertical = yaw
          lights[1].pitch = Math.max(-1.4, Math.min(1.4, lights[1].pitch + e.movementX * 0.015));
          lights[1].yaw += e.movementY * 0.015;
        } else {
          lights[0].yaw += e.movementX * 0.015;
          lights[0].pitch = Math.max(-1.4, Math.min(1.4, lights[0].pitch + e.movementY * -0.015));
        }
        syncLights();
        return;
      }
      if (!dragging) return;
      gizmoYaw += e.movementX * 0.01;
      gizmoPitch = Math.max(-1.4, Math.min(1.4, gizmoPitch - e.movementY * 0.01));
    }

    function onPointerUp(e: PointerEvent) {
      if (dragLight >= 0) {
        if (!dragMoved) {
          lights[dragLight].enabled = !lights[dragLight].enabled;
          syncLights();
        }
        dragLight = -1;
        canvas.releasePointerCapture(e.pointerId);
        return;
      }
      dragging = false;
      canvas.releasePointerCapture(e.pointerId);
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    canvas.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
      if (lights.length <= 1) return;
      const rect = canvas.getBoundingClientRect();
      const li = hitTestLight(e.clientX - rect.left, e.clientY - rect.top);
      if (li === 1) {
        lights.splice(1, 1);
        lights = [...lights];
        syncLights();
      }
    });

    function transformDir(m: number[], x: number, y: number, z: number): [number, number, number] {
      return [m[0]*x + m[4]*y + m[8]*z, m[1]*x + m[5]*y + m[9]*z, m[2]*x + m[6]*y + m[10]*z];
    }

    function project(m: number[], x: number, y: number, z: number, scale: number): [number, number, number] {
      const [rx, ry, rz] = transformDir(m, x, y, z);
      return [rx * scale, -ry * scale, rz];
    }

    function buildViewMat(yaw: number, pitch: number): number[] {
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const cy2 = Math.cos(yaw), sy = Math.sin(yaw);
      return [cy2, sp*sy, -cp*sy, 0, 0, cp, sp, 0, sy, -sp*cy2, cp*cy2, 0, 0, 0, 0, 1];
    }

    function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, enabled: boolean, s: number, active: boolean) {
      const col = enabled ? 'rgba(237, 201, 72, 0.9)' : 'rgba(120, 120, 120, 0.5)';
      const rayCol = enabled ? 'rgba(237, 201, 72, 0.45)' : 'rgba(100, 100, 100, 0.25)';
      // Glow when active/dragging
      if (active && enabled) {
        ctx.fillStyle = 'rgba(237, 201, 72, 0.12)';
        ctx.beginPath();
        ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Rays
      ctx.strokeStyle = rayCol;
      ctx.lineWidth = 1.2 * s;
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5);
        ctx.lineTo(x + Math.cos(a) * r * 2.5, y + Math.sin(a) * r * 2.5);
        ctx.stroke();
      }
      // Core
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw a faint orbit ellipse at a given pitch in the gizmo view
    function drawOrbitRing(ctx: CanvasRenderingContext2D, viewMat: number[], boxScale: number, cx: number, cy: number, s: number, pitch: number, color: string) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.0 * s;
      ctx.beginPath();
      const steps = 64;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const cp = Math.cos(pitch), sp = Math.sin(pitch);
        const ox = Math.cos(a) * cp * ORBIT_RADIUS;
        const oy = sp * ORBIT_RADIUS;
        const oz = Math.sin(a) * cp * ORBIT_RADIUS;
        const [sx, sy] = project(viewMat, ox, oy, oz, boxScale);
        if (i === 0) ctx.moveTo(cx + sx, cy + sy);
        else ctx.lineTo(cx + sx, cy + sy);
      }
      ctx.stroke();
    }

    // Draw a vertical great circle (meridian) at a given yaw
    function drawMeridianRing(ctx: CanvasRenderingContext2D, viewMat: number[], boxScale: number, cx: number, cy: number, s: number, yaw: number, color: string) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.0 * s;
      ctx.beginPath();
      const steps = 64;
      const cyaw = Math.cos(yaw), syaw = Math.sin(yaw);
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const ox = Math.cos(a) * cyaw * ORBIT_RADIUS;
        const oy = Math.sin(a) * ORBIT_RADIUS;
        const oz = Math.cos(a) * syaw * ORBIT_RADIUS;
        const [sx, sy] = project(viewMat, ox, oy, oz, boxScale);
        if (i === 0) ctx.moveTo(cx + sx, cy + sy);
        else ctx.lineTo(cx + sx, cy + sy);
      }
      ctx.stroke();
    }

    function draw() {
      ctx!.save();
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, size, size);

      // Background
      ctx!.fillStyle = 'rgba(6, 21, 13, 0.55)';
      ctx!.beginPath();
      ctx!.roundRect(4, 4, size - 8, size - 8, 8);
      ctx!.fill();
      ctx!.strokeStyle = dragging ? 'rgba(42, 149, 200, 0.3)' : 'rgba(42, 149, 200, 0.12)';
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.roundRect(4, 4, size - 8, size - 8, 8);
      ctx!.stroke();

      const { s, boxScale, cx, cy } = getScales();
      const viewMat = buildViewMat(gizmoYaw, gizmoPitch);

      // Gizmo data
      let gizmoData: number[] = [0, 0, 2, 0, 0, -1, 1, 1, 1];
      if (wasmEngine?.get_gizmo_data) {
        try { gizmoData = Array.from(wasmEngine.get_gizmo_data()) as number[]; } catch {}
      }
      const camX = gizmoData[0], camY = gizmoData[1], camZ = gizmoData[2];
      const lookX = gizmoData[3], lookY = gizmoData[4], lookZ = gizmoData[5];
      const bsx = gizmoData[6], bsy = gizmoData[7], bsz = gizmoData[8];

      // --- Orbit guidelines: only for enabled lights ---
      // Light 1: horizontal orbit at its pitch
      if (lights.length > 0 && lights[0].enabled) {
        drawOrbitRing(ctx!, viewMat, boxScale, cx, cy, s, lights[0].pitch, 'rgba(237, 220, 160, 0.35)');
      }
      // Light 2: perpendicular (meridian) orbit at light 1's yaw
      if (lights.length > 1 && lights[1].enabled) {
        drawMeridianRing(ctx!, viewMat, boxScale, cx, cy, s, lights[1].yaw, 'rgba(220, 200, 140, 0.35)');
      }

      // --- Bounding box ---
      const corners: [number, number, number][] = [
        [-bsx,-bsy,-bsz], [bsx,-bsy,-bsz], [bsx,bsy,-bsz], [-bsx,bsy,-bsz],
        [-bsx,-bsy, bsz], [bsx,-bsy, bsz], [bsx,bsy, bsz], [-bsx,bsy, bsz],
      ];
      const boxEdges: [number, number][] = [
        [0,1],[1,2],[2,3],[3,0], [4,5],[5,6],[6,7],[7,4], [0,4],[1,5],[2,6],[3,7],
      ];
      const projected = corners.map(([x, y, z]) => {
        const [sx, sy, sz] = project(viewMat, x, y, z, boxScale);
        return { sx: cx + sx, sy: cy + sy, z: sz };
      });
      const sortedEdges = boxEdges
        .map(([a, b]) => ({ a, b, z: (projected[a].z + projected[b].z) / 2 }))
        .sort((a, b) => a.z - b.z);

      for (const edge of sortedEdges) {
        const pa = projected[edge.a], pb = projected[edge.b];
        const alpha = 0.1 + Math.max(0, (edge.z + 1.5)) * 0.15;
        ctx!.strokeStyle = `rgba(74, 143, 99, ${Math.min(alpha, 0.55)})`;
        ctx!.lineWidth = edge.z > 0 ? 1.2 : 0.5;
        ctx!.beginPath();
        ctx!.moveTo(pa.sx, pa.sy);
        ctx!.lineTo(pb.sx, pb.sy);
        ctx!.stroke();
      }

      // --- Node cloud (x,y,z,r,g,b per node) ---
      for (let i = 9; i + 5 < gizmoData.length; i += 6) {
        const [sx, sy, sz] = project(viewMat, gizmoData[i], gizmoData[i+1], gizmoData[i+2], boxScale);
        const mx = cx + sx, my = cy + sy;
        if (mx < 6 || mx > size - 6 || my < 6 || my > size - 6) continue;
        const depthAlpha = 0.2 + Math.max(0, (sz + 1.5)) * 0.15;
        const r = Math.round(gizmoData[i+3] * 255);
        const g = Math.round(gizmoData[i+4] * 255);
        const b = Math.round(gizmoData[i+5] * 255);
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(depthAlpha, 0.6)})`;
        const ds = 0.8 * s;
        ctx!.fillRect(mx - ds, my - ds, ds * 2, ds * 2);
      }

      // --- Selected node indicator ---
      if (wasmEngine?.get_selected_gizmo_pos) {
        try {
          const sel: number[] = Array.from(wasmEngine.get_selected_gizmo_pos());
          if (sel.length >= 6) {
            const [sx, sy, sz] = project(viewMat, sel[0], sel[1], sel[2], boxScale);
            const selX = cx + sx, selY = cy + sy;
            const t = Date.now() * 0.005;
            const pulse = 0.7 + 0.3 * Math.sin(t);
            const sr = Math.round(sel[3] * 255), sg = Math.round(sel[4] * 255), sb = Math.round(sel[5] * 255);
            // Glow ring
            ctx!.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${pulse * 0.5})`;
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.arc(selX, selY, 6 * s, 0, Math.PI * 2);
            ctx!.stroke();
            // Bright dot
            ctx!.fillStyle = `rgba(${sr}, ${sg}, ${sb}, ${pulse})`;
            ctx!.beginPath();
            ctx!.arc(selX, selY, 3 * s, 0, Math.PI * 2);
            ctx!.fill();
          }
        } catch {}
      }

      // --- XYZ axis labels ---
      const axisEdgeDefs = [
        { from: 0, to: 1, axis: 'X', color: '#e15759' },
        { from: 0, to: 3, axis: 'Y', color: '#59a14f' },
        { from: 0, to: 4, axis: 'Z', color: '#4e79a7' },
      ];
      for (const ae of axisEdgeDefs) {
        const fp = projected[ae.from], np = projected[ae.to];
        const avgZ = (fp.z + np.z) / 2;
        const alpha = 0.35 + Math.max(0, (avgZ + 1.5)) * 0.2;
        ctx!.strokeStyle = ae.color;
        ctx!.lineWidth = 2;
        ctx!.globalAlpha = Math.min(alpha, 0.9);
        ctx!.beginPath();
        ctx!.moveTo(fp.sx, fp.sy);
        ctx!.lineTo(np.sx, np.sy);
        ctx!.stroke();

        const edx = np.sx - fp.sx, edy = np.sy - fp.sy;
        const elen = Math.sqrt(edx*edx + edy*edy) || 1;
        const tipLen = 5 * s;
        const angle = Math.atan2(edy, edx);
        ctx!.fillStyle = ae.color;
        ctx!.beginPath();
        ctx!.moveTo(np.sx, np.sy);
        ctx!.lineTo(np.sx - tipLen * Math.cos(angle - 0.35), np.sy - tipLen * Math.sin(angle - 0.35));
        ctx!.lineTo(np.sx - tipLen * Math.cos(angle + 0.35), np.sy - tipLen * Math.sin(angle + 0.35));
        ctx!.closePath();
        ctx!.fill();

        const lx = np.sx + (edx / elen) * 4, ly = np.sy + (edy / elen) * 4;
        const px = -edy / elen * 9 * s, py = edx / elen * 9 * s;
        ctx!.fillStyle = ae.color;
        ctx!.font = `bold ${Math.round(9 * s)}px SF Mono, monospace`;
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.fillText(ae.axis, lx + px, ly + py);
        ctx!.globalAlpha = 1.0;
      }

      // --- Light sources on orbit ---
      for (let i = 0; i < lights.length; i++) {
        const d = lightDir(lights[i]);
        const [lsx, lsy] = project(viewMat, d[0] * ORBIT_RADIUS, d[1] * ORBIT_RADIUS, d[2] * ORBIT_RADIUS, boxScale);
        const lx = cx + lsx, ly = cy + lsy;
        // Connector line from center to light
        ctx!.setLineDash([2, 3]);
        ctx!.strokeStyle = lights[i].enabled ? 'rgba(237, 201, 72, 0.15)' : 'rgba(100, 100, 100, 0.1)';
        ctx!.lineWidth = 0.6;
        ctx!.beginPath();
        ctx!.moveTo(cx, cy);
        ctx!.lineTo(lx, ly);
        ctx!.stroke();
        ctx!.setLineDash([]);
        // Sun icon — bigger for easier grabbing
        const sunR = (dragLight === i ? 5 : 4) * s;
        drawSun(ctx!, lx, ly, sunR, lights[i].enabled, s, dragLight === i);
      }

      // --- Add light button ("+") ---
      if (lights.length < 2) {
        const bx = size - 18 * s, by = size - 18 * s;
        ctx!.fillStyle = 'rgba(42, 149, 200, 0.12)';
        ctx!.beginPath();
        ctx!.arc(bx, by, 9 * s, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.strokeStyle = 'rgba(42, 149, 200, 0.35)';
        ctx!.lineWidth = 0.8;
        ctx!.beginPath();
        ctx!.arc(bx, by, 9 * s, 0, Math.PI * 2);
        ctx!.stroke();
        // Mini sun
        ctx!.fillStyle = 'rgba(237, 201, 72, 0.65)';
        ctx!.beginPath();
        ctx!.arc(bx - 2 * s, by, 2.5 * s, 0, Math.PI * 2);
        ctx!.fill();
        // Plus sign
        ctx!.strokeStyle = 'rgba(42, 149, 200, 0.75)';
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(bx + 2 * s, by - 3 * s);
        ctx!.lineTo(bx + 2 * s, by + 3 * s);
        ctx!.moveTo(bx - 1 * s, by);
        ctx!.lineTo(bx + 5 * s, by);
        ctx!.stroke();
      }

      // --- Camera arrow ---
      const [camSx, camSy] = project(viewMat, camX, camY, camZ, boxScale);
      const dotX = cx + camSx, dotY = cy + camSy;
      const [lookSx, lookSy] = project(viewMat, lookX, lookY, lookZ, 1);
      const lookLen2d = Math.sqrt(lookSx * lookSx + lookSy * lookSy);
      if (lookLen2d > 0.1) { lastDirX = lookSx / lookLen2d; lastDirY = lookSy / lookLen2d; }
      const dirX = lastDirX, dirY = lastDirY;

      const t = Date.now() * 0.004;
      const pulse = 0.7 + 0.3 * Math.sin(t);
      ctx!.fillStyle = `rgba(237, 201, 72, ${pulse * 0.1})`;
      ctx!.beginPath();
      ctx!.arc(dotX, dotY, 8 * s, 0, Math.PI * 2);
      ctx!.fill();

      const arrowLen = 10 * s, arrowWidth = 4 * s;
      const tipX = dotX + dirX * arrowLen, tipY = dotY + dirY * arrowLen;
      const perpX = -dirY * arrowWidth, perpY = dirX * arrowWidth;
      ctx!.fillStyle = `rgba(237, 201, 72, ${pulse * 0.9})`;
      ctx!.beginPath();
      ctx!.moveTo(tipX, tipY);
      ctx!.lineTo(dotX - dirX * 3 + perpX, dotY - dirY * 3 + perpY);
      ctx!.lineTo(dotX - dirX * 3 - perpX, dotY - dirY * 3 - perpY);
      ctx!.closePath();
      ctx!.fill();
      ctx!.fillStyle = `rgba(237, 201, 72, ${pulse})`;
      ctx!.beginPath();
      ctx!.arc(dotX, dotY, 2.5 * s, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.restore();
      animId = requestAnimationFrame(draw);
    }

    syncLights();
    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  });
</script>

<div class="gizmo-wrap">
  <canvas bind:this={canvas} class="gizmo"></canvas>
  <button class="backlight-btn" class:active={backlight}
    onclick={() => onbacklight?.(!backlight)}>
    <!-- lucide: camera -->
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
    <!-- lucide: lightbulb -->
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
    <div class="bl-toggle" class:on={backlight}>
      <div class="bl-knob"></div>
    </div>
    <span class="bl-label">Camera backlight</span>
  </button>
</div>

<style>
  .gizmo-wrap { position: relative; }
  .gizmo {
    display: block;
    width: 80%;
    height: auto;
    aspect-ratio: 1;
    margin: 0 auto;
    cursor: grab;
    opacity: 0.9;
    touch-action: none;
  }
  .gizmo:active { cursor: grabbing; }
  .backlight-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    background: rgba(6,21,13,0.8);
    border: 1px solid rgba(42,149,200,0.12);
    border-radius: 4px;
    padding: 3px 5px;
    color: rgba(250,247,240,0.3);
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .backlight-btn:hover { border-color: rgba(42,149,200,0.4); color: rgba(237,201,72,0.7); }
  .backlight-btn.active { color: rgba(237,201,72,0.9); border-color: rgba(237,201,72,0.3); }
  .bl-toggle {
    width: 18px; height: 9px; border-radius: 5px;
    background: rgba(250,247,240,0.1); position: relative; transition: background 0.15s;
  }
  .bl-toggle.on { background: rgba(237,201,72,0.35); }
  .bl-knob {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(250,247,240,0.5); position: absolute; top: 1px; left: 1px;
    transition: all 0.15s;
  }
  .bl-toggle.on .bl-knob { left: 10px; background: rgba(237,201,72,0.9); }
  .bl-label {
    display: none;
    font-size: 8px;
    font-family: var(--font-code, monospace);
    white-space: nowrap;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .backlight-btn:hover .bl-label { display: inline; }
</style>
