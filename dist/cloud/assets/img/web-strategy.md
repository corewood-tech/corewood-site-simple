# TETRA Website Update — Content & Restructure Brief

Use this doc to prompt your site updates. Every section maps to a specific change on corewood.io/tetra. Copy, data, sources, and rationale included.

---

## 1. Restructure /tetra page flow

### Problem
The proof is buried. A visitor scrolls through ~2,500 words of business case (Problem → Solution → AI → Timing) before hitting any benchmark data, and the SF10 results are behind a modal.

### New page order

1. **Hero** (keep as-is — "We used the math behind AI to build a database" is strong)
2. **NEW: Proof banner** — headline numbers from SF10 and container benchmarks, inline, not in a modal. This is the first thing after the hero. Details below.
3. **Problem section** — condense to ~60% of current length
4. **Solution section** — keep, integrate compression/encryption details (see section 5 below)
5. **AI + Data section** — keep
6. **Timing section** — keep
7. **Full benchmark suite** — SF10, Recommendations head-to-head, writes, throughput — all inline sections, not modals
8. **NEW: Competitive economics section** — pricing comparison, TCO table (see section 4 below)
9. **NEW: What's included / Retina section** (see section 5 below)
10. **Pricing + CTA**
11. **Methodology**

### Rationale
Someone who sees "172M edges, single process, 405ms average" will *want* to read why. Someone who reads 2,500 words about power grid economics may not stick around for the proof.

---

## 2. New section: Proof banner (after hero)

Place this immediately after the hero. Short, high-density, no prose — just the numbers.

### Content

**Heading:** *The proof.*

**Stats row (4 cards):**

| Stat | Value | Label |
|---|---|---|
| SF10 | 27.2M nodes · 172.2M edges | LDBC Social Network Benchmark |
| IC queries | 14/14 passed · 405ms avg | Industry-standard Interactive Complex suite |
| Container wins | 37–19 vs Neo4j | 105 queries · same hardware · Neo4j OOMs on writes |
| Cypher TCK | 1,611/1,611 · 100% | Full openCypher compliance |

**Two CTAs:**
- "See the benchmarks" → scrolls/links to benchmark section
- "See the pricing" → scrolls/links to pricing section

**Source:** All numbers from existing benchmark data already on the site.[^1]

---

## 3. Move SF10 results out of the modal

### Problem
The LDBC SF10 results live in a modal overlay. You can't link to a modal. Every blog post, HN comment, tweet, or sales email needs a URL that goes directly to the SF10 results.

### Options (pick one)
1. **Best:** Dedicated page at `/tetra/sf10` or `/tetra/ldbc` with the full SF10 breakdown
2. **Good:** Inline the SF10 results as an on-page section within `/tetra` (replace the modal)
3. **Minimum:** A defined anchor `/tetra#ldbc-sf10` that auto-opens the modal on page load

### What to add to the SF10 section

The current SF10 section is thorough on query details but missing:

**a) Peak RSS (memory used during the 14-query suite)**
This is the single most important number not on the site. It completes the inversion story: Neo4j uses 710 MB for 166K edges; TETRA runs 172M edges (1,000× more) in [X] GB. Instrument this and publish it.

**b) Competitive context paragraph**
Add after the results table, before methodology:

> **For context:** TigerGraph's audited LDBC SNB BI result at SF1000 was run on a Dell PowerEdge R7725 bare-metal server (AMD EPYC).[^11] GraphScope Flex holds throughput records (130K+ ops/s at SF100/SF300) on full server infrastructure.[^12] Neo4j failed to complete several IC queries at SF10 in the 2019 Rusu & Huang study.[^13] Amazon Neptune has no published LDBC results and its openCypher implementation does not support shortestPath() or allShortestPaths().[^9] TETRA passes 14/14 on a single process from a single file.

**c) File size on disk**
The single mmap'd file size for the SF10 dataset. Publish alongside peak RSS.

---

## 4. New section: Competitive economics

Add as a new section on `/tetra`, between the benchmark suite and pricing.

### Heading
*What it actually costs.*

### Lead text
> Every graph database prices differently. We did the math so you don't have to. All prices verified from vendor sites, April 2026.

### Pricing table — monthly, smallest production-viable config

| Provider | Config | Monthly | What's missing from that price |
|---|---|---|---|
| **TETRA** | Flat rate | **$299** | Nothing. Retina, 30+ algorithms, full Cypher included. |
| Neptune | db.r5.large, single instance | $297 | No HA/failover. +replicas (2–4× instance cost), +storage ($0.10/GB/mo), +I/O ($0.20/M). No shortestPath(). No built-in visualization.[^7][^9] |
| Neo4j AuraDB Pro | 16 GB / 3 CPU | $1,051 | Bloom included in cloud. Self-hosted GDS: $10K–$25K+/yr extra.[^5][^8] |
| Neo4j AuraDB BC | 8 GB / 2 CPU | $1,168 | SLAs, RBAC, SSO. Self-hosted Enterprise: $20K–$200K+/yr.[^5][^8] |
| TigerGraph Savanna | TG-00 (2 vCPU, 16 GB) | $720 | Compute only. +HA (2.8× multiplier → ~$2,016/mo), +storage ($0.025/GB/mo), +Insights (10%).[^6] Proprietary GSQL.[^10] |

**Source links in footnotes for every number.**

### TCO table — cumulative annual

| | Neo4j Pro 16GB | Neo4j BC 8GB | TigerGraph TG-00 | Neptune single | TETRA (w/ migration) | TETRA (product only) |
|---|---|---|---|---|---|---|
| Year 1 | $12,614 | $14,016 | $8,640 | $3,559 | $14,452 | $3,588 |
| Year 3 | $37,843 | $42,048 | $25,920 | $10,678 | $21,328 | $10,764 |
| Year 5 | $63,072 | $70,080 | $43,200 | $17,796 | $28,504 | $17,940 |

### Math (for transparency — show this or link to it)
- Neo4j Pro 16GB: $1,051.20 × 12 = $12,614/yr [^5]
- Neo4j BC 8GB: $1,168.00 × 12 = $14,016/yr [^5]
- TigerGraph TG-00: $720 × 12 = $8,640/yr (compute only) [^6]
- Neptune db.r5.large: $296.61 × 12 = $3,559/yr (AWS worked example, single instance) [^7]
- TETRA w/ migration: $10,864 + ($299 × 12) = $14,452 yr 1; $3,588/yr after [^4]
- TETRA product: $299 × 12 = $3,588/yr [^4]

### Caveats to include (important for credibility)
- Neptune $297/mo is single instance, no HA. Production requires writer + replicas (2–4× instance cost).[^7]
- TigerGraph $720/mo is compute only. With HA (2.8×) it's ~$2,016/mo before storage or add-ons.[^6]
- Neo4j self-hosted Bloom ($1,200–$2,500/user/yr) and GDS ($10K–$25K+/yr) pricing is from Vendr third-party transaction data, not Neo4j-published.[^8]

---

## 5. New section or expanded content: Retina + Storage + Encryption

This content doesn't exist on the site yet. These are strong differentiators that are currently invisible.

### Option A: New section on /tetra titled "What's included"
### Option B: Dedicated page at /tetra/retina
### Option C: Expand the existing "Visualization" section

### Content to add

**Retina — 3D/2D Graph Data Viewer & Explorer**
- WebGPU-driven rendering (2D and 3D modes)
- Server-side and client-side analytics built in (shortest path, etc.)
- Query UI for exploring and verifying data / validating migrations
- Export results as CSV or JSON
- Free and ungated — part of the TETRA suite, no add-on licensing

Comparison: Neo4j charges $1,200–$2,500/user/year for Bloom (self-hosted Enterprise).[^8] TigerGraph charges 10% compute surcharge for Insights.[^6] Neptune has the open-source graph-explorer and Jupyter-based Workbench but nothing comparable.[^7b]

**Post-Quantum Encryption**
- TETRA files are encrypted at rest with post-quantum resistant cryptography
- The encrypted file IS the queryable database — no decryption step for queries

**~38% Compression**
- TETRA files compress to approximately 38% of the initial raw data size
- This includes all structures needed to search and query the data (what other databases call "indexes")
- There is no separate index layer — the compressed file is the query engine
- By formal proof, zero data resolution is lost through the encoding process

**Ingestion**
- 10 GB of CSV data ingested, converted, and loaded in under 7 minutes on 5 GB of RAM

### Source note
All Retina, encryption, compression, and ingestion claims are currently unpublished. They need to go on the site before they can be cited in blog posts, one-pagers, or sales collateral.

---

## 6. Update existing pricing section

### Current
> $10,864 Configuration + $299/mo Includes operational support

### Problem
"Configuration" is vague. Visitors don't know what the $10,864 is for.

### Updated copy
> **$299/month** — the database. Flat rate. No per-GB scaling. No add-on tiers. Includes Retina visualization, 30+ graph algorithms, full openCypher, and operational support.
>
> **$10,864 one-time professional services** — data migration, ingestion, conversion, and validation. Not a license fee. [Optional — for existing data migrations.]

---

## 7. Update the "Where Neo4j Wins" section

### Current
Good — radical transparency. Keep it.

### Add
- A note on timeline: "These represent known query planner optimization targets for TETRA. We expect these gaps to close in [version/timeframe]."
- Frame it: "We ship what's real, including what's not done yet."

---

## 8. Improve demo surface

### Current
"Launch Demo →" as a text link near the bottom.

### Changes
- Add a screenshot, GIF, or short autoplay video of Retina in action on the /tetra page (above the demo link)
- Move the demo link higher — closer to the proof banner or benchmark section
- Update the demo link copy to describe what it is: "Explore the recommendations dataset in 3D — 2,330 nodes, 3,506 edges, running in your browser."

This is already on the site but the current copy undersells it.

---

## 9. New content: Blog post (to be written separately)

Not a site update, but the site updates above unblock this.

**Title options:**
- "172 million edges. Single process. $299/month."
- "LDBC SF10 on TETRA: benchmarks, methodology, and what it costs."

**Structure:**
1. What LDBC SF10 Interactive Complex actually requires
2. TETRA's results + SF10 memory number (once published)
3. The container head-to-head numbers (Recommendations dataset)
4. The pricing math — TETRA vs Neo4j vs TigerGraph vs Neptune
5. Where TETRA loses — the 19 Neo4j wins
6. Methodology and "what we're NOT doing"

**Distribution:** HN, r/dataengineering, r/database, Twitter/X, LinkedIn (Mickey personal post).

**Blocked by:** SF10 peak RSS (#3a above), Retina/encryption/compression on the site (#5 above).

---

## 10. New content: One-page PDF

**Purpose:** The "forward to your boss" document. An engineer evaluating graph databases drops this in a Slack channel.

**Contents (one page, high density):**
- TETRA: one line description
- SF10 headline numbers
- Container head-to-head summary
- TCO comparison table (5 competitors)
- Architecture positioning (co-location, edge, AI stack)
- "What we're NOT doing" (3 bullets from methodology)
- QR code or short link to /tetra/sf10

**Blocked by:** Same as blog post.

---

## Source Reference

All footnote numbers used above map to these verified sources:

[^1]: [corewood.io/tetra#tech](https://corewood.io/tetra#tech) — all benchmark data, container resources, throughput, LDBC SF10, Cypher TCK, methodology.

[^4]: [corewood.io/tetra](https://corewood.io/tetra) — "$10,864 Configuration + $299/mo." Visualization, algorithms, Cypher TCK from the site.

[^5]: [neo4j.com/pricing](https://neo4j.com/pricing/) — AuraDB Pro $65/GB/mo, BC $146/GB/mo. Monthly figures from expandable pricing tables. Bloom "Included" in AuraDB Pro+. Accessed April 15, 2026.

[^6]: [docs.tigergraph.com/savanna/main/overview/pricing](https://docs.tigergraph.com/savanna/main/overview/pricing) — TG-00 at $1/hr, storage $0.025/GB/mo (Tier 1), HA 2.8× for ≤TG-8, Insights 10% add-on.

[^7]: [aws.amazon.com/neptune/pricing](https://aws.amazon.com/neptune/pricing/) — db.r5.large $0.348/hr (US East), $296.61/mo worked example (50 GB storage + 200M I/Os), storage $0.10/GB/mo, I/O $0.20/million.

[^7b]: [aws.amazon.com/blogs/database/announcing-the-general-availability-of-opencypher-support-for-amazon-neptune](https://aws.amazon.com/blogs/database/announcing-the-general-availability-of-opencypher-support-for-amazon-neptune/) — Neptune Workbench visualization. Open-source graph-explorer at [github.com/aws/graph-explorer](https://github.com/aws/graph-explorer).

[^8]: [vendr.com/marketplace/neo4j](https://www.vendr.com/marketplace/neo4j) — Self-hosted Bloom $1,200–$2,500/user/yr, GDS $10K–$25K+ small deployments, Enterprise self-hosted $20K–$200K+/yr. Third-party estimates, updated Feb 2026.

[^9]: [docs.aws.amazon.com/neptune/latest/userguide/feature-opencypher-compliance.html](https://docs.aws.amazon.com/neptune/latest/userguide/feature-opencypher-compliance.html) — "shortestPath() and allShortestPaths() are not currently supported."

[^10]: [docs.tigergraph.com/gsql-ref/current/opencypher-in-gsql](https://docs.tigergraph.com/gsql-ref/current/opencypher-in-gsql) — OpenCypher via GSQL translation. GSQL is primary language.

[^11]: [LDBC SNB BI audit, SF1000, TigerGraph (PDF)](https://ldbcouncil.org/docs/audits/snb/LDBC_SNB_BI_20241010_SF1000_tigergraph-executive_summary.pdf) — Audited by David Puroja (Pometry), 2024/10/10.

[^12]: [ldbcouncil.org/tags/snb](https://ldbcouncil.org/tags/snb/) — GraphScope Flex: 130.1K ops/s SF100, 131.3K ops/s SF300.

[^13]: Rusu & Huang, [arXiv:1907.07405](https://arxiv.org/abs/1907.07405), July 2019. LDBC [retrospective review (PDF)](https://ldbcouncil.org/benchmarks/snb/retrospective-report-tigergraph.pdf) noted methodological concerns.

[^14]: Diffbot KG-LM Accuracy Benchmark — [falkordb.com](https://www.falkordb.com/blog/graphrag-accuracy-diffbot-falkordb/). Already cited on corewood.io/tetra.

---

## Unpublished data (needs to go on site before external use)

These items came from this conversation and have no public URL yet:

| Claim | Status |
|---|---|
| SF10 peak RSS (memory during 14-query suite) | **Not instrumented yet** |
| SF10 file size on disk | **Not published** |
| Retina: WebGPU, server/client analytics, query UI, CSV/JSON export | **Demo only at /tetra-demo** |
| Post-quantum resistant encryption | **Not on site** |
| ~38% compression ratio | **Not on site** |
| Zero data resolution loss (formal proof) | **Not on site** |
| 10 GB CSV ingestion in <7 min on 5 GB RAM | **Not on site** |
| $10,864 = professional services / data migration (not license) | **Ambiguous on site ("Configuration")** |

All of these block the blog post and one-pager. Get them on the site first.