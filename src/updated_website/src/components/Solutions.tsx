
import { RocketIcon, ServerIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Solutions = () => {
  return (
    <section id="solutions" className="py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 stagger-animate">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            Our Solutions
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
            Tailored for Your ML Requirements
          </h2>
          <p className="text-muted-foreground">
            We provide comprehensive solutions that address the core challenges of ML operations, allowing you to focus on building exceptional AI-powered products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {solutions.map((solution, index) => (
            <Card 
              key={solution.title}
              className={cn(
                "overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group animate-fade-in",
              )}
              style={{ animationDelay: `${(index + 1) * 0.15}s` }}
            >
              <div className="relative h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
                
                <div className="p-8">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-6">
                    <solution.icon className="w-5 h-5 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                  <p className="text-muted-foreground mb-6">{solution.description}</p>
                  
                  <div className="space-y-3">
                    {solution.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-1 h-6 w-6 flex items-center justify-center mt-0.5">
                          <solution.icon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const solutions = [
  {
    icon: ServerIcon,
    title: "ML Infrastructure Optimization",
    description: "We streamline your ML infrastructure to reduce costs and improve performance, making advanced AI accessible for businesses of all sizes.",
    features: [
      "Memory-efficient ONNX integration with 14.5x improved efficiency",
      "Processing ~94,240 characters per MB of memory",
      "Adaptive concurrency management for optimal resource usage",
      "Cost-effective cloud resource management"
    ]
  },
  {
    icon: ShieldCheckIcon,
    title: "Advanced PII Detection & Protection",
    description: "Our Piiranha-v1 model provides superior PII detection across multiple data types, ensuring compliance and data security.",
    features: [
      "99.44% overall accuracy with 98.27% PII token detection rate",
      "Support for 6 languages and 17 PII types",
      "100% accuracy for email detection",
      "98.48% precision in PII classification"
    ]
  },
  {
    icon: ZapIcon,
    title: "Streamlined ML Operations",
    description: "We handle the complexity of ML operations so you can focus on your core business and domain expertise.",
    features: [
      "Processing times as low as 4ms on consumer hardware",
      "Efficient PII entity detection pipeline",
      "Batch processing optimization (10x more efficient)",
      "Go-based ML inference acceleration (17x faster than Python)"
    ]
  },
  {
    icon: RocketIcon,
    title: "ML at Scale",
    description: "Our infrastructure scales seamlessly from prototype to production, handling increasing loads without performance degradation.",
    features: [
      "Throughput of up to 235 operations per second",
      "Tokenization process consuming less than 0.06% of processing time",
      "High availability and fault tolerance",
      "Real-time synchronization and failover"
    ]
  }
];

export default Solutions;
