import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Delivered", value: 58, color: "#06b6d4" },
  { name: "Shipped", value: 24, color: "#6366f1" },
  { name: "Pending", value: 18, color: "#f59e0b" },
  { name: "Cancelled", value: 7, color: "#ef4444" },
];

export default function OrderStatusChart({ segments = data }) {
  return (
    <div className="admin-panel h-full p-6">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
        Order Status Split
      </h2>
      <p className="mt-1 text-sm text-slate-500">Current fulfillment distribution</p>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={segments} dataKey="value" nameKey="name" outerRadius={85}>
              {segments.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-3 text-xs">
        {segments.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full inline-block"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}
