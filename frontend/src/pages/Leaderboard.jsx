import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";

function RankBadge({ rank }) {
  if (rank === 1) return <span style={{ fontSize: "24px" }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: "24px" }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: "24px" }}>🥉</span>;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: "32px", height: "32px", borderRadius: "50%",
      background: "#1e293b", border: "1px solid #334155",
      color: "#94a3b8", fontWeight: 700, fontSize: "13px",
    }}>
      {rank}
    </span>
  );
}

function PointsBar({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ height: "6px", borderRadius: "999px", background: "#1e293b", overflow: "hidden", flex: 1 }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: "linear-gradient(90deg, #0e7490, #22d3ee)",
        borderRadius: "999px", transition: "width 0.6s ease",
      }} />
    </div>
  );
}

function StatChip({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myStats, setMyStats]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [filter, setFilter]           = useState("points");

  useEffect(() => {
    Promise.all([
      api("/leaderboard"),
      api("/leaderboard/me"),
    ])
      .then(([lb, me]) => {
        setLeaderboard(lb.leaderboard || []);
        setMyStats(me);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...leaderboard].sort((a, b) => {
    if (filter === "points")  return b.totalPoints - a.totalPoints;
    if (filter === "score")   return b.averageScore - a.averageScore;
    if (filter === "modules") return b.modulesCompleted - a.modulesCompleted;
    if (filter === "sims")    return b.simulationsCompleted - a.simulationsCompleted;
    return 0;
  }).map((r, i) => ({ ...r, displayRank: i + 1 }));

  const maxPoints = sorted.length > 0 ? sorted[0].totalPoints : 1;

  return (
    <Layout title="Leaderboard">
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* My rank card */}
        {myStats && (
          <div style={{
            background: "linear-gradient(135deg, #0e3a5a 0%, #0f172a 100%)",
            border: "1px solid #22d3ee", borderRadius: "18px",
            padding: "24px", marginBottom: "24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "13px", color: "#67e8f9", fontWeight: 600, marginBottom: "6px" }}>
                  YOUR RANKING
                </div>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "#f8fafc" }}>
                  {myStats.rank ? `#${myStats.rank}` : "Unranked"}
                  <span style={{ fontSize: "16px", color: "#94a3b8", fontWeight: 400, marginLeft: "8px" }}>
                    of {myStats.totalUsers} users
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
                <StatChip label="Total Points"  value={myStats.total_points  || 0} color="#22d3ee" />
                <StatChip label="Avg Score"     value={`${myStats.average_score || 0}%`} color="#fbbf24" />
                <StatChip label="Best Score"    value={`${myStats.best_score    || 0}%`} color="#4ade80" />
                <StatChip label="Modules Done"  value={myStats.modules_completed  || 0} color="#a78bfa" />
                <StatChip label="Sims Done"     value={myStats.simulations_completed || 0} color="#f472b6" />
                {myStats.certified ? (
                  <div style={{
                    padding: "8px 14px", borderRadius: "12px",
                    background: "#052e16", border: "1px solid #14532d",
                    color: "#4ade80", fontWeight: 700, fontSize: "13px",
                  }}>
                    🎓 Certified
                  </div>
                ) : null}
              </div>
            </div>

            {/* Points breakdown hint */}
            <div style={{ marginTop: "16px", color: "#475569", fontSize: "12px" }}>
              Points: Simulations ×10 + Avg Score + Modules ×5 + Certificate +50
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: "10px", marginBottom: "16px",
            background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", fontSize: "13px",
          }}>
            {error}
          </div>
        )}

        {/* Sort controls */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px",
          padding: "14px 18px", marginBottom: "20px",
          display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center",
        }}>
          <span style={{ color: "#64748b", fontSize: "13px", marginRight: "4px" }}>Sort by:</span>
          {[
            { key: "points",  label: "🏆 Total Points" },
            { key: "score",   label: "🎯 Avg Score" },
            { key: "modules", label: "📖 Modules" },
            { key: "sims",    label: "🔍 Simulations" },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
              border: filter === f.key ? "1px solid #22d3ee" : "1px solid #334155",
              background: filter === f.key ? "#0e3a5a" : "#1e293b",
              color: filter === f.key ? "#22d3ee" : "#94a3b8", cursor: "pointer",
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Leaderboard table */}
        {loading ? (
          <div style={{ color: "#94a3b8", padding: "20px" }}>Loading leaderboard...</div>
        ) : sorted.length === 0 ? (
          <div style={{
            padding: "40px", borderRadius: "18px", textAlign: "center",
            background: "#0f172a", border: "1px solid #1e293b", color: "#475569",
          }}>
            No users on the leaderboard yet. Complete some simulations and modules to appear here!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sorted.map((entry) => (
              <div
                key={entry.userId}
                style={{
                  padding: "16px 20px", borderRadius: "16px",
                  background: entry.isCurrentUser
                    ? "linear-gradient(135deg, #0e3a5a 0%, #0f172a 100%)"
                    : "#0f172a",
                  border: entry.isCurrentUser
                    ? "1px solid #22d3ee"
                    : entry.displayRank <= 3
                    ? "1px solid #334155"
                    : "1px solid #1e293b",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top 3 glow strip */}
                {entry.displayRank <= 3 && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                    background: entry.displayRank === 1
                      ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                      : entry.displayRank === 2
                      ? "linear-gradient(90deg, #94a3b8, #cbd5e1)"
                      : "linear-gradient(90deg, #b45309, #d97706)",
                  }} />
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>

                  {/* Rank */}
                  <div style={{ minWidth: "36px", textAlign: "center" }}>
                    <RankBadge rank={entry.displayRank} />
                  </div>

                  {/* Name + points bar */}
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontWeight: 700, color: entry.isCurrentUser ? "#22d3ee" : "#f8fafc", fontSize: "14px" }}>
                        {entry.displayName}
                      </span>
                      {entry.isCurrentUser && (
                        <span style={{
                          padding: "2px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700,
                          background: "#0e3a5a", border: "1px solid #22d3ee", color: "#22d3ee",
                        }}>YOU</span>
                      )}
                      {entry.certified && (
                        <span style={{
                          padding: "2px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700,
                          background: "#052e16", border: "1px solid #14532d", color: "#4ade80",
                        }}>🎓 Certified</span>
                      )}
                      {entry.outsideTop50 && (
                        <span style={{
                          padding: "2px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700,
                          background: "#1e293b", border: "1px solid #334155", color: "#94a3b8",
                        }}>Outside Top 50</span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <PointsBar value={entry.totalPoints} max={maxPoints} />
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#22d3ee", whiteSpace: "nowrap" }}>
                        {entry.totalPoints} pts
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <StatChip label="Avg Score"  value={`${entry.averageScore}%`}       color="#fbbf24" />
                    <StatChip label="Best"       value={`${entry.bestScore}%`}           color="#4ade80" />
                    <StatChip label="Sims"       value={entry.simulationsCompleted}      color="#f472b6" />
                    <StatChip label="Modules"    value={entry.modulesCompleted}          color="#a78bfa" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Points system explanation */}
        <div style={{
          marginTop: "24px", padding: "20px", borderRadius: "14px",
          background: "#0f172a", border: "1px solid #1e293b",
        }}>
          <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: "12px" }}>
            🏆 How Points Are Calculated
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[
              { label: "Each Simulation Completed", points: "+10 pts", color: "#f472b6" },
              { label: "Average Score",             points: "+1 pt per %", color: "#fbbf24" },
              { label: "Each Module Completed",     points: "+5 pts", color: "#a78bfa" },
              { label: "Completion Certificate",    points: "+50 pts", color: "#4ade80" },
            ].map((item) => (
              <div key={item.label} style={{
                padding: "12px 14px", borderRadius: "10px",
                background: "#020617", border: "1px solid #1e293b",
              }}>
                <div style={{ fontWeight: 700, color: item.color, fontSize: "13px" }}>{item.points}</div>
                <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
