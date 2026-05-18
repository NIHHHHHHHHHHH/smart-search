
const SkeletonCard = () => (
  <div className="rounded-2xl p-5 border border-border animate-pulse bg-bg-elevated">
    <div className="flex gap-4">
      <div className="w-11 h-11 rounded-xl shrink-0 bg-bg-overlay" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 rounded-lg w-3/4 bg-bg-overlay" />
        <div className="h-3 rounded-lg w-full bg-bg-overlay" />
        <div className="h-3 rounded-lg w-5/6 bg-bg-overlay" />
        <div className="flex gap-2 mt-2">
          {[16, 20, 14].map((w, i) => (
            <div key={i} className={`h-3 rounded-lg w-${w} bg-bg-overlay`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
