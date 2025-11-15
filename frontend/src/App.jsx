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











// import React, { useState, useEffect } from 'react';
// import Layout from './components/Layout';
// import SearchBar from './components/SearchBar';
// import FileUpload from './components/FileUpload';
// import SearchResults from './components/SearchResults';
// import Filters from './components/Filters';
// import FilePreview from './components/FilePreview';
// import { searchDocuments, getFilters } from './services/api';

// /**
//  * App Component
//  *
//  * Responsibilities:
//  *  - Manages current view: "search" or "upload"
//  *  - Executes search queries and displays results
//  *  - Loads and applies filters (category, team, project, fileType)
//  *  - Handles document preview modal
//  *  - Tracks last uploaded document for user feedback
//  *
//  * This file now includes all components for:
//  *  - Commit 8: SearchBar + SearchResults
//  *  - Commit 9: Filters + FilePreview + UI Enhancements
//  */
// function App() {
//   /** Controls which screen is displayed */
//   const [view, setView] = useState('search');

//   /** Search query entered by the user */
//   const [searchQuery, setSearchQuery] = useState('');

//   /** List of documents returned from backend search */
//   const [searchResults, setSearchResults] = useState([]);

//   /** Indicates whether search API is loading */
//   const [loading, setLoading] = useState(false);

//   /** Currently selected filter values */
//   const [filters, setFilters] = useState({
//     category: '',
//     team: '',
//     project: '',
//     fileType: ''
//   });

//   /** Populates dropdown lists for filters */
//   const [availableFilters, setAvailableFilters] = useState({
//     categories: [],
//     teams: [],
//     projects: [],
//     fileTypes: []
//   });

//   /** Stores last uploaded document metadata */
//   const [lastUploaded, setLastUploaded] = useState(null);

//   /** Stores currently selected document for preview modal */
//   const [selectedDocument, setSelectedDocument] = useState(null);

//   /** Controls visibility of the file preview modal */
//   const [showPreview, setShowPreview] = useState(false);

//   /**
//    * Load available filter values on initial render
//    */
//   useEffect(() => {
//     loadFilters();
//   }, []);

//   /**
//    * Loads all filter lists from backend
//    */
//   const loadFilters = async () => {
//     try {
//       const data = await getFilters();
//       setAvailableFilters(data);
//     } catch (error) {
//       console.error('Failed to load filters:', error);
//     }
//   };

//   /**
//    * Executes live search whenever user types
//    */
//   const handleSearch = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       setSearchQuery('');
//       return;
//     }

//     setLoading(true);
//     setSearchQuery(query);

//     try {
//       const results = await searchDocuments(query, filters);
//       setSearchResults(results);
//     } catch (error) {
//       console.error('Search failed:', error);
//       setSearchResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Applies new filter values and refreshes search results
//    */
//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);

//     // Re-run search if input exists
//     if (searchQuery.trim()) {
//       handleSearch(searchQuery);
//     }
//   };

//   /**
//    * Opens preview modal when a document card is clicked
//    */
//   const handleDocumentClick = (doc) => {
//     setSelectedDocument(doc);
//     setShowPreview(true);
//   };

//   /**
//    * Handles file upload completion:
//    * - Updates last uploaded file info
//    * - Refreshes filter lists
//    * - Redirects user back to search
//    */
//   const handleUploadSuccess = (uploadedFile) => {
//     setLastUploaded(uploadedFile);
//     loadFilters();
//     setView('search');
//   };

//   return (
//     <Layout view={view} onViewChange={setView}>
//       {view === 'search' ? (
//         <div className="space-y-6">

//           {/* Search bar with real-time suggestion handling */}
//           <SearchBar 
//             onSearch={handleSearch}
//             loading={loading}
//           />

//           {/* Filters appear only when search or filters are active */}
//           {(searchQuery || Object.values(filters).some(value => value)) && (
//             <Filters
//               filters={filters}
//               availableFilters={availableFilters}
//               onFilterChange={handleFilterChange}
//             />
//           )}

//           {/* Document search results */}
//           <SearchResults
//             results={searchResults}
//             loading={loading}
//             query={searchQuery}
//             onDocumentClick={handleDocumentClick}
//           />

//           {/* Optional info about last uploaded file */}
//           {lastUploaded && !searchQuery && (
//             <p className="text-green-600 font-medium text-center mt-4">
//               ✅ Last uploaded:{" "}
//               <span className="text-slate-900">{lastUploaded.title}</span>
//             </p>
//           )}
//         </div>
//       ) : (
//         /* File upload screen */
//         <FileUpload onUploadSuccess={handleUploadSuccess} />
//       )}

//       {/* File preview modal */}
//       {showPreview && selectedDocument && (
//         <FilePreview
//           document={selectedDocument}
//           onClose={() => setShowPreview(false)}
//         />
//       )}
//     </Layout>
//   );
// }

// export default App;
