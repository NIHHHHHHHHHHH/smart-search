import React from 'react';
import { X, FileText, Users, Clipboard, Calendar, Tag, Download } from 'lucide-react';

/**
 * FilePreview Component with Universal Download
 */
const FilePreview = ({ document: doc, onClose }) => {
  if (!doc) return null;

  /**
   * Handle file download with proper extension
   */
  const handleDownload = async () => {
    try {
      // Fetch the file from Cloudinary
      const response = await fetch(doc.filePath);
      const blob = await response.blob();
      
      // Ensure filename has proper extension
      let filename = doc.title;
      if (!filename.includes('.') && doc.fileType) {
        filename = `${filename}.${doc.fileType}`;
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = filename;
      window.document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  /**
   * Returns category-specific colors
   */
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

  /**
   * Handle backdrop click to close modal
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {doc.title || 'Untitled Document'}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                {doc.category || 'Other'}
              </span>
              <span className="text-sm text-slate-500">
                {doc.fileType?.toUpperCase() || 'FILE'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team */}
            {doc.team && (
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Team</p>
                  <p className="text-slate-900 font-medium">{doc.team}</p>
                </div>
              </div>
            )}

            {/* Project */}
            {doc.project && (
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Clipboard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Project</p>
                  <p className="text-slate-900 font-medium">{doc.project}</p>
                </div>
              </div>
            )}

            {/* Upload Date */}
            {doc.uploadedAt && (
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Uploaded</p>
                  <p className="text-slate-900 font-medium">
                    {formatDate(doc.uploadedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* File Type */}
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">File Type</p>
                <p className="text-slate-900 font-medium">
                  {doc.fileType?.toUpperCase() || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          {doc.summary && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Summary</h3>
              <p className="text-slate-600 leading-relaxed">{doc.summary}</p>
            </div>
          )}

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-700">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {doc.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Points */}
          {doc.keyPoints && doc.keyPoints.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Key Points</h3>
              <ul className="space-y-2">
                {doc.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-slate-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Download Button - Fixed for All File Types */}
          {doc.filePath && (
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;