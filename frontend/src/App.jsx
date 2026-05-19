import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';
import AuthPage from './components/Auth/AuthPage';
import Layout from './components/layout/Layout';
import SearchBar from './components/search/SearchBar';
import FileUpload  from './components/files/FileUpload';
import SearchResults from './components/search/SearchResults';
import Filters from './components/search/Filters';
import FilePreview from './components/files/FilePreview';

import { searchDocuments, getFilters } from './services/api';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-bg-raised border-t-accent animate-[spin_0.8s_linear_infinite]" />
      <p className="text-sm text-text-tertiary">Loading…</p>
    </div>
  </div>
);

const UploadToast = ({ file }) => (
  <div className="fixed bottom-7 right-7 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-xl backdrop-blur-sm animate-[fadeUp_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80]" />
    <p className="text-sm text-emerald-400">
      Uploaded <span className="font-semibold">{file.title}</span>
    </p>
  </div>
);

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [appView, setAppView] = useState('landing'); 
  const [authInitial, setAuthInitial] = useState(true);   

  const goToAuth = (isLogin) => {
    setAuthInitial(isLogin);
    setAppView('auth');
  };

  const goToLanding = () => setAppView('landing');

  
  const [view, setView] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ category: '', team: '', project: '', fileType: '' });
  const [availableFilters, setAvailableFilters] = useState({ categories: [], teams: [], projects: [], fileTypes: [] });
  const [lastUploaded, setLastUploaded] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadFilters();
      loadAllDocuments();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!lastUploaded) return;
    const t = setTimeout(() => setLastUploaded(null), 4000);
    return () => clearTimeout(t);
  }, [lastUploaded]);

  const loadAllDocuments = async () => {
    setLoading(true);
    try {
      const results = await searchDocuments('', {});
      setSearchResults(results);
      setSearchQuery('');
    } catch (err) {
      console.error('Failed to load documents:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const data = await getFilters();
      setAvailableFilters(data);
    } catch (err) {
      console.error('Failed to load filters:', err);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setSearchQuery(query);
    try {
      const results = await searchDocuments(query, filters);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // re-run search so filter change takes effect immediately
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    handleSearch(searchQuery);
  };

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
    setShowPreview(true);
  };

  const handleUploadSuccess = (uploadedFile) => {
    setLastUploaded(uploadedFile);
    loadFilters();
    setView('search');
    loadAllDocuments();
  };

  if (authLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    if (appView === 'auth')
      return <AuthPage initialLogin={authInitial} onBack={goToLanding} />;
    return <LandingPage onSignIn={() => goToAuth(true)} onGetStarted={() => goToAuth(false)} />;
  }

  return (
    <Layout view={view} onViewChange={setView}>
      {view === 'search' ? (
        <div className="flex flex-col gap-5">
          <SearchBar onSearch={handleSearch} loading={loading} />
          {(searchQuery || Object.values(filters).some(v => v)) && (
            <Filters filters={filters} availableFilters={availableFilters} onFilterChange={handleFilterChange}/>
          )}
          <SearchResults results={searchResults} loading={loading} query={searchQuery} onDocumentClick={handleDocumentClick}/>
        </div>
      ) : (
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      )}

      {showPreview && selectedDocument && (
        <FilePreview document={selectedDocument} onClose={() => setShowPreview(false)} />
      )}

      {lastUploaded && <UploadToast file={lastUploaded} />}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;


