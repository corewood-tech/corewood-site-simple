// Reads the head-to-head container benchmark from /benchmrks.json (Tetra +
// Neo4j + native, p99 microbench on the Recommendations dataset) and pivots
// it into shapes the Tetra page templates loop over.
//
// To refresh numbers: drop a new benchmrks.json at the repo root and rebuild.
// No template changes needed.

const path = require('path');
const raw = require(path.join(__dirname, '..', '..', 'benchmrks.json'));

// Display labels per JSON section key. Order here determines page order.
const SECTION_META = [
  { key: 'counts',      title: 'Counts & Lookups',     desc: 'Schema metadata, label counts, property lookups' },
  { key: '1-hop',       title: '1-hop traversals',     desc: 'Single relationship hops' },
  { key: '2-hop',       title: '2-hop traversals',     desc: 'Two-hop relationship chains' },
  { key: '3-hop',       title: '3-hop traversals',     desc: 'Three-hop relationship chains' },
  { key: 'agg',         title: 'Aggregations',         desc: 'GROUP BY, ORDER BY, count/sum/avg' },
  { key: 'with',        title: 'WITH clauses',         desc: 'Stage barriers, projections, post-filter' },
  { key: 'multi',       title: 'Multi-pattern',        desc: 'Multiple MATCH clauses, multi-variable RETURN' },
  { key: 'exotic',      title: 'Exotic Cypher',        desc: 'shortestPath, OPTIONAL MATCH, EXISTS, OR-in-WHERE' },
  { key: 'devastating', title: 'Devastating / stress', desc: 'Deep chains, VLP, Kevin Bacon numbers' },
  { key: 'app',         title: 'Application queries',  desc: 'Recs, collab filter, search, pages' },
];

const TIE_RATIO = 1.05; // 5% buffer per the established methodology

const fmtUs = (us) => {
  if (us == null) return '—';
  if (us >= 1000) return `${(us / 1000).toFixed(us >= 10000 ? 0 : 1)}ms`;
  return `${Math.round(us)}μs`;
};

const fmtRatio = (r) => {
  if (r == null) return '—';
  if (r >= 10) return `${Math.round(r)}×`;
  return `${r.toFixed(1)}×`;
};

function classifyWinner(tetra, neo) {
  if (tetra == null || neo == null || tetra <= 0 || neo <= 0) return 'missing';
  if (tetra * (1 / TIE_RATIO) > neo) return 'neo';
  if (neo * (1 / TIE_RATIO) > tetra) return 'tetra';
  return 'tie';
}

// Decorate one raw record with derived display fields.
function decorate(rec) {
  const t = rec.tetra && rec.tetra.p99_us;
  const n = rec.neo4j && rec.neo4j.p99_us;
  const winner = classifyWinner(t, n);

  let ratio = null;
  let headline = '';
  if (winner === 'tetra') {
    ratio = n / t;
    headline = `TETRA, ${fmtRatio(ratio)} faster`;
  } else if (winner === 'neo') {
    ratio = t / n;
    headline = `Neo4j, ${fmtRatio(ratio)} faster`;
  } else if (winner === 'tie') {
    headline = 'Tie (≤5%)';
  } else {
    headline = '—';
  }

  // Bar widths: loser pegs to 100%, winner scales by ratio.
  let tetraBarWidth = 100, neoBarWidth = 100;
  if (winner === 'tetra' && ratio) {
    tetraBarWidth = Math.max(2, Math.round(100 / ratio));
  } else if (winner === 'neo' && ratio) {
    neoBarWidth = Math.max(2, Math.round(100 / ratio));
  }

  return {
    section: rec.section,
    name: rec.name,
    cypher: rec.cypher,
    tetraUs: t,
    neoUs: n,
    nativeUs: rec.native && rec.native.p99_us,
    tetraLabel: fmtUs(t),
    neoLabel: fmtUs(n),
    nativeLabel: fmtUs(rec.native && rec.native.p99_us),
    winner,
    ratio,
    headline,
    tetraBarWidth,
    neoBarWidth,
  };
}

const decorated = raw.map(decorate);

// Group by section, preserving JSON insertion order within each section.
const bySection = new Map();
for (const r of decorated) {
  if (!bySection.has(r.section)) bySection.set(r.section, []);
  bySection.get(r.section).push(r);
}

const sections = SECTION_META.map((meta) => {
  const queries = bySection.get(meta.key) || [];
  const tetraWins = queries.filter((q) => q.winner === 'tetra').length;
  return {
    ...meta,
    queries,
    total: queries.length,
    tetraWins,
    neoWins: queries.filter((q) => q.winner === 'neo').length,
    tied: queries.filter((q) => q.winner === 'tie').length,
    tallyLabel: `TETRA ${tetraWins}/${queries.length}`,
  };
}).filter((s) => s.queries.length > 0);

// Cross-section "Where Neo4j wins" rollup.
const neoWins = decorated
  .filter((q) => q.winner === 'neo')
  .sort((a, b) => (b.ratio || 0) - (a.ratio || 0));

// Overall tally across all 78 queries.
const tally = {
  total: decorated.length,
  tetra: decorated.filter((q) => q.winner === 'tetra').length,
  neo:   decorated.filter((q) => q.winner === 'neo').length,
  tied:  decorated.filter((q) => q.winner === 'tie').length,
};

// Iteration count surfaced to the page (assumes all rows agree; falls back
// to the first record if not).
const iterations = (decorated[0] && raw[0] && raw[0].tetra && raw[0].tetra.iters) || null;

module.exports = {
  sections,
  neoWins,
  tally,
  iterations,
};
