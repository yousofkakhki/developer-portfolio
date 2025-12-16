// @flow strict
"use client";
import { useState, useMemo } from 'react';
import { BsSearch, BsX } from 'react-icons/bs';
import BlogCard from "../../components/homepage/blog/blog-card";

export default function BlogPageClient({ blogs, allTags, locale, translations }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Filter blogs based on search and tag
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
        <div className="flex items-center gap-4">
          <span className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-transparent to-dark-700" />
          <h1 className="relative">
            <span className="bg-gradient-to-br from-dark-700 to-dark-600 
              text-text-primary px-6 py-3 text-2xl md:text-3xl font-bold
              rounded-lg border border-accent-primary/20 shadow-lg
              shadow-accent-primary/5">
              {translations.title}
            </span>
          </h1>
          <span className="w-16 md:w-24 h-[2px] bg-gradient-to-l from-transparent to-dark-700" />
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-10 space-y-6">
        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <BsSearch className="w-5 h-5 text-text-muted" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="w-full py-3.5 ps-12 pe-12 
              bg-dark-800/60 backdrop-blur-lg
              border border-dark-600/50 rounded-xl
              text-text-primary placeholder:text-text-muted
              focus:outline-none focus:border-accent-primary/50 
              focus:ring-2 focus:ring-accent-primary/20
              transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 end-0 flex items-center pe-4
                text-text-muted hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <BsX className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300 border
                ${!selectedTag 
                  ? 'bg-accent-primary/20 border-accent-primary/50 text-accent-primary' 
                  : 'bg-dark-800/40 border-dark-600/50 text-text-tertiary hover:border-dark-400/50'
                }`}
            >
              {translations.allTags}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-300 border
                  ${selectedTag === tag 
                    ? 'bg-accent-primary/20 border-accent-primary/50 text-accent-primary' 
                    : 'bg-dark-800/40 border-dark-600/50 text-text-tertiary hover:border-dark-400/50'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      {hasActiveFilters && filteredBlogs.length > 0 && (
        <p className="text-center text-text-muted mb-8">
          {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'} found
        </p>
      )}

      {/* Blog Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredBlogs.map((blog, i) => (
            <BlogCard blog={blog} key={blog.id || i} index={i} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-dark-700/30 flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-text-secondary mb-3">
            {translations.noResults}
          </h3>
          <p className="text-text-muted max-w-md mb-8">
            {translations.noResultsDescription}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-full
                bg-gradient-to-r from-accent-secondary to-accent-tertiary
                text-white font-medium
                transition-all duration-300
                hover:shadow-lg hover:shadow-accent-secondary/25
                hover:-translate-y-0.5"
            >
              {translations.clearFilters}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

