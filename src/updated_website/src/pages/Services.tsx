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
                description="Explore Corewood's range of AI services: from free consultations to fully hosted AI solutions. All our services ensure your data stays in your environment with maximum efficiency."
                keywords="ai services, machine learning services, requirements assessment, ai apis, kubernetes clusters, hosted ai, data privacy, ml infrastructure"
            />
            <JsonLd
                type="Service"
                data={{
                    name: "Corewood AI Services",
                    serviceType: "AI Software Solutions",
                    description: "Corewood delivers high-efficiency AI software solutions that run in your environment.",
                    offers: {
                        "@type": "Offer",
                        price: "0",
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
                            answer: "Our solutions run in your environment, ensuring complete data privacy with no data leaving your network. We focus on high-efficiency implementations with perpetual licensing models instead of ongoing fees."
                        },
                        {
                            question: "Do you offer free consultations?",
                            answer: "Yes, we offer free initial consultations where we listen to your needs and explain our capabilities, keeping discussions at a pre-NDA level."
                        },
                        {
                            question: "What types of AI services do you offer?",
                            answer: "We offer requirements assessments, AI APIs, AI Kubernetes clusters, hosted AI solutions, and complete product development services."
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

                        {/* Consultation & Assessment */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-display font-bold tracking-tight mb-6 text-[#386641] text-center">
                                Consultation & Assessment
                            </h2>
                            <p className="text-lg text-center mb-8">
                                Start your journey with a clear understanding of your needs and our capabilities.
                            </p>

                            <div className="space-y-8">
                                {/* Free Initial Consultation */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        Initial Consultation <em>(Free)</em>
                                    </h3>
                                    <div className="prose prose-green max-w-none mb-6">
                                        <p>
                                            We start by listening. We'll discuss your needs, explain our capabilities, and answer your questions.
                                            This no-obligation consultation helps us understand if we're the right fit for your project while respecting
                                            your confidentiality needs.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {services[0].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6">
                                        <a href="https://calendly.com/corewoodteam/30min" target="_blank" rel="noopener noreferrer">
                                            <Button className="bg-[#386641] hover:bg-[#386641]/90">
                                                Book Consultation
                                            </Button>
                                        </a>
                                    </div>
                                </div>

                                {/* Requirements Assessment */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        Requirements Assessment
                                    </h3>
                                    <div className="prose prose-green max-w-none mb-6">
                                        <p>
                                            After signing NDAs, we dive deep into your use case and ideal customer profile. We'll create
                                            an API design specifically tailored to your requirements. You can then choose to have your team build it or hire us
                                            for implementation.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {services[1].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Implementation Options - Self Hosted */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-display font-bold tracking-tight mb-6 text-[#386641] text-center">
                                Implementation Options - Self Hosted
                            </h2>
                            <p className="text-lg text-center mb-8">
                                Run AI solutions in your own environment with complete control over data and infrastructure.
                            </p>

                            <div className="space-y-8">
                                {/* AI APIs */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        AI APIs
                                    </h3>
                                    <div className="prose prose-green max-w-none mb-6">
                                        <p>
                                            We build high-performance systems to your exact requirements, with careful attention to non-functional
                                            requirements and design depth. Our deliverables are designed to integrate seamlessly with your existing
                                            infrastructure.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {services[2].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Kubernetes Clusters */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        AI Kubernetes Clusters
                                    </h3>
                                    <div className="prose prose-green max-w-none mb-6">
                                        <p>
                                            For enhanced operations support, we partner with industry-leading Kubernetes and API governance specialists.
                                            Our ML APIs are built with your operations team in mind, featuring the most robust technical foundations available.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {services[3].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Implementation Options - Managed */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-display font-bold tracking-tight mb-6 text-[#386641] text-center">
                                Implementation Options - Managed
                            </h2>
                            <p className="text-lg text-center mb-8">
                                Let us handle the infrastructure while you focus on leveraging AI for your business.
                            </p>

                            <div className="space-y-8">
                                {/* Hosted AI */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        Hosted AI
                                    </h3>
                                    <div className="prose prose-green max-w-none mb-6">
                                        <p>
                                            If you prefer not to use your own operations team, we can host your ML infrastructure in AWS. This is our only
                                            offering with recurring fees, as we maintain the infrastructure on your behalf. We maintain the strictest data
                                            privacy standards with all processing happening on-system and in-network.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {services[4].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hosted AI + Product */}
                                <div className="bg-[#386641]/5 rounded-lg p-8 transition-all hover:shadow-lg border border-[#386641]/10">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-4 text-[#386641]">
                                        Hosted AI + Product
                                    </h3>
                                    <div className="prose prose-green max-w-none mb-6">
                                        <p>
                                            For the most comprehensive solution, partner with us to build your complete AI product.
                                            With decades of software industry experience, we implement best-of-industry standards for your product.
                                            While this option includes ongoing costs, the benefits far outweigh the investment.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {services[5].features.map((feature, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-6 w-6 text-[#386641] flex-shrink-0" />
                                                <p>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                                <a href="https://calendly.com/corewoodteam/30min" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90">
                                        Start Your Free Consultation
                                    </Button>
                                </a>
                                <Link to="/contact">
                                    <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90">
                                        Schedule a Demo
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
        title: "FREE Initial Consultation",
        description: (
            <p>
                We start by listening. We'll discuss your needs, explain our capabilities, and answer your questions.
                This no-obligation consultation helps us understand if we're the right fit for your project while respecting
                your confidentiality needs.
            </p>
        ),
        features: [
            "No-obligation discussion about your AI needs",
            "We listen first and explain our approach",
            "Pre-NDA level insights and expertise",
            "Helps determine if we're the right fit for your project"
        ]
    },
    {
        title: "Requirements Assessment",
        description: (
            <p>
                After signing NDAs, we dive deep into your use case and ideal customer profile. We'll create
                an API design specifically tailored to your requirements. You can then choose to have your team build it or hire us
                for implementation.
            </p>
        ),
        features: [
            "Professional NDAs and introductions",
            "In-depth analysis of your use case and customer needs",
            "Custom API design tailored to your specific requirements",
            "Assessment cost deducted if you proceed with our implementation"
        ]
    },
    {
        title: "AI APIs",
        description: (
            <p>
                We build high-performance systems to your exact requirements, with careful attention to non-functional
                requirements and design depth. Our deliverables are designed to integrate seamlessly with your existing
                infrastructure.
            </p>
        ),
        features: [
            "On-premises program that your team can run",
            "Terraform/infrastructure as code for your environment",
            "Detailed cost by scale estimation",
            "Infrastructure and scaling recommendations",
            "Free requirements assessment if skipping the separate assessment step"
        ]
    },
    {
        title: "AI Kubernetes Clusters",
        description: (
            <p>
                For enhanced operations support, we partner with industry-leading Kubernetes and API governance specialists.
                Our ML APIs are built with your operations team in mind, featuring the most robust technical foundations available.
            </p>
        ),
        features: [
            "Access to leading Kubernetes specialists",
            "Expert API governance capabilities",
            "Autoscale-friendly ML APIs",
            "Built-in OpenTelemetry integration",
            "Comprehensive security features",
            "Health/ready checks for reliable operations"
        ]
    },
    {
        title: "Hosted AI",
        description: (
            <p>
                If you prefer not to use your own operations team, we can host your ML infrastructure in AWS. This is our only
                offering with recurring fees, as we maintain the infrastructure on your behalf. We maintain the strictest data
                privacy standards with all processing happening on-system and in-network.
            </p>
        ),
        features: [
            "Managed ML infrastructure in AWS",
            "No need for your own operations team",
            "Strict data privacy standards—everything stays in your network",
            "No shipping data to 3rd party providers",
            "No using LLMs under-the-hood",
            "Transparent recurring maintenance fees"
        ]
    },
    {
        title: "Hosted AI + Product",
        description: (
            <p>
                For the most comprehensive solution, partner with us to build your complete AI product.
                With decades of software industry experience, we implement best-of-industry standards for your product.
                While this option includes ongoing costs, the benefits far outweigh the investment.
            </p>
        ),
        features: [
            "Complete end-to-end product development",
            "Industry best practices implementation",
            "Ongoing product support and enhancement",
            "Full product ownership with clear licensing terms",
            "Integration with your existing systems"
        ]
    }
];

export default Services; 
