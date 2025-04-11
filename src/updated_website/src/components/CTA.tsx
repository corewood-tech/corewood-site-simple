
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#386641]/5 to-[#6A994E]/5 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#386641]/10 rounded-full filter blur-3xl opacity-50 animate-pulse-subtle" />
      <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-[#6A994E]/10 rounded-full filter blur-3xl opacity-50 animate-pulse-subtle animation-delay-1000" />
      
      <div className="container px-4 mx-auto">
        <div className="glass-card max-w-5xl mx-auto rounded-2xl p-10 md:p-16 border border-[#386641]/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#386641] to-[#6A994E]" />
          
          <div className="text-center max-w-3xl mx-auto stagger-animate">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
              MAKE YOUR BUSINESS AN AI BUSINESS
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Companies of any size can harness the power of cutting-edge AI without breaking the bank.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/contact">
                <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90 text-[#F2E8CF]">
                  SCHEDULE A DEMO
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-[#386641] text-[#386641] hover:bg-[#386641]/10">
                  GET PRICING INFO
                </Button>
              </Link>
            </div>
            <p className="text-muted-foreground">
              Or contact us directly to discuss custom solutions for your business:
            </p>
            <a href="mailto:hello@corewood.info" className="text-[#386641] hover:underline">
              hello@corewood.info
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
