import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import ScrollReveal from "../components/ScrollReveal";
import { CLOUDINARY_FALLBACK_IMAGE } from "../constants/cloudinaryMedia";
import { getProductById, getProducts } from "../services/productService";
import { resolveMediaUrl } from "../utils/media";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    Promise.all([getProductById(id), getProducts()])
      .then(([item, all]) => {
        if (!mounted) return;
        setProduct(item);
        setProducts(all);
        setSelectedSize(item?.sizes?.[0] || "");
      })
      .catch((apiError) => {
        if (!mounted) return;
        setError(apiError.message || "Failed to load product");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id && item.category === product.category)
      .slice(0, 4);
  }, [products, product]);

  const imageSource = resolveMediaUrl(product?.image || CLOUDINARY_FALLBACK_IMAGE);

  if (loading) {
    return <section className="max-w-6xl mx-auto px-4 py-16">Loading product...</section>;
  }

  if (!product) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16">
        {error ? <p className="text-sm text-rose-600 mb-3">{error}</p> : null}
        <p className="text-lg font-semibold">Product not found.</p>
        <Link to="/products" className="text-cyan-700 hover:underline mt-3 inline-block">
          Back to products
        </Link>
      </section>
    );
  }

  const sizeNotes = {
    S: "Slim profile with light stretch",
    M: "Balanced fit and the most popular choice",
    L: "Relaxed fit for easy movement",
    XL: "Roomy comfort with extra layering space",
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <ScrollReveal className="tilt-card rounded-3xl overflow-hidden border border-cyan-100 shadow-xl bg-white relative">
          <div className="relative overflow-hidden">
            <img
              src={imageSource}
              alt={product.name}
              className="w-full h-[460px] sm:h-[560px] object-cover transition duration-500"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120} className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md">
          <ScrollReveal type="fadeDown" className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-sm uppercase tracking-wider text-cyan-700 font-semibold">{product.category}</p>
              <h1 className="product-hero-title text-3xl sm:text-4xl font-extrabold mt-2">{product.name}</h1>
            </div>
            <div className="tag-badge bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-center">
              {product.rating >= 4.5 ? "Top Rated" : "Best Seller"}
            </div>
          </ScrollReveal>
          
          <ScrollReveal type="fadeUp" delay={150} className="text-gray-600 mt-4 leading-8 text-sm sm:text-base bg-slate-50 p-4 rounded-2xl">
            {product.description}
          </ScrollReveal>

          <ScrollReveal type="scaleIn" delay={200} className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="bg-gradient-to-br from-cyan-50 to-white p-5 rounded-2xl border border-cyan-100">
              <div className="flex items-center justify-between gap-4 mb-4">
                <p className="text-sm font-semibold">Select Size</p>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 bg-cyan-100/50 px-3 py-1 rounded-full"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition transform hover:scale-105 ${
                      selectedSize === size
                        ? "bg-cyan-700 text-white border-cyan-700 shadow-lg"
                        : "border-slate-300 text-slate-700 hover:border-cyan-500 hover:bg-cyan-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-600 italic">{sizeNotes[selectedSize] || "Choose the size that fits you best."}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                <p className="text-sm font-semibold">Stock Status</p>
              </div>
              <div className="space-y-2">
                <p className={`text-2xl font-bold ${product.inStock ? "text-emerald-600" : "text-rose-600"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>
                <p className="text-xs text-slate-600">Free shipping above Rs 1499</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal type="fadeUp" delay={250} className="mt-8 rounded-3xl bg-gradient-to-r from-cyan-50 via-teal-50 to-slate-50 border-2 border-cyan-200 p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Total Price</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Rs {product.price}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Ready to ship</p>
                <p className="text-sm font-semibold text-teal-700">✓ All inclusive</p>
              </div>
            </div>
          </ScrollReveal>
        </ScrollReveal>

          <ScrollReveal type="slideUp" delay={300} className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addToCart({ ...product, selectedSize })}
              disabled={!product.inStock}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <Link
              to="/products"
              className="px-6 py-3 rounded-full border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition text-center"
            >
              Continue Shopping
            </Link>
          </ScrollReveal>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          </ScrollReveal>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item, idx) => (
              <ScrollReveal key={item.id} delay={idx * 70}>
                <ProductCard product={item} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {showSizeGuide && (
        <>
          <div
            className="drawer-backdrop"
            onClick={() => setShowSizeGuide(false)}
          />
          <div className="drawer-panel">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-700">Size Guide</p>
                <h3 className="text-xl font-bold text-slate-900">Fit and measurements</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="mt-6 space-y-6">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-700">How to choose your size</p>
                <p className="mt-2 text-sm text-slate-600">
                  Select the size that matches your chest and shoulder measurements. If you prefer a relaxed fit, choose the next size up.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { size: "S", bust: "34", waist: "28", note: "Slim fit" },
                  { size: "M", bust: "36", waist: "30", note: "Balanced fit" },
                  { size: "L", bust: "38", waist: "32", note: "Relaxed fit" },
                  { size: "XL", bust: "40", waist: "34", note: "Comfort fit" },
                ].map((row) => (
                  <div key={row.size} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-lg font-semibold text-slate-900">Size {row.size}</p>
                    <p className="mt-2 text-sm text-slate-600">Bust: {row.bust} in</p>
                    <p className="text-sm text-slate-600">Waist: {row.waist} in</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-cyan-700">{row.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
