// @flow strict
"use client";

import { useMemo, useState } from 'react';
import { BsSearch, BsX } from 'react-icons/bs';
import BlogCard from "../../components/homepage/blog/blog-card";

export default function BlogPageClient({ blogs, allTags, locale, translations }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const filteredBlogs = useMemo(() => blogs.filter(blog => {
    if (!blog?.cover_image) return false;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch = !normalizedQuery
      || blog.title?.toLowerCase().includes(normalizedQuery)
      || blog.description?.toLowerCase().includes(normalizedQuery);
    const matchesTag = !selectedTag || blog.tag_list?.includes(selectedTag);
    return matchesSearch && matchesTag;
  }), [blogs, searchQuery, selectedTag]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  const hasActiveFilters = Boolean(searchQuery || selectedTag);
  const resultLabel = translations.resultsFound.replace(
    '{count}',
    new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(filteredBlogs.length),
  );

  return (
    <div className="brand-publication-index">
      <div className="brand-publication-index__controls">
        <div className="brand-publication-index__search">
          <BsSearch aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder={translations.searchPlaceholder}
            aria-label={translations.searchPlaceholder}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label={translations.clearSearch}
            >
              <BsX aria-hidden="true" />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="brand-publication-index__filters" aria-label={translations.allTags}>
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              aria-pressed={!selectedTag}
            >
              {translations.allTags}
            </button>
            {allTags.map(tag => (
              <button
                type="button"
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                aria-pressed={selectedTag === tag}
              >
                <bdi>{tag}</bdi>
              </button>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilters && filteredBlogs.length > 0 && (
        <p className="brand-publication-index__result" role="status">{resultLabel}</p>
      )}

      {filteredBlogs.length > 0 ? (
        <div className="brand-publication-index__grid">
          {filteredBlogs.map((blog, index) => (
            <BlogCard blog={blog} key={blog.id || blog.slug || index} index={index} />
          ))}
        </div>
      ) : (
        <div className="brand-publication-index__empty">
          <span aria-hidden="true">00 / NULL</span>
          <h2>{translations.noResults}</h2>
          <p>{translations.noResultsDescription}</p>
          {hasActiveFilters && (
            <button type="button" className="brand-button" onClick={clearFilters}>
              {translations.clearFilters}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
