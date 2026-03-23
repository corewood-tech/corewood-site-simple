<!-- Source: 0x273a Algorithm Panel + dgraph_viewer querybuilder.js full port -->
<script lang="ts">
  // Server-side algorithm client — only used in non-demo mode
  let algorithmClient: any = null;
  if (!import.meta.env.SSR) {
    import('$lib/api/client').then(m => algorithmClient = m.algorithmClient).catch(() => {});
  }
  let { wasmEngine, onfocusnode, oninspectexternal, onpickstart, onpickend, pickedNode, onalgoselect, onalgodeselect, ondiscoverynodes, oncleardiscovery, demoMode = false }: {
    wasmEngine?: any;
    onfocusnode?: (uid: string) => void;
    oninspectexternal?: (data: { uid: string; name: string; labels: string[]; properties: Record<string, string>; connections: { uid: string; name: string; type: string; inView: boolean }[] }) => void;
    onpickstart?: () => void;
    onpickend?: () => void;
    pickedNode?: string | null;
    onalgoselect?: (uids: string[], label: string) => void;
    onalgodeselect?: () => void;
    ondiscoverynodes?: (nodes: DiscoveryNode[]) => void;
    oncleardiscovery?: () => void;
    demoMode?: boolean;
  } = $props();

  export type DiscoveryNode = { uid: string; name?: string; score?: number };

  const ALGO_REGISTRY: Record<string, AlgoCategory> = {
    centrality: {
      label: 'Centrality',
      algorithms: [
        { id: 'degree', label: 'Degree Centrality', mode: 'gradient', params: [],
          help: 'Ranks nodes by their number of connections. Highly connected nodes score higher.' },
        { id: 'betweenness', label: 'Betweenness Centrality', mode: 'gradient', params: [],
          help: 'Finds bridge nodes that sit on the shortest paths between other nodes. High scores indicate gatekeepers.' },
        { id: 'closeness', label: 'Closeness Centrality', mode: 'gradient', params: [],
          help: 'Measures how close a node is to all others. High scores mean a node can reach the rest of the graph quickly.' },
        { id: 'pagerank', label: 'PageRank', mode: 'gradient', params: [
          { name: 'damping', type: 'number', label: 'Damping', min: 0.1, max: 1, step: 0.05, default: 0.85 },
          { name: 'iterations', type: 'number', label: 'Iterations', min: 1, max: 100, step: 1, default: 30 }
        ], help: 'Ranks nodes by the quality and quantity of incoming links. A node linked by other important nodes scores higher.' },
        { id: 'hits', label: 'HITS', mode: 'gradient', params: [
          { name: 'metric', type: 'select', label: 'Metric',
            options: [{ value: 'authority', label: 'Authorities' }, { value: 'hub', label: 'Hubs' }], default: 'authority' },
          { name: 'iterations', type: 'number', label: 'Iterations', min: 1, max: 100, step: 1, default: 20 }
        ], help: 'Identifies two kinds of important nodes: Authorities (pointed to by many hubs) and Hubs (pointing to many authorities).' },
        { id: 'eigenvector', label: 'Eigenvector', mode: 'gradient', params: [
          { name: 'iterations', type: 'number', label: 'Iterations', min: 1, max: 100, step: 1, default: 30 }
        ], help: 'Ranks nodes by recursive influence — a node scores high if its neighbors also score high. Similar to PageRank but without damping.' },
        { id: 'clustering', label: 'Clustering Coefficient', mode: 'gradient', params: [],
          help: 'Measures how tightly clustered each node\'s neighbors are. High scores indicate nodes in dense cliques.' },
        { id: 'eccentricity', label: 'Eccentricity', mode: 'gradient', params: [],
          help: 'Inverse of max distance to any other node. High scores = central nodes that can reach everything quickly.' }
      ]
    },
    community: { label: 'Community', algorithms: [
      { id: 'label_propagation', label: 'Label Propagation', mode: 'community', params: [
        { name: 'iterations', type: 'number', label: 'Iterations', min: 1, max: 100, step: 1, default: 20 }
      ], help: 'Groups tightly connected nodes into communities. Each node adopts the most common label among its neighbors.' }
    ]},
    structure: { label: 'Structure', algorithms: [
      { id: 'kcore', label: 'K-Core', mode: 'binary', params: [
        { name: 'k', type: 'number', label: 'K value', min: 1, max: 50, step: 1, default: 2 }
      ], help: 'Finds the densest subgraph where every node has at least K connections. Higher K = denser core.' },
      { id: 'components', label: 'Connected Components', mode: 'community', params: [],
        help: 'Finds isolated clusters — groups of nodes that are connected to each other but not to the rest of the graph.' }
    ]},
    path: { label: 'Path', algorithms: [
      { id: 'shortest', label: 'Shortest Path', mode: 'path', params: [
        { name: 'source', type: 'nodeSelect', label: 'Source Node' },
        { name: 'target', type: 'nodeSelect', label: 'Target Node' }
      ], help: 'Finds the fewest hops between two nodes. Click a node to copy its UID into the source or target field.' },
      { id: 'ego', label: 'Ego Network', mode: 'binary', params: [
        { name: 'center', type: 'nodeSelect', label: 'Center Node' },
        { name: 'radius', type: 'number', label: 'Radius', min: 1, max: 10, step: 1, default: 2 }
      ], help: 'Shows all nodes within N hops of a center node — its local neighborhood.' },
      { id: 'bridges', label: 'Articulation Points', mode: 'path', params: [],
        help: 'Finds bridge nodes whose removal would split the graph into disconnected pieces. Critical structural nodes.' },
      { id: 'triangle_list', label: 'Triangle List', mode: 'path', serverOnly: true, params: [
        { name: 'limit', type: 'number', label: 'Max triangles', min: 1, max: 10000, step: 10, default: 100 }
      ], help: 'Enumerates actual triangles and highlights the nodes involved. Use to inspect which specific clusters form tight three-way connections.' }
    ]},
    metric: { label: 'Metric', algorithms: [
      { id: 'density', label: 'Network Density', mode: 'scalar', params: [],
        help: 'Ratio of actual edges to possible edges. 0 = no edges, 1 = every node connected to every other.' },
      { id: 'triangle_count', label: 'Triangle Count', mode: 'scalar', params: [],
        help: 'Total number of triangles (3-node cycles) in the graph. Measures overall clustering density.' },
      { id: 'diameter', label: 'Graph Diameter', mode: 'scalar', params: [],
        help: 'The longest shortest path between any two nodes. Measures how "spread out" the graph is.' }
    ]},
    diffusion: { label: 'Diffusion', algorithms: [
      { id: 'diffusion', label: 'Influence Spread', mode: 'gradient', serverOnly: true, params: [
        { name: 'source', type: 'nodeSelect', label: 'Seed Node' },
        { name: 'scale', type: 'number', label: 'Scale', min: 0.1, max: 10, step: 0.1, default: 1.0 },
        { name: 'order', type: 'number', label: 'Precision', min: 5, max: 50, step: 1, default: 20 }
      ], help: 'Simulates influence spreading from a seed node through the network. High scores = most reachable at the given scale. Use to model information flow, contagion, or influence reach.' },
      { id: 'anomaly', label: 'Anomaly Detection', mode: 'gradient', serverOnly: true, params: [
        { name: 'scale', type: 'number', label: 'Scale', min: 0.1, max: 10, step: 0.1, default: 2.0 },
        { name: 'order', type: 'number', label: 'Precision', min: 5, max: 50, step: 1, default: 20 }
      ], help: 'Detects structurally anomalous nodes whose local connectivity deviates from neighborhood norms. Use to find outliers, unusual bridges, or structural irregularities.' },
      { id: 'wavelet_embed', label: 'Structural Fingerprint', mode: 'gradient', serverOnly: true, params: [
        { name: 'dims', type: 'number', label: 'Dimensions', min: 2, max: 16, step: 1, default: 4 },
        { name: 'order', type: 'number', label: 'Precision', min: 5, max: 50, step: 1, default: 20 }
      ], help: 'Computes multi-scale structural fingerprints for each node. Score reflects overall structural complexity. Use to find structurally significant or unique nodes across multiple scales.' }
    ]}
  };

  const COMMUNITY_PALETTE = [
    '#4e79a7','#f28e2b','#e15759','#76b7b2','#59a14f',
    '#edc948','#b07aa1','#ff9da7','#9c755f','#bab0ac',
    '#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e',
    '#e6ab02','#a6761d','#666666'
  ];

  interface AlgoParam { name: string; type: string; label: string; min?: number; max?: number; step?: number; default?: any; options?: { value: string; label: string }[]; }
  interface AlgoEntry { id: string; label: string; mode: string; params: AlgoParam[]; help?: string; serverOnly?: boolean; }
  interface AlgoCategory { label: string; algorithms: AlgoEntry[]; }

  let panelCollapsed = $state(true);
  let selectedCategory = $state('centrality');
  let selectedAlgoIdx = $state(0);
  let paramValues: Record<string, any> = $state({});
  let pickingParam: string | null = $state(null); // which nodeSelect field is waiting for a graph pick
  let resultLabel = $state('');
  let resultMode = $state('');
  let algoScope: 'current' | 'all' = $state('current');
  let algoTimeMs = $state(0);
  let hasDiscoveryNodes = $state(false);
  let serverNames = new Map<string, string>();
  let serverNodeMap = new Map<string, { id: string; name: string; labels: string[]; properties: Record<string, string> }>();
  let serverEdgeMap = new Map<string, { uid: string; name: string; type: string; inView: boolean }[]>(); // uid → connected nodes
  let viewUidsSnapshot = new Set<string>();

  // Result types
  type GradientItem = { uid: string; name: string; score: number };
  type CommunityGroup = { idx: number; members: { uid: string; name: string }[]; color: string; expanded: boolean; focused: boolean };
  type PathItem = { uid: string; name: string; rank: number };

  let gradientResults: GradientItem[] = $state([]);
  let communityResults: CommunityGroup[] = $state([]);
  let pathResults: PathItem[] = $state([]);

  const categories = Object.keys(ALGO_REGISTRY).filter(cat => {
    if (!demoMode) return true;
    return ALGO_REGISTRY[cat].algorithms.some(a => !a.serverOnly);
  });
  const currentAlgos = $derived(
    (ALGO_REGISTRY[selectedCategory]?.algorithms || []).filter(a => !demoMode || !a.serverOnly)
  );
  const currentAlgo = $derived(currentAlgos[selectedAlgoIdx]);
  const currentParams = $derived(currentAlgo?.params || []);

  function startPick(paramName: string) {
    pickingParam = paramName;
    if (onpickstart) onpickstart();
  }

  function cancelPick() {
    pickingParam = null;
    if (onpickend) onpickend();
  }

  // When a node is picked from the graph, fill the waiting field
  $effect(() => {
    if (pickedNode && pickingParam) {
      paramValues[pickingParam] = pickedNode;
      // Try to get the node name for the typeahead display
      let name = pickedNode;
      try {
        const node = allNodes.find(n => n.uid === pickedNode);
        if (node) name = node.name || node.uid;
      } catch {}
      typeaheadQuery[pickingParam] = name;
      typeaheadOpen[pickingParam] = false;
      const prev = pickingParam;
      pickingParam = null;
      if (onpickend) onpickend();
    }
  });

  function onCategoryChange() { selectedAlgoIdx = 0; paramValues = {}; cancelPick(); }
  function onAlgoChange() { paramValues = {}; }

  // Force scope to 'all' when a server-only algorithm is selected
  $effect(() => {
    if (currentAlgo?.serverOnly) algoScope = 'all';
  });

  function getNodeName(uid: string): string {
    // Check server-hydrated names first (for "All" mode results)
    const sn = serverNames.get(uid);
    if (sn) return sn;
    // Then try WASM graph
    if (!wasmEngine) return uid;
    try {
      const json = wasmEngine.get_node_data(uid);
      const d = JSON.parse(json);
      return d.name || d.title || d.label || uid;
    } catch { return uid; }
  }

  function runAlgorithm() {
    if (!currentAlgo) return;
    if (algoScope === 'current' && !wasmEngine) return;
    clearResults();

    const params: Record<string, any> = {};
    for (const p of currentAlgo.params) {
      params[p.name] = paramValues[p.name] ?? p.default ?? '';
    }

    if (currentAlgo.id === 'shortest' && (!params.source || !params.target)) {
      resultLabel = 'Select source and target nodes'; return;
    }
    if (currentAlgo.id === 'ego' && !params.center) {
      resultLabel = 'Select a center node'; return;
    }

    if (algoScope === 'all') {
      runAlgorithmServer(params);
    } else {
      runAlgorithmLocal(params);
    }
  }

  function runAlgorithmLocal(params: Record<string, any>) {
    if (!wasmEngine) return;
    const t0 = performance.now();
    try {
      const json = wasmEngine.run_algorithm(currentAlgo.id, JSON.stringify(params));
      algoTimeMs = Math.round(performance.now() - t0);
      const result = JSON.parse(json);
      processAlgorithmResult(result);
    } catch (e: any) {
      algoTimeMs = Math.round(performance.now() - t0);
      resultLabel = `Error: ${e.message || e}`;
    }
  }

  async function runAlgorithmServer(params: Record<string, any>) {
    resultLabel = 'Running on full graph...';

    // Snapshot view UIDs synchronously BEFORE any async work (avoids RefCell re-entry)
    const viewUidsBefore = new Set<string>();
    if (wasmEngine) {
      try {
        const allNodes: { uid: string }[] = JSON.parse(wasmEngine.get_all_nodes());
        for (const n of allNodes) viewUidsBefore.add(n.uid);
      } catch {}
    }

    const t0 = performance.now();
    try {
      // Split params into typed maps
      const numberParams: Record<string, number> = {};
      const stringParams: Record<string, string> = {};
      for (const p of currentAlgo.params) {
        const val = params[p.name] ?? p.default;
        if (val === undefined || val === '') continue;
        if (p.type === 'number') numberParams[p.name] = Number(val);
        else stringParams[p.name] = String(val);
      }

      const resp = await algorithmClient.runAlgorithm({
        algorithm: currentAlgo.id,
        numberParams,
        stringParams,
      });
      algoTimeMs = Number(resp.durationMs) || Math.round(performance.now() - t0);

      // Build lookups from hydrated server nodes
      const serverNodeNames = new Map<string, string>();
      const nodeMap = new Map<string, { id: string; name: string; labels: string[]; properties: Record<string, string> }>();
      for (const n of resp.nodes) {
        const name = n.properties?.['name'] || n.properties?.['title'] || n.labels?.[0] || n.id;
        serverNodeNames.set(n.id, name);
        nodeMap.set(n.id, { id: n.id, name, labels: n.labels || [], properties: n.properties || {} });
      }
      serverNodeMap = nodeMap;

      // Build edge adjacency from server edges
      const edgeAdj = new Map<string, { uid: string; name: string; type: string; inView: boolean }[]>();
      for (const e of resp.edges) {
        const srcName = serverNodeNames.get(e.source) || e.source;
        const tgtName = serverNodeNames.get(e.target) || e.target;
        if (!edgeAdj.has(e.source)) edgeAdj.set(e.source, []);
        if (!edgeAdj.has(e.target)) edgeAdj.set(e.target, []);
        edgeAdj.get(e.source)!.push({ uid: e.target, name: tgtName, type: e.type, inView: viewUidsBefore.has(e.target) });
        edgeAdj.get(e.target)!.push({ uid: e.source, name: srcName, type: e.type, inView: viewUidsBefore.has(e.source) });
      }
      serverEdgeMap = edgeAdj;
      viewUidsSnapshot = viewUidsBefore;

      // Convert typed response to the result format processAlgorithmResult expects
      const result = typedResponseToResult(resp);

      // Track discovery UIDs (in server results but not in client graph)
      const allResultIds = collectResultIds(resp);
      const newDiscoveries: DiscoveryNode[] = [];
      for (const uid of allResultIds) {
        if (!viewUidsBefore.has(uid)) {
          newDiscoveries.push({ uid, name: serverNodeNames.get(uid) });
        }
      }
      if (newDiscoveries.length > 0 && ondiscoverynodes) {
        ondiscoverynodes(newDiscoveries);
        hasDiscoveryNodes = true;
      }

      // Override getNodeName for server results — use hydrated data
      serverNames = serverNodeNames;

      processAlgorithmResult(result, true);
    } catch (e: any) {
      algoTimeMs = Math.round(performance.now() - t0);
      resultLabel = `Error: ${e.message || e}`;
    }
  }

  function collectResultIds(resp: any): string[] {
    if (resp.scores?.length) return resp.scores.map((s: any) => s.nodeId);
    if (resp.communities?.length) return resp.communities.map((c: any) => c.nodeId);
    if (resp.nodeIds?.length) return resp.nodeIds;
    return [];
  }

  function typedResponseToResult(resp: any): any {
    if (resp.mode === 'gradient') {
      const scores: Record<string, number> = {};
      for (const s of resp.scores) scores[s.nodeId] = s.score;
      return { mode: 'gradient', label: resp.label, scores };
    }
    if (resp.mode === 'community') {
      const communities: Record<string, number> = {};
      for (const c of resp.communities) communities[c.nodeId] = c.community;
      return { mode: 'community', communities };
    }
    if (resp.mode === 'path') {
      return { mode: 'path', nodes: resp.nodeIds };
    }
    if (resp.mode === 'metric') {
      return { mode: 'metric', label: resp.label, value: resp.metricValue };
    }
    return { mode: resp.mode };
  }

  function buildTransactionAPIJson(nodes: any[], edges: any[]): string {
    const jsonNodes = nodes.map((n: any) => ({
      id: n.id,
      labels: n.labels || [],
      properties: n.properties || {},
    }));
    const jsonEdges = edges.map((e: any) => ({
      id: e.id,
      type: e.type,
      startNode: e.source,
      endNode: e.target,
      properties: {},
    }));
    return JSON.stringify({
      results: [{
        columns: [],
        data: [{ row: [], graph: { nodes: jsonNodes, relationships: jsonEdges } }]
      }],
      errors: []
    });
  }

  function processAlgorithmResult(result: any, fromServer = false) {
    resultMode = result.mode || currentAlgo.mode;

    if (result.mode === 'metric') {
      resultLabel = `${result.label}: ${result.value}`;
      return;
    }

    // Collect all UIDs from the result
    let resultUids: string[] = [];
    if (result.scores) resultUids = Object.keys(result.scores);
    else if (result.nodes) resultUids = result.nodes;
    else if (result.communities) resultUids = Object.keys(result.communities);

    // Highlight on graph + fly to results (only UIDs that exist in client graph)
    if (wasmEngine && resultUids.length > 0) {
      // Filter to client-known UIDs for highlight/fly-to
      let highlightUids = resultUids;
      if (fromServer) {
        const viewUids = new Set<string>();
        try {
          const allNodes: { uid: string }[] = JSON.parse(wasmEngine.get_all_nodes());
          for (const n of allNodes) viewUids.add(n.uid);
        } catch {}
        highlightUids = resultUids.filter(uid => viewUids.has(uid));
      }

      if (highlightUids.length > 0) {
        wasmEngine.set_highlight(JSON.stringify(highlightUids), result.mode === 'community' ? 'community' : result.mode);
        wasmEngine.fly_to_bounds(JSON.stringify(highlightUids));
      }
    }

    // Build display + emit active selection to status bar
    const scopeLabel = algoScope === 'all' ? ' (all)' : '';
    if (result.mode === 'gradient' && result.scores) {
      const sorted = Object.entries(result.scores as Record<string, number>)
        .sort((a, b) => b[1] - a[1]);
      gradientResults = sorted.slice(0, 200).map(([uid, score]) => ({
        uid, name: getNodeName(uid), score: score as number
      }));
      resultLabel = `${currentAlgo.label}${scopeLabel}: ${sorted.length} nodes`;
      if (onalgoselect) onalgoselect(Object.keys(result.scores), currentAlgo.label);
    } else if (result.mode === 'path' && result.nodes) {
      pathResults = (result.nodes as string[]).map((uid, i) => ({
        uid, name: getNodeName(uid), rank: i + 1
      }));
      resultLabel = `Path${scopeLabel}: ${result.nodes.length} nodes`;
      if (onalgoselect) onalgoselect(result.nodes, currentAlgo.label);
    } else if (result.mode === 'community' && result.communities) {
      const groups: Record<number, string[]> = {};
      for (const [uid, c] of Object.entries(result.communities as Record<string, number>)) {
        const ci = c as number;
        if (!groups[ci]) groups[ci] = [];
        groups[ci].push(uid);
      }
      communityResults = Object.values(groups)
        .sort((a, b) => b.length - a.length)
        .map((members, i) => ({
          idx: i,
          members: members.map(uid => ({ uid, name: getNodeName(uid) })),
          color: COMMUNITY_PALETTE[i % COMMUNITY_PALETTE.length],
          expanded: false,
          focused: false
        }));
      resultLabel = `${communityResults.length} communities${scopeLabel}`;
      const allUids = Object.keys(result.communities);
      if (onalgoselect) onalgoselect(allUids, `${communityResults.length} communities`);
    } else if (result.mode === 'binary' || (result.scores && !result.mode)) {
      const uids = result.scores ? Object.keys(result.scores) : (result.nodes || []);
      pathResults = uids.slice(0, 200).map((uid: string, i: number) => ({
        uid, name: getNodeName(uid), rank: i + 1
      }));
      resultLabel = `${currentAlgo.label}${scopeLabel}: ${uids.length} nodes`;
      if (onalgoselect) onalgoselect(uids, currentAlgo.label);
    }
  }

  function clearResults() {
    resultLabel = '';
    resultMode = '';
    algoTimeMs = 0;
    gradientResults = [];
    communityResults = [];
    pathResults = [];
    serverNames = new Map();
    serverNodeMap = new Map();
    serverEdgeMap = new Map();
    viewUidsSnapshot = new Set();
    hasDiscoveryNodes = false;
    if (wasmEngine) wasmEngine.clear_highlight();
    if (onalgodeselect) onalgodeselect();
  }

  function toggleCommunity(idx: number) {
    communityResults = communityResults.map(c =>
      c.idx === idx ? { ...c, expanded: !c.expanded } : c
    );
  }

  function focusCommunity(idx: number) {
    const group = communityResults.find(c => c.idx === idx);
    if (!group || !wasmEngine) return;
    const uids = group.members.map(m => m.uid);
    wasmEngine.set_highlight(JSON.stringify(uids), 'binary');
    wasmEngine.fly_to_bounds(JSON.stringify(uids));
    communityResults = communityResults.map(c => ({ ...c, focused: c.idx === idx }));
    if (onalgoselect) onalgoselect(uids, `community ${idx + 1}`);
  }

  function unfocusCommunity() {
    if (!wasmEngine) return;
    // Restore full community highlight
    const allUids = communityResults.flatMap(c => c.members.map(m => m.uid));
    wasmEngine.set_highlight(JSON.stringify(allUids), 'community');
    communityResults = communityResults.map(c => ({ ...c, focused: false }));
    if (onalgodeselect) onalgodeselect();
  }

  // Typeahead state
  type NodeSummary = { uid: string; name: string; type: string };
  let allNodes: NodeSummary[] = $state([]);
  let typeaheadQuery: Record<string, string> = $state({});
  let typeaheadOpen: Record<string, boolean> = $state({});
  let typeaheadHighlight: Record<string, number> = $state({});

  function refreshNodes() {
    if (!wasmEngine?.get_all_nodes) return;
    try { allNodes = JSON.parse(wasmEngine.get_all_nodes()); } catch { allNodes = []; }
  }

  function typeaheadResults(paramName: string): NodeSummary[] {
    const q = (typeaheadQuery[paramName] || '').toLowerCase().trim();
    if (!q) return allNodes.slice(0, 50);
    return allNodes.filter(n =>
      n.uid.toLowerCase().includes(q) ||
      n.name.toLowerCase().includes(q) ||
      n.type.toLowerCase().includes(q)
    ).slice(0, 50);
  }

  function selectNode(paramName: string, node: NodeSummary) {
    paramValues[paramName] = node.uid;
    typeaheadQuery[paramName] = node.name || node.uid;
    typeaheadOpen[paramName] = false;
  }

  function clearNodeSelect(paramName: string) {
    paramValues[paramName] = '';
    typeaheadQuery[paramName] = '';
    typeaheadOpen[paramName] = false;
  }

  function onTypeaheadInput(paramName: string, value: string) {
    typeaheadQuery[paramName] = value;
    paramValues[paramName] = '';
    typeaheadOpen[paramName] = true;
    typeaheadHighlight[paramName] = 0;
    if (allNodes.length === 0) refreshNodes();
  }

  function onTypeaheadFocus(paramName: string) {
    typeaheadOpen[paramName] = true;
    if (allNodes.length === 0) refreshNodes();
  }

  function onTypeaheadKeydown(paramName: string, e: KeyboardEvent) {
    const results = typeaheadResults(paramName);
    const idx = typeaheadHighlight[paramName] || 0;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      typeaheadHighlight[paramName] = Math.min(idx + 1, results.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      typeaheadHighlight[paramName] = Math.max(idx - 1, 0);
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      selectNode(paramName, results[idx]);
    } else if (e.key === 'Escape') {
      typeaheadOpen[paramName] = false;
    }
  }

  function goToNode(uid: string) {
    if (isInView(uid)) {
      if (onfocusnode) onfocusnode(uid);
    } else {
      // Discovery node — open modal with server-hydrated data, no fly-to
      const data = serverNodeMap.get(uid);
      if (data && oninspectexternal) {
        const connections = serverEdgeMap.get(uid) || [];
        oninspectexternal({ uid: data.id, name: data.name, labels: data.labels, properties: data.properties, connections });
      }
    }
  }

  function isInView(uid: string): boolean {
    return viewUidsSnapshot.size === 0 || viewUidsSnapshot.has(uid);
  }
</script>

<div class="algo-panel" class:collapsed={panelCollapsed}>
  <button class="algo-header" onclick={() => panelCollapsed = !panelCollapsed}>
    <h3>Analyze</h3>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
  </button>

  {#if !panelCollapsed}
    <div class="algo-body">
      <div class="algo-row">
        <select bind:value={selectedCategory} onchange={onCategoryChange}>
          {#each categories as cat}
            <option value={cat}>{ALGO_REGISTRY[cat].label}</option>
          {/each}
        </select>
        <select bind:value={selectedAlgoIdx} onchange={onAlgoChange}>
          {#each currentAlgos as algo, i}
            <option value={i}>{algo.label}</option>
          {/each}
        </select>
      </div>

      {#if currentAlgo?.help}
        <p class="algo-help">{currentAlgo.help}</p>
      {/if}

      {#if currentParams.length > 0}
        <div class="algo-params">
          {#each currentParams as param}
            <div class="param-row">
              <label for="algo-p-{param.name}">{param.label}</label>
              {#if param.type === 'number'}
                <input id="algo-p-{param.name}" type="number" value={paramValues[param.name] ?? param.default}
                  min={param.min} max={param.max} step={param.step}
                  oninput={(e) => paramValues[param.name] = (e.target as HTMLInputElement).value} />
              {:else if param.type === 'select'}
                <select id="algo-p-{param.name}" value={paramValues[param.name] ?? param.default}
                  onchange={(e) => paramValues[param.name] = (e.target as HTMLSelectElement).value}>
                  {#each param.options || [] as opt}
                    <option value={opt.value}>{opt.label}</option>
                  {/each}
                </select>
              {:else if param.type === 'nodeSelect'}
                <div class="node-select-wrap">
                  <button class="pick-btn" class:picking={pickingParam === param.name}
                    title="Pick from graph"
                    onclick={() => pickingParam === param.name ? cancelPick() : startPick(param.name)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/>
                      <line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/>
                      <line x1="18" y1="12" x2="22" y2="12"/>
                    </svg>
                  </button>
                  <input id="algo-p-{param.name}" type="text"
                    placeholder={pickingParam === param.name ? "Click a node in the graph..." : "Search uid, name, type..."}
                    autocomplete="off"
                    value={typeaheadQuery[param.name] || ''}
                    oninput={(e) => onTypeaheadInput(param.name, (e.target as HTMLInputElement).value)}
                    onfocus={() => onTypeaheadFocus(param.name)}
                    onblur={() => setTimeout(() => { typeaheadOpen[param.name] = false; }, 150)}
                    onkeydown={(e) => onTypeaheadKeydown(param.name, e)} />
                  {#if paramValues[param.name] || typeaheadQuery[param.name]}
                    <button class="node-clear" onclick={() => { clearNodeSelect(param.name); cancelPick(); }}>×</button>
                  {/if}
                  {#if typeaheadOpen[param.name]}
                    {@const results = typeaheadResults(param.name)}
                    {#if results.length > 0}
                      <div class="typeahead-dropdown">
                        {#each results as node, i}
                          <button class="typeahead-item" class:highlighted={i === (typeaheadHighlight[param.name] || 0)}
                            onmousedown={() => selectNode(param.name, node)}>
                            <span class="ta-name">{node.name || node.uid}</span>
                            <span class="ta-meta">{node.type}</span>
                            <span class="ta-uid">{node.uid}</span>
                          </button>
                        {/each}
                      </div>
                    {/if}
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      {#if !demoMode}
      <div class="algo-scope-row">
        <button class="scope-btn" class:active={algoScope === 'current'} disabled={currentAlgo?.serverOnly} onclick={() => algoScope = 'current'}>Current</button>
        <button class="scope-btn" class:active={algoScope === 'all'} onclick={() => algoScope = 'all'}>All</button>
      </div>
      {/if}

      <div class="algo-btn-row">
        <button class="btn btn-primary" onclick={runAlgorithm}>
          <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>Run
        </button>
        <button class="btn" onclick={clearResults}>
          <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>Clear
        </button>
      </div>
      {#if algoTimeMs > 0}
        <div class="algo-time">{algoTimeMs}ms</div>
      {/if}

      {#if resultLabel}
        <div class="result-header">{resultLabel}</div>
      {/if}

      <!-- Gradient results: ranked scores with names -->
      {#if gradientResults.length > 0}
        <div class="result-list">
          {#each gradientResults as item, i}
            <div class="result-item">
              <span class="result-rank">{i + 1}.</span>
              {#if isInView(item.uid)}
                <button class="node-link" onclick={() => goToNode(item.uid)}>{item.name}</button>
              {:else}
                <button class="node-link node-link-ext" onclick={() => goToNode(item.uid)}><span class="ext-marker">*</span>{item.name}</button>
              {/if}
              <span class="result-score">{item.score.toFixed(3)}</span>
            </div>
          {/each}
          {#if gradientResults.some(r => !isInView(r.uid))}
            <div class="not-displayed-footer"><span class="ext-marker">*</span> not displayed</div>
          {/if}
        </div>
      {/if}

      <!-- Path / Binary results -->
      {#if pathResults.length > 0}
        <div class="result-list">
          {#each pathResults as item}
            <div class="result-item">
              <span class="result-rank">{item.rank}.</span>
              {#if isInView(item.uid)}
                <button class="node-link" onclick={() => goToNode(item.uid)}>{item.name}</button>
              {:else}
                <button class="node-link node-link-ext" onclick={() => goToNode(item.uid)}><span class="ext-marker">*</span>{item.name}</button>
              {/if}
            </div>
          {/each}
          {#if pathResults.some(r => !isInView(r.uid))}
            <div class="not-displayed-footer"><span class="ext-marker">*</span> not displayed</div>
          {/if}
        </div>
      {/if}

      <!-- Community results: expandable groups with focus -->
      {#if communityResults.length > 0}
        <div class="result-list">
          {#each communityResults as group}
            <div class="community-group">
              <div class="community-header">
                <button class="community-toggle" onclick={() => toggleCommunity(group.idx)}>
                  <span class="community-dot" style="background: {group.color}"></span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"
                    style="transform: rotate({group.expanded ? '90' : '0'}deg); transition: transform 0.2s">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  <span>Community {group.idx + 1}: {group.members.length} nodes</span>
                </button>
                <button class="community-focus" title={group.focused ? 'Unfocus' : 'Focus this community'}
                  onclick={() => group.focused ? unfocusCommunity() : focusCommunity(group.idx)}>
                  {#if group.focused}
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  {:else}
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  {/if}
                </button>
              </div>
              {#if group.expanded}
                <div class="community-members">
                  {#each group.members as member}
                    <div class="result-item community-member">
                      {#if isInView(member.uid)}
                        <button class="node-link" onclick={() => goToNode(member.uid)}>{member.name}</button>
                      {:else}
                        <button class="node-link node-link-ext" onclick={() => goToNode(member.uid)}><span class="ext-marker">*</span>{member.name}</button>
                      {/if}
                    </div>
                  {/each}
                  {#if group.members.some(m => !isInView(m.uid))}
                    <div class="not-displayed-footer"><span class="ext-marker">*</span> not displayed</div>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .algo-panel { border-bottom: 1px solid rgba(250,247,240,0.06); }
  .algo-header {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 12px 16px; background: none; border: none;
    cursor: pointer; color: var(--cream-300); font-family: inherit; transition: color 0.15s;
  }
  .algo-header:hover { color: var(--morpho-400); }
  .algo-header h3 { font-size: 12px; font-weight: 600; margin: 0; }
  .algo-header svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2; fill: none; transition: transform 0.2s; }
  .collapsed .algo-header svg { transform: rotate(-90deg); }
  .algo-body { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 8px; }
  .algo-row { display: flex; flex-direction: column; gap: 4px; }
  select, .algo-body input[type="text"], .algo-body input[type="number"] {
    width: 100%; background: var(--forest-900); color: var(--cream-200);
    border: 1px solid rgba(250,247,240,0.08); border-radius: 8px;
    padding: 8px 10px; font-family: var(--font-body); font-size: 12px;
  }
  select:focus, .algo-body input:focus { outline: none; border-color: var(--morpho-400); }
  .algo-help {
    font-size: 11px; color: var(--cream-600); line-height: 1.4;
    margin: 0; padding: 4px 0;
  }
  .algo-params { display: flex; flex-direction: column; gap: 6px; }
  .param-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .param-row label { font-size: 11px; color: var(--cream-600); font-weight: 500; white-space: nowrap; }
  .param-row input, .param-row select { width: 120px; }
  .node-select-wrap { position: relative; flex: 1; display: flex; gap: 4px; align-items: center; }
  .node-select-wrap input { flex: 1; padding-right: 24px; }
  .node-clear { position: absolute; right: 6px; top: 8px; background: none; border: none; color: var(--cream-600); cursor: pointer; font-size: 16px; line-height: 1; padding: 2px; z-index: 2; }
  .node-clear:hover { color: var(--dart-400); }
  .pick-btn {
    width: 26px; height: 26px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(15,59,36,0.5); border: 1px solid rgba(42,149,200,0.15);
    border-radius: 4px; cursor: pointer; color: var(--cream-600);
    transition: all 0.15s; padding: 0;
  }
  .pick-btn svg { width: 14px; height: 14px; }
  .pick-btn:hover { background: rgba(42,149,200,0.15); color: var(--morpho-400); border-color: var(--morpho-400); }
  .pick-btn.picking { background: rgba(42,149,200,0.2); color: var(--morpho-300); border-color: var(--morpho-400); box-shadow: 0 0 6px rgba(42,149,200,0.3); }
  .typeahead-dropdown {
    position: absolute; top: 100%; left: 0; right: 0; z-index: 100;
    max-height: 200px; overflow-y: auto;
    background: var(--forest-900); border: 1px solid rgba(42,149,200,0.2);
    border-top: none; border-radius: 0 0 8px 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .typeahead-item {
    display: flex; align-items: center; gap: 6px; width: 100%;
    padding: 6px 10px; background: none; border: none; border-bottom: 1px solid rgba(250,247,240,0.03);
    color: var(--cream-200); font-family: inherit; font-size: 11px; cursor: pointer; text-align: left;
  }
  .typeahead-item:hover, .typeahead-item.highlighted { background: rgba(42,149,200,0.12); }
  .ta-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--cream-100); }
  .ta-meta { font-size: 10px; color: var(--morpho-400); flex-shrink: 0; }
  .ta-uid { font-size: 10px; color: var(--cream-700); font-family: var(--font-code); flex-shrink: 0; }
  .algo-scope-row { display: flex; gap: 0; margin-bottom: 6px; }
  .scope-btn { flex: 1; padding: 5px 8px; border: 1px solid rgba(250,247,240,0.08); background: var(--forest-700); color: var(--cream-500); font-family: var(--font-body); font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .scope-btn:first-child { border-radius: 6px 0 0 6px; }
  .scope-btn:last-child { border-radius: 0 6px 6px 0; border-left: none; }
  .scope-btn.active { background: var(--forest-500); color: var(--morpho-300); border-color: var(--morpho-400); }
  .scope-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .algo-btn-row { display: flex; gap: 6px; }
  .algo-time { font-size: 10px; color: var(--cream-600); font-family: var(--font-code); margin-top: 2px; }
  .btn { flex: 1; padding: 8px 12px; border: 1px solid rgba(250,247,240,0.08); border-radius: 8px; background: var(--forest-700); color: var(--cream-200); font-family: var(--font-body); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 5px; }
  .btn svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 2; fill: none; }
  .btn:hover { background: var(--forest-600); border-color: var(--morpho-400); color: var(--morpho-300); }
  .btn-primary { background: var(--forest-500); border-color: var(--forest-400); color: var(--cream-50); }
  .btn-primary:hover { background: var(--morpho-deep); border-color: var(--morpho-400); box-shadow: 0 2px 12px rgba(42,149,200,0.2); }

  .result-header { font-size: 12px; font-weight: 600; color: var(--morpho-300); padding: 6px 0 4px; border-bottom: 1px solid rgba(250,247,240,0.06); }
  .result-list { max-height: 400px; overflow-y: auto; }
  .result-item { display: flex; align-items: center; gap: 6px; padding: 3px 0; border-bottom: 1px solid rgba(250,247,240,0.03); font-size: 11px; }
  .result-rank { color: var(--cream-700); min-width: 24px; text-align: right; }
  .node-link { color: var(--morpho-400); cursor: pointer; text-decoration: underline; background: none; border: none; font-family: inherit; font-size: inherit; padding: 0; text-align: left; }
  .node-link-ext { color: var(--cream-500); }
  .ext-marker { color: #c44; font-weight: 700; margin-right: 2px; }
  .not-displayed-footer { font-size: 9px; color: var(--cream-700); padding: 4px 0 2px; font-style: italic; }
  .node-link:hover { color: var(--morpho-300); }
  .result-score { margin-left: auto; color: var(--cream-600); font-family: var(--font-code); font-size: 10px; }

  .community-group { border-bottom: 1px solid rgba(250,247,240,0.06); }
  .community-header { display: flex; align-items: center; gap: 4px; padding: 4px 0; }
  .community-toggle { display: flex; align-items: center; gap: 6px; flex: 1; background: none; border: none; color: var(--cream-300); font-family: inherit; font-size: 11px; font-weight: 500; cursor: pointer; padding: 2px 0; }
  .community-toggle:hover { color: var(--morpho-400); }
  .community-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .community-focus { background: none; border: none; color: var(--cream-600); cursor: pointer; padding: 2px; border-radius: 4px; }
  .community-focus:hover { color: var(--morpho-400); background: rgba(250,247,240,0.06); }
  .community-members { padding-left: 20px; }
  .community-member { padding: 2px 0; }
</style>
