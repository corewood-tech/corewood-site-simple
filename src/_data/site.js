module.exports = {
  title: "Corewood",
  description: "Systems thinking. Software building. AI engineering, climate tech, and software architecture for founders, scaling teams, and enterprises.",
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
      "software consulting",
      "software architecture",
      "systems design",
      "climate tech",
      "eco tech",
      "AI engineering",
      "LLM-driven engineering",
      "vibe coding",
      "full stack engineering",
      "GoLang",
      "React",
      "infrastructure automation",
      "ML engineering",
      "API design",
      "technical leadership",
      "startup CTO",
      "fractional CTO",
      "product engineering",
      "systems thinking software building"
    ],
    organization: {
      name: "Corewood",
      type: "Software Consulting",
      description: "Systems thinking. Software building. AI engineering, climate tech, and software architecture for founders, scaling teams, and enterprises.",
      foundingDate: "2024",
      industry: "Software Engineering & Consulting",
      specialties: [
        "Software Architecture",
        "Systems Design",
        "Full Stack Engineering",
        "AI & LLM-Driven Engineering",
        "Infrastructure Automation",
        "Technical Leadership",
        "Climate Tech"
      ]
    }
  },

  // Build info
  buildTime: new Date(),
  environment: process.env.NODE_ENV || "development"
};
