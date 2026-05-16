import React from 'react';
import { Search, Upload, FileSearch } from 'lucide-react';
import UserMenu from './UserMenu';

/**
 * Layout Component
 * 
 * Main app shell with header, navigation, and content area
 * UPDATED: Now includes UserMenu in header
 */
const Layout = ({ children, view, onViewChange }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileSearch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Smart Search</h1>
                <p className="text-xs text-slate-500">AI-Powered Document Search</p>
              </div>
            </div>

            {/* Navigation + User Menu */}
            <div className="flex items-center space-x-4">
              {/* Navigation Tabs */}
              <nav className="flex space-x-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => onViewChange('search')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    view === 'search'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span className="font-medium">Search</span>
                </button>

                <button
                  onClick={() => onViewChange('upload')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    view === 'upload'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">Upload</span>
                </button>
              </nav>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-slate-500 text-sm">
        <p>&copy; 2024 Smart Search. Powered by AI.</p>
      </footer>
    </div>
  );
};

export default Layout;