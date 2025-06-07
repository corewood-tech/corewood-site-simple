module.exports = {
  title: "Corewood AI",
  description: "AI Solutions built for modern GRC needs. Enterprise AI with integrated governance, risk management, and compliance for HIPAA, GDPR, SOC 2. Secure, auditable, and privacy-first machine learning infrastructure.",
  author: "Corewood AI",
  url: process.env.ELEVENTY_BASE_URL || "https://corewood.info",
  
  // Domain configuration for multi-domain builds
  domains: {
    info: "corewood.info",
    cloud: "corewood.cloud", 
    tech: "corewood.tech",
    io: "corewood.io"
  },

  // Navigation
  navigation: [
    { text: "Home", url: "/" },
    { text: "Services", url: "/services/" },
    { text: "Masquer", url: "/masquer/" },
    { text: "Blog", url: "/blog/" },
    { text: "Contact", url: "/contact/" }
  ],

  // Social links
  social: {
    linkedin: "https://linkedin.com/company/corewood-ai",
    twitter: "https://twitter.com/corewood_ai"
  },

  // SEO defaults
  seo: {
    defaultImage: "/corewood_symbol_avatar_white.png",
    twitterHandle: "@corewood_ai",
    keywords: [
      "GRC AI solutions",
      "compliance AI",
      "governance risk compliance",
      "HIPAA compliant AI",
      "GDPR AI compliance",
      "SOC 2 compliance AI",
      "data governance",
      "AI risk management",
      "regulatory compliance AI",
      "privacy-first AI",
      "auditable AI",
      "enterprise AI governance",
      "AI compliance framework",
      "data privacy AI",
      "secure AI deployment",
      "AI audit trails",
      "compliance automation",
      "risk assessment AI",
      "data protection AI",
      "AI security governance",
      "PII detection",
      "data masking",
      "zero-trust AI",
      "on-premises AI",
      "private AI",
      "AI infrastructure",
      "machine learning compliance",
      "AI policy management",
      "data sovereignty",
      "AI ethics compliance",
      "healthcare AI compliance",
      "financial AI compliance",
      "AI monitoring",
      "compliance reporting AI"
    ],
    organization: {
      name: "Corewood AI",
      type: "Technology Company",
      description: "GRC-focused AI company delivering compliance-first machine learning solutions with built-in governance, risk management, and regulatory compliance for enterprise environments.",
      foundingDate: "2024",
      industry: "Artificial Intelligence & Compliance Technology",
      specialties: [
        "AI Solutions for Modern GRC",
        "AI Governance & Risk Management",
        "Data Privacy & Compliance Automation", 
        "Regulatory AI Frameworks",
        "Secure AI Infrastructure",
        "Healthcare & Financial AI Compliance",
        "AI Audit & Monitoring",
        "Privacy-Preserving Machine Learning"
      ]
    }
  },

  // Build info
  buildTime: new Date(),
  environment: process.env.NODE_ENV || "development"
}; 
