import React from 'react';
import { Search, Frown, FileText, Users, Clipboard, Clock, Star, File, FolderOpen } from 'lucide-react';

/**
 * SearchResults Component
 * 
 * UPDATED: Now supports browse mode when query is empty
 */
const SearchResults = ({ results = [], loading, query, onDocumentClick }) => {
  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  /**
   * No Results State - for both search and browse
   */
  if (results.length === 0) {
    if (!query) {
      // No documents exist at all
      return (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Documents Yet</h3>
          <p className="text-slate-600">Upload your first document to get started</p>
        </div>
      );
    } else {
      // Search returned no results
      return (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Frown className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Results Found</h3>
          <p className="text-slate-600">Try adjusting your search terms or filters</p>
        </div>
      );
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      Strategy: 'bg-blue-100 text-blue-700',
      Campaign: 'bg-purple-100 text-purple-700',
      Research: 'bg-green-100 text-green-700',
      Creative: 'bg-pink-100 text-pink-700',
      Analytics: 'bg-orange-100 text-orange-700',
      Other: 'bg-slate-100 text-slate-700'
    };
    return colors[category] || colors.Other;
  };

  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-8 h-8 text-blue-500" />;
      default:
        return <File className="w-8 h-8 text-slate-500" />;
    }
  };

  /**
   * Results Display - works for both search and browse mode
   */
  return (
    <div>
      {/* Results header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">
          {query ? (
            <>Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</>
          ) : (
            <>Showing all {results.length} document{results.length !== 1 ? 's' : ''}</>
          )}
        </h2>
      </div>

      {/* Document cards list */}
      <div className="space-y-4">
        {results.map((doc) => (
          <div
            key={doc._id}
            onClick={() => onDocumentClick(doc)}
            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group animate-fade-in"
          >
            <div className="flex items-start space-x-4">
              {/* File type icon */}
              <div className="shrink-0 p-3 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                {getFileIcon(doc.fileType)}
              </div>

              {/* Document details */}
              <div className="flex-1 min-w-0">
                {/* Title and category */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {doc.title}
                  </h3>
                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium shrink-0 ${getCategoryColor(doc.category)}`}>
                    {doc.category}
                  </span>
                </div>

                {/* Summary */}
                {doc.summary && (
                  <p className="text-slate-600 mb-3 line-clamp-2">
                    {doc.summary}
                  </p>
                )}

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{doc.team}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clipboard className="w-4 h-4" />
                    <span>{doc.project}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>

                  {/* Only show relevance score in search mode */}
                  {query && doc.relevanceScore && (
                    <div className="ml-auto flex items-center space-x-1 text-blue-600 font-medium">
                      <Star className="w-4 h-4" fill="currentColor" />
                      <span>{doc.relevanceScore}% match</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {doc.tags.slice(0, 5).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;