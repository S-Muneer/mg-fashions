import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { heroSlides } from "../data/homeContent";

const AUTO_PLAY_MS = 5200;

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => {
      setActive((value) => (value + 1) % heroSlides.length);
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative overflow-hidden rounded-3xl min-h-[440px] md:min-h-[520px] shadow-2xl border border-white/20"
      aria-label="Hero highlights"
    >
      {heroSlides.map((slide, idx) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === active ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {slide.image ? (
            <img
              src={slide.image}
              alt={slide.title}
              loading={idx === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${slide.bgClass} relative`}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_35%)]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
          <div className="absolute inset-0 p-6 sm:p-10 lg:p-12 flex items-end">
            <div className="max-w-2xl text-white">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-200 mb-3">
                MG Fashions
              </p>
              <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
                {slide.title}
              </h1>
              <p className="mt-4 text-white/90 max-w-xl">{slide.subtitle}</p>
              <Link
                to={slide.link}
                className="inline-block mt-7 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold px-6 py-3 rounded-full transition"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute inset-x-4 sm:inset-x-6 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() =>
            setActive((value) => (value - 1 + heroSlides.length) % heroSlides.length)
          }
          className="pointer-events-auto h-10 w-10 rounded-full bg-black/45 text-white text-lg transition hover:bg-black/65"
          aria-label="Previous hero slide"
        >
          {"<"}
        </button>
        <button
          type="button"
          onClick={() => setActive((value) => (value + 1) % heroSlides.length)}
          className="pointer-events-auto h-10 w-10 rounded-full bg-black/45 text-white text-lg transition hover:bg-black/65"
          aria-label="Next hero slide"
        >
          {">"}
        </button>
      </div>

      <div className="absolute bottom-5 right-5 flex gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === active ? "w-7 bg-cyan-300" : "w-2.5 bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
