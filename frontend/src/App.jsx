import React, { useState } from 'react';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import FileUpload from './components/FileUpload';

/**
 * App Component
 *
 * Controls:
 *  - Active view: "search" or "upload"
 *  - Search query entered by the user
 *  - Real-time search results
 *  - Recently uploaded document (for UX feedback)
 *
 * Commit 8 Functionality:
 *  - Integrates SearchBar + SearchResults
 *  - Supports real-time search via SearchBar interactions
 */
function App() {
  /** Controls which main section is displayed */
  const [view, setView] = useState("search");

  /** Stores the user's current search query */
  const [searchQuery, setSearchQuery] = useState("");

  /** Holds the list of documents returned from backend search */
  const [searchResults, setSearchResults] = useState([]);

  /** Stores latest uploaded document for display purposes */
  const [lastUploaded, setLastUploaded] = useState(null);

  /**
   * handleSearch
   *
   * Called when SearchBar sends new input.
   * - Updates query
   * - Calls backend via SearchBar (SearchBar handles API)
   * - Updates search results inside SearchResults
   */
  const handleSearch = (query, results) => {
    setSearchQuery(query);
    setSearchResults(results || []);
  };

  /**
   * handleUploadSuccess
   *
   * After upload:
   * - Save uploaded file metadata
   * - Redirect user to search interface
   */
  const handleUploadSuccess = (uploadedFile) => {
    setLastUploaded(uploadedFile);
    setView("search");
  };

  return (
    <Layout view={view} onViewChange={setView}>
      {view === "search" ? (
        <div className="space-y-6">
          {/* Search input component with real-time search */}
          <SearchBar onSearch={handleSearch} />

          {/* Display live search results */}
          <SearchResults
            query={searchQuery}
            results={searchResults}
          />

          {/* Optional message about last uploaded file */}
          {lastUploaded && !searchQuery && (
            <p className="text-green-600 font-medium text-center mt-4">
              ✅ Last uploaded:{" "}
              <span className="text-slate-900">{lastUploaded.title}</span>
            </p>
          )}
        </div>
      ) : (
        /* File upload screen */
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      )}
    </Layout>
  );
}

export default App;
