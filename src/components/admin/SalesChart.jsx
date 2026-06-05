import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 2100 },
  { day: "Wed", sales: 1800 },
  { day: "Thu", sales: 2600 },
  { day: "Fri", sales: 3200 },
  { day: "Sat", sales: 2400 },
  { day: "Sun", sales: 2800 },
];

const SalesChart = ({ series = data, title = "Weekly Sales", subtitle = "Revenue trend across this week" }) => {
  return (
    <div className="admin-panel h-full p-6">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

      <div className="mt-4">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={series}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#0f766e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
