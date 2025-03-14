
import { Cpu, ShieldCheck, Zap, Database, Code, TrendingUp, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 stagger-animate">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            WHY CHOOSE COREWOOD
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
            We Focus on Operations So You Don't Have To
          </h2>
          <p className="text-muted-foreground mb-8">
            At Corewood, we deliver more than just Masquer—we provide custom-tailored solutions for all your inference models. Our team handles the operational complexity behind your ML deployments, optimizing performance, reducing costs, and ensuring security while you focus exclusively on your core business challenges. Whether you need enhanced PII detection or custom inference acceleration, our expertise transforms complex ML operations into streamlined, efficient solutions that scale with your business.
          </p>
        </div>

        {/* Core Features Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {coreFeatures.map((feature, index) => (
            <Card 
              key={feature.title}
              className="overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group animate-fade-in p-6"
              style={{ animationDelay: `${(index + 1) * 0.15}s` }}
            >
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Technology Ownership Section */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="text-center max-w-3xl mx-auto mb-12 stagger-animate">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              TECHNOLOGY OWNERSHIP DONE RIGHT
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
              Your AI, Your Infrastructure, Your Control
            </h2>
            <p className="text-muted-foreground mb-8">
              We believe in straightforward ownership without the subscription trap. Corewood's core API integrates directly into your existing infrastructure, becoming a permanent part of your technology stack—not a recurring expense. Unlike SaaS models that charge you endlessly for your own success, our pricing is transparent and upfront: you buy it once, you own it forever. No hidden costs, no usage limits, no subscription creep. Your data stays on your systems, your AI runs on your terms, and your business maintains complete control of its technological future.
            </p>
            <div className="mt-10 p-8 bg-white/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-primary/5">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-3">Custom Solutions</h3>
                  <p className="text-muted-foreground">Tailored ML optimization for your specific business needs, ensuring scalability as your requirements grow.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Core Features data
const coreFeatures = [
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Optimize your ML models for lightning-fast inference times while maintaining superior accuracy on standard hardware."
  },
  {
    icon: Leaf,
    title: "Cost Efficiency",
    description: "Reduce cloud computing costs and environmental impact with our edge-based processing solutions that minimize data transfer needs."
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description: "Enterprise-grade protection across multiple languages and data types with specialized models for exceptional PII detection."
  }
];

export default Features;
