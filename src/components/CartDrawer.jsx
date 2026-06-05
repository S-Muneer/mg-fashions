import { useCart } from "../context/CartContext";
import { CLOUDINARY_FALLBACK_IMAGE } from "../constants/cloudinaryMedia";
import { resolveMediaUrl } from "../utils/media";

export default function CartDrawer() {
  const { cart, total, removeFromCart, open, setOpen } = useCart();

  if (!open) return null;

  return (
    <>
      <button
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/40 z-40"
        aria-label="Close cart"
      />
      <aside className="cart-panel fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-black">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {cart.length === 0 && <p className="text-gray-600">No items in cart.</p>}

          {cart.map((item) => (
            <div key={item.cartLineId} className="flex gap-3 mb-3 border border-gray-200 rounded-2xl p-2">
              <img
                src={resolveMediaUrl(item.image || CLOUDINARY_FALLBACK_IMAGE)}
                alt={item.name}
                loading="lazy"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-medium leading-5">{item.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Qty: {item.quantity || 1} | Rs {item.price}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.cartLineId)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-3">
          <p className="font-bold text-lg">Total: Rs {total}</p>
          <button
            onClick={() => setOpen(false)}
            className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-full hover:bg-cyan-700 transition"
          >
            Continue
          </button>
        </div>
      </aside>
    </>
  );
}
