import React from 'react';

const colors = {
  pdf: 'text-red-400',
  docx: 'text-blue-400',
  doc: 'text-blue-400',
  txt: 'text-white/40',
  md:  'text-purple-400',
};

const FileTypeBadge = ({ fileType }) => (
  <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-bg-raised border border-border">
    <span className={`text-[10px]  font-bold ${colors[fileType?.toLowerCase()] ?? 'text-white/30'}`}>
      {fileType?.toUpperCase() || 'FILE'}
    </span>
  </div>
);

export default FileTypeBadge;