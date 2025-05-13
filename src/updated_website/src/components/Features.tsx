import { Cpu, ShieldCheck, Zap, Database, Code, TrendingUp, Leaf, Lock, Server, Shield } from "lucide-react";
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
            Private AI Infrastructure That Respects Your Data
          </h2>
          <p className="text-muted-foreground mb-8 text-justify">
            Our team builds secure, self-hosted AI solutions that keep your sensitive data within your control. We transform complex ML operations into streamlined, private infrastructure that prioritizes data sovereignty while delivering exceptional performance.
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
              COMPLETE DATA PRIVACY AND CONTROL
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
              Your AI, Your Infrastructure, Your Data
            </h2>
            <p className="text-muted-foreground mb-8 text-justify">
              We believe in straightforward, secure AI systems that prioritize your data privacy.

              Our solutions integrate directly into your existing infrastructure, ensuring sensitive data never leaves your environment.

              No hidden costs, no arbitrary limits, no data harvesting.

              Your data stays on your systems, protected by your security measures, while still leveraging cutting-edge AI capabilities.

              Or we build and host it for you with ironclad privacy guarantees. The choice is yours.
            </p>
            <div className="mt-10 p-8 bg-white/90 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-primary/5">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-3">Private AI Solutions</h3>
                  <p className="text-muted-foreground text-justify">Self-hosted, data-sovereign ML infrastructure tailored to your specific business needs, ensuring both privacy and performance at scale.</p>
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
    icon: Shield,
    title: "Complete Data Privacy",
    description: "Your sensitive data never leaves your environment, ensuring maximum security and regulatory compliance."
  },
  {
    icon: Server,
    title: "Self-Hosted Infrastructure",
    description: "AI solutions that deploy directly to your infrastructure, giving you full control over your data and processing."
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description: "Enterprise-grade protection with specialized AI applications designed for data sovereignty and privacy regulations."
  }
];

export default Features;
