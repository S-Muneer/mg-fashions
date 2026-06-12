import { useCallback, useEffect, useMemo, useState } from "react";
import OrderInvoice from "../../components/OrderInvoice";
import { getAdminOrders, updateOrderStatus } from "../../services/orderService";
import { subscribeAdminEvents } from "../../services/realtimeService";

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Orders Load Error:", err);
      setError(err?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();

    const unsubscribe = subscribeAdminEvents?.((event) => {
      if (
        event?.type === "order_created" ||
        event?.type === "order_status_updated"
      ) {
        loadOrders();
      }
    });

    const interval = setInterval(() => {
      loadOrders();
    }, 30000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(interval);
    };
  }, [loadOrders]);

  const delivered = useMemo(
    () => orders.filter((o) => o?.status === "DELIVERED").length,
    [orders],
  );

  const pending = useMemo(
    () =>
      orders.filter((o) => ["PENDING", "CONFIRMED"].includes(o?.status)).length,
    [orders],
  );

  const shipped = useMemo(
    () => orders.filter((o) => o?.status === "SHIPPED").length,
    [orders],
  );

  const cancelled = useMemo(
    () => orders.filter((o) => o?.status === "CANCELLED").length,
    [orders],
  );

  const statusClass = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200";
      case "CANCELLED":
        return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
      default:
        return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
    }
  };

  const onStatusChange = async (orderId, nextStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, nextStatus);

      setOrders((prev) =>
        prev.map((order) => (order.id === updated.id ? updated : order)),
      );
    } catch (err) {
      console.error(err);
      setError(err?.message || "Could not update order status");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="admin-panel p-4">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold">{pending}</p>
          </div>

          <div className="admin-panel p-4">
            <p className="text-sm text-slate-500">Shipped</p>
            <p className="text-2xl font-bold">{shipped}</p>
          </div>

          <div className="admin-panel p-4">
            <p className="text-sm text-slate-500">Delivered</p>
            <p className="text-2xl font-bold">{delivered}</p>
          </div>

          <div className="admin-panel p-4">
            <p className="text-sm text-slate-500">Cancelled</p>
            <p className="text-2xl font-bold">{cancelled}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        {/* Mobile Cards */}
        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {loading ? (
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              No orders found.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order?.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Order ID
                    </p>

                    <h3 className="mt-1 break-words text-base font-bold text-slate-900">
                      {order?.orderNumber}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap ${statusClass(
                      order?.status,
                    )}`}
                  >
                    {order?.status}
                  </span>
                </div>

                {/* Customer */}
                <div className="mt-4">
                  <p className="font-semibold text-slate-800">
                    {order?.customerName}
                  </p>

                  <p className="truncate text-sm text-slate-500">
                    {order?.customerEmail}
                  </p>
                </div>

                {/* Details */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Items</span>

                    <span className="font-semibold text-slate-900">
                      {order?.items?.length || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total</span>

                    <span className="text-lg font-bold text-emerald-600">
                      ₹ {Number(order?.total || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                  <select
                    value={order?.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className="h-11 rounded-xl border border-slate-300 px-3 text-sm font-medium outline-none focus:border-cyan-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSelectedInvoice(order)}
                    className="h-11 rounded-xl bg-cyan-600 px-5 font-semibold text-white transition hover:bg-cyan-700"
                  >
                    Invoice
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="admin-panel hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order?.id} className="border-b">
                  <td className="p-4">{order?.orderNumber}</td>

                  <td className="p-4">
                    <div>{order?.customerName}</div>
                    <div className="text-xs text-slate-500">
                      {order?.customerEmail}
                    </div>
                  </td>

                  <td className="p-4">{order?.items?.length || 0}</td>

                  <td className="p-4">
                    Rs {Number(order?.total || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${statusClass(
                        order?.status,
                      )}`}
                    >
                      {order?.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <select
                        value={order?.status}
                        onChange={(e) =>
                          onStatusChange(order.id, e.target.value)
                        }
                        className="rounded-lg border px-2 py-1"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setSelectedInvoice(order)}
                        className="rounded-lg bg-cyan-600 px-3 py-1 text-white"
                      >
                        Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <OrderInvoice
          order={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
}
