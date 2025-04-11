import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#A7C957]/30 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#386641]/10 rounded-full filter blur-3xl opacity-50 animate-pulse-subtle" />
      <div className="absolute top-60 -left-40 w-80 h-80 bg-[#6A994E]/10 rounded-full filter blur-3xl opacity-50 animate-pulse-subtle animation-delay-1000" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 stagger-animate">
          {/* First bold emphasis */}
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            <span className="gradient-text">Cut Complexity</span>
          </h1>

          {/* Second emphasis */}
          <div className="inline-block px-3 py-1 rounded-full bg-[#386641]/10 text-[#386641] font-medium text-sm mb-6">
            On-Premises AI Solutions
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            At Corewood, we're making AI accessible to everyone, enabling companies of any size to compete with industry giants.
          </p>

          {/* Masquer block */}
          <div className="bg-[#386641]/5 rounded-lg p-6 mb-8">
            <a href="/masquer"><h2 className="text-xl md:text-2xl font-semibold mb-2">Introducing Masquer</h2></a>
            <p className="text-md md:text-lg">
              Masquer delivers enterprise-grade Personally Identifiable Information (PII) detection, affordably in your own infrastructure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90 text-[#F2E8CF]">
                Schedule Demo
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-[#386641] text-[#386641] hover:bg-[#386641]/10">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
