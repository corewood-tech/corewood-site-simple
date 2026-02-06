module.exports = {
  title: "Corewood",
  description: "Hard problems. Simple solutions. Software consulting for founders, scaling teams, and enterprises.",
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
    defaultImage: "/corewood_symbol_avatar_white.png",
    keywords: [
      "software consulting",
      "software architecture",
      "systems design",
      "climate tech",
      "full stack engineering",
      "GoLang",
      "React",
      "infrastructure automation",
      "ML engineering",
      "API design",
      "technical leadership",
      "startup CTO",
      "fractional CTO",
      "product engineering"
    ],
    organization: {
      name: "Corewood",
      type: "Software Consulting",
      description: "Software consulting for founders, scaling teams, and enterprises. Architecture, engineering, and technical leadership.",
      foundingDate: "2024",
      industry: "Software Engineering & Consulting",
      specialties: [
        "Software Architecture",
        "Systems Design",
        "Full Stack Engineering",
        "ML & AI Engineering",
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
