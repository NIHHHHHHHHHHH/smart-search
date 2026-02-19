import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/Auth/AuthPage';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import FileUpload from './components/FileUpload';
import SearchResults from './components/SearchResults';
import Filters from './components/Filters';
import FilePreview from './components/FilePreview';
import { searchDocuments, getFilters } from './services/api';

/**
 * Main App Component - Wrapped with Auth
 */
function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // ✅ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY RETURNS
  const [view, setView] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    team: '',
    project: '',
    fileType: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    teams: [],
    projects: [],
    fileTypes: []
  });
  const [lastUploaded, setLastUploaded] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  /**
   * Load all documents on mount (Browse mode)
   * ✅ useEffect MUST be before any conditional returns
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadFilters();
      loadAllDocuments();
    }
  }, [isAuthenticated]);

  /**
   * Load all documents (Browse mode)
   */
  const loadAllDocuments = async () => {
    setLoading(true);
    try {
      const results = await searchDocuments('', {});
      setSearchResults(results);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to load documents:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load filter options
   */
  const loadFilters = async () => {
    try {
      const data = await getFilters();
      setAvailableFilters(data);
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  /**
   * Search with support for empty queries (Browse mode)
   */
  const handleSearch = async (query) => {
    setLoading(true);
    setSearchQuery(query);

    try {
      const results = await searchDocuments(query, filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filters and refresh results
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    handleSearch(searchQuery);
  };

  /**
   * Open document preview
   */
  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
    setShowPreview(true);
  };

  /**
   * After upload, reload all documents
   */
  const handleUploadSuccess = (uploadedFile) => {
    setLastUploaded(uploadedFile);
    loadFilters();
    setView('search');
    loadAllDocuments();
  };

  // ✅ NOW conditional returns are AFTER all hooks
  
  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Main app render
  return (
    <Layout view={view} onViewChange={setView}>
      {view === 'search' ? (
        <div className="space-y-6">

          {/* Search bar */}
          <SearchBar 
            onSearch={handleSearch}
            loading={loading}
            hasQuery={!!searchQuery}
          />

          {/* Filters */}
          {(searchQuery || Object.values(filters).some(value => value)) && (
            <Filters
              filters={filters}
              availableFilters={availableFilters}
              onFilterChange={handleFilterChange}
            />
          )}

          {/* Search/Browse results */}
          <SearchResults
            results={searchResults}
            loading={loading}
            query={searchQuery}
            onDocumentClick={handleDocumentClick}
          />

          {/* Success message after upload */}
          {lastUploaded && !searchQuery && (
            <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
              ✅ Successfully uploaded: <strong>{lastUploaded.title}</strong>
            </div>
          )}
        </div>
      ) : (
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      )}

      {/* File preview modal */}
      {showPreview && selectedDocument && (
        <FilePreview
          document={selectedDocument}
          onClose={() => setShowPreview(false)}
        />
      )}
    </Layout>
  );
}

/**
 * App Wrapper with Auth Provider
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;