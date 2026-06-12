export default function StickySortBar({ sortBy, onSortChange }) {
  return (
    <div className="sticky top-32 sm:top-[120px] z-25 bg-gradient-to-r from-white via-cyan-50/60 to-teal-50/40 border-b-2 border-cyan-100 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
              <span>⭐</span> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg border-2 border-cyan-300 bg-white text-slate-900 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-sm hover:shadow-md"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <div className="text-xs text-slate-500">
            {/* Product count placeholder */}
          </div>
        </div>
      </div>
    </div>
  );
}
