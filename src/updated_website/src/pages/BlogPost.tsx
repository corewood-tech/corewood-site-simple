import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { blogEntries } from './Blog';
import Header from '../components/Header';
import { getBlogComponent } from '../data/blog-posts';

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [content, setContent] = useState<React.ReactNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [blogEntry, setBlogEntry] = useState<typeof blogEntries[0] | null>(null);

    useEffect(() => {
        const loadBlogPost = () => {
            if (!slug) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                // Check if the blog entry exists in our list
                const entry = blogEntries.find(entry => entry.slug === slug);
                if (!entry) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setBlogEntry(entry);

                // Get the component using the centralized helper
                const BlogComponent = getBlogComponent(slug);
                if (BlogComponent) {
                    setContent(<BlogComponent />);
                } else {
                    console.error(`Blog component not found for slug: ${slug}`);
                    setError(true);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error loading blog post:', err);
                setError(true);
                setLoading(false);
            }
        };

        loadBlogPost();
    }, [slug]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
                    <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
                {blogEntry && (
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-4 text-gray-900">{blogEntry.title}</h1>
                        <div className="text-gray-600 text-sm mb-8">
                            <time>{new Date(blogEntry.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</time>
                            <span className="mx-2">•</span>
                            <span>{blogEntry.readingTime}</span>
                        </div>
                    </div>
                )}

                <div className="prose prose-lg max-w-none">
                    {content}
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200">
                    <a
                        href="/blog"
                        className="text-[#386641] hover:text-[#386641]/80 transition-colors"
                    >
                        ← Back to all posts
                    </a>
                </div>
            </div>
        </>
    );
};

export default BlogPost; 
