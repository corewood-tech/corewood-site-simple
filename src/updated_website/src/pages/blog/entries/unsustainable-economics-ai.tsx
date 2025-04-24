import React from 'react';
import { Link } from 'react-router-dom';

const BlogPost: React.FC = () => {
    return (
        <article className="font-sans text-gray-800 leading-relaxed">
            <h2 className="text-4xl font-bold mt-12 mb-6 text-gray-900 leading-tight">The Unsustainable Economics of Generative AI: Finding a Path Forward</h2>
            
            <p className="mb-6 text-lg">
                Let's start with the brass tacks: many companies are demoing and raising capital on capabilities they fundamentally cannot afford to operate. Why? Because we're in the early adoption stage of LLMs, and organizations are using these models at massive discounts from what they actually cost to run.
            </p>

            <h3 className="text-3xl font-bold mt-10 mb-4 text-gray-900">The Sobering Reality of AI Economics</h3>
            <p className="mb-6 text-lg">
                What does it actually cost to operate LLMs? The numbers tell a stark story:
            </p>
            <p className="mb-6 text-lg">
                Putting aside the hype and bluster, OpenAI — as with all generative AI model developers — loses money on every single prompt and output. Its products do not scale like traditional software, in that the more users it gets, the more expensive its services are to run because its models are so compute-intensive.
            </p>

            <h3 className="text-3xl font-bold mt-10 mb-4 text-gray-900">The Financial Reality of Generative AI in 2024-2025</h3>
            
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Company</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">2024 Revenue</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">2024 Losses</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Key Financial Facts</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">OpenAI</td>
                            <td className="border border-gray-300 px-4 py-2">$4 billion</td>
                            <td className="border border-gray-300 px-4 py-2">$5 billion (after revenue), $9 billion total operating costs</td>
                            <td className="border border-gray-300 px-4 py-2">
                                • Compute for training models alone: $3 billion<br />
                                • Compute for running models: $2 billion<br />
                                • Salary expenses: Over $700 million (before stock compensation)
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Anthropic</td>
                            <td className="border border-gray-300 px-4 py-2">$918 million</td>
                            <td className="border border-gray-300 px-4 py-2">$5.6 billion</td>
                            <td className="border border-gray-300 px-4 py-2">
                                • 60-75% of revenue came from API calls<br />
                                • Currently raising $2 billion at a $60 billion valuation
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Perplexity</td>
                            <td className="border border-gray-300 px-4 py-2">Just over $56 million</td>
                            <td className="border border-gray-300 px-4 py-2">Not profitable</td>
                            <td className="border border-gray-300 px-4 py-2">
                                • Valued at $9 billion (late 2024)<br />
                                • Projecting $127 million revenue in 2025
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
                Source: <a href="https://www.wheresyoured.at/wheres-the-money/" className="text-[#386641] hover:underline" target="_blank" rel="noopener noreferrer">Ed Zitron's "Where's The Money?"</a> - Data compiled from reporting by The Information, New York Times, and CNBC.
            </p>

            <h3 className="text-3xl font-bold mt-10 mb-4 text-gray-900">The Fundamental Question</h3>
            <p className="mb-6 text-xl font-bold text-center">
                IF YOUR BUSINESS IS NOT USING PROFITABLE TECH, HOW CAN YOUR BUSINESS BE PROFITABLE?
            </p>
            <p className="mb-6 text-lg">
                This question cuts to the heart of the current AI landscape. The rush to implement generative AI features has outpaced reasonable economic considerations. Companies are building business models on technology that fundamentally loses money with every transaction.
            </p>

            <h3 className="text-3xl font-bold mt-10 mb-4 text-gray-900">A Different Path Forward</h3>
            <p className="mb-6 text-lg">
                If we want AI to be sustainable and profitable, we need to build it differently. This means developing high-performance, low-cost-of-operations technology that addresses:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2 text-lg">
                <li>How models access context and on-prem data: Context windows and retrieval mechanisms need fundamental redesign</li>
                <li>Systems design from first principles: Rather than scaling expensive architectures, rethinking how inference operates</li>
                <li>Economic realities: Understanding the true cost structure of AI operations</li>
            </ul>
            <p className="mb-6 text-lg">
                The current usage pattern of AI fits the textbook definition of a bubble stage. It will pop. The only question is when.
            </p>

            <h3 className="text-3xl font-bold mt-10 mb-4 text-gray-900">Practical Steps Forward</h3>
            <p className="mb-6 text-lg">
                What can forward-thinking organizations do now?
            </p>
            <p className="mb-6 text-lg">
                Start building AI systems you can afford to operate. "But we need to validate our approach..." I hear you say. If you can't rebuild your prototype into something economically viable, you're not validating - you're gambling.
            </p>
            <p className="mb-6 text-lg">
                There's a dangerous assumption that systems can be "fixed later" if the business succeeds. This is often incorrect with generative AI because these models can do things you simply can't hire people to program efficiently - but at a cost structure that few businesses can sustain.
            </p>

            <h3 className="text-3xl font-bold mt-10 mb-4 text-gray-900">The Outsourced Foundation Problem</h3>
            <p className="mb-6 text-lg">
                Using vendor-provided generative AI for core features means your business model rests in someone else's hands. What happens when they inevitably need to become profitable? Your margins become their target.
            </p>
            <p className="mb-6 text-lg">
                Think of it as hiring a Harvard-educated PhD to staff your support desk. They might do excellent work, but it's a fundamentally inefficient allocation of resources - unless perhaps your support desk is managing a nuclear power plant.
            </p>

            <h3 className="text-3xl font-bold mt-10 mb-4 text-gray-900">A Better Path: Custom, Small Language Model Training</h3>
            <p className="mb-6 text-lg">
                I'm not here to burst bubbles or ruin parades. I'm offering a more sustainable path: custom, small language model training and operation with reimagined inference frameworks.
            </p>
            <p className="mb-6 text-lg">
                At Corewood, we've assembled a team with deep expertise across:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2 text-lg">
                <li>System design, cloud infrastructure, security, and identity</li>
                <li>Engineering management and front-end/last mile delivery</li>
                <li>Backend engineering and framework optimization</li>
                <li>Academic and applied AI, spanning LLMs, SLMs, and purpose-built models</li>
            </ul>
            <p className="mb-6 text-lg">
                We're not a one-trick pony but a collective of essential industry knowledge uniquely positioned to help your organization navigate through this bubble without getting caught in its inevitable burst.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="mb-6 text-lg font-medium italic">
                    Ready to build AI systems you can actually afford to operate? Let's talk about how Corewood can help.
                </p>
                <Link
                    to="/schedule-meeting"
                    className="inline-block px-6 py-3 bg-[#386641] text-white font-medium rounded-md hover:bg-[#386641]/90 transition-colors"
                >
                    Contact us today
                </Link>
            </div>
        </article>
    );
};

export default BlogPost; 
