import RoiBeyondDemo from '../pages/blog/entries/roi-beyond-the-demo';
import BeyondAiHype from '../pages/blog/entries/ai-hype-failing';
import OnPremisesAi from '../pages/blog/entries/ai-on-prem';

interface BlogPost {
    title: string;
    date: string;
    readingTime: string;
    slug: string;
    component: React.FC;
}

export const blogPosts: BlogPost[] = [
    {
        title: "On-Premises AI: The Smarter Way Forward in Corporate Computing",
        date: "2025-0416",
        readingTime: "4 min read",
        slug: "ai-on-prem",
        component: OnPremisesAi
    },
    {
        title: "AI Hype: Why Current ML Approaches Are Failing Businesses",
        date: "2025-04-14",
        readingTime: "3 min read",
        slug: "ai-hype-failing",
        component: BeyondAiHype
    },
    {
        title: "ROI Beyond the Demo: Making AI Work for Your Business",
        date: "2025-04-10",
        readingTime: "6 min read",
        slug: "roi-beyond-the-demo",
        component: RoiBeyondDemo
    }
    // Add more blog entries here as they are created
];

// Helper function to get blog posts metadata without components
export const getBlogEntries = () => {
    return blogPosts.map(({ title, date, readingTime, slug }) => ({
        title,
        date,
        readingTime,
        slug
    }));
};

// Helper function to get component by slug
export const getBlogComponent = (slug: string) => {
    const post = blogPosts.find(post => post.slug === slug);
    return post ? post.component : null;
}; 
