import React, { useState, useRef } from 'react';
import { Upload, CloudUpload, Check, Zap, Tag as TagIcon, Shield, FileText, Bot, Tags } from 'lucide-react';
import { uploadFile } from '../../services/api';
import {Button, ErrorBanner, CategoryChip, Tag} from '../ui';


const featureCards = [
  { Icon: Zap, title: 'Instant Processing', desc: 'AI analyzes and categorizes your document in under 15 seconds.', iconClass: 'text-accent' },
  { Icon: TagIcon, title: 'Smart Tagging', desc: 'Automatic categorization by topic, team, and project.', iconClass: 'text-purple' },
  { Icon: Shield, title: 'Secure Storage', desc: 'Files stored on Cloudinary CDN with encrypted transit.', iconClass: 'text-chip-green' },
];

const processingSteps = [
  { Icon: FileText, label: 'Extracting text content' },
  { Icon: Bot, label: 'Analyzing with Gemini AI' },
  { Icon: Tags, label: 'Categorizing & tagging' },
];

const FileUpload = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const supportedFormats = ['.pdf', '.docx', '.doc', '.txt', '.md'];
  const maxSize = 10 * 1024 * 1024;

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!supportedFormats.includes(ext))
      throw new Error(`Unsupported file type. Allowed: ${supportedFormats.join(', ')}`);
    if (file.size > maxSize) throw new Error('File size exceeds 10MB limit');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = async (file) => {
    setError(''); setUploadedFile(null); setUploadProgress(0);
    try {
      validateFile(file);
      setUploading(true);
      const result = await uploadFile(file, (p) => setUploadProgress(p));
      setUploadedFile(result);
      setTimeout(() => { if (onUploadSuccess) onUploadSuccess(result); }, 2000);
    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null); setError(''); setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-text-primary">Upload <span className="ss-shimmer">Document</span></h2>
        <p className="text-base text-text-secondary">Drop any file, AI handles categorization, tagging, and summaries automatically. </p>
      </div>
      <ErrorBanner message={error} />
      <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 overflow-hidden
          ${uploading ? 'pointer-events-none opacity-75' : ''}
          ${dragActive
            ? 'bg-accent-subtle border-accent shadow-[0_0_60px_var(--color-accent-subtle)]'
            : 'bg-bg-elevated border-border'
          }`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-[linear-gradient(var(--color-text-primary)_1px,transparent_1px),linear-gradient(90deg,var(--color-text-primary)_1px,transparent_1px)] bg-size-[60px_60px]" />

        {dragActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none bg-accent-dim blur-[80px]" />
        )}

        <input ref={fileInputRef} type="file" accept={supportedFormats.join(',')} onChange={handleChange} className="hidden" disabled={uploading}/>

        {!uploading && !uploadedFile && (
          <div className="relative text-center">
            <div className="mb-6 inline-flex">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200
                ${dragActive
                  ? 'bg-accent border-0 shadow-[0_0_40px_var(--color-accent-glow)]'
                  : 'bg-bg-raised border border-border'
                }`}
              >
                <CloudUpload size={36} className={dragActive ? 'text-bg' : 'text-text-tertiary'} />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2  text-text-primary">{dragActive ? 'Release to upload' : 'Drop your file here or click to browse'}</h3>
            <p className="text-sm mb-6 text-text-secondary">PDF · DOCX · DOC · TXT · MD &nbsp;·&nbsp; Max 10MB</p>
            <Button variant="primary" size="md" onClick={() => fileInputRef.current?.click()} className="cursor-pointer">Choose File</Button>
          </div>
        )}
        {uploading && (
          <div className="relative text-center">
            <div className="mb-6 inline-flex">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-accent-dim border border-accent-glow">
                <Upload size={32} className="text-accent animate:[ssfloat_1.2s_ease-in-out_infinite]" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-5  text-text-primary">Processing Document…</h3>
            <div className="max-w-sm mx-auto mb-6">
              <div className="w-full rounded-full h-1 overflow-hidden bg-bg-overlay">
                <div className="h-full rounded-full transition-all duration-300 bg-accent" style={{ width: `${uploadProgress}%` }}/>
              </div>
              <p className="text-sm mt-2 text-text-secondary">{uploadProgress}% uploaded</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {processingSteps.map(({ Icon, label }, i) => (
                <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm bg-bg-raised text-text-secondary">
                  <Icon size={12} className="text-text-secondary" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedFile && !uploading && (
          <div className="relative text-center">
            <div className="mb-6 inline-flex">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-success-bg border border-[rgba(74,222,128,0.25)]">
                <Check size={36} className="text-success" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-5  text-success"> Upload Successful!</h3>

            <div className="max-w-md mx-auto rounded-xl p-5 text-left space-y-3 mb-6 border border-border bg-bg-raised">
              {[
                { label: 'File', value: uploadedFile.title },
                { label: 'Team', value: uploadedFile.team },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
                  <span className="text-sm font-medium text-text-primary">{value}</span>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Category</span>
                <CategoryChip category={uploadedFile.category} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-wider shrink-0 mt-1 text-text-secondary">Tags</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {uploadedFile.tags?.map((tag, idx) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                </div>
              </div>

              {uploadedFile.summary && (
                <div className="pt-3 border-t border-border">
                  <p className="text-sm leading-relaxed text-text-secondary">{uploadedFile.summary}</p>
                </div>
              )}
            </div>

            <Button variant="secondary" size="md" onClick={handleReset} className="cursor-pointer">Upload Another File</Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-10">
        {featureCards.map(({ Icon, title, desc, iconClass }, i) => (
          <div
            key={i}
            className="group flex flex-col gap-4 p-5 rounded-2xl border border-border bg-bg-elevated transition-all duration-200 hover:border-accent-glow hover:shadow-[0_0_24px_var(--color-accent-subtle)]"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-border bg-bg-raised transition-all duration-200 ${iconClass}`}>
              <Icon size={18} />
            </div>
            <div>
              <h4 className="text-base font-bold mb-1.5  text-text-primary">{title}</h4>
              <p className="text-sm leading-relaxed text-text-secondary">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;