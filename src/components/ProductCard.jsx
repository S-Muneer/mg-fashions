import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CLOUDINARY_FALLBACK_IMAGE } from "../constants/cloudinaryMedia";
import { resolveMediaUrl } from "../utils/media";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const image = resolveMediaUrl(product.image || CLOUDINARY_FALLBACK_IMAGE);
  const badgeText = product.rating >= 4.5 ? "Top Pick" : product.inStock ? "Best Seller" : "Limited";

  return (
    <article className="group tilt-card bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col border border-cyan-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-900 shadow-sm">
          {badgeText}
        </div>
        <span
          className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${
            product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <p className="text-cyan-700 font-bold mt-3">Rs {product.price}</p>

        <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product.id}`}
            className="text-center border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Details
          </Link>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="bg-slate-900 text-white py-2 rounded-lg hover:bg-cyan-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
