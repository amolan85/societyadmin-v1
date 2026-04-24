import React from 'react'
import "../styles/Sidebar.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PieChart, Pie, Cell
} from "recharts";

const Dashboard = () => {
  const barData = [
    { name: "Jan", approved: 54, pending: 23, rejected: 48 },
    { name: "Feb", approved: 28, pending: 25, rejected: 10 },
    { name: "Mar", approved: 55, pending: 56, rejected: 38 },
    { name: "Apr", approved: 59, pending: 98, rejected: 52 },
    { name: "May", approved: 98, pending: 52, rejected: 93 },
  ];

  const radarData = [
    { subject: "Jan", A: 80, B: 50, C: 20 },
    { subject: "Feb", A: 60, B: 70, C: 30 },
    { subject: "Mar", A: 40, B: 20, C: 60 },
    { subject: "Apr", A: 70, B: 40, C: 50 },
  ];

  const pieData = [
    { name: "Approved", value: 35 },
    { name: "In Progress", value: 20 },
    { name: "Pending", value: 20 },
    { name: "Rejected", value: 15 },
    { name: "Review", value: 10 },
  ];
  const COLORS = ["#6C63FF", "#42A5F5", "#F4A62A", "#EF5350", "#9C27B0"];

  return (
    <>


      <div style={{ padding: 20 }}>
        <h3 className='text-start fw-bold'>Welcome Back!</h3>
        <h6 className='text-start fw-bold text-dark'>Your Overview Statistics</h6>


        <div className="">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 12, alignItems: 'center' }}>

            {/* SEARCH */}
            <div className="searchInput" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#aaa' }}>🔍</span>
              <span style={{ fontSize: 13, color: '#aaa' }}>Start searching here</span>
            </div>

            {/* CARD 1 */}
            <div className="statCard text-start">
              <p style={{ fontSize: 14, color: '#888', margin: '0 0 4px 0' }}>Active Complaints</p>
              <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>14</p>
            </div>

            {/* CARD 2 */}
            <div className="statCard text-start">
              <p style={{ fontSize: 14, color: '#888', margin: '0 0 4px 0' }}>Visits</p>
              <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>3,671</p>
            </div>

            {/* CARD 3 */}
            <div className="statCard text-start">
              <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px 0' }}>Pending Approvals</p>
              <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>156</p>
            </div>

            {/* CARD 4 */}
            <div className="statCard text-start">
              <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px 0' }}>Staff Present</p>
              <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>48/50</p>
            </div>

          </div>

        </div>
        {/* SEARCH */}
        {/* <div className='cardStyle'>🔍 Start searching here</div> */}

        {/* STATS */}
        {/* <div className='statsGrid'>
          <Stat title="Active Complaints" value="14" />
          <Stat title="Visits" value="3,671" />
          <Stat title="Pending Approvals" value="156" />
          <Stat title="Staff Present" value="48/50" />
        </div> */}

        {/* CHARTS */}
        <div className='chartGrid'>
          <Card>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="#6C63FF" />
                <Bar dataKey="pending" fill="#F4A62A" />
                <Bar dataKey="rejected" fill="#EF5350" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.4} />
                <Radar dataKey="B" stroke="#F4A62A" fill="#F4A62A" fillOpacity={0.4} />
                <Radar dataKey="C" stroke="#EF5350" fill="#EF5350" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* BOTTOM */}
        <div className='chartGrid'>
          <Card>Tenant Agreement Verification</Card>

          <Card>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={90} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Dashboard

function Stat({ title, value }) {
  return (
    <div className='cardStyle'>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Card({ children }) {
  return <div className='cardStyle'>{children}</div>;
}