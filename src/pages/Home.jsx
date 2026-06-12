import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardCarousel from "../components/CardCarousel";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import ScrollReveal from "../components/ScrollReveal";
import { homeBanners, trustCards } from "../data/homeContent";
import { getProducts } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((items) => setProducts(items.slice(0, 8)))
      .catch((apiError) => {
        setError(apiError.message || "Failed to load featured products");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero-wrap px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <HeroSlider />
        </div>
      </section>

      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <ScrollReveal>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Editorial Banners
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
                  Clean Card Slider Layout
                </h2>
              </div>
              <Link to="/collections" className="text-cyan-700 font-semibold hover:underline">
                View collections
              </Link>
            </div>
          </ScrollReveal>

          <CardCarousel
            items={homeBanners}
            autoPlayMs={6000}
            breakpoints={{ 0: 1, 960: 2, 1280: 3 }}
            ariaLabel="Home promotional banners"
            getItemKey={(item) => item.title}
            renderItem={(item) => (
              <article className="h-full overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-md">
                <div className={`relative h-52 w-full rounded-t-3xl bg-gradient-to-br ${item.bgClass}`}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover opacity-70"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-950/10" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700">
                    {item.tag}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.text}</p>
                  <Link
                    to={item.link}
                    className="mt-4 inline-block text-sm font-semibold text-cyan-700 hover:underline"
                  >
                    {item.cta}
                  </Link>
                </div>
              </article>
            )}
          />

          <div className="grid gap-4 md:grid-cols-3">
            {trustCards.map((card, idx) => (
              <ScrollReveal key={card.title} delay={idx * 70}>
                <article className="bg-white/90 border border-cyan-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  {card.icon && (
                    <img
                      src={card.icon}
                      alt={card.title}
                      className="h-12 w-12 rounded-2xl bg-slate-100 p-2"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{card.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{card.text}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-3 mb-7">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl font-bold">Trending Now</h2>
            </ScrollReveal>
            <Link to="/products" className="text-cyan-700 font-semibold hover:underline">
              View all
            </Link>
          </div>
          {error ? (
            <p className="text-sm text-rose-600">{error}</p>
          ) : loading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <ProductSkeleton count={4} />
            </div>
          ) : products.length === 0 ? (
            <p className="text-sm text-slate-600">No products available right now.</p>
          ) : (
            <CardCarousel
              items={products}
              breakpoints={{ 0: 1, 768: 2, 1100: 3, 1400: 4 }}
              ariaLabel="Trending products slider"
              getItemKey={(item) => item.id}
              renderItem={(product) => <ProductCard product={product} />}
            />
          )}
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <ScrollReveal className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white p-7 sm:p-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <p className="uppercase tracking-[0.25em] text-xs text-cyan-200 mb-2">Exclusive Club</p>
              <h3 className="text-2xl font-bold">Get New Arrivals Before Everyone</h3>
              <p className="text-cyan-100 mt-1 text-sm">Subscribe for launch alerts and member-only offers.</p>
            </div>
            <Link
              to="/deals"
              className="bg-cyan-400 text-slate-950 px-6 py-3 rounded-full font-semibold hover:bg-cyan-300 transition text-center"
            >
              Explore Deals
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
