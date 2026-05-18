import React, { useState, useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { Button } from '../ui';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    onSearch('');
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={28} className="text-accent" />
         <h2 className="text-4xl font-extrabold tracking-tight mb-2  text-text-primary">AI Powered <span className="ss-shimmer">Search</span></h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative group">
          {/* focus glow - intentionally outside the input container so blur spreads beyond the border */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none bg-accent-subtle blur-[20px]" />
          <div className="relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-border focus-within:border-accent bg-bg-elevated shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200">

            <Search  size={20}  className={`shrink-0 transition-colors duration-150 ${loading ? 'text-accent animate-pulse' : 'text-text-secondary'}`}/>

            <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents, campaigns, strategies… or leave empty to browse all"
              className="flex-1 bg-transparent text-sm outline-none min-w-0 text-text-primary placeholder:text-text-tertiary disabled:opacity-50"
              disabled={loading}
            />

            <div className="flex items-center gap-2 shrink-0">
              {query && (
                <button  type="button" onClick={handleClear} disabled={loading} className="p-1 rounded-lg transition-all cursor-pointer text-text-secondary hover:text-text-primary">
                  <X size={20} />
                </button>
              )}
              <Button  type="submit" variant="primary" size="md" loading={loading} disabled={loading} className="cursor-pointer">
                {query.trim() ? 'Search' : 'Browse All'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;