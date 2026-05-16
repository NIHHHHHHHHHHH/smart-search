import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 * 
 * UPDATED: Now supports optional search - empty query triggers browse mode
 */
const SearchBar = ({ onSearch, loading, hasQuery }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  /**
   * Handles form submission - search is now optional
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim()); // Empty query is valid now
  };

  /**
   * Clears search and returns to browse mode
   */
  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    onSearch(''); // Triggers browse mode
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search 
              className={`w-5 h-5 ${loading ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`}
            />
          </div>

          {/* Main search input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, campaigns, strategies... (or leave empty to browse all)"
            className="w-full pl-12 pr-24 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white shadow-sm"
            disabled={loading}
          />

          {/* Action buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
            {/* Clear button */}
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
            
            {/* Search/Browse button - now always enabled */}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all font-medium"
            >
              {query.trim() ? 'Search' : 'Browse All'}
            </button>
          </div>
        </div>
      </form>

    </div>
  );
};

export default SearchBar;