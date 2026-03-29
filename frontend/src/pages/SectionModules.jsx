import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api";

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

export default function SectionModules() {
  const { id }                    = useParams();
  const navigate                  = useNavigate();
  const [section, setSection]     = useState(null);
  const [modules, setModules]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [filter, setFilter]       = useState("all");

  useEffect(() => {
    Promise.all([
      api(`/sections/${id}`),
      api(`/modules?section_id=${id}`),
    ])
      .then(([secRes, modRes]) => {
        setSection(secRes.section || null);
        setModules(modRes.modules || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const totalModules     = modules.length;
  const completedModules = modules.filter((m) => m.completed).length;
  const overallProgress  = totalModules > 0
    ? Math.round((completedModules / totalModules) * 100)
    : 0;

  const filtered = modules.filter((m) => {
    if (filter === "completed")   return m.completed;
    if (filter === "in-progress") return m.started && !m.completed;
    if (filter === "not-started") return !m.started && !m.locked;
    if (filter === "locked")      return m.locked;
    return true;
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
    <Layout title={section ? section.name : "Section Modules"}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Back button */}
        <button
          onClick={() => navigate("/sections")}
          style={{
            marginBottom: "24px", padding: "8px 18px", borderRadius: "10px",
            border: "1px solid #334155", background: "#0f172a",
            color: "#94a3b8", cursor: "pointer", fontWeight: 600, fontSize: "13px",
          }}
        >
          ← Back to Sections
        </button>

        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: "10px", marginBottom: "20px",
            background: "#2d0a0a", border: "1px solid #5f1d1d",
            color: "#f87171", fontSize: "13px",
          }}>
            {error}
          </div>
        )}

        {/* Section progress banner */}
        {section && (
          <div style={{
            background: "#0f172a", border: "1px solid #1e293b",
            borderRadius: "18px", padding: "24px", marginBottom: "24px",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              flexWrap: "wrap", gap: "16px", marginBottom: "16px",
            }}>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>
                  {section.name}
                </div>
                {section.description && (
                  <div style={{ color: "#94a3b8", marginTop: "4px", fontSize: "14px" }}>
                    {section.description}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <Stat label="Total"       value={totalModules}                                          color="#94a3b8" />
                <Stat label="Completed"   value={completedModules}                                      color="#34d399" />
                <Stat label="In Progress" value={modules.filter(m => m.started && !m.completed).length} color="#fbbf24" />
                <Stat label="Locked"      value={modules.filter(m => m.locked).length}                  color="#f87171" />
              </div>
            </div>
            <ProgressBar value={overallProgress} color="#22d3ee" />
            <div style={{ marginTop: "8px", textAlign: "right", color: "#22d3ee", fontWeight: 700, fontSize: "13px" }}>
              {overallProgress}% complete
            </div>
          </div>
        )}

        {/* Lock info */}
        <div style={{
          background: "#0c1a2e", border: "1px solid #1e3a5f",
          borderRadius: "14px", padding: "14px 18px", marginBottom: "20px",
          fontSize: "13px", color: "#93c5fd",
        }}>
          🔒 Modules unlock in order. Complete each module quiz with 80% or higher to unlock the next one.
        </div>

        {/* Filters */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px",
          padding: "14px 18px", marginBottom: "24px",
          display: "flex", flexWrap: "wrap", gap: "8px",
        }}>
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

        <div style={{ marginBottom: "16px", color: "#94a3b8", fontSize: "13px" }}>
          Showing {filtered.length} of {totalModules} modules
        </div>

        {/* Module grid */}
        {loading ? (
          <div style={{ color: "#94a3b8", padding: "24px" }}>Loading modules...</div>
        ) : filtered.length === 0 ? (
          <div style={{ color: "#94a3b8", padding: "24px" }}>
            No modules match the current filter.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "18px",
          }}>
            {filtered.map((module) => {
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
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
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
                    <Badge
                      label={module.difficulty || "beginner"}
                      colors={isLocked ? { bg: "#0f172a", border: "#1e293b", text: "#334155" } : diffColors}
                    />
                    <Badge
                      label={`⏱ ${module.duration_minutes || 10} min`}
                      colors={{ bg: "#0f172a", border: "#334155", text: "#475569" }}
                    />
                    <Badge
                      label={`#${module.order_index}`}
                      colors={{ bg: "#0f172a", border: "#334155", text: "#475569" }}
                    />
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
                      🔒 Complete the previous module to unlock
                    </div>
                  )}

                  {/* Actions */}
                  {!isLocked && (
                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "auto" }}
                      onClick={(e) => e.stopPropagation()}
                    >
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
      <div style={{ fontSize: "22px", fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{label}</div>
    </div>
  );
}
