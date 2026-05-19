import React from 'react';
import { X, FileText, Users, Clipboard, Calendar, Tag as TagIcon, Download } from 'lucide-react';
import {Button,  CategoryChip, Tag, FileTypeBadge } from '../ui';

const metaIconClass = {
  team: 'text-chip-blue',
  project: 'text-purple',
  uploadedAt: 'text-chip-green',
  fileType: 'text-accent',
};

const FilePreview = ({ document: doc, onClose }) => {
  if (!doc) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(doc.filePath);
      const blob = await response.blob();
      let filename = doc.title;
      if (!filename.includes('.') && doc.fileType) filename = `${filename}.${doc.fileType}`;
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = filename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const handleBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const metaItems = [
    doc.team && { key: 'team', Icon: Users, label: 'Team', value: doc.team },
    doc.project && { key: 'project', Icon: Clipboard, label: 'Project', value: doc.project },
    doc.uploadedAt && { key: 'uploadedAt', Icon: Calendar,  label: 'Uploaded', value: formatDate(doc.uploadedAt) },
    { key: 'fileType', Icon: FileText,  label: 'File Type', value: doc.fileType?.toUpperCase() || 'Unknown' },
  ].filter(Boolean);

  return (
    <div  className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-[rgba(0,0,0,0.70)] backdrop-blur-[6px]"  onClick={handleBackdropClick}>
      <div className="relative rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border bg-bg-elevated shadow-[0_32px_80px_rgba(0,0,0,0.8)] animate:[ssfadeUp_0.25s_cubic-bezier(0.16,1,0.3,1)_both]">
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-[linear-gradient(90deg,transparent,var(--color-accent),transparent)]" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full pointer-events-none bg-accent-subtle blur-[60px]" />

        <div className="sticky top-0 border-b border-border px-6 py-5 flex items-start justify-between z-10 rounded-t-2xl bg-[rgba(17,17,19,0.95)] backdrop-blur-md">
          <div className="flex-1 pr-4 min-w-0">
            <h2 className="text-xl font-bold tracking-tight mb-2 truncate  text-text-primary">{doc.title || 'Untitled Document'}</h2>
            <div className="flex items-center gap-2">
              <CategoryChip category={doc.category} />
             <FileTypeBadge fileType={doc.fileType} />
            </div>
          </div>
          <Button variant="ghost" size="md" onClick={onClose} className="cursor-pointer shrink-0 text-text-secondary"> <X size={15} /></Button>
        </div>

        <div className="relative p-6 space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metaItems.map(({ key, Icon, label, value }) => (
              <div key={key} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-bg-raised">
                <Icon size={15} className={`${metaIconClass[key]} shrink-0`} />
                <div className="min-w-0">
                  <p className="text-base font-semibold uppercase tracking-wider mb-0.5 text-text-secondary">{label}</p>
                  <p className="text-base font-medium truncate text-text-primary">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {doc.summary && (
            <div className="relative rounded-xl p-4 border border-border overflow-hidden bg-bg-raised">
              <div className="absolute top-0 left-0 w-0.5 h-full rounded-l-xl bg-accent" />
              <p className="text-base font-semibold uppercase tracking-wider mb-2 pl-3 text-text-tertiary">Summary</p>
              <p className="text-base leading-relaxed pl-3 text-text-secondary">{doc.summary}</p>
            </div>
          )}

          {doc.tags && doc.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TagIcon size={12} className="text-text-tertiary" />
                <p className="text-base font-semibold uppercase tracking-wider text-text-tertiary">Tags</p>
              </div>
              <div className="flex flex-wrap gap-2">{doc.tags.map((tag, idx) => <Tag key={idx}>{tag}</Tag>)}</div>
            </div>
          )}

          {doc.keyPoints && doc.keyPoints.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-text-tertiary">Key Points</p>
              <ul className="space-y-2">
                {doc.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg-raised">
                    <span className="text-xs font-bold mt-0.5 shrink-0 text-accent">•</span>
                    <span className="text-sm leading-relaxed text-text-secondary">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {doc.filePath && (
            <div className="pt-4 border-t border-border">
              <Button variant="primary" size="md" onClick={handleDownload} className="cursor-pointer">
                <Download size={14} />
                <span>Download Document</span>
              </Button>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-border px-6 py-4 flex justify-end rounded-b-2xl bg-[rgba(17,17,19,0.95)] backdrop-blur-md">
          <Button variant="secondary" size="md" onClick={onClose} className="cursor-pointer">Close</Button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;