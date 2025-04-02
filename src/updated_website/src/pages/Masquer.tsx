import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Database, Zap, Layers, Filter, Settings, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";

const Masquer = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Masquer - Configurable PII Masking System"
                description="Masquer is a highly configurable PII masking system that sits between your data and external stakeholders, with 99% accurate PII identification using advanced models and traditional database column flagging."
                keywords="masquer, pii masking, data privacy, pii detection, data protection, pii redaction, gdpr compliance, data security"
            />
            <JsonLd
                type="Product"
                data={{
                    name: "Masquer PII Masking System",
                    description: "Advanced PII masking system with 99% accuracy for protecting sensitive data",
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
                            Masquer
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                            A configurable PII masking system that sits between your data and external stakeholders
                        </p>
                        <div className="bg-[#386641]/10 p-4 md:p-6 rounded-lg inline-block mb-8">
                            <p className="text-lg font-medium text-[#386641]">
                                99% accurate PII identification with advanced AI models
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

                    {/* How It Works Section */}
                    <div className="max-w-4xl mx-auto mb-24">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                            How Masquer Works
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/50 rounded-lg p-8 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <Database className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Database Column Flagging</h3>
                                        <p className="text-muted-foreground">
                                            Traditionally identify sensitive columns in your database schema that contain PII, giving you complete control over what should be masked.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-lg p-8 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <Zap className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">AI-Powered Detection</h3>
                                        <p className="text-muted-foreground">
                                            Our advanced AI model can identify PII in unstructured data with 99% accuracy, catching sensitive information that might be missed by rule-based systems.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-lg p-8 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <Settings className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Highly Configurable</h3>
                                        <p className="text-muted-foreground">
                                            Customize masking rules based on data type, recipient, purpose, and compliance requirements. Different stakeholders can see different levels of masked data.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-lg p-8 border border-[#386641]/20 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-4">
                                    <Layers className="h-8 w-8 text-[#386641] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Middleware Integration</h3>
                                        <p className="text-muted-foreground">
                                            Masquer sits between your data and external stakeholders as a secure middleware layer, ensuring sensitive information never leaves your control.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="max-w-4xl mx-auto mb-24 bg-[#386641]/5 rounded-xl p-8 md:p-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                            Key Benefits
                        </h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <Shield className="h-6 w-6 text-[#386641] mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Enhanced Data Privacy</h3>
                                    <p>
                                        Protect sensitive personal information from unauthorized access while still enabling data sharing with third parties, partners, and vendors.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <FileText className="h-6 w-6 text-[#386641] mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Regulatory Compliance</h3>
                                    <p>
                                        Meet GDPR, CCPA, HIPAA, and other data protection regulations with configurable masking policies that adapt to different compliance requirements.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Filter className="h-6 w-6 text-[#386641] mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Granular Control</h3>
                                    <p>
                                        Implement different masking levels for different users, roles, and contexts. Some users may see partial information while others see fully masked data.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Lock className="h-6 w-6 text-[#386641] mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">On-Premises Security</h3>
                                    <p>
                                        Masquer runs entirely within your environment, ensuring that your data never leaves your control and sensitive information is never exposed to third parties.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Details Section */}
                    <div className="max-w-4xl mx-auto mb-24">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                            Technical Specifications
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white/50 rounded-lg p-6 border border-[#386641]/20">
                                <h3 className="text-xl font-semibold mb-4">PII Detection Methods</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>Schema-based PII identification</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>ML-based content analysis</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>Pattern matching and regular expressions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>Natural language processing for unstructured text</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white/50 rounded-lg p-6 border border-[#386641]/20">
                                <h3 className="text-xl font-semibold mb-4">Masking Techniques</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>Complete redaction (replacement with asterisks)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>Partial masking (show only last 4 digits)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>Tokenization (consistent replacement values)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>Format-preserving encryption</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Integration Options</h3>
                            <div className="inline-block text-left">
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>REST API for real-time data masking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#386641] font-bold">•</span>
                                        <span>Database proxy for transparent integration</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                            Ready to Protect Your Sensitive Data?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Contact us today to schedule a demo of Masquer and see how our configurable PII masking system can help protect your data while enabling secure sharing with external stakeholders.
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
