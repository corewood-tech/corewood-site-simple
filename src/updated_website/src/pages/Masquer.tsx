import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Database, Zap, Layers, Filter, Settings, FileText, Sparkles, Gauge, Server, Cpu, BadgeCheck, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";

const Masquer = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Masquer - Revolution in Data Privacy That Just Works"
                description="Masquer delivers uncompromising data privacy through a groundbreaking transparent database proxy system with military-grade PII detection powered by cutting-edge ML technology."
                keywords="masquer, pii masking, data privacy, pii detection, data protection, pii redaction, gdpr compliance, data security, transparent database proxy"
            />
            <JsonLd
                type="Product"
                data={{
                    name: "Masquer PII Masking System",
                    description: "Advanced PII masking system with 98.48% accuracy for protecting sensitive data",
                    brand: {
                        "@type": "Brand",
                        name: "Corewood AI"
                    },
                    offers: {
                        "@type": "Offer",
                        priceCurrency: "USD",
                        seller: {
                            "@type": "Organization",
                            name: "Corewood AI"
                        }
                    }
                }}
            />

            <Header />
            <main className="pt-32 pb-24">
                <div className="container px-4 mx-auto">
                    {/* Hero Section */}
                    <div className="max-w-5xl mx-auto text-center mb-20">
                        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 text-[#386641]">
                            MASQUER
                        </h1>
                        <p className="text-2xl md:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto font-medium">
                            Revolution in Data Privacy That Just Works
                        </p>
                        <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
                            Imagine a world where your sensitive data is protected without sacrificing developer productivity. That world is here.
                        </p>
                        <div className="bg-[#386641]/10 p-6 md:p-8 rounded-lg mb-10">
                            <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#386641]">
                                The Privacy Problem We Solve
                            </h2>
                            <p className="text-lg">
                                Engineers need access to production data, but the privacy implications are MASSIVE. Traditional solutions are clunky, break workflows, and kill productivity. Until now.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="https://calendly.com/corewoodteam/30min" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90 shadow-lg">
                                    Schedule a Demo
                                </Button>
                            </a>
                            <Link to="/contact">
                                <Button size="lg" variant="outline">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Introduction Section */}
                    <div className="max-w-4xl mx-auto mb-20 text-center">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                            Privacy at the Speed of Innovation
                        </h2>
                        <p className="text-lg md:text-xl mb-8">
                            Masquer delivers uncompromising data privacy through a groundbreaking transparent database proxy system with military-grade PII detection powered by cutting-edge ML technology.
                        </p>
                    </div>

                    {/* Key Features Section */}
                    <div className="max-w-4xl mx-auto mb-24">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/50 rounded-lg p-8 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <Zap className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Real-Time PII Redaction via ML Inference</h3>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>98.48% PII detection accuracy using our proprietary ML model</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Lightning-fast processing - up to 17x faster than Python implementations</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Ultra-efficient memory usage - 19MB vs 2GB in competitive solutions</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>270+ requests/second throughput with 100% reliability under load</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-lg p-8 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <Settings className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Intelligent Configuration via Simple API</h3>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Point-and-click sensitive data management through intuitive admin UI</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Secure credential storage for enterprise-grade security compliance</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Consistent masking policies across your entire data ecosystem</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Zero changes to your applications or SQL code required</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-lg p-8 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <Sparkles className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Auto-Detection for Hidden Sensitive Data</h3>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>ML-powered column analysis finds PII you didn't know existed</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Confidence scoring helps prioritize protection efforts</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Schema-aware detection understands your data relationships</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Eliminates human error in privacy configuration</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-lg p-8 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <Database className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Seamless DB Proxy for Zero-Friction Privacy</h3>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Transparent PostgreSQL proxy sits between apps and databases</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Real-time query interception and analysis</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Intelligent masking preserves data format and referential integrity</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#386641] font-bold">•</span>
                                                <span>Deterministic replacement for consistent test data</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Industries Section */}
                    <div className="max-w-4xl mx-auto mb-24 bg-[#386641]/5 rounded-xl p-8 md:p-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">
                            Built for Critical Industries
                        </h2>
                        <p className="text-lg text-center mb-8">
                            Perfect for organizations in Healthcare, Finance, Insurance, Government, Legal, Education, and Technology where data privacy is non-negotiable but developer agility is essential.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div className="p-4">
                                <div className="flex justify-center mb-3">
                                    <BadgeCheck className="h-12 w-12 text-[#386641]" />
                                </div>
                                <p className="font-medium">Healthcare</p>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-center mb-3">
                                    <BadgeCheck className="h-12 w-12 text-[#386641]" />
                                </div>
                                <p className="font-medium">Finance</p>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-center mb-3">
                                    <BadgeCheck className="h-12 w-12 text-[#386641]" />
                                </div>
                                <p className="font-medium">Government</p>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-center mb-3">
                                    <BadgeCheck className="h-12 w-12 text-[#386641]" />
                                </div>
                                <p className="font-medium">Technology</p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Excellence Section */}
                    <div className="max-w-4xl mx-auto mb-24">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                            Technical Excellence That Matters
                        </h2>

                        <p className="text-lg text-center mb-8">
                            Our advanced architecture delivers exceptional performance characteristics that outclass the competition:
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/50 rounded-lg p-6 border border-[#386641]/20 flex items-start gap-4">
                                <Server className="h-6 w-6 text-[#386641] mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Advanced memory management with tensor pooling and zero-copy operations</p>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-lg p-6 border border-[#386641]/20 flex items-start gap-4">
                                <Gauge className="h-6 w-6 text-[#386641] mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Adaptive concurrency that dynamically scales with system load</p>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-lg p-6 border border-[#386641]/20 flex items-start gap-4">
                                <BarChart className="h-6 w-6 text-[#386641] mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Consistent entity handling across requests</p>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-lg p-6 border border-[#386641]/20 flex items-start gap-4">
                                <Cpu className="h-6 w-6 text-[#386641] mt-1 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Energy efficient processing - 17x less energy consumption than traditional implementations</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                            The Privacy Solution That Finally Makes Sense
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Masquer is the first privacy solution that truly understands both the technical and business challenges of protecting sensitive data. We don't just mask data - we enable innovation while eliminating privacy risk.
                        </p>
                        <p className="text-xl font-semibold text-[#386641] mb-8">
                            Don't compromise between privacy and productivity. Choose Masquer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="https://calendly.com/corewoodteam/30min" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90">
                                    Schedule a Demo
                                </Button>
                            </a>
                            <Link to="/pricing">
                                <Button size="lg" variant="outline">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Masquer; 
