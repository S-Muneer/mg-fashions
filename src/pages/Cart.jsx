import { Link } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import { CLOUDINARY_FALLBACK_IMAGE } from "../constants/cloudinaryMedia";
import { useCart } from "../context/CartContext";
import { resolveMediaUrl } from "../utils/media";

export default function Cart() {
  const { cart, total, removeFromCart, updateQuantity } = useCart();

  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 max-w-6xl mx-auto">
      <ScrollReveal>
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      </ScrollReveal>

      {cart.length === 0 ? (
        <ScrollReveal delay={80}>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <p className="text-gray-600">Your cart is empty.</p>
            <Link
              to="/products"
              className="inline-block mt-4 bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-cyan-700 transition"
            >
              Browse Products
            </Link>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <ScrollReveal key={item.cartLineId} delay={idx * 60}>
                <article className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={resolveMediaUrl(item.image || CLOUDINARY_FALLBACK_IMAGE)}
                      alt={item.name}
                      loading="lazy"
                      className="h-20 w-20 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600 text-sm mt-1">Rs {item.price}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {item.selectedSize ? `Size: ${item.selectedSize}` : "Standard size"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.cartLineId, (item.quantity || 1) - 1)
                      }
                      className="h-9 w-9 rounded-full border border-gray-300 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center">{item.quantity || 1}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.cartLineId, (item.quantity || 1) + 1)
                      }
                      className="h-9 w-9 rounded-full border border-gray-300 hover:bg-gray-50"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.cartLineId)}
                      className="ml-3 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={120}>
            <aside className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 h-fit">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {total}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t my-4" />
              <p className="text-xl font-bold">Total: Rs {total}</p>
              <Link
                to="/checkout"
                className="inline-block mt-4 w-full text-center bg-cyan-600 text-white px-6 py-3 rounded-full hover:bg-cyan-700 transition"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </ScrollReveal>
        </div>
      )}
    </section>
  );
}
