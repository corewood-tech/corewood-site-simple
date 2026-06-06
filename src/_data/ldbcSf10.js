// Drives the LDBC SNB SF10 section on /tetra/.
//
// Numbers come from src/_data/ldbcSf10Results.json (drop a new run there to
// refresh). Per-query curation (display name, mermaid shape, work description,
// stat chips) lives in this file so it stays attached to the query identity
// even if latencies change.

const path = require('path');
const results = require(path.join(__dirname, 'ldbcSf10Results.json'));

const TIER_MS = { fast: 100, mid: 500 }; // <100 fast, 100–500 mid, else slow

const fmtLatency = (us) => {
  if (us == null) return '—';
  if (us >= 1_000_000) return `${(us / 1_000_000).toFixed(2)}s`;
  if (us >= 1000)      return `${Math.round(us / 1000)}ms`;
  return `${(us / 1000).toFixed(1)}ms`;
};

const tierFor = (us) => {
  const ms = us / 1000;
  if (ms < TIER_MS.fast) return 'fast';
  if (ms < TIER_MS.mid)  return 'mid';
  return 'slow';
};

// IC card curation (shape + prose). Latencies come from the JSON.
const IC_DETAILS = {
  IC1: {
    diagram: `graph LR
  P((Person)):::p -->|"KNOWS*1..3"| F((friend)):::p
  F -->|IS_LOCATED_IN| C[City]:::loc
  F -.->|STUDY_AT| U[Uni]:::org
  F -.->|WORK_AT| W[Comp]:::org
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef loc fill:#59a14f,stroke:none,color:#F5F0E6
  classDef org fill:#f28e2b,stroke:none,color:#F5F0E6`,
    work: `Explore all persons within <strong>3 friendship hops</strong> who share a given first name. Visits ~80,000 persons across the 3-hop KNOWS frontier, reads the firstName property on each, deduplicates. After filtering and ranking, enriches the top 20 with their city of residence, universities attended (with enrollment year), and employers (with start year).`,
    stats: ['~1.4M edges', '20 rows', '3-hop VLP + enrichment joins'],
  },
  IC2: {
    diagram: `graph LR
  P((Person)):::p -->|KNOWS| F((friend)):::p
  M["Post | Comment"]:::m -->|HAS_CREATOR| F
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6`,
    work: `Retrieve the <strong>20 most recent messages</strong> from direct friends. Finds ~200 friends, examines ~77,000 messages (Posts and Comments) authored by those friends, applies a date ceiling, and selects the top 20 newest by creation date using a heap.`,
    stats: ['~77K edges', '20 rows', '1-hop + top-K selection'],
  },
  IC3: {
    diagram: `graph LR
  P((Person)):::p -->|"KNOWS*1..2"| F((friend)):::p
  F -->|located| Co[Country]:::loc
  M["message"]:::m -->|HAS_CREATOR| F
  M -->|located| Co2["Country X/Y"]:::loc
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef loc fill:#59a14f,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6`,
    work: `Count messages by <strong>2-hop friends in two specific countries</strong>, excluding friends who live in either country. Explores ~5,500 persons across 2 hops, resolves each person's location through a City→Country chain, applies the exclusion filter, then scans ~1.9M messages and joins each to its country of origin. Splits counts into two country-specific buckets using conditional aggregation.`,
    stats: ['~4M edges', '20 rows', '2-hop VLP + NOT pattern + 5-hop chain'],
  },
  IC4: {
    diagram: `graph LR
  P((Person)):::p -->|KNOWS| F((friend)):::p
  Po[Post]:::m -->|HAS_CREATOR| F
  Po -->|HAS_TAG| T[Tag]:::org
  X["NOT EXISTS: same tag before date"]:::res
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6
  classDef org fill:#f28e2b,stroke:none,color:#F5F0E6
  classDef res fill:#e15759,stroke:none,color:#F5F0E6`,
    work: `Find tags that appear on <strong>recent friend posts but never on older friend posts</strong> &mdash; newly trending topics. Scans ~200 friends' posts within a date window, collects their tags (~36,000 post-tag pairs), then for each candidate tag verifies it has no occurrence before the start date. This is a correlated anti-join: the engine must cross-reference each tag against the entire pre-window post history of the same friend set.`,
    stats: ['~300K–500K edges', '10 rows', 'NOT EXISTS correlated subquery'],
  },
  IC5: {
    diagram: `graph LR
  P((Person)):::p -->|"KNOWS*1..2"| F((friend)):::p
  Fo[Forum]:::org -->|HAS_MEMBER| F
  Fo -->|CONTAINER_OF| Po[Post]:::m
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6
  classDef org fill:#f28e2b,stroke:none,color:#F5F0E6`,
    work: `Rank forums by <strong>how many 2-hop friends joined recently</strong>, then count each forum's total posts. Deduplicates ~5,500 persons from the 2-hop frontier, scans ~55,000 forum memberships with a date filter on the membership edge, groups by forum, sorts by friend count. For the top 20 forums, counts all contained posts. Four sequential pipeline stages, each requiring full materialization before the next begins.`,
    stats: ['~85K–130K edges', '20 rows', '2-hop VLP + 4 WITH barriers'],
  },
  IC6: {
    diagram: `graph LR
  P((Person)):::p -->|"KNOWS*1..2"| F((friend)):::p
  Po[Post]:::m -->|HAS_CREATOR| F
  Po -->|HAS_TAG| T1["known Tag"]:::org
  Po -->|HAS_TAG| T2["co-occurring"]:::res
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6
  classDef org fill:#f28e2b,stroke:none,color:#F5F0E6
  classDef res fill:#b07aa1,stroke:none,color:#F5F0E6`,
    work: `Find tags that <strong>co-occur with a named tag</strong> on posts by 2-hop friends. Scans ~660,000 posts from ~5,500 friends and checks ~2.6M tag edges to find the ~16,500 posts carrying the target tag. Then reads ~66,000 co-occurring tags on those posts. Groups by tag name with distinct post count.`,
    stats: ['~3.3M edges', '10 rows', '2-hop VLP + full post×tag scan'],
  },
  IC7: {
    diagram: `graph LR
  P((Person)):::p -->|created| M["messages"]:::m
  M -->|LIKES| L((likers)):::res
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6
  classDef res fill:#b07aa1,stroke:none,color:#F5F0E6`,
    work: `Find who <strong>most recently liked the seed person's content</strong>. Scans ~385 messages, follows ~3,850 LIKES edges, sorts by like timestamp, groups by liker keeping only the most recent like per person. Checks whether each liker is already a friend (boolean NOT EXISTS). Computes the time gap between the like and the original message creation.`,
    stats: ['~4.3K edges', '20 rows', 'reversed chain + head(collect())'],
  },
  IC8: {
    diagram: `graph LR
  P((Person)):::p -->|created| M["messages"]:::m
  C[Comment]:::m2 -->|REPLY_OF| M
  C -->|HAS_CREATOR| A((author)):::res
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6
  classDef m2 fill:#76b7b2,stroke:none,color:#F5F0E6
  classDef res fill:#b07aa1,stroke:none,color:#F5F0E6`,
    work: `Find the <strong>most recent replies to the seed person's content</strong>. Scans ~385 messages, follows ~3,080 REPLY_OF edges to find comments, resolves each comment's author. Returns the 20 newest replies sorted by creation date. A straight 4-hop chain with no aggregation or VLP.`,
    stats: ['~6.5K edges', '20 rows', '4-hop chain + top-K'],
  },
  IC9: {
    diagram: `graph LR
  P((Person)):::p -->|"KNOWS*1..2"| F((friend)):::p
  M["Post | Comment"]:::m -->|HAS_CREATOR| F
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6`,
    work: `Retrieve the <strong>20 most recent messages from 2-hop friends</strong>. Deduplicates ~5,500 persons from the 2-hop frontier, then scans all of their authored content &mdash; approximately <strong>2.1 million messages</strong>. Applies a date filter and multi-label check (Post or Comment), then selects the top 20 by creation date via a 20-element heap over the full 2.1M candidates.`,
    stats: ['~2.1M edges', '20 rows', '2-hop VLP + bulk scan + top-K heap'],
  },
  IC10: {
    diagram: `graph LR
  P((Person)):::p -->|"KNOWS*2"| FoF((fof)):::p
  FoF -->|IS_LOCATED_IN| C[City]:::loc
  Po[Post]:::m -->|HAS_CREATOR| FoF
  Po -->|HAS_TAG| T[Tag]:::org
  T -->|HAS_INTEREST| P
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef loc fill:#59a14f,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6
  classDef org fill:#f28e2b,stroke:none,color:#F5F0E6`,
    work: `Score <strong>friend-of-friends by shared interests</strong>. Takes the exactly-2-hop KNOWS frontier (~8,000 persons), excludes direct friends and the seed, filters by birthday month (~833 candidates remaining). For each candidate, runs two passes: one counting posts whose tags match the seed's declared interests, one counting posts that don't match. Computes a similarity score as the difference.`,
    stats: ['~500K–600K edges', '10 rows', 'fixed 2-hop VLP + double OPTIONAL MATCH'],
  },
  IC11: {
    diagram: `graph LR
  P((Person)):::p -->|"KNOWS*1..2"| F((friend)):::p
  F -->|WORK_AT| O[Org]:::org
  O -->|IS_LOCATED_IN| Co[Country]:::loc
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef org fill:#f28e2b,stroke:none,color:#F5F0E6
  classDef loc fill:#59a14f,stroke:none,color:#F5F0E6`,
    work: `Find <strong>2-hop friends who work at companies in a specific country</strong> before a given year. Explores ~5,500 persons, follows ~8,250 WORK_AT edges (most people have 1–2 jobs), resolves each company's country, filters by country name and employment start year. Sorts by work-from year with tiebreakers on person ID and company name (mixed ASC/DESC).`,
    stats: ['~33K edges', '10 rows', '2-hop VLP + 4-hop chain + property filters'],
  },
  IC12: {
    diagram: `graph LR
  P((Person)):::p -->|KNOWS| F((friend)):::p
  C[Comment]:::m -->|HAS_CREATOR| F
  C -->|REPLY_OF| Po[Post]:::m
  Po -->|HAS_TAG| T[Tag]:::org
  T -->|HAS_TYPE| TC[TagClass]:::org
  TC -->|"SUBCLASS*0.."| B["base class"]:::res
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef m fill:#76b7b2,stroke:none,color:#F5F0E6
  classDef org fill:#f28e2b,stroke:none,color:#F5F0E6
  classDef res fill:#b07aa1,stroke:none,color:#F5F0E6`,
    work: `Find friends whose comments reply to posts tagged under a given <strong>tag class hierarchy &mdash; the deepest chain at 7+ hops</strong>. For ~200 friends, examines ~53,000 comments. Each comment is chased through a mandatory 7-hop path: Comment→REPLY_OF→Post→HAS_TAG→Tag→HAS_TYPE→TagClass, then up the IS_SUBCLASS_OF tree (variable depth, min 0) to test against a named base class. Every comment must complete the full chain before the engine knows if it qualifies.`,
    stats: ['~530K edges', '20 rows', '7-hop chain + VLP on class hierarchy'],
  },
  IC13: {
    diagram: `graph LR
  P1((Person 1)):::p ---|"KNOWS* &mdash; BFS"| P2((Person 2)):::res
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef res fill:#b07aa1,stroke:none,color:#F5F0E6`,
    work: `Find the <strong>shortest friendship path</strong> between two people. Launches a bidirectional breadth-first search from both endpoints through the KNOWS graph (68,673 persons). Social network path lengths average ~4 hops, so each direction expands only ~2 frontiers before they meet. No property reads, no filters &mdash; pure adjacency-list iteration on the compact KNOWS subgraph.`,
    stats: ['~16K edges', '1 row', 'bidirectional BFS'],
  },
  IC14: {
    diagram: `graph LR
  P1((Person 1)):::p ---|"KNOWS* &mdash; all paths"| P2((Person 2)):::res
  classDef p fill:#4e79a7,stroke:none,color:#F5F0E6
  classDef res fill:#b07aa1,stroke:none,color:#F5F0E6`,
    work: `Enumerate <strong>all shortest friendship paths</strong> between two people. Same BFS as IC13, but tracks every equal-length route by recording multiple parent pointers when a node is reached by different shortest paths simultaneously. After BFS completes, reconstructs all 15 paths by backtracking through the parent DAG. Returns each path as a list of person IDs. Same ~16K edge reads as IC13; the multi-parent bookkeeping and path enumeration (15 paths × ~4 nodes) add negligible cost.`,
    stats: ['~16K edges', '15 rows', 'bidirectional BFS + multi-parent tracking'],
  },
};

function buildList(category) {
  return results.results
    .filter((r) => r.category === category)
    .map((r) => ({
      id: r.id,
      name: r.title,
      cypher: r.cypher,
      avgUs: r.avg_us,
      avgRows: r.avg_rows,
      latencyLabel: fmtLatency(r.avg_us),
      tier: tierFor(r.avg_us),
    }));
}

const ic = buildList('Interactive Complex Reads').map((q) => ({
  ...q,
  details: IC_DETAILS[q.id] || null,
}));

const is_ = buildList('Interactive Short Reads');

const dataset = {
  totalNodes: results.graph_info.total_nodes,
  totalEdges: results.graph_info.total_edges,
  persons:    results.graph_info.persons,
  posts:      results.graph_info.posts,
  comments:   results.graph_info.comments,
  forums:     results.graph_info.forums,
  tags:       results.graph_info.tags,
};

// Storage comparison (curated; not in the JSON results file).
const storage = {
  caption: 'Same SF10 dataset, ingested into each engine. Tetra stores the entire graph in a single mmap’d file.',
  rows: [
    { label: 'Raw CSV (LDBC SF10 export)', size: '10 GB',  ratio: '2.6×',  highlight: false },
    { label: 'Tetra (single file, mmap)',  size: '3.9 GB', ratio: '—',     highlight: true  },
    { label: 'Postgres',                   size: '30+ GB', ratio: '7.7×',  highlight: false },
    { label: 'Neo4j',                      size: '60+ GB', ratio: '15.4×', highlight: false },
  ],
};

const environment = {
  engine:     'Tetra / EdgeGlider · native arm64 binary · single process · in-process (no network hop)',
  storage:    'Single file · mmap’d · LDBC SNB SF10',
  hardware:   'Apple M-series · single machine · CPU only — no GPU, no cluster',
  protocol:   'Bolt v4.4 (Neo4j wire-compatible) · openCypher',
  parameters: 'Sampled live from graph · top persons by KNOWS degree',
  date:       results.timestamp ? results.timestamp.slice(0, 10) : '2026-05-02',
};

module.exports = {
  ic,
  is: is_,
  dataset,
  storage,
  environment,
};
