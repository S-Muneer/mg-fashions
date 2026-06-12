import { useCallback, useEffect, useState } from "react";
import SalesChart from "../../components/admin/SalesChart";
import OrderStatusChart from "../../components/admin/OrderStatusChart";
import { getAdminStats } from "../../services/adminService";
import { subscribeAdminEvents } from "../../services/realtimeService";
import { getAdminOrders } from "../../services/orderService";

const defaultSales = [
  { day: "Mon", sales: 0 },
  { day: "Tue", sales: 0 },
  { day: "Wed", sales: 0 },
  { day: "Thu", sales: 0 },
  { day: "Fri", sales: 0 },
  { day: "Sat", sales: 0 },
  { day: "Sun", sales: 0 },
];

const defaultStatus = [
  { name: "Delivered", value: 0, color: "#06b6d4" },
  { name: "Shipped", value: 0, color: "#6366f1" },
  { name: "Pending", value: 0, color: "#f59e0b" },
  { name: "Cancelled", value: 0, color: "#ef4444" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totals: {
      products: 0,
      orders: 0,
      revenue: 0,
      pending: 0,
    },
    salesByDay: defaultSales,
    orderStatus: defaultStatus,
  });
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [period, setPeriod] = useState("week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);

  const loadStats = useCallback(async (filters = {}) => {
    const data = await getAdminStats(filters);
    setStats(data);
    setError("");
    setLastUpdated(new Date());
  }, []);

  const loadRecentOrders = useCallback(async () => {
    try {
      const orders = await getAdminOrders();
      setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
    } catch {
      setRecentOrders([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const initialFetch = window.setTimeout(() => {
      loadStats({ period }).catch((apiError) => {
        if (mounted) setError(apiError.message || "Could not load dashboard");
      });
      loadRecentOrders().catch(() => {});
    }, 0);

    const unsubscribe = subscribeAdminEvents(() => {
      loadStats({ period, startDate, endDate }).catch(() => {});
      loadRecentOrders().catch(() => {});
    });

    const fallbackPolling = window.setInterval(() => {
      loadStats({ period, startDate, endDate }).catch(() => {});
      loadRecentOrders().catch(() => {});
    }, 30000);

    return () => {
      mounted = false;
      window.clearTimeout(initialFetch);
      unsubscribe();
      window.clearInterval(fallbackPolling);
    };
  }, [loadStats, loadRecentOrders, period, startDate, endDate]);

  const applyFilters = () => {
    const filters = {};
    if (period && period !== "custom") filters.period = period;
    if (period === "custom") {
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
    }
    loadStats(filters).catch(() => {});
  };

  const exportCsv = () => {
    const rows = [
      ["Day", "Sales"],
      ...((stats.salesByDay || []).map((row) => [row.day, String(row.sales || 0)])),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-${period || "range"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const resetToWeek = () => {
    setPeriod("week");
    setStartDate("");
    setEndDate("");
    loadStats({ period: "week" }).catch(() => {});
  };

  const cards = [
    {
      label: "Products",
      value: String(stats.totals.products),
      detail: "Active product listings",
      tone: "from-cyan-500 to-teal-600",
    },
    {
      label: "Orders",
      value: String(stats.totals.orders),
      detail: `${stats.totals.pending} awaiting action`,
      tone: "from-indigo-500 to-violet-600",
    },
    {
      label: "Revenue",
      value: `Rs ${Math.round(stats.totals.revenue || 0).toLocaleString("en-IN")}`,
      detail: "Confirmed sales total",
      tone: "from-emerald-500 to-emerald-700",
    },
  ];

return (
  <div className="space-y-6 max-w-[1800px] mx-auto">
    {/* HERO */}
    <section className="admin-hero p-4 sm:p-6 lg:p-8 text-slate-900">
      <div className="grid gap-6 xl:grid-cols-[1fr_500px] xl:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800">
            Store Pulse
          </p>

          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950">
            Dashboard Performance
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-700">
            Track store activity, monitor order fulfillment and revenue growth
            in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="admin-hero-stat">
            <p className="text-xs uppercase text-slate-500">Revenue</p>
            <p className="mt-2 text-xl lg:text-2xl font-bold">
              Rs{" "}
              {Math.round(stats.totals.revenue || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total sales</p>
          </div>

          <div className="admin-hero-stat">
            <p className="text-xs uppercase text-slate-500">Orders</p>
            <p className="mt-2 text-xl lg:text-2xl font-bold">
              {stats.totals.orders}
            </p>
            <p className="text-xs text-slate-500 mt-1">Processed</p>
          </div>

          <div className="admin-hero-stat">
            <p className="text-xs uppercase text-slate-500">Products</p>
            <p className="mt-2 text-xl lg:text-2xl font-bold">
              {stats.totals.products}
            </p>
            <p className="text-xs text-slate-500 mt-1">Active listings</p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mt-6 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between rounded-2xl bg-white/70 border border-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs uppercase font-semibold text-slate-500">
            Range
          </label>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
            <option value="custom">Custom</option>
          </select>

          {period === "custom" && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
            </>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="site-primary-btn px-5 py-2"
          >
            Apply
          </button>

          <button
            onClick={resetToWeek}
            className="rounded-lg bg-slate-900 text-white px-5 py-2"
          >
            Last 7 Days
          </button>
        </div>
      </div>
    </section>

    {/* SUMMARY CARDS */}
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((item) => (
        <div
          key={item.label}
          className={`admin-status-card bg-gradient-to-br ${item.tone}
          rounded-3xl p-6 text-white shadow-xl`}
        >
          <p className="text-white/80 text-sm">{item.label}</p>

          <h3 className="mt-3 text-3xl font-bold">{item.value}</h3>

          <p className="mt-2 text-white/80 text-sm">{item.detail}</p>
        </div>
      ))}
    </div>

    {/* CHARTS */}
    <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
      <div className="2xl:col-span-2">
        <div className="admin-panel p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Sales Overview
              </h3>

              <p className="text-sm text-slate-500">
                {period === "custom"
                  ? `${startDate || "Start"} - ${endDate || "End"}`
                  : period}
              </p>
            </div>

            <button
              onClick={exportCsv}
              className="border rounded-lg px-4 py-2 hover:bg-slate-100"
            >
              Export CSV
            </button>
          </div>

          <div className="mt-6">
            <SalesChart
              series={stats.salesByDay || defaultSales}
              title=""
              subtitle=""
            />
          </div>
        </div>
      </div>

      <OrderStatusChart
        segments={stats.orderStatus || defaultStatus}
      />
    </div>

    {/* RECENT ORDERS */}
    <section className="admin-panel p-4 sm:p-6">
      <h3 className="text-xl font-semibold">
        Recent Orders
      </h3>

      <div className="hidden lg:block overflow-x-auto mt-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Order #</th>
              <th className="text-left py-3">Customer</th>
              <th className="text-left py-3">Total</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3">{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>
                  Rs{" "}
                  {Math.round(order.total || 0).toLocaleString("en-IN")}
                </td>
                <td>{order.status}</td>
                <td>
                  {new Date(
                    order.updatedAt || order.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden mt-4 space-y-4">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="border rounded-2xl p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between">
              <h4 className="font-semibold">
                #{order.orderNumber}
              </h4>

              <span className="text-cyan-600 font-medium">
                {order.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-600">
              {order.customerName}
            </p>

            <p className="mt-2 font-bold">
              Rs{" "}
              {Math.round(order.total || 0).toLocaleString("en-IN")}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {new Date(
                order.updatedAt || order.createdAt
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  </div>
);
}
