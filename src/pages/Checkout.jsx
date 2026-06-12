import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user, isUserLoggedIn } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!isUserLoggedIn) {
      setError("Please login to place your order.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const order = await createOrder({
        customerName: user?.name,
        customerEmail: user?.email,
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        },
        paymentMethod: form.paymentMethod,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity || 1,
          size: item.selectedSize || null,
        })),
      });

      clearCart();
      navigate("/order-success", {
        state: { orderNumber: order.orderNumber },
      });
    } catch (apiError) {
      setError(apiError.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  if (!isUserLoggedIn) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-600">
            Please login with your customer account to place an order.
          </p>
          <Link
            to="/user/login"
            className="inline-block mt-4 bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-cyan-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h2>

      <div className="bg-white p-6 rounded shadow mb-6">
         <h1 className="inline-flex items-center gap-3 rounded-2 bg-cyan-500/10 px-4 py-2 text-red-600 text-sm font-semibold tracking-[0.18em] uppercase shadow-glow">This website is under construction. Please do not make any payment. This is a demo store and no real transactions will occur.
</h1>
        <h3 className="font-semibold mb-4">Shipping Address</h3>
        <input
          className="input mb-3"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          className="input mb-3"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          className="input mb-3"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          className="input mb-3"
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Payment</h3>
        <label className="block mb-2">
          <input
            type="radio"
            name="pay"
            className="mr-2"
            checked={form.paymentMethod === "COD"}
            onChange={() => setForm({ ...form, paymentMethod: "COD" })}
          />
          Cash on Delivery
        </label>
        <label className="block mb-4">
          <input
            type="radio"
            name="pay"
            className="mr-2"
            checked={form.paymentMethod === "ONLINE"}
            onChange={() => setForm({ ...form, paymentMethod: "ONLINE" })}
          />
          Online Payment
        </label>

        <p className="font-semibold mb-4">
          Items: {cart.length} | Total: Rs {total}
        </p>
        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
        <button
          onClick={placeOrder}
          disabled={loading}
          className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600 disabled:opacity-70"
        >
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </section>
  );
};

export default Checkout;
