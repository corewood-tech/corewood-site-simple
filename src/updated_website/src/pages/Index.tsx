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
        title="High-Efficiency AI Solutions for Your Environment"
        description="Corewood delivers AI software solutions that run in your environment, giving you complete control and ownership without ongoing fees or data leaving your network."
        keywords="ai software, machine learning infrastructure, on-premises ai, ai apis, kubernetes clusters, hosted ai, data privacy"
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
