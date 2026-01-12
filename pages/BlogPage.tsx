
import React from 'react';
import { BLOG_POSTS } from '../constants';

const BlogPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6 serif">Tattva Insights</h1>
        <p className="text-xl text-slate-600 italic">Thoughts on craftsmanship, code, and the intersection of both.</p>
      </header>

      <div className="space-y-24">
        {BLOG_POSTS.map(post => (
          <article key={post.id} className="group">
            <div className="aspect-video mb-8 overflow-hidden rounded-2xl">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm font-bold text-indigo-600 uppercase tracking-widest">
                <span>{post.date}</span>
                <span className="w-8 h-px bg-indigo-200"></span>
                <span>Development</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer">
                {post.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {post.excerpt}
              </p>
              <button className="text-slate-900 font-bold border-b-2 border-slate-900 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                Read Article
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
