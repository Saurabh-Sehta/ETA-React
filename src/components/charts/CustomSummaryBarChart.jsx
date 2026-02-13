import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomSummaryBarChart = ({ data }) => {

  // Custom Tooltip
  const CustomToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;

      return (
        <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            {item.monthYear}
          </p>

          <p className="text-xs text-orange-600 font-semibold">
            Income: ₹{item.totalIncome}
          </p>

          <p className="text-xs text-red-600 font-semibold">
            Expense: ₹{item.totalExpense}
          </p>

          <p className="text-xs text-purple-600 font-semibold">
            Savings: ₹{item.totalBalance}
          </p>
        </div>
      );
    }
    return null;
  };

  // Add formatted monthYear field
  const formattedData = data.map((item) => ({
    ...item,
    monthYear: item.monthYear,
  }));

  return (
    <div className="bg-white mt-6 p-4 rounded-xl shadow-sm">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={formattedData} key={JSON.stringify(formattedData)}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="monthYear"
            tick={{ fontSize: 12, fill: "#555" }}
          />

          <YAxis tick={{ fontSize: 12, fill: "#555" }} />

          <Tooltip content={<CustomToolTip />} />

          <Legend />

          {/* Stacked Bars */}
          <Bar
            dataKey="totalIncome"
            stackId="a"
            fill="#FF6900"
            radius={[6, 6, 0, 0]}
            name="Total Income"
          />

          <Bar
            dataKey="totalExpense"
            stackId="a"
            fill="#FA2C37"
            name="Total Expense"
          />

          <Bar
            dataKey="totalBalance"
            stackId="a"
            fill="#875CF5"
            name="Total Savings"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomSummaryBarChart;