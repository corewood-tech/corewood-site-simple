
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const Pricing = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct email link with form data
    const subject = encodeURIComponent(`Pricing Request from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\n\nMessage: ${formData.message}`
    );
    
    window.location.href = `mailto:hello@corewood.info?subject=${subject}&body=${body}`;
    
    toast({
      title: "Message sent!",
      description: "Your pricing request has been sent successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
                Pricing
              </h1>
              
              <div className="bg-[#386641]/5 rounded-lg p-8 mb-12 text-left">
                <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4">
                  Own Your ML Infrastructure
                </h2>
                <p className="text-muted-foreground mb-6">
                  At Corewood, we believe in straightforward ownership without ongoing fees. Our product is delivered and installed directly in your cloud environment with a perpetual license—no subscriptions, no usage meters running in the background.
                </p>
                
                <h3 className="text-xl font-bold mb-3">What You Get</h3>
                <ul className="space-y-2 mb-6">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-[#386641] mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">{feature.title}:</span>{" "}
                        {feature.description}
                      </div>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-bold mb-3">Transparent Pricing Structure</h3>
                <p className="text-muted-foreground mb-6">
                  We've eliminated the complex pricing tiers and usage-based models that make budgeting impossible. No database usage fees, no API call limits, no surprises on your monthly bill. Just powerful ML infrastructure that belongs to you.
                </p>
                
                <h3 className="text-xl font-bold mb-3">Ready to Take Control of Your ML Infrastructure?</h3>
                <p className="text-muted-foreground">
                  Contact our team for a customized quote based on your specific implementation needs.
                </p>
              </div>
            </div>
            
            <div className="glass-card rounded-xl border border-primary/10 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your specific implementation needs"
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full bg-[#386641] hover:bg-[#386641]/90">
                  Request Pricing Information
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Pricing features
const pricingFeatures = [
  {
    title: "Complete Ownership",
    description: "Your Corewood solution lives in your ecosystem, under your control"
  },
  {
    title: "Perpetual License",
    description: "Pay once, own forever—no recurring subscription fees"
  },
  {
    title: "Exceptional Speed",
    description: "Smart optimization inference APIs delivering breakthrough performance"
  },
  {
    title: "Lifetime Bug Fixes",
    description: "Critical updates and bug fixes included at no additional cost"
  },
  {
    title: "Discounted Enhancements",
    description: "As an existing customer, access modifications and enhancements at preferred rates"
  }
];

export default Pricing;
