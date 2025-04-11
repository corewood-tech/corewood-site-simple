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
            We Focus on Operations
          </h2>
          <p className="text-muted-foreground mb-8 text-justify">
            Our team handles the operational complexity behind your AI, optimizing performance, reducing costs, and driving security. Our expertise transforms complex ML operations into streamlined, efficient solutions that scale with your business.
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
              Your AI, Your Infrastructure (if you want)
            </h2>
            <p className="text-muted-foreground mb-8 text-justify">
              We believe in straightforward software systems.

              We integrate directly into your existing infrastructure, becoming a reliable partner in tech.

              No hidden costs, no arbitrary limits, no subscription creep.

              Your data stays on your systems, your AI runs on your terms, and your business maintains control.

              Or we build and host it for you. We want to help.
            </p>
            <div className="mt-10 p-8 bg-white/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-primary/5">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-3">Custom Solutions</h3>
                  <p className="text-muted-foreground text-justify">Tailored ML optimization for your specific business needs, ensuring scalability as your requirements grow.</p>
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
    description: "Optimize your AI."
  },
  {
    icon: Leaf,
    title: "Cost Efficiency",
    description: "Reduce cloud computing costs and environmental impact."
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description: "Enterprise-grade protection across multiple languages and data types with specialized AI business applications."
  }
];

export default Features;
