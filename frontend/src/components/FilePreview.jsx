import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { getDocumentById } from '../services/api';

/**
 * FilePreview Component
 * 
 * A modal component that displays detailed information about a document including
 * metadata, tags, summary, and content preview. Fetches full document data on mount.
 */
const FilePreview = ({ document, onClose }) => {
  // State for storing the complete document data
  const [fullDocument, setFullDocument] = useState(null);
  
  // Loading state while fetching document details
  const [loading, setLoading] = useState(true);
  
  // Error state for handling API failures
  const [error, setError] = useState(null);

  /**
   * Effect hook to load full document data when component mounts
   * or when document ID changes
   */
  useEffect(() => {
    loadFullDocument();
  }, [document._id]);

  /**
   * Fetches complete document data from the API
   * Handles loading states and error scenarios
   */
  const loadFullDocument = async () => {
    try {
      setLoading(true);
      const data = await getDocumentById(document._id);
      setFullDocument(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Returns appropriate Tailwind color classes based on document category
   * Includes background, text, and border colors for consistent theming
   */
  const getCategoryColor = (category) => {
    const colors = {
      Strategy: 'bg-blue-100 text-blue-700 border-blue-200',
      Campaign: 'bg-purple-100 text-purple-700 border-purple-200',
      Research: 'bg-green-100 text-green-700 border-green-200',
      Creative: 'bg-pink-100 text-pink-700 border-pink-200',
      Analytics: 'bg-orange-100 text-orange-700 border-orange-200',
      Other: 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return colors[category] || colors.Other;
  };

  /**
   * Converts bytes to human-readable file size format
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    // Modal overlay with centered content
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header section with document title and close button */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-slate-900 truncate">
              {document.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {new Date(document.uploadedAt).toLocaleString()}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="ml-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main content area with scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading state with skeleton placeholders */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse space-y-4 w-full">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : error ? (
            // Error state display
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600">{error}</p>
            </div>
          ) : fullDocument ? (
            // Document details display
            <div className="space-y-6">
              
              {/* Metadata grid showing document properties */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                {/* Category badge */}
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Category</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(fullDocument.category)}`}>
                    {fullDocument.category}
                  </span>
                </div>
                
                {/* Team information */}
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Team</p>
                  <p className="text-slate-900 font-medium">{fullDocument.team}</p>
                </div>
                
                {/* Project information */}
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Project</p>
                  <p className="text-slate-900 font-medium">{fullDocument.project}</p>
                </div>
                
                {/* File type */}
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">File Type</p>
                  <p className="text-slate-900 font-medium uppercase">{fullDocument.fileType}</p>
                </div>
                
                {/* File size (formatted) */}
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">File Size</p>
                  <p className="text-slate-900 font-medium">{formatFileSize(fullDocument.fileSize)}</p>
                </div>
                
                {/* View count */}
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Views</p>
                  <p className="text-slate-900 font-medium">{fullDocument.accessCount || 0}</p>
                </div>
              </div>

              {/* Tags section (if available) */}
              {fullDocument.tags && fullDocument.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {fullDocument.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Document summary section (if available) */}
              {fullDocument.summary && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Summary</h3>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-slate-700 leading-relaxed">{fullDocument.summary}</p>
                  </div>
                </div>
              )}

              {/* Content preview section (if available) */}
              {/* Shows first 5000 characters of extracted text */}
              {fullDocument.extractedText && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Content Preview</h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-96 overflow-y-auto">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {fullDocument.extractedText.substring(0, 5000)}
                      {fullDocument.extractedText.length > 5000 && '...'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer with uploader info and action buttons */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-500">
            Uploaded by {fullDocument?.uploadedBy || 'System'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-all font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;