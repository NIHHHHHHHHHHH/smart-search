import React, { useState, useRef } from 'react';
import { Upload, CloudUpload, Check, X, AlertCircle, Zap, Tag, Shield, FileText, Bot, Tags } from 'lucide-react';

/**
 * FileUpload Component
 * Handles:
 *  - Drag & drop document upload
 *  - File validation (format + size)
 *  - Upload progress tracking
 *  - Upload success + error UI states
 *  - Triggering parent callback on successful upload
 *
 * Supported formats: PDF, DOCX, DOC, TXT, MD
 * Max size: 10MB
 */
const FileUpload = ({ onUploadSuccess }) => {
  // UI state for drag area highlighting
  const [dragActive, setDragActive] = useState(false);

  // Upload lifecycle state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Result and error states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  // Ref for hidden file input element
  const fileInputRef = useRef(null);

  // Allowed file types and size (10MB)
  const supportedFormats = ['.pdf', '.docx', '.doc', '.txt', '.md'];
  const maxSize = 10 * 1024 * 1024;

  /**
   * Handles drag events to toggle dragActive UI state
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  /**
   * Validates file extension and file size
   */
  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!supportedFormats.includes(ext)) {
      throw new Error(`Unsupported file type. Allowed: ${supportedFormats.join(', ')}`);
    }

    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    return true;
  };

  /**
   * Handles file drop event (from drag & drop)
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  /**
   * Handles file selection via file picker
   */
  const handleChange = (e) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  /**
   * Core file handler:
   *  - Validates file
   *  - Simulates upload with progress
   *  - Tracks progress and displays UI states
   *  - Notifies parent component on success
   */
  const handleFile = async (file) => {
    setError(null);
    setUploadedFile(null);
    setUploadProgress(0);

    try {
      validateFile(file);
      setUploading(true);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API response after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = {
        title: file.name,
        category: 'Marketing',
        team: 'Product Marketing',
        tags: ['Q4 2024', 'Campaign', 'Launch'],
        summary: 'Marketing document successfully processed and categorized.'
      };

      setUploadedFile(result);

      // Small delay for better UX before returning to search view
      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }
      }, 2000);

    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Opens hidden file input programmatically
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Resets upload UI and states for new upload
   */
  const handleReset = () => {
    setUploadedFile(null);
    setError(null);
    setUploadProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Upload Document</h2>
        <p className="text-slate-600">
          Upload marketing documents to automatically index and categorize them
        </p>
      </div>

      {/* Drag & Drop Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-white hover:border-slate-400'
        } ${uploading ? 'pointer-events-none opacity-75' : ''}`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        {/* Initial State (no file uploaded) */}
        {!uploading && !uploadedFile && (
          <div className="text-center">
            <div className="mb-6 inline-block">
              <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <CloudUpload className="w-10 h-10 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Drop your file here or click to browse
            </h3>
            <p className="text-slate-500 mb-6">
              Supported formats: PDF, DOCX, DOC, TXT, MD (Max 10MB)
            </p>

            <button
              onClick={handleButtonClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Choose File
            </button>
          </div>
        )}

        {/* Uploading State */}
        {uploading && (
          <div className="text-center">
            <div className="mb-6 inline-block">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="animate-pulse">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-4">Processing Document...</h3>

            {/* Upload Progress Bar */}
            <div className="max-w-md mx-auto mb-4">
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 mt-2">{uploadProgress}% uploaded</p>
            </div>

            {/* Processing messages */}
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Extracting text...
              </p>
              <p className="flex items-center justify-center gap-2">
                <Bot className="w-4 h-4" />
                Analyzing with AI...
              </p>
              <p className="flex items-center justify-center gap-2">
                <Tags className="w-4 h-4" />
                Categorizing document...
              </p>
            </div>
          </div>
        )}

        {/* Upload Success State */}
        {uploadedFile && !uploading && (
          <div className="text-center">
            <div className="mb-6 inline-block">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-green-600 mb-2">Upload Successful!</h3>

            {/* Uploaded file details */}
            <div className="max-w-2xl mx-auto bg-slate-50 rounded-xl p-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">File:</span>
                <span className="text-slate-900">{uploadedFile.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Category:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {uploadedFile.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Team:</span>
                <span className="text-slate-900">{uploadedFile.team}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Tags:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {uploadedFile.tags?.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary from backend (if AI extracted one) */}
              {uploadedFile.summary && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-sm text-slate-600">{uploadedFile.summary}</p>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all"
            >
              Upload Another File
            </button>
          </div>
        )}
      </div>

      {/* Error Box */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900">Upload Failed</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>

            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Feature Highlights Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Instant Processing</h4>
          <p className="text-sm text-slate-600">AI analyzes and categorizes documents in seconds</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Tag className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Smart Tagging</h4>
          <p className="text-sm text-slate-600">Automatic categorization by topic, team, and project</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Secure Storage</h4>
          <p className="text-sm text-slate-600">Your documents are safely stored and indexed</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;