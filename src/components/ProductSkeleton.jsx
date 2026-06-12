export default function ProductSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <article
          key={idx}
          className="skeleton-card rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md"
        >
          <div className="skeleton-image h-64 w-full bg-slate-200"></div>
          <div className="p-5 space-y-4">
            <div className="skeleton-line h-4 w-3/4 bg-slate-200 rounded-full" />
            <div className="skeleton-line h-5 w-1/2 bg-slate-200 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton-line h-3 w-full bg-slate-200 rounded-full" />
              <div className="skeleton-line h-3 w-5/6 bg-slate-200 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton-box h-11 rounded-2xl bg-slate-200" />
              <div className="skeleton-box h-11 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}
