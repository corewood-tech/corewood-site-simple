import { useEffect } from 'react';
import { getBaseUrl } from '@/lib/utils';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    keywords?: string;
    ogType?: string;
    ogImage?: string;
}

const SEO = ({
    title,
    description,
    canonical,
    keywords,
    ogType = 'website',
    ogImage = '/corewood_symbol_avatar_white.png'
}: SEOProps) => {
    useEffect(() => {
        const baseUrl = getBaseUrl();
        const fullOgImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

        // Update page title
        document.title = `${title} | Corewood AI`;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        // Update canonical URL if provided
        const canonicalUrl = canonical
            ? (canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`)
            : window.location.href;
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (linkCanonical) {
            linkCanonical.setAttribute('href', canonicalUrl);
        }

        // Update keywords if provided
        if (keywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
            }
        }

        // Update Open Graph data
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        const ogImageTag = document.querySelector('meta[property="og:image"]');
        const ogTypeTag = document.querySelector('meta[property="og:type"]');

        if (ogTitle) ogTitle.setAttribute('content', `${title} | Corewood AI`);
        if (ogDesc) ogDesc.setAttribute('content', description);
        if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
        if (ogImageTag) ogImageTag.setAttribute('content', fullOgImageUrl);
        if (ogTypeTag) ogTypeTag.setAttribute('content', ogType);

        // Update Twitter data
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        const twitterDesc = document.querySelector('meta[property="twitter:description"]');
        const twitterUrl = document.querySelector('meta[property="twitter:url"]');
        const twitterImage = document.querySelector('meta[property="twitter:image"]');

        if (twitterTitle) twitterTitle.setAttribute('content', `${title} | Corewood AI`);
        if (twitterDesc) twitterDesc.setAttribute('content', description);
        if (twitterUrl) twitterUrl.setAttribute('content', canonicalUrl);
        if (twitterImage) twitterImage.setAttribute('content', fullOgImageUrl);
    }, [title, description, canonical, keywords, ogType, ogImage]);

    // This component doesn't render anything visible
    return null;
};

export default SEO; 
