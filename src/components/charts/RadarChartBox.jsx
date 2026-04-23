import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from "recharts";

const data = [
  { subject: "Jan", A: 80, B: 50, C: 20 },
  { subject: "Feb", A: 60, B: 70, C: 30 },
  { subject: "Mar", A: 40, B: 20, C: 60 },
  { subject: "Apr", A: 70, B: 40, C: 50 },
];

export default function RadarChartBox() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />

        <Radar dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.4} />
        <Radar dataKey="B" stroke="#F4A62A" fill="#F4A62A" fillOpacity={0.4} />
        <Radar dataKey="C" stroke="#EF5350" fill="#EF5350" fillOpacity={0.4} />
      </RadarChart>
    </ResponsiveContainer>
  );
}