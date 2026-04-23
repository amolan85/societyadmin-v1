// src/components/charts/BarChartBox.jsx
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const data = [
  { name: "Jan", approved: 54, pending: 23, rejected: 48 },
  { name: "Feb", approved: 28, pending: 25, rejected: 10 },
  { name: "Mar", approved: 55, pending: 56, rejected: 38 },
  { name: "Apr", approved: 59, pending: 98, rejected: 52 },
  { name: "May", approved: 98, pending: 52, rejected: 93 },
];

export default function BarChartBox() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="approved" fill="#6C63FF" radius={[5,5,0,0]} />
        <Bar dataKey="pending" fill="#F4A62A" radius={[5,5,0,0]} />
        <Bar dataKey="rejected" fill="#EF5350" radius={[5,5,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}