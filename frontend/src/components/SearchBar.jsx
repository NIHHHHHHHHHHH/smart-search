import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 * 
 * A professional search input component with loading states, clear functionality,
 * and quick search suggestions.

 */
const SearchBar = ({ onSearch, loading }) => {
  // Local state for search query input
  const [query, setQuery] = useState('');
  
  // Reference to input element for programmatic focus management
  const inputRef = useRef(null);

  /**
   * Handles form submission
   * Prevents default form behavior and triggers search with trimmed query
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  /**
   * Clears the search input and refocuses
   * Also triggers search callback with empty string to reset results
   */
  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    onSearch('');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search icon - shows loading pulse animation when searching */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search 
              className={`w-5 h-5 ${loading ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`}
            />
          </div>

          {/* Main search input field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, campaigns, strategies..."
            className="w-full pl-12 pr-24 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white shadow-sm"
            disabled={loading}
          />

          {/* Action buttons container (Clear and Search) */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            {/* Clear button - only visible when query has content */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {/* Submit button - disabled when query is empty or loading */}
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Quick search suggestions - only shown when input is empty */}
      {!query && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-slate-500">Try:</span>
          {['marketing strategy', 'Q4 campaign', 'social media analytics'].map((tip) => (
            <button
              key={tip}
              onClick={() => {
                setQuery(tip);
                onSearch(tip);
              }}
              className="text-sm px-3 py-1 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            >
              {tip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;