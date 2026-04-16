/* ═══════════════════════════════════════════════════════════
   graph-bg.js — Infinite 3D graph texture background
   Graph extends far beyond viewport in every direction.
   Camera sits inside the graph, not outside looking at it.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PALETTE = ['#ff4d4d','#00f0c0','#4da6ff','#ff8c1a','#ffe033','#c44dff','#33ff77','#ff5599','#00e5ff','#d966ff'];
  var NODE_COUNT = 900;
  var EDGE_RATIO = 1.6;
  var VOLUME     = 2400;      // nodes fill a cube this wide
  var LINK_DIST  = 90;
  var REPULSION  = -200;
  var DAMPING    = 0.82;
  var CENTER_PULL = 0.0004;   // very weak — let the graph stay huge
  var DT          = 0.3;
  var PREBAKE    = 500;

  var scene, camera, renderer, nodeGroup, linkMesh, linkPosAttr;
  var nodes = [], edges = [];

  /* Camera orbits slowly INSIDE the graph, not outside */
  var spherical = { radius: 180, theta: 0, phi: Math.PI / 2.1 };
  var camTarget = new THREE.Vector3(0, 0, 0);

  var GEOS = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.BoxGeometry(1.2, 1.2, 1.2),
    new THREE.SphereGeometry(1, 12, 8),
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.OctahedronGeometry(1, 1)
  ];

  function hexToRgb(hex) {
    var c = hex.replace('#', '');
    return [parseInt(c.substring(0,2),16), parseInt(c.substring(2,4),16), parseInt(c.substring(4,6),16)];
  }

  function init() {
    var canvas = document.getElementById('graph-bg');
    if (!canvas) return;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();

    /* Wide FOV so graph fills every pixel, near nodes big, far nodes small */
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.5, 6000);

    scene.add(new THREE.AmbientLight(0xa0a898, 1.2));
    var key = new THREE.DirectionalLight(0xffffff, 0.6);
    key.position.set(300, 500, 400);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0x2D7A4A, 0.25);
    fill.position.set(-300, -200, -300);
    scene.add(fill);
    var rim = new THREE.PointLight(0x2A95C8, 0.3, 4000);
    rim.position.set(0, 300, -500);
    scene.add(rim);

    generateGraph();
    for (var i = 0; i < PREBAKE; i++) simTick();
    buildScene();
    syncCamera();
    window.addEventListener('resize', onResize);
    requestAnimationFrame(animate);
  }

  function generateGraph() {
    var half = VOLUME / 2;
    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x:  (Math.random() - 0.5) * VOLUME,
        y:  (Math.random() - 0.5) * VOLUME,
        z:  (Math.random() - 0.5) * VOLUME,
        vx: 0, vy: 0, vz: 0,
        color: PALETTE[i % PALETTE.length],
        geo: i % GEOS.length,
        size: 2, degree: 0
      });
    }

    var edgeCount = Math.floor(NODE_COUNT * EDGE_RATIO);
    for (var i = 0; i < edgeCount; i++) {
      var a = Math.floor(Math.random() * NODE_COUNT);
      var best = -1, bestDist = Infinity;
      for (var attempt = 0; attempt < 8; attempt++) {
        var cand = Math.floor(Math.random() * NODE_COUNT);
        if (cand === a) continue;
        var dx = nodes[a].x - nodes[cand].x;
        var dy = nodes[a].y - nodes[cand].y;
        var dz = nodes[a].z - nodes[cand].z;
        var d  = dx*dx + dy*dy + dz*dz;
        if (d < bestDist) { bestDist = d; best = cand; }
      }
      if (best < 0) best = (a + 1) % NODE_COUNT;
      edges.push([a, best]);
      nodes[a].degree++;
      nodes[best].degree++;
    }

    for (var i = 0; i < nodes.length; i++) {
      var deg = nodes[i].degree || 1;
      nodes[i].size = Math.max(1.4, Math.min(4.2, 1.4 + Math.log2(deg + 1) * 0.7));
    }
  }

  function buildScene() {
    nodeGroup = new THREE.Group();

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var mat = new THREE.MeshStandardMaterial({
        color: n.color,
        roughness: 0.45,
        metalness: 0.3,
        flatShading: true,
        transparent: true,
        opacity: 0.8
      });
      if (n.size > 3.5) {
        mat.emissive = new THREE.Color(n.color);
        mat.emissiveIntensity = 0.12;
      }
      var mesh = new THREE.Mesh(GEOS[n.geo], mat);
      mesh.scale.setScalar(n.size);
      mesh.position.set(n.x, n.y, n.z);
      n.mesh = mesh;
      nodeGroup.add(mesh);
    }
    scene.add(nodeGroup);

    /* Thick edges via cylinder tubes — LineBasicMaterial linewidth is capped at 1px by GPUs */
    var tubeRadius = 0.25;
    var tubeGeo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, 1, 4, 1);
    tubeGeo.rotateX(Math.PI / 2);
    tubeGeo.translate(0, 0, 0.5);

    for (var i = 0; i < edges.length; i++) {
      var src = nodes[edges[i][0]];
      var tgt = nodes[edges[i][1]];
      var mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.45
      });
      /* Blend source and target colors at 50/50 for the tube */
      var rgbS = hexToRgb(src.color);
      var rgbT = hexToRgb(tgt.color);
      mat.color = new THREE.Color(
        ((rgbS[0] + rgbT[0]) / 2) / 255,
        ((rgbS[1] + rgbT[1]) / 2) / 255,
        ((rgbS[2] + rgbT[2]) / 2) / 255
      );
      var tube = new THREE.Mesh(tubeGeo, mat);
      tube.userData.edgeIdx = i;
      scene.add(tube);
    }

    updateEdgePositions();
  }

  var _dir = new THREE.Vector3();
  var _up = new THREE.Vector3(0, 1, 0);

  function updateEdgePositions() {
    /* Position/orient each tube cylinder between its two nodes */
    var tubes = scene.children.filter(function(c) { return c.userData && c.userData.edgeIdx !== undefined; });
    for (var i = 0; i < tubes.length; i++) {
      var tube = tubes[i];
      var e = edges[tube.userData.edgeIdx];
      var s = nodes[e[0]];
      var t = nodes[e[1]];
      var dx = t.x - s.x, dy = t.y - s.y, dz = t.z - s.z;
      var len = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.01;
      tube.position.set(s.x, s.y, s.z);
      _dir.set(dx, dy, dz).normalize();
      tube.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), _dir);
      tube.scale.set(1, 1, len);
    }
  }

  function simTick() {
    var n = nodes.length;
    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) {
        var dx = nodes[j].x - nodes[i].x;
        var dy = nodes[j].y - nodes[i].y;
        var dz = nodes[j].z - nodes[i].z;
        var d2 = dx*dx + dy*dy + dz*dz + 1;
        if (d2 > 400000) continue;
        var f = REPULSION / d2;
        var fx = dx * f, fy = dy * f, fz = dz * f;
        nodes[i].vx -= fx; nodes[i].vy -= fy; nodes[i].vz -= fz;
        nodes[j].vx += fx; nodes[j].vy += fy; nodes[j].vz += fz;
      }
    }
    for (var i = 0; i < edges.length; i++) {
      var s = nodes[edges[i][0]];
      var t = nodes[edges[i][1]];
      var dx = t.x - s.x, dy = t.y - s.y, dz = t.z - s.z;
      var dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
      var f = (dist - LINK_DIST) * 0.004;
      var fx = (dx / dist) * f, fy = (dy / dist) * f, fz = (dz / dist) * f;
      s.vx += fx; s.vy += fy; s.vz += fz;
      t.vx -= fx; t.vy -= fy; t.vz -= fz;
    }
    for (var i = 0; i < n; i++) {
      var nd = nodes[i];
      nd.vx -= nd.x * CENTER_PULL;
      nd.vy -= nd.y * CENTER_PULL;
      nd.vz -= nd.z * CENTER_PULL;
      nd.vx *= DAMPING; nd.vy *= DAMPING; nd.vz *= DAMPING;
      nd.x += nd.vx * DT;
      nd.y += nd.vy * DT;
      nd.z += nd.vz * DT;
    }
  }

  function syncCamera() {
    var sp = spherical;
    var sinPhi = Math.sin(sp.phi);
    camera.position.set(
      camTarget.x + sp.radius * sinPhi * Math.sin(sp.theta),
      camTarget.y + sp.radius * Math.cos(sp.phi),
      camTarget.z + sp.radius * sinPhi * Math.cos(sp.theta)
    );
    camera.lookAt(camTarget);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!renderer) return;
    spherical.theta += 0.0005;
    spherical.phi = (Math.PI / 2.1) + Math.sin(Date.now() * 0.00005) * 0.08;
    spherical.radius = 180 + Math.sin(Date.now() * 0.00003) * 40;
    syncCamera();
    renderer.render(scene, camera);
  }

  function onResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
