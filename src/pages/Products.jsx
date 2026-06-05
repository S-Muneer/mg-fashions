import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import ScrollReveal from "../components/ScrollReveal";
import { getProducts } from "../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((apiError) => {
        setError(apiError.message || "Failed to load products");
      });
  }, []);

  const categories = useMemo(() => {
    const all = products.map((item) => item.category);
    return ["All", ...new Set(all)];
  }, [products]);

  const filtered = useMemo(() => {
    const base = products.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const queryMatch = item.name.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });

    if (sortBy === "price-low") return [...base].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") return [...base].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") return [...base].sort((a, b) => b.rating - a.rating);
    return base;
  }, [products, query, category, sortBy]);

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-[2.5rem] p-8 sm:p-10 bg-gradient-to-br from-slate-950 via-cyan-700 to-teal-600 text-white shadow-2xl mb-10 hero-highlight">
            <p className="uppercase tracking-[0.28em] text-cyan-200 text-xs font-semibold">Seasonal Edit</p>
            <h1 className="product-hero-title mt-4 text-4xl sm:text-5xl font-extrabold leading-tight">
              Discover modern silhouettes for every layer.
            </h1>
            <p className="mt-4 max-w-3xl text-sm sm:text-base text-slate-100/90">
              Shop elevated essentials, statement dresses, and easy mix-and-match sets with lively color palettes and standout detailing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="tag-badge bg-white/15 text-white border border-white/10">Free shipping</span>
              <span className="tag-badge bg-white/15 text-white border border-white/10">Easy returns</span>
              <span className="tag-badge bg-white/15 text-white border border-white/10">New arrivals</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 grid gap-3 sm:grid-cols-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product name"
              className="input bg-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input bg-white"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {error ? (
            <p className="text-sm text-rose-600 col-span-full">{error}</p>
          ) : null}
          {filtered.map((product, idx) => (
            <ScrollReveal key={product.id} delay={idx * 55}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
