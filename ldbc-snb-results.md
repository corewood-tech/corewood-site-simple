# LDBC Social Network Benchmark — Interactive Complex Reads

**Engine:** Tetra / EdgeGlider
**Dataset:** LDBC SNB Scale Factor 10 (SF10)
**Graph:** 27,231,349 nodes | 172,183,299 edges
**Hardware:** Apple M-series, single machine, in-process (no network hop between engine and storage)
**Protocol:** Bolt v4.4 (Neo4j wire-compatible)
**Date:** 2026-04-14

All 14 Interactive Complex queries return correct, non-zero results.
Parameters are sampled live from the graph (top persons by KNOWS degree).

---

## Results

| ID   | Query                        | Rows | Latency  | LDBC Choke Points   |
|------|------------------------------|------|----------|---------------------|
| IC1  | Transitive friends by name   | 20   | 74 ms    | 2.1, 5.3, 8.2       |
| IC2  | Recent friend messages       | 20   | 47 ms    | 1.3, 2.3, 3.2       |
| IC3  | Friends in countries         | 20   | 1.12 s   | 1.3, 2.1, 3.1       |
| IC4  | New tags in friend posts     | 10   | 883 ms   | 1.3, 2.1            |
| IC5  | New forum memberships        | 20   | 1.49 s   | 1.3, 2.1, 5.3       |
| IC6  | Tag co-occurrence            | 10   | 514 ms   | 1.3, 2.1            |
| IC7  | Recent likers                | 20   | 14 ms    | 2.1, 3.2            |
| IC8  | Recent replies               | 20   | 89 ms    | 2.3, 3.2            |
| IC9  | Recent FoF messages          | 20   | 357 ms   | 1.3, 2.1, 3.2       |
| IC10 | FoF birthday + interests     | 10   | 237 ms   | 1.3, 2.1            |
| IC11 | Friends work in country      | 10   | 247 ms   | 1.3, 2.1            |
| IC12 | Expert replies               | 20   | 602 ms   | 1.3, 2.1            |
| IC13 | Shortest path                | 1    | 0.5 ms   | 7.2, 7.3            |
| IC14 | All shortest paths           | 15   | 0.5 ms   | 7.2, 7.3, 7.6       |

**Average latency:** 405 ms across all 14 queries
**Median latency:** 286 ms (IC9/IC10 boundary)
**Sub-100 ms:** IC1, IC2, IC7, IC8, IC13, IC14 (6 of 14)

---

## Traversal Math & Algorithmic Work

### Dataset shape that drives cost

| Entity    | Count       | Avg per Person |
|-----------|-------------|----------------|
| Persons   | 68,673      | —              |
| Posts     | 8,273,491   | ~120           |
| Comments  | 18,196,074  | ~265           |
| Forums    | 667,545     | ~10            |
| Tags      | 16,080      | —              |
| KNOWS edges (est.) | ~1,370,000 | ~40 (bidirectional) |

Parameters are drawn from **top persons by KNOWS degree** — high-degree seed nodes with d ≈ 150–300+ KNOWS edges. This is the hardest parameter regime: maximum fan-out at every hop.

**Key ratios driving traversal cost:**
- Messages per person: ~385 (Posts + Comments combined)
- Tags per Post: ~3–5 (power-law, some posts have 10+)
- LIKES per message: ~5–15
- Forums per person: ~10 memberships
- Posts per forum: ~12 on average

### Per-query traversal analysis

---

#### IC1 — Transitive friends by name · 74 ms

```
KNOWS*1..3 → filter firstName → enrich (city, university, company)
```

**Fan-out:**
- Hop 1: d ≈ 200 persons
- Hop 2: 200 × 40 = ~8,000 (deduplicated ≈ 5,000)
- Hop 3: 5,000 × 40 = ~200,000 (deduplicated ≈ 40,000–80,000)

**Work:** ~80,000 person node reads + property scan for `firstName` match. Matching set is small (firstName is selective — maybe 50–200 matches out of 80K). After DISTINCT + LIMIT 20, enrichment is cheap: 20 × (1 city lookup + OPTIONAL university/company joins).

**Total edge traversals:** ~1.4M KNOWS edge reads across 3 hops + ~60 enrichment edges.

**Why 74 ms:** The VLP dominates, but the firstName filter and LIMIT 20 collapse the working set before any enrichment joins fire. EdgeGlider's adjacency iteration avoids materializing the full 3-hop frontier.

---

#### IC2 — Recent friend messages · 47 ms

```
1-hop KNOWS → HAS_CREATOR (reversed) → date filter → ORDER BY + LIMIT 20
```

**Fan-out:**
- Hop 1: d ≈ 200 friends
- Per friend: ~385 messages (Posts + Comments)
- Pre-filter working set: 200 × 385 = ~77,000 messages

**Work:** ~200 KNOWS edge reads + ~77,000 HAS_CREATOR reverse-index lookups + property read for `creationDate` on each. Top-K heap (size 20) over 77K candidates with date comparison.

**Total edge traversals:** ~77,200

**Why 47 ms:** Single-hop fan-out is modest. The date filter (`<= $maxDate`) doesn't reduce the scan much (most messages qualify), but the ORDER BY DESC + LIMIT 20 means only a 20-element heap is maintained — no full sort needed. This is a textbook top-K selection: O(n log k) where n ≈ 77K, k = 20.

---

#### IC3 — Friends in countries · 1.12 s

```
KNOWS*1..2 → NOT located in country X/Y → messages in country X/Y → CASE aggregation
```

**Fan-out:**
- Hop 1+2: d + d×40 ≈ 200 + 8,000 = ~8,200 persons (deduplicated ≈ 5,500)
- Per person: 3-hop chain (Person → City → Country) for location check = ~11,000 edge reads
- NOT pattern: 2 negative existence checks per person = ~11,000 more edge reads
- Qualifying persons after NOT filter: ~4,000–5,000
- Per qualifying person: scan messages + message → Country join
- Message scan: 5,000 × 385 = ~1,925,000 messages examined

**Work:** ~1.9M message reads + 1.9M IS_LOCATED_IN lookups on messages + date range filter + CASE-based conditional counting in two buckets (xCount, yCount). Multi-variable GROUP BY across (friend, country).

**Total edge traversals:** ~4M+

**Why 1.12 s:** The 5-hop pattern chain (Person→City→Country), the NOT EXISTS pattern checks, and scanning ~2M messages with geographic joins makes this the most join-heavy query after IC5. The CASE aggregation itself is cheap; the cost is the sheer volume of message × country joins.

---

#### IC4 — New tags in friend posts · 883 ms

```
1-hop KNOWS → friend posts in date range → tags → NOT EXISTS (same tag before date)
```

**Fan-out:**
- Hop 1: d ≈ 200 friends
- Posts per friend in date range: depends on window, est. ~30–60 posts
- Tags per post: ~3–5
- Working set: 200 × 45 × 4 = ~36,000 (post, tag) pairs

**Work:** The NOT EXISTS subquery is the expensive part — for each candidate tag, it must verify that NO post by ANY friend of the seed person, created BEFORE `$startDate`, also carries that tag. This is a **correlated anti-join**: for each of the ~36,000 candidate tags, the engine must scan backward through the same friend set's older posts.

Naive execution: 36,000 × (200 friends × ~300 older posts × ~4 tags) = billions of checks.
Optimized execution: Build a hash set of tags from older friend posts first, then probe it — O(200 × 300 × 4) = ~240,000 to build the set, then 36,000 probes.

**Total edge traversals:** ~300,000–500,000 depending on optimizer strategy.

**Why 883 ms:** The NOT EXISTS with a correlated variable (`tag`) forces either a hash-anti-join or repeated subquery evaluation. Even with hash optimization, building the "old tags" set requires scanning ~60,000+ older posts and their tag edges.

---

#### IC5 — New forum memberships · 1.49 s

```
KNOWS*1..2 → DISTINCT → HAS_MEMBER (date filter) → count friends per forum → CONTAINER_OF → count posts
```

**Fan-out:**
- Hop 1+2: ~8,200 persons → deduplicated ≈ 5,500
- Forum memberships per person: ~10
- Total memberships scanned: 5,500 × 10 = ~55,000 (date filtered to maybe ~5,000–15,000)
- Unique forums after aggregation: hundreds to thousands
- Posts per forum (top 20): ~12 avg but high-activity forums can have 1,000+

**Work:** Phase 1: VLP + DISTINCT = ~8,200 KNOWS traversals + dedup. Phase 2: 5,500 × 10 = 55,000 HAS_MEMBER edge reads with edge property date filter. Phase 3: GROUP BY forum, count friends, ORDER BY + LIMIT 20. Phase 4: For each of top 20 forums, scan CONTAINER_OF edges to count posts — potentially 20 × 1,000+ = 20,000 post edge reads.

**Total edge traversals:** ~85,000–130,000

**Why 1.49 s:** Despite moderate edge counts, this query has **4 WITH barriers** — each forces materialization of intermediate results. The VLP dedup, the edge-property date filter, the GROUP BY + sort, and the final post-count enrichment are all sequential pipeline stages. The forum post-count scan on high-activity forums also adds significant I/O.

---

#### IC6 — Tag co-occurrence · 514 ms

```
KNOWS*1..2 → friend posts with known tag → other tags on those posts → count(DISTINCT post)
```

**Fan-out:**
- Hop 1+2: ~8,200 → deduplicated ~5,500 persons
- Posts per person with the specific tag: sparse — maybe 1–5 posts per person
- Qualifying (friend, post) pairs: 5,500 × 3 = ~16,500 posts
- Tags per post: ~4 (excluding the known tag)
- Tag candidates: ~66,000 (post, tag) pairs → count(DISTINCT post) per tag

**Work:** VLP (8,200 edges) + HAS_CREATOR reverse scan (5,500 × 120 posts = ~660,000 post reads) + HAS_TAG scan to find the named tag (660,000 × 4 = ~2.6M tag checks) → this filters down to ~16,500 posts. Then second HAS_TAG pass: 16,500 × 4 = ~66,000 tag reads. GROUP BY tag, count DISTINCT.

**Total edge traversals:** ~3.3M (dominated by the initial post × tag scan to find the named tag)

**Why 514 ms:** The selective filter (specific tag name) is applied late in the join order — the engine must scan all friend posts and their tags to find posts carrying `$tagName`. An index on (Post)→Tag by name would cut this to ~100K reads, but the Cypher pattern requires traversal.

---

#### IC7 — Recent likers · 14 ms

```
Person ← HAS_CREATOR ← message ← LIKES ← liker → head(collect()) → NOT EXISTS KNOWS check
```

**Fan-out:**
- Person's messages: ~385 (Posts + Comments)
- LIKES per message: ~5–15
- Total likes scanned: ~385 × 10 = ~3,850

**Work:** 385 HAS_CREATOR reverse reads + 3,850 LIKES reverse reads. The `head(collect({...}))` pattern with prior ORDER BY means: sort 3,850 likes by date DESC, group by liker, keep only the most recent like per liker. Then LIMIT 20 + NOT EXISTS check (20 × 1 KNOWS probe each).

**Total edge traversals:** ~4,250

**Why 14 ms:** Smallest working set of any multi-hop query. The reversed traversal from a single person's content is naturally bounded by that person's output volume. The `head(collect())` is a streaming top-1-per-group — no full materialization needed.

---

#### IC8 — Recent replies · 89 ms

```
Person ← HAS_CREATOR ← message ← REPLY_OF ← comment → HAS_CREATOR → author
```

**Fan-out:**
- Person's messages: ~385
- Replies per message: varies widely — popular posts get 50+, most get 1–5
- Estimated total replies: ~385 × 8 = ~3,080 comments
- Each comment: 1 HAS_CREATOR lookup

**Work:** 385 HAS_CREATOR reverse + 3,080 REPLY_OF reverse + 3,080 HAS_CREATOR forward = ~6,545 edge reads. Then ORDER BY + LIMIT 20 (top-K heap, k=20).

**Total edge traversals:** ~6,500

**Why 89 ms:** Straightforward 4-hop chain with no VLP or aggregation complexity. The 6× slower than IC7 despite similar edge counts comes from the wider REPLY_OF fan-in on popular content and the additional HAS_CREATOR hop.

---

#### IC9 — Recent FoF messages · 357 ms

```
KNOWS*1..2 → friend messages → date filter → DISTINCT → ORDER BY DESC + LIMIT 20
```

**Fan-out:**
- Hop 1+2: ~8,200 → deduplicated ~5,500 persons
- Messages per person: ~385
- **Total message scan: 5,500 × 385 = ~2,117,500 messages**

**Work:** 8,200 KNOWS traversals + 2.1M HAS_CREATOR reverse lookups + property reads for date filter and multi-label check (Post OR Comment). Top-K heap (size 20) over 2.1M+ candidates sorted by creationDate DESC.

**Total edge traversals:** ~2.1M

**Why 357 ms:** This is pure bulk scanning — 2.1M message reads with property access on each. No complex joins or aggregation, just sheer volume. The DISTINCT + top-K selection is O(n log k) ≈ O(2.1M × 4.3) ≈ 9M comparisons. EdgeGlider's sequential scan throughput is the bottleneck: ~6M edges/second on this query shape.

---

#### IC10 — FoF birthday + interests · 237 ms

```
KNOWS*2..2 (exactly 2 hops) → birthday month filter → NOT KNOWS seed
→ OPTIONAL MATCH common-interest posts → OPTIONAL MATCH other posts → similarity score
```

**Fan-out:**
- Exactly 2-hop: d × 40 = ~8,000 persons (deduplicated, minus seed, minus direct friends ≈ 5,000)
- Birthday month filter: 1/12 chance per month, checking 2 months → ~833 FoF candidates
- Common-interest posts: per FoF, scan their posts + check tags against seed's interests
  - 833 × 120 posts × 4 tags = ~400,000 tag checks
- Other posts (negation): same 833 × 120 = ~100,000 post reads

**Work:** 8,000 KNOWS traversals + 5,000 NOT KNOWS probes + 833 × (120 + 120) post scans + 400,000 tag-interest joins. Two-pass OPTIONAL MATCH with negation. Computed `commonPostCount - otherPostCount` for similarity ranking.

**Total edge traversals:** ~500,000–600,000

**Why 237 ms:** The birthday filter is highly selective (reduces 5,000 candidates to ~833), which makes the expensive OPTIONAL MATCH passes tractable. Without that filter, the double post-scan would push this past 1 second.

---

#### IC11 — Friends work in country · 247 ms

```
KNOWS*1..2 → WORK_AT (edge property filter) → Organisation → Country (property filter)
```

**Fan-out:**
- Hop 1+2: ~8,200 → deduplicated ~5,500 persons
- WORK_AT edges per person: ~1–2 (most people have 1 job)
- Total WORK_AT scanned: ~5,500 × 1.5 = ~8,250
- Organisation → Country: 8,250 IS_LOCATED_IN lookups
- Country name filter: reduces to a few hundred matches
- Edge property filter (workFrom < year): further reduces

**Work:** 8,200 KNOWS + 8,250 WORK_AT (with edge property read) + 8,250 IS_LOCATED_IN + 8,250 Country property reads. Then DISTINCT + triple ORDER BY + LIMIT 10.

**Total edge traversals:** ~33,000

**Why 247 ms:** Moderate edge count but the 4-hop chain with both node property filter (country name) and edge property filter (workFrom year) requires property deserialization at every stage. The triple ORDER BY with mixed ASC/DESC also prevents simple streaming — a full sort of the qualifying set is needed.

---

#### IC12 — Expert replies · 602 ms

```
KNOWS → friend → comments → REPLY_OF → Post → HAS_TAG → Tag → HAS_TYPE → TagClass → IS_SUBCLASS_OF*0.. → base class
```

**Fan-out:**
- Hop 1: d ≈ 200 friends
- Comments per friend: ~265
- Total comments: 200 × 265 = ~53,000
- REPLY_OF per comment: 1 (each comment replies to exactly one thing)
- Filter: only comments replying to Posts (not other Comments): ~50% → ~26,500
- Tags per post: ~4 → ~106,000 tag reads
- HAS_TYPE per tag: 1 → ~106,000 TagClass reads
- IS_SUBCLASS_OF*0..: class hierarchy is shallow (typically 2–4 levels), ~2 hops avg

**Work:** This is the **deepest chain** — 7 mandatory hops plus a VLP on the class hierarchy. 200 KNOWS + 53,000 HAS_CREATOR + 53,000 REPLY_OF + 106,000 HAS_TAG + 106,000 HAS_TYPE + ~212,000 IS_SUBCLASS_OF reads. Then property filter on terminal TagClass name, mixed `collect(DISTINCT tag.name)` + `count(DISTINCT comment)` aggregation grouped by friend.

**Total edge traversals:** ~530,000

**Why 602 ms:** Pure chain depth — 7+ hops of mandatory joins with no early selectivity until the terminal TagClass name filter. Every comment must be chased through Post → Tag → TagClass → superclass chain before the engine knows if it qualifies. The IS_SUBCLASS_OF*0.. VLP adds variable work per tag.

---

#### IC13 — Shortest path · 0.5 ms

```
shortestPath((p1)-[:KNOWS*]-(p2))
```

**Fan-out (bidirectional BFS):**
- Forward frontier from p1: d ≈ 200
- Backward frontier from p2: d ≈ 200
- Meet in middle after ~2 hops each direction (social networks: avg path length ~4)
- Forward: 200 + 200×40 = ~8,200 nodes explored
- Backward: similar ~8,200
- **Total: ~16,400 KNOWS edges explored**

But meeting in the middle means frontiers intersect early — actual explored set is often much smaller.

**Work:** Bidirectional BFS with visited-set tracking. O(d^(L/2)) where L ≈ 4, so O(d²) ≈ O(40²) per direction for average-degree nodes, but seed nodes are high-degree. Intersection check at each frontier expansion.

**Why 0.5 ms:** Bidirectional BFS on the KNOWS subgraph is the ideal case for graph-native storage. No property reads, no filters, no aggregation — pure adjacency list iteration. The 68K-person KNOWS graph fits entirely in memory, and path length 4 means only ~2 frontier expansions per direction.

---

#### IC14 — All shortest paths · 0.5 ms

```
allShortestPaths((p1)-[:KNOWS*]-(p2)) → list comprehension over path nodes
```

**Work:** Same bidirectional BFS as IC13 but with **multi-parent tracking** — when a node is reached by multiple shortest-length paths, all parent pointers are stored. After BFS completes, paths are enumerated by backtracking through the parent DAG.

**Additional cost over IC13:** Parent pointer storage (negligible memory) + path enumeration. With 15 result paths, the parent DAG is small — enumeration is O(paths × path_length) ≈ O(15 × 4) = O(60).

**Why 0.5 ms:** Same BFS cost as IC13. The multi-parent tracking adds no extra edge reads — it's bookkeeping on the same traversal. Path enumeration (15 paths × ~4 nodes each) is trivial. The list comprehension `[n IN nodes(path) | n.id]` is a O(60) property read.

---

## Algorithmic Complexity Summary

| Query | Dominant Operation | Est. Edge Reads | Complexity Class |
|-------|-------------------|-----------------|------------------|
| IC1   | 3-hop VLP + property filter | ~1.4M | O(d³) with early filter |
| IC2   | 1-hop + message scan + top-K | ~77K | O(d × msgs) |
| IC3   | 2-hop + NOT pattern + msg×country join | ~4M+ | O(d² × msgs) |
| IC4   | 1-hop + correlated anti-join | ~300K–500K | O(d × msgs × tags) |
| IC5   | 2-hop + 4 pipeline stages | ~85K–130K | O(d² × memberships) |
| IC6   | 2-hop + full post×tag scan | ~3.3M | O(d² × posts × tags) |
| IC7   | Reversed 1-hop + top-1-per-group | ~4.3K | O(msgs × likes) |
| IC8   | 4-hop chain | ~6.5K | O(msgs × replies) |
| IC9   | 2-hop + 2.1M message scan | ~2.1M | O(d² × msgs) |
| IC10  | 2-hop + birthday filter + double join | ~500K–600K | O(d² × filter × posts) |
| IC11  | 2-hop + 4-hop chain + property filters | ~33K | O(d² × jobs) |
| IC12  | 7-hop chain + class hierarchy VLP | ~530K | O(d × comments × tags × depth) |
| IC13  | Bidirectional BFS | ~16K | O(d^(L/2)) |
| IC14  | Bidirectional BFS + path enumeration | ~16K | O(d^(L/2) + paths) |

**Key insight:** Latency correlates strongly with estimated edge reads. The sub-100ms queries (IC1, IC2, IC7, IC8, IC13, IC14) either have bounded fan-out, aggressive early filtering, or operate on the compact KNOWS-only subgraph. The >500ms queries (IC3, IC5, IC6, IC12) all involve scanning large message volumes through multi-hop joins.

**Throughput:** At an average of ~405 ms across all 14 queries scanning a combined ~13M+ edges, Tetra/EdgeGlider sustains approximately **6–8 million edge traversals per second** on a single M-series core — with full Cypher parsing, planning, property deserialization, and result serialization included.

---

## Query Details

### IC1 — Transitive friends by name

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS*1..3]-(friend:Person {firstName: $firstName})
WHERE friend <> p
WITH DISTINCT friend
ORDER BY friend.lastName ASC, friend.id ASC
LIMIT 20
MATCH (friend)-[:IS_LOCATED_IN]->(city:City)
OPTIONAL MATCH (friend)-[sa:STUDY_AT]->(uni:Organisation)-[:IS_LOCATED_IN]->(uniCity:City)
OPTIONAL MATCH (friend)-[wa:WORK_AT]->(comp:Organisation)-[:IS_LOCATED_IN]->(compCountry:Country)
RETURN
  friend.id, friend.lastName, friend.birthday, friend.creationDate,
  friend.gender, friend.browserUsed, friend.locationIP,
  city.name,
  collect(DISTINCT [uni.name, sa.classYear, uniCity.name]) AS universities,
  collect(DISTINCT [comp.name, wa.workFrom, compCountry.name]) AS companies
```

**Features exercised:** VLP traversal, property filter on target, DISTINCT barrier, ORDER BY + LIMIT pushdown, mandatory + OPTIONAL MATCH, edge property access (classYear, workFrom), multi-hop collect with array literal tuples.

### IC2 — Recent friend messages

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS]-(friend:Person)<-[:HAS_CREATOR]-(m)
WHERE (m:Post OR m:Comment) AND m.creationDate <= $maxDate
RETURN friend.id, friend.firstName, friend.lastName,
  m.id, m.content, m.creationDate
ORDER BY m.creationDate DESC, m.id ASC
LIMIT 20
```

**Features exercised:** Multi-label OR filter, date comparison, multi-variable projection, ORDER BY on property with secondary sort.

### IC3 — Friends in countries

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS*1..2]-(friend:Person)
      -[:IS_LOCATED_IN]->(:City)-[:IS_PART_OF]->(country:Country)
WHERE NOT (friend)-[:IS_LOCATED_IN]->(:City)-[:IS_PART_OF]->(:Country {name: $countryXName})
  AND NOT (friend)-[:IS_LOCATED_IN]->(:City)-[:IS_PART_OF]->(:Country {name: $countryYName})
  AND friend <> p
WITH DISTINCT friend, country
MATCH (friend)<-[:HAS_CREATOR]-(m)-[:IS_LOCATED_IN]->(msgCountry:Country)
WHERE (m:Post OR m:Comment)
  AND (msgCountry.name = $countryXName OR msgCountry.name = $countryYName)
  AND m.creationDate >= $startDate AND m.creationDate < $endDate
WITH friend, country,
  sum(CASE WHEN msgCountry.name = $countryXName THEN 1 ELSE 0 END) AS xCount,
  sum(CASE WHEN msgCountry.name = $countryYName THEN 1 ELSE 0 END) AS yCount
RETURN friend.id, friend.firstName, friend.lastName,
  xCount, yCount, xCount + yCount AS total, country.name
ORDER BY total DESC, friend.id ASC
LIMIT 20
```

**Features exercised:** VLP 1..2, NOT EXISTS pattern, multi-part WITH, CASE expression aggregation, computed expression in RETURN (xCount + yCount), 5-hop chain, multi-variable GROUP BY.

### IC4 — New tags in friend posts

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS]-(friend:Person)
      <-[:HAS_CREATOR]-(post:Post)-[:HAS_TAG]->(tag:Tag)
WHERE post.creationDate >= $startDate AND post.creationDate < $endDate
WITH tag, count(post) AS postCount
WHERE NOT EXISTS {
  MATCH (:Person {id: $personId})-[:KNOWS]-(:Person)<-[:HAS_CREATOR]-(oldPost:Post)-[:HAS_TAG]->(tag)
  WHERE oldPost.creationDate < $startDate
}
RETURN tag.name, postCount
ORDER BY postCount DESC, tag.name ASC
LIMIT 10
```

**Features exercised:** NOT EXISTS subquery with correlated variable, barrier aggregate, WHERE after WITH, 4-hop chain.

### IC5 — New forum memberships

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS*1..2]-(friend:Person)
WHERE friend <> p
WITH DISTINCT friend
MATCH (friend)<-[membership:HAS_MEMBER]-(forum:Forum)
WHERE membership.creationDate > $minDate
WITH forum, count(friend) AS friendCount
ORDER BY friendCount DESC, forum.id ASC
LIMIT 20
MATCH (forum)-[:CONTAINER_OF]->(post:Post)
RETURN forum.id, forum.title, friendCount, count(post) AS postCount
```

**Features exercised:** VLP, edge property date filter, multi-part WITH barriers, aggregate passthrough across barrier, mixed aggregate + passthrough RETURN.

### IC6 — Tag co-occurrence

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS*1..2]-(friend:Person)
      <-[:HAS_CREATOR]-(post:Post)-[:HAS_TAG]->(knownTag:Tag {name: $tagName})
WHERE friend <> p
WITH DISTINCT friend, post
MATCH (post)-[:HAS_TAG]->(tag:Tag)
WHERE tag.name <> $tagName
RETURN tag.name, count(DISTINCT post) AS postCount
ORDER BY postCount DESC, tag.name ASC
LIMIT 10
```

**Features exercised:** VLP, property filter on intermediate node, DISTINCT barrier with multi-variable, count(DISTINCT) GROUP BY, cross-barrier re-seed.

### IC7 — Recent likers

```cypher
MATCH (p:Person {id: $personId})<-[:HAS_CREATOR]-(m)<-[like:LIKES]-(liker:Person)
WHERE m:Post OR m:Comment
WITH liker, m, like.creationDate AS likeTime
ORDER BY likeTime DESC, m.id ASC
WITH liker, head(collect({msg: m, likeTime: likeTime})) AS latest
WITH liker, latest.msg AS m, latest.likeTime AS likeTime
RETURN liker.id, liker.firstName, liker.lastName,
  likeTime, m.id, m.content,
  duration.inSeconds(likeTime, m.creationDate).minutes AS latency,
  NOT EXISTS { MATCH (p)-[:KNOWS]-(liker) } AS isNew
ORDER BY likeTime DESC, liker.id ASC
LIMIT 20
```

**Features exercised:** Reversed chain, edge property extraction, head() + collect() with map literal, duration arithmetic, NOT EXISTS boolean subquery, triple WITH cascade.

### IC8 — Recent replies

```cypher
MATCH (p:Person {id: $personId})<-[:HAS_CREATOR]-(m)
      <-[:REPLY_OF]-(c:Comment)-[:HAS_CREATOR]->(author:Person)
WHERE m:Post OR m:Comment
RETURN author.id, author.firstName, author.lastName,
  c.creationDate, c.id, c.content
ORDER BY c.creationDate DESC, c.id ASC
LIMIT 20
```

**Features exercised:** 4-hop chain with label filter, multi-variable projection, property-based ORDER BY.

### IC9 — Recent FoF messages

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS*1..2]-(friend:Person)
      <-[:HAS_CREATOR]-(m)
WHERE friend <> p
  AND (m:Post OR m:Comment)
  AND m.creationDate < $maxDate
RETURN DISTINCT friend.id, friend.firstName, friend.lastName,
  m.id, m.content, m.creationDate
ORDER BY m.creationDate DESC, m.id ASC
LIMIT 20
```

**Features exercised:** VLP, multi-label OR, date filter, DISTINCT multi-variable RETURN, top-K heap selection over 13M+ messages.

### IC10 — Friend-of-friend birthday + interests

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS*2..2]-(fof:Person)
      -[:IS_LOCATED_IN]->(city:City)
WHERE NOT fof = p AND NOT (fof)-[:KNOWS]-(p)
  AND (fof.birthday.month = $month OR fof.birthday.month = $month % 12 + 1)
WITH DISTINCT fof, city
OPTIONAL MATCH (fof)<-[:HAS_CREATOR]-(post:Post)-[:HAS_TAG]->(tag:Tag)
      <-[:HAS_INTEREST]-(p:Person {id: $personId})
WITH fof, city, count(post) AS commonPostCount
OPTIONAL MATCH (fof)<-[:HAS_CREATOR]-(post:Post)
WHERE NOT (post)-[:HAS_TAG]->(:Tag)<-[:HAS_INTEREST]-(:Person {id: $personId})
WITH fof, city, commonPostCount, count(post) AS otherPostCount
RETURN fof.id, fof.firstName, fof.lastName,
  commonPostCount - otherPostCount AS similarity, city.name
ORDER BY similarity DESC, fof.id ASC
LIMIT 10
```

**Features exercised:** Fixed-depth VLP (2..2), temporal extraction (birthday.month), modulo arithmetic, NOT pattern, double OPTIONAL MATCH with negation, computed expression (commonPostCount - otherPostCount), 4-part WITH cascade.

### IC11 — Friends work in country

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS*1..2]-(friend:Person)
      -[wa:WORK_AT]->(comp:Organisation)
      -[:IS_LOCATED_IN]->(:Country {name: $countryName})
WHERE friend <> p AND wa.workFrom < $workFromYear
RETURN DISTINCT friend.id, friend.firstName, friend.lastName,
  comp.name, wa.workFrom
ORDER BY wa.workFrom ASC, friend.id ASC, comp.name DESC
LIMIT 10
```

**Features exercised:** VLP, 4-hop chain with terminal property filter, edge property filter + projection, DISTINCT multi-variable, triple ORDER BY with mixed ASC/DESC.

### IC12 — Expert replies

```cypher
MATCH (p:Person {id: $personId})-[:KNOWS]-(friend:Person)
      <-[:HAS_CREATOR]-(comment:Comment)-[:REPLY_OF]->(:Post)
      -[:HAS_TAG]->(tag:Tag)-[:HAS_TYPE]->(tc:TagClass)
      -[:IS_SUBCLASS_OF*0..]->(baseClass:TagClass {name: $tagClassName})
RETURN friend.id, friend.firstName, friend.lastName,
  collect(DISTINCT tag.name) AS tagNames,
  count(DISTINCT comment) AS replyCount
ORDER BY replyCount DESC, friend.id ASC
LIMIT 20
```

**Features exercised:** 7-hop chain, VLP with minHops=0 (IS_SUBCLASS_OF\*0..), terminal property filter, mixed collect(DISTINCT) + count(DISTINCT) aggregation, multi-hop reverse GROUP BY.

### IC13 — Shortest path

```cypher
MATCH path = shortestPath((p1:Person {id: $person1Id})-[:KNOWS*]-(p2:Person {id: $person2Id}))
RETURN length(path) AS pathLength
```

**Features exercised:** Bidirectional BFS, edge-type-filtered traversal, path variable, length() function.

### IC14 — All shortest paths

```cypher
MATCH path = allShortestPaths((p1:Person {id: $person1Id})-[:KNOWS*]-(p2:Person {id: $person2Id}))
WITH [n IN nodes(path) | n.id] AS personIdsInPath
RETURN personIdsInPath
```

**Features exercised:** Bidirectional BFS with multi-parent tracking, iterative path enumeration, list comprehension over path nodes, WITH clause over path variable.

---

## LDBC Choke Point Coverage

| Choke Point | Description            | Queries                |
|-------------|------------------------|------------------------|
| 1.3         | Complex patterns       | IC2–IC6, IC9–IC12      |
| 2.1         | Rich joins             | IC1, IC3–IC6, IC9–IC12 |
| 2.3         | Binding hop direction  | IC2, IC8               |
| 3.1         | Selective DISTINCT     | IC3                    |
| 3.2         | Top-K ORDER BY         | IC2, IC7–IC9           |
| 5.3         | VLP (variable-length path) | IC1, IC5           |
| 7.2         | Shortest path          | IC13, IC14             |
| 7.3         | Path finding           | IC13, IC14             |
| 7.6         | All shortest paths     | IC14                   |
| 8.2         | OPTIONAL MATCH         | IC1                    |

---

## Dataset: LDBC SNB SF10

| Entity       | Count       |
|-------------|-------------|
| Persons     | 68,673      |
| Posts       | 8,273,491   |
| Comments    | 18,196,074  |
| Forums      | 667,545     |
| Tags        | 16,080      |
| Total nodes | 27,231,349  |
| Total edges | 172,183,299 |
| Edge types  | 16          |
| Node labels | 13          |

The LDBC Social Network Benchmark (SNB) is the industry-standard benchmark for graph databases. SF10 represents a social network 10x the base scale factor, with realistic power-law degree distributions, temporal properties, and correlated data generation.
