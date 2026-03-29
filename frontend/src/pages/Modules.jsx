import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api";

const CATEGORY_COLORS = {
  "Email Security":      { bg: "#0c1a2e", border: "#1e3a5f", text: "#60a5fa" },
  "Identity Protection": { bg: "#1a0c2e", border: "#3b1f5f", text: "#c084fc" },
  "Authentication":      { bg: "#0c2e1a", border: "#1f5f3b", text: "#34d399" },
  "Mobile Security":     { bg: "#2e1a0c", border: "#5f3b1f", text: "#fb923c" },
  "Voice Security":      { bg: "#2e0c1a", border: "#5f1f3b", text: "#f472b6" },
  "Physical Security":   { bg: "#2e2a0c", border: "#5f551f", text: "#fbbf24" },
  "Web Security":        { bg: "#0c2e2e", border: "#1f5f5f", text: "#22d3ee" },
  "Malware":             { bg: "#2e0c0c", border: "#5f1f1f", text: "#f87171" },
  "Human Factors":       { bg: "#1a2e0c", border: "#3b5f1f", text: "#a3e635" },
  "Network Security":    { bg: "#0c1a2e", border: "#1f3b5f", text: "#38bdf8" },
  "Data Security":       { bg: "#2e1a0c", border: "#5f3b1f", text: "#fdba74" },
  "Emerging Threats":    { bg: "#1a0c2e", border: "#3b1f5f", text: "#e879f9" },
  "General":             { bg: "#0f172a", border: "#1e293b", text: "#94a3b8" },
};

const DIFFICULTY_COLORS = {
  beginner:     { bg: "#052e16", border: "#14532d", text: "#4ade80" },
  intermediate: { bg: "#1c1400", border: "#422006", text: "#fbbf24" },
  advanced:     { bg: "#2d0a0a", border: "#5f1d1d", text: "#f87171" },
};

function Badge({ label, colors }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: "999px",
      fontSize: "11px", fontWeight: 700,
      background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text,
    }}>
      {label}
    </span>
  );
}

function ProgressBar({ value, color = "#22d3ee" }) {
  return (
    <div style={{ height: "6px", borderRadius: "999px", background: "#1e293b", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`, background: color,
        borderRadius: "999px", transition: "width 0.5s ease",
      }} />
    </div>
  );
}

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api("/modules")
      .then((res) => setModules(res.modules || []))
      .finally(() => setLoading(false));
  }, []);

  const totalModules     = modules.length;
  const completedModules = modules.filter((m) => m.completed).length;
  const startedModules   = modules.filter((m) => m.started && !m.completed).length;
  const overallProgress  = totalModules ? Math.round((completedModules / totalModules) * 100) : 0;
  const categories       = [...new Set(modules.map((m) => m.category).filter(Boolean))];

  const filtered = modules.filter((m) => {
    const matchStatus =
      filter === "all" ||
      (filter === "completed"   && m.completed) ||
      (filter === "in-progress" && m.started && !m.completed) ||
      (filter === "not-started" && !m.started && !m.locked) ||
      (filter === "locked"      && m.locked);
    const matchCategory = !categoryFilter || m.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  async function handleStart(e, moduleId) {
    e.stopPropagation();
    try {
      await api(`/modules/${moduleId}/start`, { method: "POST", body: JSON.stringify({}) });
      navigate(`/modules/${moduleId}`);
    } catch (err) {
      alert(err.message || "Could not start module");
    }
  }

  return (
    <Layout title="Training Modules">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Overall progress banner */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "18px", padding: "24px", marginBottom: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>Your Progress</div>
              <div style={{ color: "#94a3b8", marginTop: "4px" }}>
                {completedModules} of {totalModules} modules completed
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <Stat label="Completed"   value={completedModules}                                     color="#34d399" />
              <Stat label="In Progress" value={startedModules}                                       color="#fbbf24" />
              <Stat label="Locked"      value={modules.filter(m => m.locked).length}                 color="#f87171" />
              <Stat label="Not Started" value={modules.filter(m => !m.started && !m.locked).length}  color="#94a3b8" />
            </div>
          </div>
          <ProgressBar value={overallProgress} color="#22d3ee" />
          <div style={{ marginTop: "8px", textAlign: "right", color: "#22d3ee", fontWeight: 700 }}>
            {overallProgress}%
          </div>
        </div>

        {/* Lock info banner */}
        <div style={{
          background: "#0c1a2e", border: "1px solid #1e3a5f",
          borderRadius: "14px", padding: "14px 18px", marginBottom: "20px",
          fontSize: "13px", color: "#93c5fd", lineHeight: 1.6,
        }}>
          🔒 Modules unlock in order. Complete each module quiz with 80% or higher to unlock the next one.
        </div>

        {/* Filters */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px",
          padding: "16px 20px", marginBottom: "24px",
          display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center",
        }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { key: "all",          label: "All" },
              { key: "completed",    label: "✅ Completed" },
              { key: "in-progress",  label: "🔄 In Progress" },
              { key: "not-started",  label: "⭕ Not Started" },
              { key: "locked",       label: "🔒 Locked" },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: "7px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: 600,
                border: filter === f.key ? "1px solid #22d3ee" : "1px solid #334155",
                background: filter === f.key ? "#0e7490" : "#1e293b",
                color: filter === f.key ? "#fff" : "#94a3b8", cursor: "pointer",
              }}>
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "7px 12px", borderRadius: "10px", fontSize: "13px",
              border: "1px solid #334155", background: "#1e293b", color: "#e2e8f0",
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: "16px", color: "#94a3b8", fontSize: "13px" }}>
          Showing {filtered.length} of {totalModules} modules
        </div>

        {/* Module grid */}
        {loading ? (
          <div style={{ color: "#94a3b8", padding: "24px" }}>Loading modules...</div>
        ) : filtered.length === 0 ? (
          <div style={{ color: "#94a3b8", padding: "24px" }}>No modules match the current filters.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "18px" }}>
            {filtered.map((module) => {
              const catColors  = CATEGORY_COLORS[module.category]  || CATEGORY_COLORS["General"];
              const diffColors = DIFFICULTY_COLORS[module.difficulty] || DIFFICULTY_COLORS["beginner"];
              const isLocked   = module.locked;

              const statusColor = isLocked ? "#f87171"
                : module.completed ? "#34d399"
                : module.started   ? "#fbbf24"
                : "#94a3b8";

              const statusLabel = isLocked ? "🔒 Locked"
                : module.completed ? "✅ Completed"
                : module.started   ? "🔄 In Progress"
                : "⭕ Not Started";

              return (
                <div
                  key={module.id}
                  onClick={() => !isLocked && navigate(`/modules/${module.id}`)}
                  style={{
                    background: isLocked ? "#080d18" : "#0f172a",
                    border: isLocked
                      ? "1px solid #1e293b"
                      : module.completed
                      ? "1px solid #14532d"
                      : module.started
                      ? "1px solid #422006"
                      : "1px solid #1e293b",
                    borderRadius: "18px", padding: "20px",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    display: "flex", flexDirection: "column", gap: "14px",
                    opacity: isLocked ? 0.6 : 1,
                    transition: "border-color 0.2s, transform 0.1s",
                  }}
                  onMouseEnter={(e) => { if (!isLocked) e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: isLocked ? "#475569" : "#f8fafc", lineHeight: 1.4 }}>
                      {module.title}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: statusColor, whiteSpace: "nowrap" }}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Badges */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    <Badge label={module.category  || "General"}  colors={isLocked ? { bg: "#0f172a", border: "#1e293b", text: "#334155" } : catColors} />
                    <Badge label={module.difficulty || "beginner"} colors={isLocked ? { bg: "#0f172a", border: "#1e293b", text: "#334155" } : diffColors} />
                    <Badge label={`⏱ ${module.duration_minutes || 10} min`} colors={{ bg: "#0f172a", border: "#334155", text: "#475569" }} />
                  </div>

                  {/* Content preview */}
                  <p style={{
                    margin: 0, fontSize: "13px", lineHeight: 1.6,
                    color: isLocked ? "#334155" : "#94a3b8",
                    display: "-webkit-box", WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {module.content}
                  </p>

                  {/* Quiz score */}
                  {module.quiz_score !== null && !isLocked && (
                    <div style={{
                      padding: "8px 12px", borderRadius: "10px",
                      background: module.completed ? "#052e16" : "#1c1400",
                      border: `1px solid ${module.completed ? "#14532d" : "#422006"}`,
                      color: module.completed ? "#4ade80" : "#fbbf24",
                      fontSize: "13px", fontWeight: 600,
                    }}>
                      🎯 Quiz Score: {module.quiz_score}%
                      {!module.completed && " — retake needed"}
                    </div>
                  )}

                  {/* Progress bar */}
                  {!isLocked && module.started && !module.completed && (
                    <ProgressBar value={50} color="#fbbf24" />
                  )}
                  {!isLocked && module.completed && (
                    <ProgressBar value={100} color="#34d399" />
                  )}

                  {/* Lock message */}
                  {isLocked && (
                    <div style={{
                      padding: "10px 14px", borderRadius: "10px",
                      background: "#0c1118", border: "1px solid #1e293b",
                      color: "#475569", fontSize: "12px", textAlign: "center",
                    }}>
                      🔒 Complete the previous module quiz to unlock
                    </div>
                  )}

                  {/* Actions */}
                  {!isLocked && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}
                      onClick={(e) => e.stopPropagation()}>
                      {!module.started && (
                        <button onClick={(e) => handleStart(e, module.id)} style={{
                          flex: 1, padding: "10px", borderRadius: "12px", border: "none",
                          background: "#0e7490", color: "#fff", fontWeight: 700, cursor: "pointer",
                        }}>
                          Start Module
                        </button>
                      )}
                      {module.started && !module.completed && (
                        <button onClick={() => navigate(`/modules/${module.id}`)} style={{
                          flex: 1, padding: "10px", borderRadius: "12px", border: "none",
                          background: "#0e7490", color: "#fff", fontWeight: 700, cursor: "pointer",
                        }}>
                          Continue
                        </button>
                      )}
                      {module.completed && (
                        <button onClick={() => navigate(`/modules/${module.id}`)} style={{
                          flex: 1, padding: "10px", borderRadius: "12px",
                          border: "1px solid #14532d", background: "#052e16",
                          color: "#4ade80", fontWeight: 700, cursor: "pointer",
                        }}>
                          Review Again
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "24px", fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{label}</div>
    </div>
  );
}
