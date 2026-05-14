"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function RevenueChart({
  data
}: {
  data: any[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">
        Doanh thu theo tháng
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#000"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}