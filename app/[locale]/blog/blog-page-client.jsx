// @flow strict
"use client";
import { useState, useMemo } from 'react';
import { BsSearch, BsX } from 'react-icons/bs';
import BlogCard from "../../components/homepage/blog/blog-card";

export default function BlogPageClient({ blogs, allTags, locale, translations }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      if (!blog?.cover_image) return false;
      const matchesSearch = !searchQuery || 
        blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || 
        blog.tag_list?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [blogs, searchQuery, selectedTag]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  const hasActiveFilters = searchQuery || selectedTag;

  return (
    <div className="min-h-screen py-8 lg:py-16">
      {/* Header */}
      <div className="flex justify-center mb-10 lg:mb-16">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-100">
          {translations.title}
        </h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-10 space-y-6">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <BsSearch className="w-5 h-5 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="w-full py-3.5 ps-12 pe-12 
              bg-slate-800 border border-slate-700 rounded-lg
              text-slate-100 placeholder:text-slate-500
              focus:outline-none focus:border-slate-500 
              focus:ring-1 focus:ring-slate-500
              transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 end-0 flex items-center pe-4
                text-slate-500 hover:text-slate-200 transition-colors"
              aria-label="Clear search"
            >
              <BsX className="w-6 h-6" />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors border
                ${!selectedTag 
                  ? 'bg-slate-700 border-slate-600 text-slate-100' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
            >
              {translations.allTags}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors border
                  ${selectedTag === tag 
                    ? 'bg-slate-700 border-slate-600 text-slate-100' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilters && filteredBlogs.length > 0 && (
        <p className="text-center text-slate-500 mb-8">
          {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'} found
        </p>
      )}

      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredBlogs.map((blog, i) => (
            <BlogCard blog={blog} key={blog.id || i} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-slate-200 mb-3">
            {translations.noResults}
          </h3>
          <p className="text-slate-500 max-w-md mb-8">
            {translations.noResultsDescription}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded border border-slate-500 text-slate-100 hover:bg-slate-800 transition-colors"
            >
              {translations.clearFilters}
            </button>
          )}
        </div>
      )}
    </div>
  );
}