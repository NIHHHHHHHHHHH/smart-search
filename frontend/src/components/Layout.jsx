import React from 'react';
import { Search, Upload, FileSearch } from 'lucide-react';

/**
 * Layout Component
 * This component provides the primary page structure used
 * across the application. It includes:
 *  - Header with branding and navigation
 *  - Main content slot (children)
 *  - Footer section
 *
 * Props:
 *  - children: JSX content for the active page (Search / Upload)
 *  - view: current active view ('search' or 'upload')
 *  - onViewChange: function to update the active view
 */
const Layout = ({ children, view, onViewChange }) => {
  return (
    // App background container with soft gradient
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">

      {/* Sticky header: stays visible while scrolling */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo + Title Section */}
            <div className="flex items-center space-x-3">
              {/* Gradient icon container */}
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileSearch className="w-6 h-6 text-white" />
              </div>

              {/* App Title */}
              <div>
                <h1 className="text-xl font-bold text-slate-900">Smart Search</h1>
                <p className="text-xs text-slate-500">Internal Knowledge Base</p>
              </div>
            </div>

            {/* Navigation Buttons: Search / Upload */}
            <nav className="flex space-x-6">
              {/* Search Tab Button */}
              <button
                onClick={() => onViewChange('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === 'search'
                    ? 'bg-blue-600 text-white shadow-md' // Active state
                    : 'text-slate-600 hover:bg-slate-100' // Inactive state
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </span>
              </button>

              {/* Upload Tab Button */}
              <button
                onClick={() => onViewChange('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === 'upload'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main page content (dynamic pages injected as children) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              © 2024 Smart Search Tool
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
