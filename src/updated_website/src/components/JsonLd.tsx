import { useEffect } from 'react';
import { getBaseUrl } from '@/lib/utils';

interface JsonLdProps {
    type: 'Organization' | 'WebSite' | 'Service' | 'FAQPage' | 'Product' | 'BreadcrumbList';
    data: any;
}

const JsonLd = ({ type, data }: JsonLdProps) => {
    useEffect(() => {
        const baseUrl = getBaseUrl();

        // Helper to resolve URLs
        const resolveUrl = (url: string) => {
            if (!url) return '';
            return url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
        };

        // Create or update the JSON-LD script
        let script = document.querySelector(`script[data-type="${type}"]`);

        if (!script) {
            script = document.createElement('script');
            script.setAttribute('type', 'application/ld+json');
            script.setAttribute('data-type', type);
            document.head.appendChild(script);
        }

        // Create the appropriate schema based on type
        let schema;

        switch (type) {
            case 'Organization':
                schema = {
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: data.name || 'Corewood AI',
                    url: data.url ? resolveUrl(data.url) : baseUrl,
                    logo: data.logo ? resolveUrl(data.logo) : `${baseUrl}/corewood_symbol_avatar_white.png`,
                    description: data.description || 'Corewood delivers high-efficiency AI software solutions that run in your environment.',
                    contactPoint: {
                        '@type': 'ContactPoint',
                        email: 'hello@corewood.info',
                        contactType: 'customer service'
                    },
                    ...data
                };
                break;

            case 'WebSite':
                schema = {
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: data.name || 'Corewood AI',
                    url: data.url ? resolveUrl(data.url) : baseUrl,
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: {
                            '@type': 'EntryPoint',
                            urlTemplate: `${baseUrl}/search?q={search_term_string}`
                        },
                        'query-input': 'required name=search_term_string'
                    },
                    ...data
                };
                break;

            case 'Service':
                schema = {
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    serviceType: data.serviceType || 'AI Software Solutions',
                    provider: {
                        '@type': 'Organization',
                        name: 'Corewood AI',
                        url: baseUrl
                    },
                    ...data
                };
                break;

            case 'FAQPage':
                schema = {
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: data.questions.map((item: any) => ({
                        '@type': 'Question',
                        name: item.question,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: item.answer
                        }
                    }))
                };
                break;

            case 'Product':
                schema = {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: data.name,
                    description: data.description,
                    ...data
                };
                break;

            case 'BreadcrumbList':
                schema = {
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: data.items.map((item: any, index: number) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: item.name,
                        item: resolveUrl(item.url)
                    }))
                };
                break;

            default:
                schema = data;
        }

        script.textContent = JSON.stringify(schema);

        // Cleanup function
        return () => {
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [type, data]);

    // Component doesn't render anything visible
    return null;
};

export default JsonLd; 
