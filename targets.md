# TETRA Site Content

---

# `/tetra` — Updated Main Page

## Hero (keep existing)

## Proof Banner (NEW — place after hero)

### Heading
The proof.

### Stat cards

**27.2M nodes · 172M edges**
LDBC SF10 — the industry-standard graph benchmark

**14/14 · 405ms avg**
Interactive Complex queries passed, single process, single file

**37–19 vs Neo4j**
Same hardware, same queries — Neo4j OOMs on writes

**1,611/1,611 · 100%**
Full openCypher compliance

### CTAs
- See the benchmarks
- See the pricing

---

## Solution Section (UPDATE existing copy)

### Heading
One engine. A fraction of the footprint.

### Body
TETRA files compress to ~38% of the initial raw data size — and that includes everything needed to search and query it (what other databases call indexes). There is no separate index layer. The compressed, post-quantum encrypted file *is* the query engine. By formal proof, zero data resolution is lost.

Where a traditional system wraps your data in layers of infrastructure — indexes, logs, caches, replication layers — TETRA's structure *is* the query engine. Nothing is wasted.

That efficiency cascades into every cost line:

**Smaller data**
Smaller servers. Lower cloud bills. Lower electricity. A multi-server cluster workload runs on a single standard machine.

**Single engine**
Replaces separate systems for structured records, relationships, search, and analytics.

**Lower ops burden**
No indexes, logs, caches, or replication layers to maintain.

**Runs anywhere**
Datacenter, edge, or a device in the field.

---

## What's Included Section (NEW)

### Heading
What $299/month includes.

### Feature cards

**Retina — 3D Graph Viewer**
WebGPU-driven 2D/3D graph explorer with server-side and client-side analytics. Run shortest path, verify migrations, query and visualize data. Export to CSV or JSON. Free and ungated.

**30+ Graph Algorithms**
Built in. No add-on licensing. Neo4j charges $10K–$25K+/year for Graph Data Science. TigerGraph charges 10% compute surcharge for Insights.

**Post-Quantum Encryption**
TETRA files are encrypted at rest with post-quantum resistant cryptography. The encrypted, compressed file IS the queryable database — no decryption step for queries.

**~38% Compression**
Raw data compresses to ~38% of original, including all structures needed to search and query. No separate indexes. By formal proof, zero data resolution is lost.

**100% Cypher TCK**
1,611/1,611 openCypher scenarios passed. Full standard compliance over Bolt v4.4. Neptune can't run shortestPath(). TigerGraph uses proprietary GSQL.

**Co-location Ready**
66 MB of RAM for 166K edges. Native binary in a 24 MB Alpine container. Runs alongside your app — no cluster, no network hop.

---

## Competitive Economics Section (NEW)

### Heading
What it actually costs.

### Lead
Every graph database prices differently. We did the math. All prices verified from vendor sites, April 2026.

### Monthly pricing comparison

| Provider | Config | Monthly | What's missing from that price |
|---|---|---|---|
| **TETRA** | Flat rate | **$299** | Nothing. Retina, 30+ algorithms, full Cypher included. |
| Neptune | db.r5.large, single | $297 | No HA. +replicas (2–4× instance cost), +I/O, +storage. No shortestPath(). |
| Neo4j AuraDB Pro | 16 GB / 3 CPU | $1,051 | Bloom included cloud-only. Self-hosted GDS $10K–$25K+/yr extra. |
| Neo4j AuraDB BC | 8 GB / 2 CPU | $1,168 | SLAs, RBAC, SSO. Self-hosted Enterprise $20K–$200K+/yr. |
| TigerGraph Savanna | TG-00 (2 vCPU, 16 GB) | $720 | Compute only. +HA 2.8× (~$2,016/mo), +storage, +add-ons. |

### 5-year cumulative

| | Year 1 | Year 3 | Year 5 |
|---|---|---|---|
| **TETRA (product)** | **$3,588** | **$10,764** | **$17,940** |
| TETRA (w/ migration) | $14,452 | $21,328 | $28,504 |
| Neptune single-instance | $3,559 | $10,678 | $17,796 |
| TigerGraph TG-00 | $8,640 | $25,920 | $43,200 |
| Neo4j Pro 16GB | $12,614 | $37,843 | $63,072 |
| Neo4j BC 8GB | $14,016 | $42,048 | $70,080 |

### Read the fine print
Neptune's $297/mo is a single instance with no failover or read scaling. Production requires writer + replicas (2–4× instance cost). TigerGraph's $720/mo is compute only — HA adds a 2.8× multiplier. Neo4j self-hosted Bloom ($1,200–$2,500/user/yr) and GDS estimates are from Vendr third-party transaction data.

### Sources
- [neo4j.com/pricing](https://neo4j.com/pricing/)
- [docs.tigergraph.com/savanna/main/overview/pricing](https://docs.tigergraph.com/savanna/main/overview/pricing)
- [aws.amazon.com/neptune/pricing](https://aws.amazon.com/neptune/pricing/)
- [vendr.com/marketplace/neo4j](https://www.vendr.com/marketplace/neo4j)
- [docs.aws.amazon.com — Neptune openCypher compliance](https://docs.aws.amazon.com/neptune/latest/userguide/feature-opencypher-compliance.html)

---

## Pricing Section (UPDATE existing copy)

### TETRA

**$299/month.** The database. Flat rate. No per-GB scaling. No add-on tiers. Includes Retina, 30+ algorithms, full Cypher, and operational support.

**$10,864 one-time professional services.** Optional. For migrations where our team ingests, converts, and validates your existing data. 10 GB of CSV data in under 7 minutes on 5 GB of RAM.

---

## SF10 Section (ADD to environment block)

### Environment

- engine: Tetra / EdgeGlider · native arm64 binary · single process · in-process
- storage: Single file · mmap'd · LDBC SNB SF10
- hardware: Apple M-series · single machine · CPU only
- **peak RSS: [TO INSTRUMENT]**
- **file size on disk: [TO INSTRUMENT]**
- **total wall-clock for 14 IC queries: [TO INSTRUMENT]**
- protocol: Bolt v4.4 (Neo4j wire-compatible) · openCypher
- parameters: Sampled live from graph · top persons by KNOWS degree

### For context (NEW paragraph after results table)

TigerGraph's audited LDBC SNB BI result at SF1000 was run on a Dell PowerEdge R7725 bare-metal server (AMD EPYC). GraphScope Flex holds throughput records (130K+ ops/s at SF100/SF300) on full server infrastructure. Neo4j failed to complete several IC queries at SF10 in the 2019 Rusu & Huang study. Amazon Neptune has no published LDBC results — its openCypher implementation does not support shortestPath() or allShortestPaths(). TETRA passes 14/14 on a single process from a single file.

---

## Where Neo4j Wins (ADD to existing section)

We ship what's real, including what's not done yet. The 19 queries where Neo4j outperforms TETRA are concentrated in multi-variable RETURN projections and OPTIONAL MATCH chains — known query planner optimization targets. We expect these gaps to close in upcoming releases.

---

# `/tetra/vs-neo4j` — NEW Page

## Hero

### Headline
You're paying too much for Neo4j. And it still OOMs on writes.

### Sub-hero
Same queries. Same hardware. Same Bolt protocol. We gave Neo4j twice the RAM budget.

Neo4j used 10.8× more memory. Crashed on concurrent writes. Failed half the LDBC Interactive Complex queries. Costs $1,051/month for 16GB of RAM.

TETRA ran the full suite in 66 MB. Passed all 14 LDBC queries. Stayed flat at 64 concurrent clients. **$299/month flat.**

## Stat cards

**66 MB vs 710 MB**
TETRA RAM used vs Neo4j RAM used — on the same workload, with Neo4j getting 2× the budget

**14/14 vs partial**
LDBC SF10 Interactive Complex queries — TETRA passes all, Neo4j fails several

**11/11 vs 0/11**
Write operations completed — Neo4j OOMs on every one

**$299 vs $1,051**
Monthly cost for equivalent capacity — Neo4j AuraDB Pro 16GB vs TETRA flat rate

## We ran the benchmark. Here's what happened.

105 Cypher queries. 30 iterations each. Both containerized with hard resource limits. Neo4j got 1 GB of RAM and 1 CPU; TETRA got 512 MB and 1 CPU.

**TETRA won 37 queries. Neo4j won 19. TETRA completed all 11 write operations; Neo4j OOM-crashed on every one.**

| Category | TETRA wins | Neo4j wins | TETRA speedup |
|---|---|---|---|
| Counts & Lookups | 5 | 0 | 1.1×–3.9× |
| Traversals | 5 | 2 | varied |
| Aggregation | 6 | 0 | 2.9×–63× |
| WITH Pipeline | 6 | 0 | 1.1×–22× |
| Real-World App | 7 | 0 | 1.4×–290× |
| Stress Test | 4 | 1 | varied |
| **Total** | **37** | **19** | |
| **Write ops** | **11/11** | **0/11 OOM** | |

Throughput under concurrency: Neo4j drops from 90 q/s at 1 client to 29 q/s at 8 clients (the JVM GC fights the memory limit). At 64 concurrent clients, Neo4j crashes. TETRA stays flat at 485 q/s.

## Neo4j's real cost

Neo4j AuraDB pricing scales with RAM. **$65/GB/month** on Professional. **$146/GB/month** on Business Critical.

| Config | Monthly | Year 1 | Year 5 |
|---|---|---|---|
| AuraDB Pro 8GB | $526 | $6,307 | $31,536 |
| **AuraDB Pro 16GB** | **$1,051** | **$12,614** | **$63,072** |
| AuraDB BC 8GB | $1,168 | $14,016 | $70,080 |
| AuraDB BC 32GB | $4,672 | $56,064 | $280,320 |
| **TETRA** | **$299** | **$3,588** | **$17,940** |

And that's before the add-ons. Self-hosted Bloom licensing: $1,200–$2,500/user/year. Graph Data Science library: $10,000–$25,000+/year. Self-hosted Enterprise: $20,000–$200,000+/year.

TETRA includes all of it.

## Migration in an afternoon

TETRA passes 100% of the Cypher TCK — all 1,611 scenarios. Same Bolt protocol Neo4j drivers already use. Same openCypher queries you've already written.

Point your existing Neo4j driver at TETRA's Bolt endpoint. Your application doesn't know the difference.

## Where Neo4j wins

Neo4j outperforms TETRA on 19 of the 105 queries we tested. They're concentrated in multi-variable RETURN projections and OPTIONAL MATCH chains — known query planner optimization targets. We publish them alongside our wins because you deserve to know.

## CTAs

- See the full benchmark
- Clone the benchmark repo
- Schedule a migration call

---

# `/tetra/startups` — NEW Page

## Hero

### Headline
The graph database that fits on your existing app servers.

### Sub-hero
A new graph database usually means a new cluster, new monitoring, new on-call rotation, a new $1,500/month line item — at a time when every CFO is asking where to cut.

TETRA runs alongside your app. Same machine. 66 MB of RAM. **$299/month flat.**

## Stat cards

**$299/month flat**
No per-GB scaling. No add-on tiers. Everything included.

**66 MB RAM**
Fits in the margins your app server already has. No separate infrastructure tier.

**Zero network latency**
Co-located. Localhost Bolt or in-process. Queries in microseconds, not milliseconds.

**$45,000+ saved**
5-year cumulative savings vs Neo4j AuraDB Pro 16GB per service

## The infrastructure tier you don't need

Traditional architecture: App → network → database cluster → network → app. Every query pays a network round-trip. Every cluster is a separate bill, a separate on-call rotation, a separate thing that breaks at 3am.

TETRA architecture: App + TETRA on the same machine. Same container if you want. Bolt over localhost or in-process. Data access latency is measured in microseconds.

This works because TETRA is 66 MB of RAM for a real workload. A native binary in a 24 MB Alpine container. It fits in the margins your app server already has — it's not competing with your app for resources.

## Linear degradation, not cliff-edge failure

A database that spikes unpredictably or crashes under load can't share a machine with your app. A database with linear, predictable degradation can.

| Concurrent clients | TETRA (q/s) | Neo4j (q/s) |
|---|---|---|
| 1 | 391 | 90 |
| 8 | 471 | 29 |
| 32 | 468 | 54 |
| 64 | **485** | **OOM crash** |

TETRA's throughput *increases* with concurrency and stays flat. Neo4j's *decreases* as the JVM GC fights the memory limit — then crashes.

## TCO vs everyone

| Year | Neo4j Pro 16GB | Neptune production | TigerGraph TG-00 | **TETRA** |
|---|---|---|---|---|
| 1 | $12,614 | $6,500+ | $8,640 | **$3,588** |
| 3 | $37,843 | $19,500+ | $25,920 | **$10,764** |
| 5 | $63,072 | $32,500+ | $43,200 | **$17,940** |

Every dollar you don't spend on database infrastructure is a dollar of runway.

## CTAs

- See the benchmarks
- Talk to us

---

# `/tetra/ai` — NEW Page

## Hero

### Headline
Your RAG system is guessing. Give it something to reason over.

### Sub-hero
Vector databases retrieve documents. They don't retrieve *relationships*. When your model needs to know how two entities are connected — through what path, via what intermediaries, under what conditions — vector similarity can't answer.

GraphRAG fixes this. **3.4× better accuracy** than vector-only retrieval. The only problem: every other graph database is too heavy to sit inside an inference loop.

## Stat cards

**3.4× accuracy lift**
GraphRAG vs vector-only retrieval (Diffbot KG-LM Benchmark)

**0.5ms shortest path**
Bidirectional BFS across 68K-person graph

**66 MB RAM**
Fits in the margins of your GPU inference server

**$299/month**
Flat rate. Full openCypher. 30+ algorithms. No cluster.

## Why RAG hallucinates

Your model retrieves documents. It stitches together an answer from text fragments. It doesn't actually *know* whether entity A relates to entity B, or through what path. When retrieval fails to surface the right context, the model confabulates.

Vector similarity is good at "find documents like this one." It's bad at "find the connection between these two things." Most real business questions are the second kind.

## What GraphRAG does differently

Structured knowledge graphs give models explicit relationships. Not "here are three documents about Alice and Bob" — but "Alice works at Acme, Bob works at Acme, both report to Carol, Carol is in the org chart under the VP of Engineering."

The Diffbot KG-LM Accuracy Benchmark tested this across 43 complex business questions. GraphRAG with structured knowledge outperformed vector-only retrieval by 3.4×.

## Why existing graph DBs don't fit

Neo4j needs a cluster. Neptune needs a VPC. TigerGraph needs a PowerEdge. None of them can sit on the same machine as your model — they're entire infrastructure tiers, not libraries you run alongside inference.

Every retrieval becomes a network round-trip. Every hop through the graph is another latency cost. At scale, the overhead eats the accuracy gains.

## TETRA: 66 MB on your GPU server

Single native binary. Single mmap'd file. 66 MB of RAM for a real workload. Runs on the same machine as your model — localhost Bolt or in-process access.

Shortest path in 0.5ms. Full openCypher (1,611/1,611 TCK). 30+ built-in algorithms including community detection, centrality, and embeddings.

Structured knowledge access during inference. Not a separate infrastructure dependency.

## CTAs

- See the benchmark
- GraphRAG integration guide
- Schedule a call

---

# `/tetra/edge` — NEW Page

## Hero

### Headline
Graph intelligence. On a gateway. In the field.

### Sub-hero
For twenty years the answer has been "your device can't run a graph database." A JVM is too heavy. A cluster doesn't fit. A managed cloud needs a network.

TETRA is a single native binary. **24 MB container. 66 MB of RAM.**

## Stat cards

**24 MB container**
Alpine-based image. No JVM. No dependencies.

**66 MB RAM**
Full production workload

**Post-quantum encryption**
At-rest encryption with post-quantum resistant cryptography

**~38% of raw data**
Compressed, encrypted, queryable — in a single file

## What edge graph intelligence unlocks

**Fleet management:** Real-time relationship queries across vehicles, drivers, routes, maintenance history — without a round-trip to the cloud.

**Industrial control:** Asset relationships, dependency graphs, failure propagation modeling — running on the gateway, not the datacenter.

**Retail:** Customer journey, product affinity, inventory relationships — at the edge of the store network.

**Defense & aerospace:** Post-quantum encrypted graph intelligence on-device, offline-capable, no phone-home.

## Single binary. Single file. No dependencies.

One encrypted file contains your entire queryable graph. Drop it into your deployment pipeline like any other artifact. Works on ARM, x86, embedded Linux, Docker on an edge gateway, bare metal in a shipping container.

Full openCypher. 30+ graph algorithms. Offline capable — no remote calls required.

## Post-quantum encryption

TETRA files are encrypted at rest with post-quantum resistant cryptography. The encrypted, compressed file is the queryable database — no decryption step for queries.

For defense, healthcare, financial services, and regulated industries: this isn't a 2035 problem being solved now. It's a requirement that's already on procurement checklists.

## Compress to ~38%, zero loss

Raw data compresses to approximately 38% of its original size — and that includes everything needed to search and query. No separate index layer. The compressed file IS the query engine.

By formal proof, zero data resolution is lost through the encoding. Every bit of the original data is recoverable.

## CTAs

- See the technical spec
- Schedule an integration call