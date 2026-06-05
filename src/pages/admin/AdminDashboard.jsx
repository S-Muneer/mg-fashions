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

  const loadStats = useCallback(
    async (filters = {}) => {
      const data = await getAdminStats(filters);
      setStats(data);
      setError("");
      setLastUpdated(new Date());
    },
    []
  );

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
      ...((stats.salesByDay || []).map((r) => [r.day, String(r.sales || 0)])),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""') }"`).join(",")).join("\n");
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

  const cards = [
    {
      label: "Products",
      value: String(stats.totals.products),
      detail: "Active listings",
      tone: "from-cyan-500 to-teal-600",
    },
    {
      label: "Orders",
      value: String(stats.totals.orders),
      detail: `${stats.totals.pending} pending`,
      tone: "from-indigo-500 to-violet-600",
    },
    {
      label: "Revenue",
      value: `Rs ${Math.round(stats.totals.revenue || 0).toLocaleString("en-IN")}`,
      detail: "All non-cancelled orders",
      tone: "from-emerald-500 to-emerald-700",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] admin-banner p-6 sm:p-8 shadow-2xl text-slate-900">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-800 font-semibold">Store Pulse</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-950">
              Dashboard Performance
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-700/90">
              Track store activity, monitor order fulfillment, and react quickly to inventory demand.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/90 p-4 text-slate-900 shadow-lg">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Wallet</p>
              <p className="mt-3 text-2xl font-bold">{Math.round(stats.totals.revenue || 0).toLocaleString("en-IN")}</p>
              <p className="text-xs text-slate-500 mt-1">Total sales</p>
            </div>
            <div className="rounded-3xl bg-white/90 p-4 text-slate-900 shadow-lg">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Orders</p>
              <p className="mt-3 text-2xl font-bold">{stats.totals.orders}</p>
              <p className="text-xs text-slate-500 mt-1">Orders processed</p>
            </div>
            <div className="rounded-3xl bg-white/90 p-4 text-slate-900 shadow-lg">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Stock</p>
              <p className="mt-3 text-2xl font-bold">{stats.totals.products}</p>
              <p className="text-xs text-slate-500 mt-1">Active listings</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600">Range:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
            >
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {period === "custom" && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600">From</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border px-2 py-1 text-sm" />
              <label className="text-xs text-slate-600">To</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md border px-2 py-1 text-sm" />
            </div>
          )}
          <div>
            <button onClick={applyFilters} className="site-primary-btn px-3 py-1">Apply</button>
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        {lastUpdated ? (
          <p className="mt-1 text-xs text-slate-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        ) : null}
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((item) => (
          <div
            key={item.label}
            className={`admin-status-card rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg shadow-slate-300/35 ${item.tone}`}
          >
            <p className="text-sm text-white/80">{item.label}</p>
            <p className="mt-2 text-2xl font-bold">{item.value}</p>
            <p className="mt-2 text-xs text-white/80">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Sales Overview</h3>
                <p className="text-sm text-slate-500">{period === 'custom' ? `${startDate || 'Start'} → ${endDate || 'End'}` : period}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={exportCsv} className="rounded-md border px-3 py-1 text-sm">Export CSV</button>
                <button onClick={() => { setPeriod('week'); applyFilters(); }} className="rounded-md bg-slate-900 text-white px-3 py-1 text-sm">Last 7d</button>
              </div>
            </div>
            <div className="mt-4">
              <SalesChart
                series={stats.salesByDay || defaultSales}
                title={`Sales (${period})`}
                subtitle={`Showing ${stats.salesByDay?.length || 0} data points`}
              />
            </div>
          </div>
        </div>
        <OrderStatusChart segments={stats.orderStatus || defaultStatus} />
      </div>

      <section className="admin-panel p-6">
        <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="py-2">Order #</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="py-4 text-slate-500">No recent orders</td></tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="py-3">{o.orderNumber}</td>
                    <td className="py-3">{o.customerName}</td>
                    <td className="py-3">Rs {Math.round(o.total).toLocaleString('en-IN')}</td>
                    <td className="py-3">{o.status}</td>
                    <td className="py-3">{new Date(o.updatedAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel p-6">
        <h3 className="text-lg font-semibold text-slate-900">Quick Notes</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Restock low-inventory denim jackets by Friday.
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Review pending COD orders older than 48 hours.
          </div>
        </div>
      </section>
    </div>
  );
}
