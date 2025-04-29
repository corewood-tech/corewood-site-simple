import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";

const Services = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Our Services"
                description="Explore Corewood's range of AI services: from ML Architecture & Systems Design to API Integration and Security. All our services ensure your data stays in your environment with maximum efficiency."
                keywords="ml architecture, model development, api engineering, security, data engineering, ml infrastructure, enterprise ml"
            />
            <JsonLd
                type="Service"
                data={{
                    name: "Corewood AI Services",
                    serviceType: "AI Software Solutions",
                    description: "Corewood delivers high-efficiency AI software solutions that run in your environment.",
                    offers: {
                        "@type": "Offer",
                        price: "15000",
                        priceCurrency: "USD",
                        availability: "https://schema.org/InStock",
                        validFrom: "2023-01-01",
                        offeredBy: {
                            "@type": "Organization",
                            name: "Corewood AI"
                        }
                    }
                }}
            />
            <JsonLd
                type="FAQPage"
                data={{
                    questions: [
                        {
                            question: "What makes Corewood's AI services different?",
                            answer: "Our solutions run in your environment, ensuring complete data privacy with no data leaving your network. We focus on high-efficiency implementations with transparent project pricing."
                        },
                        {
                            question: "What types of AI services do you offer?",
                            answer: "We offer ML Architecture & Systems Design, Model Development Services, API & Integration Engineering, Security & Compliance, and Data & Telemetry services."
                        },
                        {
                            question: "How is your pricing structured?",
                            answer: "We offer project-based pricing for specific deliverables and retainer options for ongoing support and advisory services."
                        }
                    ]
                }}
            />
            <Header />
            <main className="pt-32 pb-24">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
                                Our Services
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                We deliver high-efficiency AI software solutions that run in your environment, giving you complete control and ownership.
                            </p>
                        </div>

                        {/* Core Services */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-display font-bold tracking-tight mb-6 text-[#386641] text-center">
                                Core Services
                            </h2>

                            <div className="space-y-8">
                                {/* ML Architecture & Systems Design */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        ML Architecture & Systems Design
                                    </h3>
                                    <div className="space-y-3 mt-6">
                                        {services[0].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Model Development Services */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        Model Development Services
                                    </h3>
                                    <div className="space-y-3 mt-6">
                                        {services[1].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* API & Integration Engineering */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        API & Integration Engineering
                                    </h3>
                                    <div className="space-y-3 mt-6">
                                        {services[2].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Security & Compliance */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        Security & Compliance
                                    </h3>
                                    <div className="space-y-3 mt-6">
                                        {services[3].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Data & Telemetry */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        Data & Telemetry
                                    </h3>
                                    <div className="space-y-3 mt-6">
                                        {services[4].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-display font-bold tracking-tight mb-6 text-[#386641] text-center">
                                Project-Based Pricing
                            </h2>
                            <p className="text-lg text-center mb-8">
                                Clear, transparent pricing for your ML initiatives.
                            </p>

                            <div className="space-y-6">
                                {pricing.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-[#386641]/5 rounded-lg border border-[#386641]/10">
                                        <h3 className="font-semibold text-lg">{item.service}</h3>
                                        <p className="font-medium text-[#386641]">{item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-16">
                            <h2 className="text-3xl font-display font-bold tracking-tight mb-6 text-[#386641] text-center">
                                Retainer Options
                            </h2>
                            <p className="text-lg text-center mb-8">
                                Ongoing support for your ML infrastructure and needs.
                            </p>

                            <div className="space-y-6">
                                {retainers.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-[#386641]/5 rounded-lg border border-[#386641]/10">
                                        <h3 className="font-semibold text-lg">{item.service}</h3>
                                        <p className="font-medium text-[#386641]">{item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-16 text-center">
                            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-6">
                                Ready to transform your AI capabilities?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Our team of experts is ready to help you implement powerful, efficient AI solutions in your environment.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/schedule-meeting">
                                    <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90">
                                        Schedule a Meeting
                                    </Button>
                                </Link>
                                <Link to="/contact">
                                    <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// Service definitions
const services = [
    {
        title: "ML Architecture & Systems Design",
        features: [
            "Enterprise ML Infrastructure Design",
            "ML System Architecture Planning",
            "Scalability & Performance Planning"
        ]
    },
    {
        title: "Model Development Services",
        features: [
            "Model Selection & Validation",
            "Custom Model Development",
            "Model Optimization & Tuning",
            "Quantization & Efficiency Engineering"
        ]
    },
    {
        title: "API & Integration Engineering",
        features: [
            "ML API Development",
            "Inference Endpoint Design",
            "Third-party System Integration"
        ]
    },
    {
        title: "Security & Compliance",
        features: [
            "ML Security Architecture",
            "Identity & Authorization Systems",
            "Data Compliance Framework",
            "Privacy-Preserving ML Design"
        ]
    },
    {
        title: "Data & Telemetry",
        features: [
            "Data Pipeline Engineering",
            "Telemetry Integration",
            "Data Integrity Systems"
        ]
    }
];

// Pricing definitions
const pricing = [
    {
        service: "ML System Assessment & Roadmap",
        price: "Starting at $15,000"
    },
    {
        service: "Proof-of-Concept Development",
        price: "Starting at $25,000"
    },
    {
        service: "Enterprise ML Platform Development",
        price: "Starting at $100,000"
    },
    {
        service: "Model Optimization Projects",
        price: "Starting at $30,000"
    }
];

// Retainer definitions
const retainers = [
    {
        service: "Advisory Services",
        price: "Starting at $5,000/month"
    },
    {
        service: "Technical Leadership",
        price: "Starting at $10,000/month"
    },
    {
        service: "Ongoing Development Support",
        price: "Starting at $15,000/month"
    }
];

export default Services; 
