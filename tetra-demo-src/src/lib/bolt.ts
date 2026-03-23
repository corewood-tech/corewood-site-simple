// Direct Bolt connection from the browser to Neo4j/EdgeGlider.
// Uses the neo4j-driver which connects via WebSocket in browser environments.
// Connection config comes from the backend's /api/protocol response, not the UI.
import neo4j, { type Driver, type Record as Neo4jRecord, type Node, type Relationship, type Path } from 'neo4j-driver';

let driver: Driver | null = null;

export interface BoltConfig {
  url: string;      // bolt://host:7687 or neo4j://host:7687
  user: string;
  password: string;
}

export function connect(cfg: BoltConfig): Driver {
  disconnect();
  driver = neo4j.driver(cfg.url, neo4j.auth.basic(cfg.user, cfg.password));
  return driver;
}

export function disconnect() {
  if (driver) {
    driver.close().catch(() => {});
    driver = null;
  }
}

// Run a Cypher query and return results in dgraph-compatible format.
// This replaces both the Go proxy AND the neo4jToDgraph transform.
export async function query(cypher: string, nodeLabelMap: Record<string, string> = {}): Promise<{ data: { q: any[] } }> {
  if (!driver) throw new Error('Not connected');

  const session = driver.session();
  try {
    const result = await session.run(cypher);
    return recordsToDgraph(result.records, nodeLabelMap);
  } finally {
    await session.close();
  }
}

// Run a scalar query (e.g., count) and return the raw value.
export async function scalarQuery(cypher: string): Promise<any> {
  if (!driver) throw new Error('Not connected');

  const session = driver.session();
  try {
    const result = await session.run(cypher);
    if (result.records.length === 0) return null;
    const val = result.records[0].get(0);
    if (neo4j.isInt(val)) return val.toNumber();
    return val;
  } finally {
    await session.close();
  }
}

// Convert Bolt records directly to dgraph-compatible format for the WASM engine.
// Skips the intermediate HTTP Transaction API JSON entirely.
function recordsToDgraph(
  records: Neo4jRecord[],
  nodeLabelMap: Record<string, string>
): { data: { q: any[] } } {
  const nodeMap = new Map<string, any>();
  const edges: Array<{ type: string; start: string; end: string }> = [];

  for (const record of records) {
    for (const value of record.values()) {
      if (isNode(value)) {
        collectNode(value, nodeMap, nodeLabelMap);
      } else if (isRelationship(value)) {
        collectRelationship(value, edges);
      } else if (isPath(value)) {
        for (const node of (value as Path).segments.map(s => s.start).concat([(value as Path).end])) {
          collectNode(node, nodeMap, nodeLabelMap);
        }
        for (const seg of (value as Path).segments) {
          collectRelationship(seg.relationship, edges);
        }
      }
    }
  }

  // Wire edges as nested references (dgraph style)
  for (const edge of edges) {
    const src = nodeMap.get(edge.start);
    const tgt = nodeMap.get(edge.end);
    if (!src || !tgt) continue;
    const key = edge.type.toLowerCase();
    if (!src[key]) src[key] = [];
    src[key].push({ uid: tgt.uid, name: tgt.name, 'dgraph.type': tgt['dgraph.type'] });
  }

  return { data: { q: Array.from(nodeMap.values()) } };
}

function nodeIdStr(node: Node): string {
  if (node.elementId) return node.elementId;
  return node.identity.toString();
}

function collectNode(node: Node, nodeMap: Map<string, any>, nodeLabelMap: Record<string, string>) {
  const uid = nodeIdStr(node);
  if (nodeMap.has(uid)) return;

  const props = convertProps(node.properties);
  const entry: any = { uid, ...props };

  if (node.labels && node.labels.length > 0) {
    entry['dgraph.type'] = node.labels;
  }

  entry.name = resolveLabel(entry, nodeLabelMap);
  nodeMap.set(uid, entry);
}

function collectRelationship(rel: Relationship, edges: Array<{ type: string; start: string; end: string }>) {
  const startId = rel.startNodeElementId || rel.start.toString();
  const endId = rel.endNodeElementId || rel.end.toString();
  edges.push({
    type: rel.type || 'edge',
    start: startId,
    end: endId,
  });
}

function resolveLabel(node: any, nodeLabelMap: Record<string, string>): string {
  const nodeType = node['dgraph.type']?.[0];
  if (nodeType && nodeLabelMap[nodeType]) {
    const val = node[nodeLabelMap[nodeType]];
    if (val != null) return String(val);
  }
  if (node.name != null) return String(node.name);
  for (const v of Object.values(node)) {
    if (typeof v === 'string' && v.length > 0 && v !== node.uid) return v;
  }
  return node.uid;
}

function convertProps(props: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    out[k] = convertValue(v);
  }
  return out;
}

function convertValue(v: any): any {
  if (v === null || v === undefined) return v;
  if (neo4j.isInt(v)) return v.toNumber();
  if (Array.isArray(v)) return v.map(convertValue);
  if (typeof v === 'object' && v.constructor === Object) return convertProps(v);
  return v;
}

function isNode(v: any): v is Node {
  return v !== null && typeof v === 'object' && 'labels' in v && 'properties' in v && 'identity' in v;
}

function isRelationship(v: any): v is Relationship {
  return v !== null && typeof v === 'object' && 'type' in v && 'start' in v && 'end' in v && 'properties' in v && !('labels' in v);
}

function isPath(v: any): v is Path {
  return v !== null && typeof v === 'object' && 'segments' in v && 'start' in v && 'end' in v;
}
