import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ScrollReveal from "../components/ScrollReveal";
import { getProducts } from "../services/productService";

export default function Deals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((items) => setProducts(items.slice(0, 8)));
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl p-7 sm:p-10 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-500 text-white mb-10">
            <p className="uppercase tracking-[0.25em] text-sm text-cyan-100">Limited Time</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">Flash Deals</h1>
            <p className="mt-3 text-cyan-50 max-w-2xl">
              Save on top picks. Offers update regularly across ladies, kids, and casual styles.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, idx) => (
            <ScrollReveal key={product.id} delay={idx * 70}>
              <div className="relative">
                <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{10 + (idx % 4) * 5}%
                </span>
                <ProductCard product={product} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
