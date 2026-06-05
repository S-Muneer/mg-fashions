import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/orderService";

export default function Account() {
  const { user, logoutUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getMyOrders()
      .then((data) => {
        if (mounted) setOrders(data);
      })
      .catch(() => {
        if (mounted) setOrders([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          <h1 className="text-2xl font-bold">My Account</h1>
          <p className="text-gray-600 mt-1 text-sm">Welcome back, {user?.name}</p>
          <div className="mt-5 space-y-1 text-sm">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
          <button
            onClick={logoutUser}
            className="mt-6 border border-red-300 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-3">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link to="/products" className="border rounded-xl p-4 hover:bg-gray-50">
              Browse products
            </Link>
            <Link to="/deals" className="border rounded-xl p-4 hover:bg-gray-50">
              View deals
            </Link>
            <Link to="/cart" className="border rounded-xl p-4 hover:bg-gray-50">
              Go to cart
            </Link>
          </div>

          <h3 className="text-lg font-semibold mt-7 mb-3">Recent Orders</h3>
          {loading ? (
            <p className="text-sm text-gray-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-600">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-200 p-3 text-sm"
                >
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-gray-600">
                    {order.items.length} items | Rs {order.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Status: {order.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
