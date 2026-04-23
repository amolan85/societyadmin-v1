import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Approved", value: 35 },
  { name: "In Progress", value: 20 },
  { name: "Pending", value: 20 },
  { name: "Rejected", value: 15 },
  { name: "Review", value: 10 },
];

const COLORS = ["#6C63FF", "#42A5F5", "#F4A62A", "#EF5350", "#9C27B0"];

export default function PieChartBox() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} innerRadius={60} outerRadius={90} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}