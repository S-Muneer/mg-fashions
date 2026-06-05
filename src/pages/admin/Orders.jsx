import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../../services/orderService";
import { subscribeAdminEvents } from "../../services/realtimeService";

const statusOptions = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (apiError) {
      setError(apiError.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();

    const unsubscribe = subscribeAdminEvents((event) => {
      if (event.type === "order_created" || event.type === "order_status_updated") {
        loadOrders().catch(() => {});
      }
    });

    const fallbackPolling = window.setInterval(() => {
      loadOrders().catch(() => {});
    }, 30000);

    return () => {
      unsubscribe();
      window.clearInterval(fallbackPolling);
    };
  }, [loadOrders]);

  const delivered = useMemo(
    () => orders.filter((order) => order.status === "DELIVERED").length,
    [orders]
  );
  const pending = useMemo(
    () =>
      orders.filter((order) =>
        ["PENDING", "CONFIRMED"].includes(order.status)
      ).length,
    [orders]
  );
  const shipped = useMemo(
    () => orders.filter((order) => order.status === "SHIPPED").length,
    [orders]
  );
  const cancelled = useMemo(
    () => orders.filter((order) => order.status === "CANCELLED").length,
    [orders]
  );

  const statusClass = (status) => {
    if (status === "DELIVERED") return "bg-emerald-100 text-emerald-700";
    if (status === "SHIPPED") return "bg-indigo-100 text-indigo-700";
    if (status === "CANCELLED") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  const onStatusChange = async (orderId, nextStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, nextStatus);
      setOrders((prev) =>
        prev.map((order) => (order.id === updated.id ? updated : order))
      );
    } catch (apiError) {
      setError(apiError.message || "Could not update order status");
    }
  };

  return (
    <div className="space-y-6">
      <section className="admin-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
          Fulfillment
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Orders</h2>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Delivered: <span className="font-semibold">{delivered}</span>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            Shipped: <span className="font-semibold">{shipped}</span>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Pending: <span className="font-semibold">{pending}</span>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Cancelled: <span className="font-semibold">{cancelled}</span>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="admin-panel p-4 text-sm text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="admin-panel p-4 text-sm text-slate-500">No orders found.</div>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="admin-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Order ID
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                    {order.orderNumber}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Customer
                  </p>
                  <p className="mt-1 text-slate-800">{order.customerName}</p>
                  <p className="truncate text-xs text-slate-500">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Summary
                  </p>
                  <p className="mt-1 text-slate-700">Items: {order.items.length}</p>
                  <p className="font-semibold text-slate-900">Rs {order.total}</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Update Status
                </label>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="admin-panel hidden overflow-x-auto p-0 md:block">
        <table className="w-full min-w-[860px] text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-700">Order ID</th>
              <th className="p-4 text-sm font-semibold text-slate-700">Customer</th>
              <th className="p-4 text-sm font-semibold text-slate-700">Items</th>
              <th className="p-4 text-sm font-semibold text-slate-700">Total</th>
              <th className="p-4 text-sm font-semibold text-slate-700">Status</th>
              <th className="p-4 text-sm font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4 text-sm text-slate-500" colSpan={6}>
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className="p-4 text-sm text-slate-500" colSpan={6}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-200 transition hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{order.orderNumber}</td>
                  <td className="p-4 text-slate-700">
                    <p>{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.customerEmail}</p>
                  </td>
                  <td className="p-4 text-slate-700">{order.items.length}</td>
                  <td className="p-4 font-medium text-slate-900">Rs {order.total}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value)}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-700"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
