import { useEffect, useMemo, useState } from "react";

const defaultBreakpoints = {
  0: 1,
  768: 2,
  1200: 3,
};

function getSlidesPerView(width, breakpoints) {
  return Object.entries(breakpoints)
    .map(([screenWidth, perView]) => ({
      screenWidth: Number(screenWidth),
      perView: Number(perView),
    }))
    .sort((a, b) => a.screenWidth - b.screenWidth)
    .reduce((current, point) => (width >= point.screenWidth ? point.perView : current), 1);
}

export default function CardCarousel({
  items = [],
  renderItem = () => null,
  getItemKey = (_, index) => index,
  breakpoints = defaultBreakpoints,
  autoPlayMs = 0,
  ariaLabel = "Content slider",
}) {
  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(() =>
    typeof window === "undefined" ? 1200 : window.innerWidth
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const perView = useMemo(
    () => getSlidesPerView(width, breakpoints),
    [breakpoints, width]
  );

  const pages = useMemo(() => {
    const grouped = [];
    for (let i = 0; i < items.length; i += perView) {
      grouped.push(items.slice(i, i + perView));
    }
    return grouped.length ? grouped : [[]];
  }, [items, perView]);

  const pageCount = pages.length;

  useEffect(() => {
    if (page >= pageCount) {
      setPage(Math.max(0, pageCount - 1));
    }
  }, [page, pageCount]);

  useEffect(() => {
    if (!autoPlayMs || pageCount <= 1) return undefined;
    const timer = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount);
    }, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [autoPlayMs, pageCount]);

  return (
    <section aria-label={ariaLabel} className="space-y-4">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((group, groupIndex) => (
            <div
              key={`group-${groupIndex}`}
              className="w-full shrink-0 grid gap-4"
              style={{ gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))` }}
            >
              {group.map((item, itemIndex) => (
                <div key={getItemKey(item, groupIndex * perView + itemIndex)}>
                  {renderItem(item, groupIndex * perView + itemIndex)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setPage((current) => (current - 1 + pageCount) % pageCount)
            }
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            aria-label="Previous slide"
          >
            Prev
          </button>

          <div className="flex items-center gap-2">
            {pages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPage(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === page ? "w-8 bg-cyan-600" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPage((current) => (current + 1) % pageCount)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            aria-label="Next slide"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
