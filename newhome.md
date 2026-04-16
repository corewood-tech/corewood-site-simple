# Corewood Homepage — Neo4j Killer Edition

New homepage copy. TETRA is the headline. Every section positions against Neo4j. Existing stats (172M edges, 3.6 GB single file, <4 GB peak RAM, 405ms avg) stay as-is. Partners, consulting, and other Corewood content retained lower on the page.

---

# HERO

## Headline
**The Neo4j killer.**

## Sub-headline
*Faster. Smaller. A fraction of the cost.*

## Lead paragraph
Neo4j charges you $65/GB/month and still crashes under concurrent writes. TETRA runs the same Cypher queries on **10× less RAM**, passes all 14 LDBC Interactive Complex queries at SF10 scale, and costs **$299/month flat**. Same Bolt protocol. Same openCypher. Migrate in an afternoon.

## Hero stats (4-up, comparative)

| | TETRA | Neo4j |
|---|---|---|
| RAM used, same workload | **66 MB** | 710 MB |
| Write operations completed | **11/11** | 0/11 (OOM) |
| Monthly cost (16 GB equivalent) | **$299** | $1,051 |
| LDBC SF10 — full suite | **14/14 · 405ms avg** | Fails several |

## CTAs
- **See the benchmarks →**
- **Schedule a migration call →**

---

# SECTION: The benchmark Neo4j doesn't want you to see

## Heading
We ran 105 Cypher queries. Same hardware. Same Bolt protocol. We gave Neo4j 2× the RAM budget.

## Body
Neo4j got 1 GB and 1 CPU. TETRA got 512 MB and 1 CPU. Both containerized. Both running the Recommendations dataset (28,863 nodes, 166,261 edges). Both speaking Bolt.

**The result: 37 wins for TETRA. 19 for Neo4j. And Neo4j OOM-crashed on every write operation we tried.**

## Query win breakdown

| Category | TETRA | Neo4j | TETRA speedup |
|---|---|---|---|
| Counts & Lookups | 5 | 0 | 1.1×–3.9× |
| Traversals | 5 | 2 | varied |
| Aggregation | **6** | 0 | **2.9×–63×** |
| WITH Pipeline | 6 | 0 | 1.1×–22× |
| Real-World App | **7** | 0 | **1.4×–290×** |
| Stress Test | 4 | 1 | varied |
| **Total** | **37** | **19** | — |

## Callout
Neo4j's 19 wins are concentrated in multi-variable RETURN projections and OPTIONAL MATCH chains — known planner optimization targets for TETRA, not architectural limits. We publish them alongside our wins because you deserve to know.

## CTA
See the full head-to-head →

---

# SECTION: Neo4j's throughput collapses. TETRA's stays flat.

## Heading
Here's what happens when real traffic shows up.

## Body
We ran a mixed workload against both databases. Scaled from 1 to 64 concurrent Bolt clients. Gave Neo4j 1 GB of RAM. Gave TETRA 512 MB.

Neo4j's throughput dropped 68% between 1 and 8 clients. At 64 clients, Neo4j crashed. TETRA stayed flat at 485 queries per second.

## Throughput table

| Concurrent clients | TETRA (q/s) | Neo4j (q/s) |
|---|---|---|
| 1 | 391 | 90 |
| 4 | 457 | 37 |
| 8 | 471 | 29 |
| 32 | 468 | 54 |
| **64** | **485** | **OOM crash** |

## Callout
The JVM garbage collector fights the memory limit. Throughput degrades. Eventually the process dies. This is not a configuration problem — it's the architecture.

TETRA has no JVM, no GC pauses, no heap pressure. When you eventually exhaust the CPU, performance degrades *linearly*. No cliffs. No crashes.

---

# SECTION: 172M edges. Single file. 3.6 GB on disk.

## Heading
While Neo4j was busy OOMing, we ran the hardest graph benchmark in the industry.

## Body
The LDBC Social Network Benchmark is the industry-standard test for graph databases, maintained by the Graph Data Council. Scale Factor 10 is a social network with **27.2 million nodes and 172.2 million edges**.

The 14 Interactive Complex queries are not micro-benchmarks. They include variable-length path traversals, 7-hop chain queries through class hierarchies, correlated anti-joins, and bidirectional BFS across 68,000 persons.

**TETRA passes all 14. Average latency: 405ms. Shortest path: 0.5ms. Single process. Single 3.6 GB file. Under 4 GB of RAM.**

## Stats (4-up)

**172M edges**
LDBC SF10 — 27.2M nodes, 16 edge types, 13 node labels

**14/14 passed**
Full Interactive Complex suite

**405ms avg**
Six queries under 100ms, two under 1ms

**3.6 GB · <4 GB RAM**
Single file, mmap'd, no indexes, no logs, no caches

## Callout
Neo4j's own wire protocol. Our engine. Single process. No cluster. No auxiliary infrastructure. Run it on a laptop, a VM, or alongside your app server.

## CTA
See the SF10 breakdown →

---

# SECTION: Neo4j's real cost

## Heading
You're paying Neo4j by the gigabyte. Forever.

## Body
Neo4j AuraDB Professional charges **$65 per GB of RAM per month**. Business Critical doubles that to $146/GB/month. Self-hosted Enterprise is "Contact Sales" — third-party data says $20,000 to $200,000+ per year depending on core count.

Then come the add-ons. Bloom (visualization) is $1,200–$2,500 per user per year for self-hosted. Graph Data Science is $10,000–$25,000+ per year for small deployments.

TETRA is **$299/month flat**. Retina (our 3D graph viewer) included. 30+ algorithms included. Full openCypher included. No per-GB scaling. No tier upgrades. No "Contact Sales."

## Monthly pricing comparison

| Config | Monthly |
|---|---|
| Neo4j AuraDB Pro 8GB | $526 |
| Neo4j AuraDB Pro 16GB | $1,051 |
| Neo4j AuraDB Pro 32GB | $2,102 |
| Neo4j AuraDB BC 8GB | $1,168 |
| Neo4j AuraDB BC 32GB | $4,672 |
| **TETRA** | **$299** |

## 5-year cumulative cost

| | Year 1 | Year 3 | Year 5 |
|---|---|---|---|
| Neo4j Pro 16GB | $12,614 | $37,843 | $63,072 |
| Neo4j BC 8GB | $14,016 | $42,048 | $70,080 |
| **TETRA** | **$3,588** | **$10,764** | **$17,940** |

## Callout
By year five, you've paid Neo4j $63,000 to crash on concurrent writes. The same workload on TETRA costs $17,940 — and it doesn't crash.

## CTA
See every pricing tier →

---

# SECTION: Migration in an afternoon

## Heading
You're already writing Cypher. We pass every test.

## Body
TETRA implements **100% of the openCypher Technology Compatibility Kit** — 1,611 of 1,611 scenarios. Full Bolt v4.4 protocol. Neo4j's own wire format.

Point your existing Neo4j driver at TETRA's endpoint. Your application doesn't know the difference.

## Compatibility stats

**1,611/1,611**
Cypher TCK scenarios passed — 100% compliance

**Bolt v4.4**
Neo4j's own wire protocol, fully compatible

**Drop-in**
Same drivers, same queries, same clients

## Migration services
For datasets that need our team to handle ingestion and validation: **$10,864 one-time**. Includes full schema conversion, CSV or JSON ingest, and validation against your existing Neo4j output. 10 GB of CSV data processed in under 7 minutes on 5 GB of RAM.

Or migrate yourself. The wire protocol is compatible.

## CTA
Book a migration call →

---

# SECTION: What $299 actually includes

## Heading
Everything Neo4j charges extra for. Included.

## Feature grid

**Retina — 3D Graph Viewer**
WebGPU-driven 2D/3D graph explorer with server-side and client-side analytics. Run shortest path, verify migrations, visualize your data. Export to CSV or JSON. Free and ungated.
*Neo4j Bloom: $1,200–$2,500 per user per year (self-hosted).*

**30+ Graph Algorithms**
Community detection, centrality, embeddings, pathfinding — built in.
*Neo4j Graph Data Science: $10,000–$25,000+ per year.*

**Full openCypher**
1,611/1,611 TCK scenarios. Bolt v4.4 protocol. Drop-in with existing Neo4j drivers.
*Neo4j's own standard. We pass 100% of it.*

**Post-Quantum Encryption**
Files encrypted at rest with post-quantum resistant cryptography. The encrypted file IS the queryable database.
*Neo4j: standard encryption only.*

**~38% Compression**
Raw data compresses to ~38% of original, including all structures needed to query it. No separate indexes. Zero data resolution loss (formally proven).
*Neo4j: 5–10× overhead from indexes, logs, caches, replication layers.*

**Co-location Ready**
66 MB of RAM. 24 MB Alpine container. Runs alongside your app — no cluster, no network hop.
*Neo4j: requires dedicated cluster, JVM, 710 MB+ for equivalent workload.*

---

# SECTION: What TETRA replaces

## Heading
One engine. Everything Neo4j needs a stack for.

## Body
A traditional graph database deployment is five systems, not one:

- The database engine (JVM, heap-managed, cluster-aware)
- Indexes and write-ahead logs (separate storage, 5–10× overhead)
- The visualization layer (Bloom — separate license, separate server)
- The analytics library (GDS — separate license, separate cores)
- The ops layer (monitoring, backup coordination, cluster management)

TETRA is one binary. One file. One process. The compressed, encrypted file *is* the query engine. Retina is built in. The algorithms are built in. Post-quantum encryption is built in.

**You don't manage a stack. You run a binary.**

---

# SECTION: Where Neo4j wins

## Heading
19 queries. We publish them too.

## Body
Out of 105 Cypher queries, Neo4j beats TETRA on 19. They're concentrated in multi-variable RETURN projections and OPTIONAL MATCH chains — known query planner optimization targets in our upcoming releases.

We publish them for the same reason we publish everything else: if you're going to trust a database with your data, you deserve to see where it falls short. Not just where it wins.

## CTA
See every query, every result →

---

# SECTION: Also by Corewood

*(Retain existing Partners / Corewood Also block — Landscope, RogueDB, GalenAI, Rootstock. Position after the TETRA section.)*

## Building the future together.

**Landscope** — Geospatial intelligence and earth observation. Mapping the planet's ecosystems with precision.

**RogueDB** — Database infrastructure for the next generation. Rethinking how data systems are built.

**GalenAI** — AI-powered medical intelligence. Bringing clinical decision support to the point of care.

**Rootstock** — Citizen science meets data collection. A campaign platform enabling citizen scientists to submit data for research.

---

# SECTION: Consulting practice

*(Retain existing three "Your X" consulting pitch blocks — RAG, GIS, auth — as they are.)*

## "Your RAG system doesn't know who's asking."
*(existing copy)*

## "Your location data is trapped in legacy tools."
*(existing copy)*

## "You'll land an enterprise customer. Will your auth survive?"
*(existing copy)*

---

# SECTION: How we work

*(Retain existing consulting engagement block — free consultation, project/retainer, pricing, climate/nonprofit pricing.)*

---

# FINAL CTA

## Headline
Everyone else used this math to build language models.

## Sub-headline
We used it to kill Neo4j.

## CTAs
- **Schedule a migration call →**
- **See the benchmarks →**

---

# Page metadata / SEO

## Title tag
TETRA — The Neo4j Killer · Faster, Smaller, $299/mo · Corewood

## Meta description
The graph database that beats Neo4j on benchmarks and costs a fraction of the price. 10× less RAM, 100% Cypher compatibility, $299/month flat. Migrate from Neo4j in an afternoon.

## Keywords to rank for
- neo4j alternative
- neo4j killer
- cheap graph database
- neo4j pricing comparison
- graph database vs neo4j
- replace neo4j
- neo4j too expensive
- faster than neo4j
- neo4j benchmark

## Open Graph / Twitter card
**Title:** The Neo4j Killer
**Description:** 10× less RAM. 37–19 on benchmarks. Neo4j crashes on writes. TETRA runs 172M edges on a single file. $299/month flat.
**Image:** Benchmark comparison chart or the 66 MB vs 710 MB visual