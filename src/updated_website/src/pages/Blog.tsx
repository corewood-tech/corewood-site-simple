import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { getBlogEntries } from '../data/blog-posts';

interface BlogEntry {
    title: string;
    date: string;
    readingTime: string;
    slug: string;
}

// Use the centralized blog entries
export const blogEntries: BlogEntry[] = getBlogEntries();

const Blog: React.FC = () => {
    return (
        <>
            <Header />
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Blog</h1>
                <div className="grid gap-8">
                    {blogEntries.map((entry) => (
                        <article key={entry.slug} className="border-b border-gray-200 pb-8 last:border-b-0">
                            <Link to={`/blog/${entry.slug}`} className="block group">
                                <h2 className="text-2xl font-semibold mb-2 text-gray-900 group-hover:text-[#386641] transition-colors">
                                    {entry.title}
                                </h2>
                                <div className="text-gray-600 text-sm mb-4">
                                    <time>{new Date(entry.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</time>
                                    <span className="mx-2">•</span>
                                    <span>{entry.readingTime}</span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Blog; 
