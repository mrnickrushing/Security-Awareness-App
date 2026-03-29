import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api";

const SECTION_ICONS = {
  "Security Awareness":    "🛡",
  "Computer Troubleshooting": "🖥",
  "Anti-Hacking Defense":  "🔒",
  "Network Fundamentals":  "🌐",
  "Safe Internet Habits":  "🌍",
  "Device Security":       "📱",
  "Privacy Protection":    "👁",
};

const SECTION_GRADIENTS = [
  { border: "#1e3a5f", glow: "#0e7490", accent: "#22d3ee" },
  { border: "#3b1f5f", glow: "#6d28d9", accent: "#a78bfa" },
  { border: "#1f5f3b", glow: "#15803d", accent: "#34d399" },
  { border: "#5f3b1f", glow: "#b45309", accent: "#fbbf24" },
  { border: "#5f1f3b", glow: "#be185d", accent: "#f472b6" },
  { border: "#1f5f5f", glow: "#0e7490", accent: "#67e8f9" },
  { border: "#3b5f1f", glow: "#4d7c0f", accent: "#a3e635" },
];

function ProgressRing({ percent, color }) {
  const r   = 28;
  const cir = 2 * Math.PI * r;
  const off = cir - (percent / 100) * cir;

  return (
    <svg width="70" height="70" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="35" cy="35" r={r} fill="none" stroke="#1e293b" strokeWidth="5" />
      <circle
        cx="35" cy="35" r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={cir}
        strokeDashoffset={off}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="35" y="35"
        textAnchor="middle" dominantBaseline="central"
        fill="#f8fafc" fontSize="13" fontWeight="700"
        style={{ transform: "rotate(90deg) translate(0px, -70px)" }}
      >
        {percent}%
      </text>
    </svg>
  );
}

export default function Sections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  useEffect(() => {
    api("/dashboard/sections")
      .then((res) => setSections(res.sections || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalModules    = sections.reduce((s, sec) => s + sec.total_modules, 0);
  const completedAll    = sections.reduce((s, sec) => s + sec.completed_modules, 0);
  const overallPercent  = totalModules > 0 ? Math.round((completedAll / totalModules) * 100) : 0;

  return (
    <Layout title="Training Modules">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Overall banner */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "18px", padding: "24px", marginBottom: "28px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>
                Overall Progress
              </div>
              <div style={{ color: "#94a3b8", marginTop: "4px", fontSize: "14px" }}>
                {completedAll} of {totalModules} modules completed across all sections
              </div>
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#22d3ee" }}>
              {overallPercent}%
            </div>
          </div>
          <div style={{
            marginTop: "16px", height: "8px", borderRadius: "999px",
            background: "#1e293b", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${overallPercent}%`,
              background: "linear-gradient(90deg, #0e7490, #22d3ee)",
              borderRadius: "999px", transition: "width 0.6s ease",
            }} />
          </div>
        </div>

        {/* Info strip */}
        <div style={{
          background: "#0c1a2e", border: "1px solid #1e3a5f",
          borderRadius: "14px", padding: "14px 18px", marginBottom: "28px",
          fontSize: "13px", color: "#93c5fd",
        }}>
          🔒 Select a section below to view its modules. Modules unlock in order within each section.
        </div>

        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: "10px", marginBottom: "20px",
            background: "#2d0a0a", border: "1px solid #5f1d1d",
            color: "#f87171", fontSize: "13px",
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ color: "#94a3b8", padding: "24px" }}>Loading sections...</div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}>
            {sections.map((section, i) => {
              const style   = SECTION_GRADIENTS[i % SECTION_GRADIENTS.length];
              const icon    = SECTION_ICONS[section.name] || "📋";
              const percent = section.total_modules > 0
                ? Math.round((section.completed_modules / section.total_modules) * 100)
                : 0;
              const allDone = percent === 100;

              return (
                <div
                  key={section.id}
                  onClick={() => navigate(`/sections/${section.id}/modules`)}
                  style={{
                    background: "#0f172a",
                    border: `1px solid ${allDone ? "#14532d" : style.border}`,
                    borderRadius: "20px",
                    padding: "24px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 8px 32px ${style.glow}33`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Glow strip */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                    background: `linear-gradient(90deg, transparent, ${style.accent}, transparent)`,
                  }} />

                  {/* Header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{
                        width: "52px", height: "52px", borderRadius: "14px",
                        background: `${style.glow}22`,
                        border: `1px solid ${style.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "24px", flexShrink: 0,
                      }}>
                        {icon}
                      </div>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", lineHeight: 1.3 }}>
                          {section.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>
                          {section.total_modules} modules
                        </div>
                      </div>
                    </div>

                    <ProgressRing percent={percent} color={style.accent} />
                  </div>

                  {/* Description */}
                  {section.description && (
                    <p style={{
                      margin: 0, fontSize: "13px", color: "#94a3b8",
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {section.description}
                    </p>
                  )}

                  {/* Progress bar */}
                  <div>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      marginBottom: "8px", fontSize: "12px",
                    }}>
                      <span style={{ color: "#64748b" }}>
                        {section.completed_modules} of {section.total_modules} completed
                      </span>
                      {allDone && (
                        <span style={{ color: "#34d399", fontWeight: 700 }}>✅ Complete</span>
                      )}
                    </div>
                    <div style={{
                      height: "6px", borderRadius: "999px",
                      background: "#1e293b", overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${percent}%`,
                        background: allDone
                          ? "linear-gradient(90deg, #15803d, #34d399)"
                          : `linear-gradient(90deg, ${style.glow}, ${style.accent})`,
                        borderRadius: "999px",
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginTop: "auto",
                  }}>
                    <span style={{
                      fontSize: "13px", fontWeight: 600,
                      color: allDone ? "#34d399" : style.accent,
                    }}>
                      {allDone ? "Review Section" : percent > 0 ? "Continue" : "Start Section"} →
                    </span>
                    <span style={{
                      padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700,
                      background: `${style.glow}22`, border: `1px solid ${style.border}`,
                      color: style.accent,
                    }}>
                      {percent}% done
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
