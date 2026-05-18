import React from 'react';
import { Users, Clipboard, Clock, Star, FolderOpen, Frown } from 'lucide-react';
import { CategoryChip, FileTypeBadge, Tag, EmptyState, SkeletonCard } from '../ui';


const SearchResults = ({ results = [], loading, query, onDocumentClick }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (results.length === 0) {
    return !query
      ? <EmptyState icon={<FolderOpen size={22} />} title="No Documents Yet" subtitle="Upload your first document to get started" />
      : <EmptyState icon={<Frown size={22} />} title="No Results Found" subtitle="Try adjusting your search terms or filters" />;
  }

  return (
    <div>
         <div className="flex items-center gap-2.5 mb-4">
           <span className="inline-flex items-center justify-center min-w-[35px] h-[30px] px-2  bg-accent/10 border border-accent/20 rounded-md  text-xl font-bold text-accent">
             {results.length}
           </span>
           <span className="text-base font-medium text-text-primary">
             {query ? (
               <>
                 result{results.length !== 1 ? 's' : ''} for{' '}
                 <span className="text-accent">"{query}"</span>
               </>
             ) : (
               <>Document{results.length !== 1 ? 's' : ''}</>
             )}
           </span>
         </div>

      <div className="space-y-3">
        {results.map((doc, idx) => (
          <div key={doc._id} onClick={() => onDocumentClick(doc)}
            className="group relative rounded-2xl p-5 border border-border cursor-pointer overflow-hidden transition-all duration-200 bg-bg-elevated hover:border-accent-glow hover:shadow-[0_0_32px_var(--color-accent-subtle)]"
            style={{ animation: `ssfadeUp 0.3s cubic-bezier(0.16,1,0.3,1) ${idx * 40}ms both` }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-accent-subtle blur-[60px]" />

            <div className="relative flex items-start gap-4">
              <FileTypeBadge fileType={doc.fileType} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl font-semibold truncate transition-colors duration-150 text-text-primary group-hover:text-accent">{doc.title}</h3>
                  <CategoryChip category={doc.category} />
                </div>

                {doc.summary && (<p className="text-base mb-3 line-clamp-2 leading-relaxed text-text-secondary">{doc.summary}</p>)}

                <div className="flex flex-wrap items-center gap-3 text-base text-text-tertiary">
                  {doc.team && (<div className="flex items-center gap-1"><Users size={15} /><span>{doc.team}</span></div>)}
                  {doc.project && (<div className="flex items-center gap-1"><Clipboard size={15} /><span>{doc.project}</span></div>)}
                  <div className="flex items-center gap-1"><Clock size={15} /><span>{new Date(doc.uploadedAt).toLocaleDateString()}</span></div>
                  {query && doc.relevanceScore && (
                    <div className="ml-auto flex items-center gap-1 font-semibold text-accent">
                      <Star size={13} fill="currentColor" />
                      <span>{doc.relevanceScore}% match</span>
                    </div>
                  )}
                </div>
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {doc.tags.slice(0, 5).map((tag, i) => (
                      <Tag key={i}>{tag}</Tag>
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