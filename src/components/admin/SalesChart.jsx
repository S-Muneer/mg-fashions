import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold text-slate-900">
          {payload[0].payload.day}
        </p>
        <p className="text-sm font-bold text-cyan-700">
          Rs {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const SalesChart = ({
  series = [],
  title = "Weekly Sales",
  subtitle = "Revenue trend",
}) => {
  if (!series || series.length === 0) {
    return (
      <div className="admin-panel h-full p-6">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-8 flex items-center justify-center h-64 bg-slate-50 rounded-xl">
          <p className="text-sm text-slate-500">No data available</p>
        </div>
      </div>
    );
  }

  const formattedData = series.map((item) => ({
    ...item,
    sales: Number(item.sales) || 0,
  }));

  const maxSales = Math.max(...formattedData.map((d) => d.sales), 1);
  const totalSales = formattedData.reduce((sum, d) => sum + d.sales, 0);
  const avgSales =
    formattedData.length > 0
      ? Math.round(totalSales / formattedData.length)
      : 0;

  const getBarColor = (value) => {
    const percentage = (value / maxSales) * 100;
    if (percentage === 0) return "#cbd5e1";
    if (percentage < 25) return "#fca5a5";
    if (percentage < 50) return "#fdba74";
    if (percentage < 75) return "#a7f3d0";
    return "#06b6d4";
  };
  const isMobile = window.innerWidth < 640;
  return (
    <div className="admin-panel h-full p-6">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Total Revenue
          </p>
          <p className="text-xl sm:text-2xl font-bold text-cyan-700 mt-1">
            Rs {totalSales.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-4 rounded-xl border border-cyan-200">
          <p className="text-lg sm:text-2xl font-bold text-cyan-700 mt-1">
            Total
          </p>
          <p className="text-2xl font-bold text-cyan-700 mt-1">
            Rs {totalSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
          <p className="text-xs text-slate-600 uppercase font-semibold">
            Average
          </p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            Rs {avgSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600 uppercase font-semibold">Days</p>
          <p className="text-2xl font-bold text-slate-700 mt-1">
            {formattedData.length}
          </p>
        </div>
      </div>

      <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              angle={isMobile ? -30 : 0}
              textAnchor="end"
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `Rs ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(6, 182, 212, 0.08)" }}
            />
            <Bar dataKey="sales" radius={[8, 8, 0, 0]} isAnimationActive={true}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.sales)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
