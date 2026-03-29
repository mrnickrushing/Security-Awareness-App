import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api";

function ProgressBar({ value, color = "#22d3ee" }) {
  return (
    <div style={{ height: "8px", borderRadius: "999px", background: "#1e293b", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${Math.min(100, Math.max(0, value))}%`, background: color,
        borderRadius: "999px", transition: "width 0.6s ease",
      }} />
    </div>
  );
}

function SectionCertCard({ section, userName }) {
  const issued = section.issuedAt
    ? new Date(section.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  if (!section.isComplete) {
    return (
      <div style={{
        borderRadius: "20px", padding: "24px",
        background: "#080d18", border: "1px solid #1e293b",
        display: "flex", flexDirection: "column", gap: "14px",
        opacity: 0.75,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            background: "#0f172a", border: "1px solid #1e293b",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", filter: "grayscale(1)",
          }}>
            {section.icon}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#475569", fontSize: "14px" }}>{section.sectionName}</div>
            <div style={{ fontSize: "12px", color: "#334155", marginTop: "2px" }}>
              {section.completedModules} of {section.totalModules} modules
            </div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: "12px", color: "#334155", fontWeight: 700 }}>
            🔒 Locked
          </div>
        </div>
        <ProgressBar value={section.percent} color="#334155" />
        <div style={{ textAlign: "right", fontSize: "12px", color: "#334155" }}>
          {section.percent}% complete
        </div>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: "20px", padding: "0",
      background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
      border: `1px solid ${section.color}44`,
      boxShadow: `0 0 30px ${section.color}18`,
      overflow: "hidden", position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, transparent, ${section.color}, transparent)`,
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0, width: "120px", height: "120px",
        background: `radial-gradient(circle at top left, ${section.color}18, transparent 70%)`,
      }} />

      <div style={{ padding: "24px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: `${section.color}18`,
              border: `1px solid ${section.color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px",
            }}>
              {section.icon}
            </div>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: section.color, fontWeight: 700, textTransform: "uppercase" }}>
                Certificate of Completion
              </div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", marginTop: "2px" }}>
                {section.sectionName}
              </div>
            </div>
          </div>
          <div style={{
            width: "44px", height: "44px", borderRadius: "50%",
            border: `2px solid ${section.color}66`,
            background: `radial-gradient(circle, ${section.color}22, rgba(2,6,23,0.8))`,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 12px ${section.color}33`,
          }}>
            <div style={{ fontSize: "16px" }}>🏅</div>
          </div>
        </div>

        <div style={{
          height: "1px", margin: "0 0 16px",
          background: `linear-gradient(90deg, transparent, ${section.color}44, transparent)`,
        }} />

        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
          This certifies that
        </div>
        <div style={{ fontSize: "22px", fontWeight: 800, color: section.color, marginBottom: "16px" }}>
          {userName}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Modules", value: section.completedModules },
            { label: "Avg Score", value: `${section.avgQuizScore}%` },
            { label: "Issued", value: issued ? issued.split(",")[0] : "Today" },
          ].map((stat) => (
            <div key={stat.label} style={{
              textAlign: "center", padding: "10px 8px", borderRadius: "10px",
              background: "rgba(0,0,0,0.3)", border: `1px solid ${section.color}22`,
            }}>
              <div style={{ fontSize: "16px", fontWeight: 800, color: section.color }}>{stat.value}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", textAlign: "right" }}>
          {issued || "Issued today"}
        </div>
      </div>
    </div>
  );
}

function MasterCertCard({ masterCert, userName, sectionCount }) {
  const issued = masterCert?.issuedAt
    ? new Date(masterCert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{
      width: "100%",
      background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #020c1b 100%)",
      borderRadius: "24px", padding: "56px 64px", position: "relative", overflow: "hidden",
      border: "1px solid rgba(34,211,238,0.3)",
      boxShadow: "0 0 60px rgba(14,116,144,0.2), inset 0 0 60px rgba(0,0,0,0.3)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "200px", height: "200px", background: "radial-gradient(circle at top left, rgba(34,211,238,0.12), transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: "200px", height: "200px", background: "radial-gradient(circle at bottom right, rgba(14,116,144,0.15), transparent 70%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, transparent, #22d3ee, #0e7490, #22d3ee, transparent)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, transparent, #0e7490, #22d3ee, #0e7490, transparent)" }} />

      <div style={{ textAlign: "center", marginBottom: "40px", position: "relative" }}>
        <div style={{ fontSize: "13px", letterSpacing: "0.3em", color: "#22d3ee", fontWeight: 700, textTransform: "uppercase", marginBottom: "16px" }}>
          Master Certificate of Completion
        </div>
        <div style={{ fontSize: "42px", fontWeight: 800, color: "#f8fafc", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Computer Fundamentals & Security
        </div>
        <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginTop: "8px", fontWeight: 400 }}>
          Full Training Program
        </div>
      </div>

      <div style={{ height: "1px", margin: "0 auto 40px", background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)" }} />

      <div style={{ textAlign: "center", marginBottom: "40px", position: "relative" }}>
        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginBottom: "12px" }}>This certifies that</div>
        <div style={{ fontSize: "38px", fontWeight: 800, color: "#22d3ee", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          {userName}
        </div>
        <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginTop: "16px", lineHeight: 1.7, maxWidth: "600px", margin: "16px auto 0" }}>
          has successfully completed all {sectionCount} training sections, demonstrated
          proficiency across every domain, and fulfilled all requirements
          of the Computer Fundamentals & Security Training Program.
        </div>
      </div>

      <div style={{ height: "1px", margin: "0 auto 40px", background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px", position: "relative" }}>
        {[
          { label: "Modules Completed", value: masterCert?.modulesCompleted || 77, color: "#22d3ee" },
          { label: "Sections Completed", value: sectionCount, color: "#a78bfa" },
          { label: "Average Score", value: `${masterCert?.averageScore || 100}%`, color: "#4ade80" },
          { label: "Date Issued", value: issued.split(",")[0], color: "#fbbf24" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center", padding: "16px 12px", borderRadius: "14px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
        <div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>Issued on</div>
          <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{issued}</div>
        </div>
        <div style={{
          width: "90px", height: "90px", borderRadius: "50%",
          border: "3px solid rgba(34,211,238,0.5)",
          background: "radial-gradient(circle, rgba(14,116,144,0.3), rgba(2,6,23,0.8))",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 20px rgba(34,211,238,0.2)",
        }}>
          <div style={{ fontSize: "24px" }}>🔒</div>
          <div style={{ fontSize: "8px", color: "#22d3ee", fontWeight: 700, letterSpacing: "0.1em", marginTop: "4px" }}>CERTIFIED</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>Program</div>
          <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Computer Fundamentals & Security</div>
        </div>
      </div>
    </div>
  );
}

export default function Certificate() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    api("/certificates/me")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleClaim() {
    setClaiming(true); setError("");
    try {
      await api("/certificates/claim", { method: "POST", body: JSON.stringify({}) });
      const fresh = await api("/certificates/me");
      setData(fresh);
    } catch (e) { setError(e.message); }
    finally { setClaiming(false); }
  }

  const userName = data?.userName || user?.email?.split("@")[0] || "Trainee";

  return (
    <Layout title="Certificate">
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", fontSize: "13px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ color: "#94a3b8", padding: "20px" }}>Loading...</div>
        ) : !data ? null : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#f8fafc" }}>
                Your Certificates
              </div>
              <div style={{ color: "#64748b", marginTop: "6px", fontSize: "14px" }}>
                {data.completedSections} of {data.totalSections} sections complete
              </div>
            </div>

            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: 600 }}>Overall Progress</span>
                <span style={{ color: "#22d3ee", fontWeight: 700, fontSize: "14px" }}>
                  {data.completedSections} / {data.totalSections} sections
                </span>
              </div>
              <ProgressBar
                value={data.totalSections > 0 ? Math.round((data.completedSections / data.totalSections) * 100) : 0}
                color="#22d3ee"
              />
            </div>

            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc", marginBottom: "16px" }}>
                Section Certificates
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                {(data.sectionProgress || []).map((section) => (
                  <SectionCertCard key={section.sectionId} section={section} userName={userName} />
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc", marginBottom: "16px" }}>
                Master Certificate
              </div>

              {data.allComplete ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => window.print()} style={{ padding: "10px 20px", borderRadius: "12px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
                      Print Master Certificate
                    </button>
                  </div>
                  <MasterCertCard
                    masterCert={data.masterCert}
                    userName={userName}
                    sectionCount={data.totalSections}
                  />
                </div>
              ) : (
                <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "18px", padding: "32px", textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏆</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#f8fafc", marginBottom: "8px" }}>
                    Complete All Sections to Unlock
                  </div>
                  <div style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 24px" }}>
                    Earn all {data.totalSections} section certificates to unlock your Master Certificate proving full program completion.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
                    {(data.sectionProgress || []).filter(s => !s.isComplete).map((s) => (
                      <div key={s.sectionId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "#020617", border: "1px solid #1e293b" }}>
                        <span style={{ fontSize: "14px", color: "#94a3b8" }}>{s.icon} {s.sectionName}</span>
                        <span style={{ fontSize: "12px", color: "#475569" }}>{s.completedModules}/{s.totalModules}</span>
                      </div>
                    ))}
                  </div>
                  {data.completedSections === data.totalSections && (
                    <button onClick={handleClaim} disabled={claiming} style={{ marginTop: "24px", padding: "14px 32px", borderRadius: "14px", border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "16px", cursor: claiming ? "not-allowed" : "pointer" }}>
                      {claiming ? "Issuing..." : "Claim Master Certificate"}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={() => navigate("/sections")} style={{ padding: "10px 24px", borderRadius: "12px", border: "1px solid #334155", background: "#0f172a", color: "#94a3b8", cursor: "pointer", fontWeight: 600 }}>
                Go to Training Sections →
              </button>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
