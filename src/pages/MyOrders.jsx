import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ScrollReveal from "../components/ScrollReveal";
import OrderInvoice from "../components/OrderInvoice";
import ReturnModal from "../components/ReturnModal";
import { getMyOrders } from "../services/orderService";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    let mounted = true;

    getMyOrders()
      .then((data) => {
        if (mounted) setOrders(data || []);
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Failed to load orders");
          setOrders([]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const statusColors = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
    SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
  };

  const filteredOrders = useMemo(() => {
    if (filterStatus === "ALL") return orders;
    return orders.filter((order) => order.status === filterStatus);
  }, [orders, filterStatus]);

  const handleReturn = async (returnData) => {
    try {
      // TODO: Call API to submit return request
      console.log("Return request:", returnData);
      alert("Return request submitted successfully!");
      setSelectedReturn(null);
    } catch (err) {
      alert("Failed to submit return request");
    }
  };

  return (
    <>
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
                Customer Portal
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">My Orders</h1>
              <p className="text-slate-600 mt-2">View, track, and manage all your purchases</p>
            </div>
          </ScrollReveal>

          {/* Filter Tabs */}
          <ScrollReveal delay={50}>
            <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
              {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition text-sm font-medium ${
                    filterStatus === status
                      ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status === "ALL" ? "All Orders" : status}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Content */}
          {error && (
            <ScrollReveal delay={100}>
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 text-sm mb-6">
                {error}
              </div>
            </ScrollReveal>
          )}

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 h-40 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <ScrollReveal delay={100}>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-slate-900">No orders yet</h3>
                <p className="text-slate-600 mt-2">
                  {filterStatus === "ALL"
                    ? "Start shopping to see your orders here"
                    : `No ${filterStatus.toLowerCase()} orders`}
                </p>
                <a
                  href="/products"
                  className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-full font-semibold hover:shadow-lg transition"
                >
                  Browse Products
                </a>
              </div>
            </ScrollReveal>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, idx) => (
                <ScrollReveal key={order.id} delay={idx * 50}>
                  <div className="bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Order Info */}
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">
                              Order Number
                            </p>
                            <p className="text-xl font-bold text-slate-900 mt-1">
                              {order.orderNumber}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              statusColors[order.status]
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                          <div>
                            <p className="text-slate-600">📅 Order Date</p>
                            <p className="font-medium text-slate-900">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600">📦 Items</p>
                            <p className="font-medium text-slate-900">{order.items?.length} item(s)</p>
                          </div>
                          <div>
                            <p className="text-slate-600">💰 Total Amount</p>
                            <p className="font-bold text-cyan-700 text-lg">
                              Rs {order.total.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-3">Items in Order</p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div key={i} className="text-sm p-2 bg-slate-50 rounded-lg">
                              <p className="font-medium text-slate-900">{item.productName}</p>
                              <p className="text-xs text-slate-600">
                                Qty: {item.quantity} | Size: {item.size}
                              </p>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <p className="text-xs text-slate-600 italic">
                              +{order.items.length - 3} more item(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-200">
                      <button
                        onClick={() => setSelectedInvoice(order)}
                        className="px-4 py-2 border border-cyan-300 text-cyan-700 rounded-lg hover:bg-cyan-50 transition font-medium text-sm"
                      >
                        📄 View Invoice
                      </button>
                      {["DELIVERED", "SHIPPED", "CONFIRMED"].includes(order.status) && (
                        <button
                          onClick={() => setSelectedReturn(order)}
                          className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition font-medium text-sm"
                        >
                          ↩️ Request Return
                        </button>
                      )}
                      {order.status === "SHIPPED" && (
                        <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium text-sm">
                          📍 Track Package
                        </button>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {selectedInvoice && (
        <OrderInvoice order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
      {selectedReturn && (
        <ReturnModal
          order={selectedReturn}
          onClose={() => setSelectedReturn(null)}
          onSubmit={handleReturn}
        />
      )}
    </>
  );
}
