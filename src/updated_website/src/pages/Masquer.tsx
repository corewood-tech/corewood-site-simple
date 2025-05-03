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
                title="Masquer - Zero-Copy Privacy That Makes Sense"
                description="Masquer delivers zero-copy privacy that processes sensitive data in-place without creating duplicates, deployed entirely within your infrastructure with fixed, predictable pricing."
                keywords="masquer, pii masking, data privacy, pii detection, data protection, pii redaction, gdpr compliance, data security, zero-copy privacy, healthcare, healthcare tech, pii management, personal data, personal data masking, medical, medical AI, phi protection, hipaa compliance, healthcare data security, protected health information, sensitive data handling, ehr data protection, patient data privacy, medical records security, healthcare compliance, health information protection, healthcare database security"
                ogType="product"
                ogImage="/corewood_symbol_avatar_white.png"
                canonical="/masquer"
            />
            <JsonLd
                type="Product"
                data={{
                    name: "Masquer PII Masking System",
                    description: "Advanced PII masking system with zero-copy architecture that processes sensitive data in-place",
                    brand: {
                        "@type": "Brand",
                        name: "Corewood"
                    },
                    offers: {
                        "@type": "Offer",
                        priceCurrency: "USD",
                        seller: {
                            "@type": "Organization",
                            name: "Corewood"
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
                            ZERO-COPY ARCHITECTURE THAT MAKES SENSE
                        </p>
                        <div className="bg-[#386641]/10 p-6 md:p-8 rounded-lg mb-10">
                            <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#386641]">
                                The Data Privacy Problem
                            </h2>
                            <p className="text-lg text-left">
                                Organizations face an impossible situation:
                            </p>
                            <ul className="text-lg text-left list-disc pl-6 mt-4 space-y-2">
                                <li>Production data is essential for development and testing</li>
                                <li>Regulations require comprehensive protection of sensitive identifiers</li>
                                <li>Current solutions force you to copy entire databases, redact, then re-upload</li>
                                <li>Cloud providers charge by data volume, making costs unpredictable and excessive</li>
                                <li>Each data copy increases both security risk and compliance burden</li>
                            </ul>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/schedule-meeting">
                                <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90 shadow-lg">
                                    Schedule a Demo
                                </Button>
                            </Link>
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
                            Masquer: Privacy Without Data Movement
                        </h2>
                        <p className="text-lg md:text-xl mb-8">
                            Masquer eliminates these fundamental flaws:
                        </p>
                        <ul className="text-lg text-left list-disc pl-6 mt-4 space-y-2 max-w-3xl mx-auto">
                            <li>Processes sensitive data in-place without creating duplicates</li>
                            <li>Deploys entirely within your infrastructure—zero data leaves your environment</li>
                            <li>Masks only what needs protection, not entire datasets</li>
                            <li>Fixed, predictable pricing regardless of data volume</li>
                            <li>No costly data duplication or movement</li>
                        </ul>
                    </div>

                    {/* Screenshots Section */}
                    <div className="max-w-5xl mx-auto mb-20">
                        {/* Database Admin Interface - Full Width */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-center text-[#386641]">Database Administration Interface</h3>
                            <div className="bg-white/80 p-4 rounded-lg shadow-md">
                                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img
                                        src="/masquer_db_admin.png"
                                        alt="Masquer database administration interface"
                                        className="w-full h-auto"
                                    />
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground text-center">
                                    Intuitive admin interface for managing and monitoring PII detection across your database
                                </p>
                            </div>
                        </div>

                        {/* PII Detection with Info - Two Columns */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/80 p-4 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4 text-center text-[#386641]">PII Detection & Redaction</h3>
                                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img
                                        src="/masquer_pii_redact.png"
                                        alt="Masquer PII detection and redaction"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white/50 rounded-lg p-4 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4">
                                        <Zap className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">Why Organizations Choose Masquer</h3>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-[#386641] font-bold">•</span>
                                                    <span>Eliminate Copy-Redact-Reupload Cycles: Process sensitive data directly where it resides</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-[#386641] font-bold">•</span>
                                                    <span>Slash Compliance Costs: No more paying per-gigabyte for cloud processing</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-[#386641] font-bold">•</span>
                                                    <span>Accelerate Development: Give teams immediate access to safe, production-like data</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-[#386641] font-bold">•</span>
                                                    <span>Reduce Security Risks: No duplicate copies means smaller attack surface</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-[#386641] font-bold">•</span>
                                                    <span>Simplify Regulatory Compliance: Data never leaves your controlled environment</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/50 rounded-lg p-4 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4">
                                        <Database className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">Designed for Critical Data Infrastructure</h3>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-[#386641] font-bold">•</span>
                                                    <span>Seamlessly integrates with existing database systems</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-[#386641] font-bold">•</span>
                                                    <span>Transparent proxy requires zero application code changes</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-[#386641] font-bold">•</span>
                                                    <span>ML-powered detection identifies all forms of sensitive information</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-[#386641] font-bold">•</span>
                                                    <span>Particularly valuable for organizations handling PHI, financial data, and other regulated information</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
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
                                    <p className="font-medium">Advanced low-resource AI for PII detection</p>
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
                                    <p className="font-medium">High performance database proxy</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                            Ready to transform your data privacy approach?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Schedule a conversation to see how our zero-copy architecture can solve your specific challenges.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/schedule-meeting">
                                <Button size="lg" className="bg-[#386641] hover:bg-[#386641]/90">
                                    Schedule a Demo
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
