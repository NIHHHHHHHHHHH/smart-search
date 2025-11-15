import React, { useState } from 'react';
import Layout from './components/Layout';

/**
 * App Component 
 * This component manages the global state for the active view
 * (Search or Upload) and passes it down to the Layout component.
 *
 * Currently, this is the entry point of the UI. As the project grows,
 * the view state will control which page content is rendered.
 */
function App() {
  // Tracks which main page is active: 'search' or 'upload'
  const [view, setView] = useState('search');

  return (
    // Layout wraps all main content including header, footer, and navigation
    <Layout view={view} onViewChange={setView}>
      {/* Placeholder UI — actual Search/Upload components will be added later */}
      <div className="text-gray-500 text-center py-10">
        Select a view to continue.
      </div>
    </Layout>
  );
}

export default App;
