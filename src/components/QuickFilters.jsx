export default function QuickFilters({ activeCategory, onCategoryChange, categories }) {
  const topCategories = ["All", ...categories.filter(c => c !== "All").slice(0, 5)];

  return (
    <div className="sticky top-20 sm:top-[72px] z-30 bg-gradient-to-r from-white via-cyan-50/80 to-teal-50/80 backdrop-blur-lg border-b-2 border-cyan-200 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 scroll-smooth -mx-1 px-1 sm:mx-0 sm:px-0">
          <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider whitespace-nowrap mr-1 sm:mr-2 flex-shrink-0">
            🔍 Filter:
          </span>
          <div className="flex gap-1 sm:gap-2 flex-nowrap">
            {topCategories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg scale-105 animate-pulse"
                    : "bg-white text-slate-700 hover:bg-cyan-100 border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
            {categories.length > 6 && (
              <details className="group relative flex-shrink-0">
                <summary className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-white text-slate-700 hover:bg-cyan-100 border-2 border-cyan-200 hover:border-cyan-400 cursor-pointer list-none whitespace-nowrap transition-all hover:shadow-md">
                  More ({categories.length - 6})
                </summary>
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-cyan-200 rounded-2xl shadow-2xl p-4 grid grid-cols-2 gap-2 min-w-[220px] z-40">
                  {categories.slice(6).map((category) => (
                    <button
                      key={category}
                      onClick={() => onCategoryChange(category)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeCategory === category
                          ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md"
                          : "bg-slate-50 text-slate-700 hover:bg-cyan-100 border border-cyan-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
