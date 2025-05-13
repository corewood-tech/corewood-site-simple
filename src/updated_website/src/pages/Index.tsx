import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="High-Efficiency Private AI Solutions for Your Environment"
        description="Corewood delivers secure, self-hosted AI solutions that run in your environment, ensuring complete data privacy and control without ongoing fees or sensitive data ever leaving your network."
        keywords="ai software, machine learning infrastructure, on-premises ai, private ai, self-hosted ai, data privacy, ai infrastructure, secure ai, data sovereignty, data protection, confidential ai, local ai deployment, ai security, enterprise ai"
      />
      <JsonLd
        type="Organization"
        data={{
          name: "Corewood AI",
          url: "/",
          logo: "/corewood_symbol_avatar_white.png",
          sameAs: [
            "https://linkedin.com/company/corewood-ai",
            "https://twitter.com/corewood_ai"
          ]
        }}
      />
      <JsonLd
        type="WebSite"
        data={{
          name: "Corewood AI",
          url: "/"
        }}
      />
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
