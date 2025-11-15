import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import FileUpload from './components/FileUpload';
import SearchResults from './components/SearchResults';
import Filters from './components/Filters';
import FilePreview from './components/FilePreview';
import { searchDocuments, getFilters } from './services/api';

/**
 * App Component
 *
 * UPDATED: Now loads all documents on mount (Browse mode by default)
 */
function App() {
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
   * NEW: Load all documents on mount (Browse mode)
   */
  useEffect(() => {
    loadFilters();
    loadAllDocuments(); // Auto-load documents on startup
  }, []);

  /**
   * NEW: Load all documents (Browse mode)
   */
  const loadAllDocuments = async () => {
    setLoading(true);
    try {
      // Empty query triggers browse mode in backend
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
   * UPDATED: Search now supports empty queries (Browse mode)
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
    
    // Refresh with current query (empty = browse mode)
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
   * UPDATED: After upload, reload all documents to show the new one
   */
  const handleUploadSuccess = (uploadedFile) => {
    setLastUploaded(uploadedFile);
    loadFilters();
    setView('search');
    loadAllDocuments(); // Reload to show newly uploaded document
  };

  return (
    <Layout view={view} onViewChange={setView}>
      {view === 'search' ? (
        <div className="space-y-6">

          {/* Search bar - now supports browse mode */}
          <SearchBar 
            onSearch={handleSearch}
            loading={loading}
            hasQuery={!!searchQuery}
          />

          {/* Filters - show when query exists or filters are active */}
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

export default App;