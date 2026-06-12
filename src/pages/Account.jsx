import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ScrollReveal from "../components/ScrollReveal";
import { getMyOrders } from "../services/orderService";

export default function Account() {
  const { user, logoutUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getMyOrders()
      .then((data) => {
        if (mounted) setOrders((data || []).slice(0, 3));
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
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <ScrollReveal>
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
              Account Dashboard
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-slate-600 mt-2">Manage your account, orders, and preferences</p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Account Info Card */}
          <ScrollReveal delay={50}>
            <div className="lg:col-span-1 bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center text-white text-2xl">
                  👤
                </div>
                <div>
                  <p className="text-xs text-cyan-700 font-semibold uppercase">Profile</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{user?.name}</p>
                </div>
              </div>

              <div className="space-y-3 pb-6 border-b border-cyan-200">
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Email</p>
                  <p className="text-sm text-slate-900 mt-1 break-all">{user?.email}</p>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <Link
                  to="/my-orders"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 transition font-medium text-sm text-slate-900 border border-slate-200"
                >
                  📦 My Orders
                </Link>
                <button
                  onClick={logoutUser}
                  className="w-full px-4 py-3 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 transition font-medium text-sm"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Actions */}
          <ScrollReveal delay={100}>
            <div className="lg:col-span-2 space-y-6">
              {/* Action Buttons */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Link
                    to="/products"
                    className="p-4 border border-slate-200 rounded-xl hover:bg-cyan-50 transition text-center font-medium text-sm text-slate-900"
                  >
                    🛍️ Browse Products
                  </Link>
                  <Link
                    to="/deals"
                    className="p-4 border border-slate-200 rounded-xl hover:bg-amber-50 transition text-center font-medium text-sm text-slate-900"
                  >
                    🎉 View Deals
                  </Link>
                  <Link
                    to="/cart"
                    className="p-4 border border-slate-200 rounded-xl hover:bg-indigo-50 transition text-center font-medium text-sm text-slate-900"
                  >
                    🛒 Go to Cart
                  </Link>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-900">Recent Orders</p>
                  <Link to="/my-orders" className="text-xs text-cyan-700 hover:text-cyan-900 font-semibold">
                    View All →
                  </Link>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 text-sm mb-3">No orders yet</p>
                    <Link
                      to="/products"
                      className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {order.items?.length} item(s) • Rs {order.total.toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              order.status === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "SHIPPED"
                                ? "bg-indigo-100 text-indigo-700"
                                : order.status === "CANCELLED"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Account Features */}
        <ScrollReveal delay={150} className="mt-10">
          <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 border border-cyan-200 rounded-3xl p-8">
            <p className="text-sm font-semibold text-cyan-700 uppercase">Account Features</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">Everything you need</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl mb-2">📦</p>
                <p className="text-sm font-medium text-slate-900">Order Tracking</p>
                <p className="text-xs text-slate-600 mt-1">Real-time updates on shipments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-2">📄</p>
                <p className="text-sm font-medium text-slate-900">Invoices</p>
                <p className="text-xs text-slate-600 mt-1">Download purchase receipts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-2">↩️</p>
                <p className="text-sm font-medium text-slate-900">Easy Returns</p>
                <p className="text-xs text-slate-600 mt-1">30-day return policy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-2">💬</p>
                <p className="text-sm font-medium text-slate-900">Support</p>
                <p className="text-xs text-slate-600 mt-1">24/7 customer service</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
