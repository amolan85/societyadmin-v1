import { useState, useEffect } from 'react'
import "../../styles/polls.css"
import { Badge } from '../../components/Common/ReusableFunction';
// import { getPollAnalyticsApi } from '../../services/PollApi'; // TODO: re-enable once backend endpoint is ready
import { toast } from "react-toastify";
import {
    FiArrowLeft,
    FiDownload,
    FiUsers,
    FiClock,
    FiCheckCircle,
} from "react-icons/fi";
import { BiPieChartAlt2 } from 'react-icons/bi';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Colors cycled across poll options in charts/legend
const OPTION_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444", "#06b6d4"];

// ---- TEMPORARY HARDCODED DATA (remove once getPollAnalyticsApi is wired up) ----
const MOCK_POLL = {
    poll_id: 9,
    question: "Should we install CCTV cameras",
    status: "ACTIVE",
    start_datetime: "2026-03-17 14:23:52",
    expiry_datetime: "2027-03-17 14:23:52",
    total_eligible_voters: 86,
    options: [
        { id: 97, text: "Yes", votes: 42 },
        { id: 98, text: "No", votes: 11 },
        { id: 99, text: "Discuss in meeting", votes: 7 },
    ],
    votes_over_time: [
        { date: "01 Jun", votes: 4 },
        { date: "06 Jun", votes: 9 },
        { date: "11 Jun", votes: 15 },
        { date: "16 Jun", votes: 22 },
        { date: "21 Jun", votes: 31 },
        { date: "26 Jun", votes: 45 },
        { date: "30 Jun", votes: 60 },
    ],
    peak_day: { date: "2026-06-26", votes: 14 },
    peak_time: "6:00 PM - 8:00 PM",
};
// ---------------------------------------------------------------------------

/**
 * PollAnalytics
 *
 * Props:
 *  - pollId: id of the poll to show analytics for
 *  - setActive: navigation setter to switch screens (e.g. back to "polls" list)
 *
 * Expected API shape from getPollAnalyticsApi(pollId) -> { data: {...}, success, message }
 * data: {
 *   poll_id, question, status, start_datetime, expiry_datetime,
 *   total_votes, total_eligible_voters,           // for participation %
 *   options: [{ id, text, votes }],
 *   votes_over_time: [{ date: "2026-06-01", votes: 12 }, ...],  // optional, for trend chart
 *   peak_day: { date, votes },                      // optional
 *   peak_time: "6:00 PM - 8:00 PM",                  // optional
 * }
 *
 * If votes_over_time / peak_day / peak_time are not returned by the backend yet,
 * this component gracefully hides those sections instead of crashing.
 */
const PollAnalytics = ({ pollId, setActive }) => {
    const [loading, setLoading] = useState(true);
    const [poll, setPoll] = useState(null);

    useEffect(() => {
        if (pollId) fetchAnalytics(pollId);
    }, [pollId]);

    const fetchAnalytics = async (id) => {
        setLoading(true);
        try {
            // TODO: switch back to the real API once backend endpoint is ready:
            // const res = await getPollAnalyticsApi(id);
            // const data = Array.isArray(res) ? null : (res?.poll_id ? res : res?.data) || null;
            // setPoll(data);

            // ---- using hardcoded mock data for now ----
            await new Promise((r) => setTimeout(r, 300)); // fake loading delay
            setPoll({ ...MOCK_POLL, poll_id: id ?? MOCK_POLL.poll_id });
        } catch (error) {
            console.error("Error fetching poll analytics:", error);
            toast.error("Failed to load poll analytics");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!poll) return;
        const rows = [
            ["Option", "Votes", "Percentage"],
            ...poll.options.map((o) => [
                o.text,
                o.votes,
                `${getOptionPercent(o.votes)}%`,
            ]),
        ];
        const csv = rows.map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `poll-${poll.poll_id}-analytics.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getTotalVotes = () =>
        poll?.options?.reduce((sum, o) => sum + (o.votes || 0), 0) || 0;

    const getOptionPercent = (votes) => {
        const total = getTotalVotes();
        if (!total) return 0;
        return Math.round((votes / total) * 100);
    };

    const getParticipationRate = () => {
        const eligible = poll?.total_eligible_voters;
        const total = getTotalVotes();
        if (!eligible) return 0;
        return Math.round((total / eligible) * 100);
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "ACTIVE":
                return "green";
            case "UPCOMING":
                return "orange";
            case "EXPIRED":
                return "red";
            default:
                return "gray";
        }
    };

    const getLeadingOption = () => {
        if (!poll?.options?.length) return null;
        return [...poll.options].sort((a, b) => (b.votes || 0) - (a.votes || 0))[0];
    };

    const pieData =
        poll?.options?.map((o) => ({ name: o.text, value: o.votes || 0 })) || [];

    const hasTrendData = Array.isArray(poll?.votes_over_time) && poll.votes_over_time.length > 0;

    if (loading) {
        return (
            <div className="pg pl-wrap" style={{ textAlign: "center", padding: "60px 0" }}>
                <p className="tx-muted">Loading analytics...</p>
            </div>
        );
    }

    if (!poll) {
        return (
            <div className="pg pl-wrap" style={{ textAlign: "center", padding: "60px 0" }}>
                <p className="tx-muted mb-3">Could not load analytics for this poll.</p>
                <button className="btn-ol" onClick={() => setActive("polls")}>
                    <FiArrowLeft size={14} style={{ marginRight: 6 }} /> Back to Polls
                </button>
            </div>
        );
    }

    const totalVotes = getTotalVotes();
    const leadingOption = getLeadingOption();
    const participationRate = getParticipationRate();

    return (
        <div className="pg pl-wrap">

            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 20,
                }}
            >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div
                        style={{
                            background: "#dcfce7",
                            borderRadius: 10,
                            width: 42,
                            height: 42,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <BiPieChartAlt2 size={20} color="#16a34a" />
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <h4 className="mb-0" style={{ fontWeight: 600, fontSize: 20 }}>
                            Poll Analytics
                        </h4>
                        <p className="tx-muted mb-0" style={{ fontSize: 13 }}>
                            {poll.question}
                        </p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        className="btn-ol"
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                        onClick={() => setActive("polls")}
                    >
                        <FiArrowLeft size={14} /> Back to Polls
                    </button>
                    <button
                        className="btn-ac"
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                        onClick={handleExport}
                    >
                        <FiDownload size={14} /> Export Report
                    </button>
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="sv-card p-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <FiUsers size={16} color="#3b82f6" />
                            <span className="tx-muted" style={{ fontSize: 13 }}>Total Votes</span>
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700 }}>{totalVotes}</div>
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="sv-card p-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <BiPieChartAlt2 size={16} color="#a855f7" />
                            <span className="tx-muted" style={{ fontSize: 13 }}>Participation</span>
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700 }}>
                            {poll.total_eligible_voters ? `${participationRate}%` : "—"}
                        </div>
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="sv-card p-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <FiCheckCircle size={16} color="#16a34a" />
                            <span className="tx-muted" style={{ fontSize: 13 }}>Status</span>
                        </div>
                        <Badge
                            label={poll.status === "ACTIVE" ? "Active" : poll.status === "UPCOMING" ? "Upcoming" : "Expired"}
                            c={getStatusBadgeColor(poll.status)}
                        />
                    </div>
                </div>

                <div className="col-6 col-md-3">
                    <div className="sv-card p-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <FiClock size={16} color="#f59e0b" />
                            <span className="tx-muted" style={{ fontSize: 13 }}>
                                {poll.status === "EXPIRED" ? "Ended On" : "Ends On"}
                            </span>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>
                            {formatDate(poll.expiry_datetime)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">

                {/* LEFT: trend + breakdown table */}
                <div className="col-12 col-lg-8">

                    {hasTrendData && (
                        <div className="sv-card p-3 mb-4">
                            <h6 className="pl-side-title text-start mb-3">Votes Over Time</h6>
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={poll.votes_over_time}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="votes"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="sv-card p-3">
                        <h6 className="pl-side-title text-start mb-3">Option-wise Breakdown</h6>

                        {poll.options.map((o, i) => {
                            const pct = getOptionPercent(o.votes);
                            const color = OPTION_COLORS[i % OPTION_COLORS.length];
                            return (
                                <div key={o.id ?? i} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 14 }}>
                                        <span style={{ fontWeight: 500 }}>
                                            {o.text}
                                            {leadingOption?.text === o.text && totalVotes > 0 && (
                                                <span
                                                    className="tx-success"
                                                    style={{ fontSize: 11, marginLeft: 8 }}
                                                >
                                                    Leading
                                                </span>
                                            )}
                                        </span>
                                        <span className="tx-muted">
                                            {o.votes} votes • {pct}%
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            height: 8,
                                            borderRadius: 6,
                                            background: "#f1f5f9",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${pct}%`,
                                                height: "100%",
                                                background: color,
                                                borderRadius: 6,
                                                transition: "width .3s ease",
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {totalVotes === 0 && (
                            <p className="tx-muted mb-0" style={{ fontSize: 13 }}>
                                No votes have been cast on this poll yet.
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT: distribution donut + insights */}
                <div className="col-12 col-lg-4">

                    <div className="sv-card p-3 mb-3">
                        <h6 className="pl-side-title text-start mb-2">Vote Distribution</h6>

                        {totalVotes > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={55}
                                            outerRadius={85}
                                            paddingAngle={2}
                                        >
                                            {pieData.map((_, i) => (
                                                <Cell
                                                    key={`cell-${i}`}
                                                    fill={OPTION_COLORS[i % OPTION_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="d-flex flex-column gap-2 mt-2">
                                    {poll.options.map((o, i) => (
                                        <div
                                            key={o.id ?? i}
                                            className="d-flex justify-content-between align-items-center"
                                            style={{ fontSize: 13 }}
                                        >
                                            <span className="d-flex align-items-center gap-2">
                                                <span
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        background: OPTION_COLORS[i % OPTION_COLORS.length],
                                                        display: "inline-block",
                                                    }}
                                                />
                                                {o.text}
                                            </span>
                                            <span className="tx-muted">
                                                {o.votes} ({getOptionPercent(o.votes)}%)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="tx-muted mb-0" style={{ fontSize: 13 }}>
                                No data to display yet.
                            </p>
                        )}
                    </div>

                    {(poll.peak_day || poll.peak_time) && (
                        <div className="sv-card p-3">
                            <h6 className="pl-side-title text-start mb-2">
                                <HiOutlineLightningBolt className="me-2 text-warning" size={16} />
                                Engagement Insights
                            </h6>

                            {poll.peak_day && (
                                <div className="mb-2">
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>Highest Participation Day</div>
                                    <div className="tx-muted" style={{ fontSize: 12 }}>
                                        {formatDate(poll.peak_day.date)} ({poll.peak_day.votes} votes)
                                    </div>
                                </div>
                            )}

                            {poll.peak_time && (
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>Most Active Time</div>
                                    <div className="tx-muted" style={{ fontSize: 12 }}>{poll.peak_time}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PollAnalytics;
