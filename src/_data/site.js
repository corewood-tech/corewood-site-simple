module.exports = {
  title: "TETRA by Corewood",
  description: "TETRA by Corewood — a fast, effective Neo4j alternative built for GraphRAG. Coming soon.",
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
      "Corewood",
      "Neo4j alternative",
      "GraphRAG",
      "openCypher",
      "knowledge graph",
      "AI infrastructure",
      "software consulting",
      "AI engineering"
    ],
    organization: {
      name: "TETRA by Corewood",
      type: "Graph Database Technology",
      description: "Corewood builds TETRA — a fast, effective Neo4j alternative for GraphRAG.",
      foundingDate: "2024",
      industry: "Database Technology & Software Engineering",
      specialties: [
        "Graph Database Technology",
        "openCypher Query Language",
        "Knowledge Graph Infrastructure",
        "GraphRAG",
        "Software Architecture",
        "Systems Design"
      ]
    }
  },

  // Build info
  buildTime: new Date(),
  environment: process.env.NODE_ENV || "development"
};
