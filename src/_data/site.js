module.exports = {
  title: "TETRA by Corewood",
  description: "TETRA — the world's fastest graph database. 172M edges from a 3.6 GB file. 14/14 LDBC queries at 405ms avg. Wins 37-19 vs Neo4j. Full openCypher. Post-quantum encrypted. $299/month.",
  author: "Corewood",
  url: process.env.ELEVENTY_BASE_URL || "https://corewood.io",

  // Navigation
  navigation: [
    { text: "About", url: "/about/" },
    { text: "Blog", url: "/blog/" }
  ],

  // Social links
  social: {
    linkedin: "https://www.linkedin.com/in/kylemickey/",
    github: "https://github.com/orgs/corewood-tech"
  },

  // SEO defaults
  seo: {
    defaultImage: "/meta.png",
    keywords: [
      "TETRA",
      "graph database",
      "fastest graph database",
      "Corewood",
      "LDBC benchmark",
      "Neo4j alternative",
      "openCypher",
      "Cypher database",
      "graph database benchmark",
      "graph database pricing",
      "graph database comparison",
      "knowledge graph",
      "graph visualization",
      "graph algorithms",
      "TigerGraph alternative",
      "Neptune alternative",
      "post-quantum encryption",
      "WebAssembly",
      "AI infrastructure",
      "software consulting",
      "AI engineering"
    ],
    organization: {
      name: "TETRA by Corewood",
      type: "Graph Database Technology",
      description: "Corewood builds TETRA — the world's fastest graph database. 172M edges from a single file. 14/14 LDBC IC queries. Wins 37-19 vs Neo4j. Full openCypher. Post-quantum encryption. $299/month.",
      foundingDate: "2024",
      industry: "Database Technology & Software Engineering",
      specialties: [
        "Graph Database Technology",
        "LDBC Benchmark Performance",
        "openCypher Query Language",
        "Post-Quantum Cryptography",
        "3D Graph Visualization",
        "AI & Knowledge Graph Infrastructure",
        "Software Architecture",
        "Systems Design"
      ]
    }
  },

  // Build info
  buildTime: new Date(),
  environment: process.env.NODE_ENV || "development"
};
