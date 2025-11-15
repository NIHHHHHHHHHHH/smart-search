import React, { useState } from 'react';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';

/**
 * App Component 
 * Manages:
 *  - Active view: "search" or "upload"
 *  - Tracking the most recently uploaded file
 *
 * Renders:
 *  - Search placeholder screen (until search page is implemented)
 *  - FileUpload component when user switches to upload view
 *
 * Acts as the controller between navigation and content rendering.
 */
function App() {
  // Controls which main section is displayed
  const [view, setView] = useState("search");

  // Stores the most recently uploaded file returned by backend
  const [lastUploaded, setLastUploaded] = useState(null);

  /**
   * handleUploadSuccess

   * Called after a file is successfully uploaded.
   * - Stores the uploaded file metadata
   * - Redirects user back to the search view
   */
  const handleUploadSuccess = (uploadedFile) => {
    setLastUploaded(uploadedFile);
    setView("search");
  };

  return (
    <Layout view={view} onViewChange={setView}>
      {/* Conditionally render search interface or upload interface */}
      {view === "search" ? (
        <div className="text-center py-20 text-slate-500">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Smart Search</h2>
          <p className="text-slate-600">
            The search interface will appear here .
          </p>

          {/* Show the name of the last uploaded file for user feedback */}
          {lastUploaded && (
            <p className="mt-6 text-green-600 font-medium">
              ✅ Last uploaded: <span className="text-slate-900">{lastUploaded.title}</span>
            </p>
          )}
        </div>
      ) : (
        // Upload screen
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      )}
    </Layout>
  );
}

export default App;
