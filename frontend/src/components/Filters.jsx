import React from 'react';
import { Filter, X } from "lucide-react";

/**
 * Filters Component
 * Displays a filter panel allowing users to refine search results by:
 *  - Category
 *  - Team
 *  - Project
 *  - File Type
 *
 * Props:
 *  - filters: Current filter values (category, team, project, fileType)
 *  - availableFilters: Lists of available filter options from backend
 *  - onFilterChange: Callback invoked whenever filters are updated

 *  - Updates filters when a user selects a new value
 *  - Provides a "Clear all" action when any filter is active
 *  - Uses Lucide icons for visual clarity
 */
const Filters = ({ filters, availableFilters, onFilterChange }) => {

  /**
   * handleFilterChange
   * Updates a specific filter key (e.g., category, team) and
   * triggers the parent callback with the updated filters object.
   */
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  /**
   * handleClearFilters
   * Resets all filter values back to empty.
   * Useful when the user wants to see unfiltered search results.
   */
  const handleClearFilters = () => {
    onFilterChange({
      category: '',
      team: '',
      project: '',
      fileType: ''
    });
  };

  // Checks if any filter has a value — used to show/hide "Clear all"
  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

      {/* Header section with Filters title and Clear button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </h3>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Grid container for all dropdown filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
          >
            <option value="">All Categories</option>
            {availableFilters.categories?.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Team
          </label>
          <select
            value={filters.team}
            onChange={(e) => handleFilterChange('team', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
          >
            <option value="">All Teams</option>
            {availableFilters.teams?.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        {/* Project Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Project
          </label>
          <select
            value={filters.project}
            onChange={(e) => handleFilterChange('project', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
          >
            <option value="">All Projects</option>
            {availableFilters.projects?.map((proj) => (
              <option key={proj} value={proj}>{proj}</option>
            ))}
          </select>
        </div>

        {/* File Type Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            File Type
          </label>
          <select
            value={filters.fileType}
            onChange={(e) => handleFilterChange('fileType', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
          >
            <option value="">All Types</option>
            {availableFilters.fileTypes?.map((type) => (
              <option key={type} value={type}>{type.toUpperCase()}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};

export default Filters;
