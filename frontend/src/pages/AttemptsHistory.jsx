import { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import api from "../api";

function ScorePill({ score }) {
  const color = score >= 80 ? "#4ade80" : score >= 60 ? "#fbbf24" : "#f87171";
  const bg    = score >= 80 ? "#052e16" : score >= 60 ? "#1c1400" : "#2d0a0a";
  const border= score >= 80 ? "#14532d" : score >= 60 ? "#422006" : "#5f1d1d";
  return (
    <span style={{
      padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: 700,
      background: bg, border: `1px solid ${border}`, color,
    }}>
      {score}%
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      padding: "16px 20px", borderRadius: "14px",
      background: "#0f172a", border: "1px solid #1e293b", textAlign: "center",
    }}>
      <div style={{ fontSize: "26px", fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

export default function AttemptsHistory() {
  const [history, setHistory]               = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [error, setError]                   = useState("");
  const [loading, setLoading]               = useState(true);
  const [detailLoading, setDetailLoading]   = useState(false);
  const [search, setSearch]                 = useState("");
  const [diffFilter, setDiffFilter]         = useState("");
  const [scoreFilter, setScoreFilter]       = useState("");
  const [sortBy, setSortBy]                 = useState("newest");

  useEffect(() => {
    api("/attempts/history")
      .then((res) => setHistory(res.history || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const loadAttempt = async (attemptId) => {
    try {
      setDetailLoading(true);
      const res = await api(`/attempts/${attemptId}`);
      setSelectedAttempt(res.attempt || null);
      setSelectedAnswers(res.answers || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Summary stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const scores = history.map((h) => h.score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best = Math.max(...scores);
    const passed = history.filter((h) => h.score >= 80).length;
    const byDiff = history.reduce((acc, h) => {
      acc[h.difficulty] = (acc[h.difficulty] || 0) + 1;
      return acc;
    }, {});
    return { total: history.length, avg, best, passed, byDiff };
  }, [history]);

  // ── Filtered + sorted list ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...history];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((h) =>
        (h.subject || h.title || "").toLowerCase().includes(q) ||
        (h.sender_name || "").toLowerCase().includes(q)
      );
    }
    if (diffFilter) list = list.filter((h) => h.difficulty === diffFilter);
    if (scoreFilter === "passed")  list = list.filter((h) => h.score >= 80);
    if (scoreFilter === "average") list = list.filter((h) => h.score >= 60 && h.score < 80);
    if (scoreFilter === "failed")  list = list.filter((h) => h.score < 60);

    list.sort((a, b) => {
      if (sortBy === "newest")    return new Date(b.completed_at) - new Date(a.completed_at);
      if (sortBy === "oldest")    return new Date(a.completed_at) - new Date(b.completed_at);
      if (sortBy === "score-asc") return a.score - b.score;
      if (sortBy === "score-desc")return b.score - a.score;
      return 0;
    });
    return list;
  }, [history, search, diffFilter, scoreFilter, sortBy]);

  // ── Export CSV ───────────────────────────────────────────────────────────
  function exportCsv() {
    const headers = ["ID", "Subject", "Sender", "Difficulty", "Score", "Completed At"];
    const rows = history.map((h) => [
      h.id,
      `"${(h.subject || h.title || "").replace(/"/g, '""')}"`,
      `"${(h.sender_name || "").replace(/"/g, '""')}"`,
      h.difficulty,
      h.score,
      h.completed_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "attempts_history.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Layout title="Attempts History">
      {error && (
        <div style={{
          padding: "12px 16px", borderRadius: "10px", marginBottom: "16px",
          background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", fontSize: "13px",
        }}>
          {error}
        </div>
      )}

      {/* Summary stats */}
      {stats && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px", marginBottom: "24px",
        }}>
          <StatCard label="Total Attempts" value={stats.total}  color="#60a5fa" />
          <StatCard label="Average Score"  value={`${stats.avg}%`} color="#fbbf24" />
          <StatCard label="Best Score"     value={`${stats.best}%`} color="#4ade80" />
          <StatCard label="Passed (≥80%)"  value={stats.passed} color="#34d399" />
        </div>
      )}

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.1fr 0.9fr" }}>

        {/* Left — list */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "18px", padding: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>Completed Attempts</div>
              <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "2px" }}>
                {filtered.length} of {history.length} shown
              </div>
            </div>
            {history.length > 0 && (
              <button onClick={exportCsv} style={{
                padding: "7px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 600,
                border: "1px solid #334155", background: "#1e293b", color: "#94a3b8", cursor: "pointer",
              }}>
                ⬇ Export CSV
              </button>
            )}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                flex: "1 1 160px", padding: "8px 12px", borderRadius: "10px",
                border: "1px solid #334155", background: "#020617", color: "#e2e8f0",
                fontSize: "13px", outline: "none",
              }}
            />
            <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)} style={{
              padding: "8px 10px", borderRadius: "10px", fontSize: "13px",
              border: "1px solid #334155", background: "#020617", color: "#e2e8f0",
            }}>
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} style={{
              padding: "8px 10px", borderRadius: "10px", fontSize: "13px",
              border: "1px solid #334155", background: "#020617", color: "#e2e8f0",
            }}>
              <option value="">All Scores</option>
              <option value="passed">Passed (≥80%)</option>
              <option value="average">Average (60–79%)</option>
              <option value="failed">Failed (&lt;60%)</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
              padding: "8px 10px", borderRadius: "10px", fontSize: "13px",
              border: "1px solid #334155", background: "#020617", color: "#e2e8f0",
            }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
            </select>
          </div>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "560px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ color: "#94a3b8", fontSize: "13px" }}>Loading attempts...</div>
            ) : filtered.length === 0 ? (
              <div style={{ color: "#94a3b8", fontSize: "13px" }}>No attempts match the current filters.</div>
            ) : filtered.map((attempt) => (
              <button
                key={attempt.id}
                onClick={() => loadAttempt(attempt.id)}
                style={{
                  width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: "14px",
                  border: selectedAttempt?.id === attempt.id ? "1px solid #22d3ee" : "1px solid #1e293b",
                  background: selectedAttempt?.id === attempt.id ? "#0e3a5a" : "#020617",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#f8fafc", fontSize: "13px" }}>
                      {attempt.subject || attempt.title}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>
                      {attempt.sender_name} · {attempt.difficulty}
                    </div>
                    <div style={{ color: "#475569", fontSize: "11px", marginTop: "4px" }}>
                      {attempt.completed_at?.slice(0, 16).replace("T", " ")}
                    </div>
                  </div>
                  <ScorePill score={attempt.score} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — detail */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "18px", padding: "20px",
        }}>
          <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc", marginBottom: "4px" }}>
            Attempt Details
          </div>
          <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "16px" }}>
            Select an attempt to review your answers and feedback
          </div>

          {detailLoading ? (
            <div style={{ color: "#94a3b8", fontSize: "13px" }}>Loading...</div>
          ) : !selectedAttempt ? (
            <div style={{
              padding: "32px", borderRadius: "14px", textAlign: "center",
              background: "#020617", border: "1px solid #1e293b", color: "#475569",
            }}>
              Click any attempt on the left to review it
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "680px", overflowY: "auto" }}>

              {/* Attempt summary */}
              <div style={{
                padding: "16px", borderRadius: "14px",
                background: "#020617", border: "1px solid #1e293b",
              }}>
                <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "15px" }}>
                  {selectedAttempt.subject || selectedAttempt.title}
                </div>
                <div style={{ color: "#64748b", fontSize: "12px", marginTop: "6px" }}>
                  {selectedAttempt.sender_name} · {selectedAttempt.sender_email}
                </div>
                <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                  Difficulty: {selectedAttempt.difficulty}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <ScorePill score={selectedAttempt.score} />
                </div>
                {selectedAttempt.explanation && (
                  <div style={{
                    marginTop: "12px", padding: "12px", borderRadius: "10px",
                    background: "#0f172a", border: "1px solid #1e293b",
                    color: "#94a3b8", fontSize: "13px", lineHeight: 1.6,
                  }}>
                    💡 {selectedAttempt.explanation}
                  </div>
                )}
              </div>

              {/* Per-question results */}
              {selectedAnswers.map((answer, index) => (
                <div
                  key={`${answer.question_id}-${index}`}
                  style={{
                    padding: "16px", borderRadius: "14px",
                    background: answer.is_correct ? "#052e16" : "#2d0a0a",
                    border: `1px solid ${answer.is_correct ? "#14532d" : "#5f1d1d"}`,
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#f8fafc", fontSize: "13px", marginBottom: "10px" }}>
                    Q{index + 1}: {answer.question_text}
                  </div>

                  <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                    <span style={{ color: "#64748b" }}>Your answer: </span>
                    <span style={{ color: answer.is_correct ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                      {answer.selected_choice}
                    </span>
                  </div>

                  {!answer.is_correct && (
                    <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                      <span style={{ color: "#64748b" }}>Correct answer: </span>
                      <span style={{ color: "#4ade80", fontWeight: 600 }}>{answer.correct_choice}</span>
                    </div>
                  )}

                  <div style={{ fontSize: "13px", marginBottom: "10px" }}>
                    <span style={{ color: answer.is_correct ? "#4ade80" : "#f87171", fontWeight: 700 }}>
                      {answer.is_correct ? "✅ Correct" : "❌ Incorrect"}
                    </span>
                  </div>

                  {/* Red flags */}
                  {answer.red_flags && (
                    <div>
                      <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Red Flags
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {String(answer.red_flags).split(",").map((flag, fi) => (
                          <span key={fi} style={{
                            padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600,
                            background: "#1c1400", border: "1px solid #422006", color: "#fbbf24",
                          }}>
                            {flag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
