import React from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

const filterFields = [
  { key: 'category', label: 'Category', placeholder: 'All Categories', optKey: 'categories' },
  { key: 'team', label: 'Team', placeholder: 'All Teams', optKey: 'teams' },
  { key: 'project', label: 'Project',  placeholder: 'All Projects', optKey: 'projects' },
  { key: 'fileType', label: 'File Type', placeholder: 'All Types', optKey: 'fileTypes', upper: true },
];

const Filters = ({ filters, availableFilters, onFilterChange }) => {
  const handleFilterChange = (key, value) => onFilterChange({ ...filters, [key]: value });
  const handleClearFilters = () =>
    onFilterChange({ category: '', team: '', project: '', fileType: '' });

  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  const activeCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="relative rounded-2xl p-5 overflow-hidden border border-border bg-bg-elevated">
      {hasActiveFilters && (
        <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)]" />
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-border bg-bg-raised text-text-secondary">
            <Filter size={13} />
          </div>
          <span className="text-base font-semibold text-text-primary">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-sm font-bold rounded-full border bg-accent-dim text-accent border-accent-glow">{activeCount} Active</span>
          )}
        </div>

        {hasActiveFilters && (
          <button onClick={handleClearFilters}  className="flex items-center gap-1.5 text-sm transition-colors cursor-pointer text-text-secondary hover:text-text-primary" >
            <X size={14} /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {filterFields.map(({ key, label, placeholder, optKey, upper }) => {
          const isActive = filters[key] !== '';
          return (
            <div key={key}>
              <label className="block text-sm font-semibold uppercase tracking-widest mb-1.5 text-text-secondary">{label}</label>
              <div className="relative">
                <select
                  value={filters[key]} onChange={(e) => handleFilterChange(key, e.target.value)}
                  className={`w-full px-3 py-2.5 text-sm rounded-xl outline-none appearance-none cursor-pointer transition-all duration-150 bg-bg-raised
                    ${isActive
                      ? 'border border-accent-glow text-accent'
                      : 'border border-border text-text-primary'
                    }`}
                >
                  <option value="" className="bg-bg-raised text-text-secondary">{placeholder}</option>
                  {availableFilters[optKey]?.map((opt) => (
                    <option key={opt} value={opt} className="bg-bg-raised text-text-primary">{upper ? opt.toUpperCase() : opt}</option>
                  ))}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                   <ChevronDown size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Filters;