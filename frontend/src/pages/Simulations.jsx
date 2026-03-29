import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api";

function SenderBadge({ name }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div style={{
      width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
      border: "1px solid rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.1)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "18px", fontWeight: 700, color: "#22d3ee",
    }}>
      {initial}
    </div>
  );
}

function IndicatorPill({ children, safe = false }) {
  return (
    <span style={{
      padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
      border: safe ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(251,191,36,0.3)",
      background: safe ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)",
      color: safe ? "#34d399" : "#fbbf24",
    }}>
      {children}
    </span>
  );
}

function MetaPill({ children }) {
  return (
    <span style={{
      padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
      border: "1px solid rgba(34,211,238,0.3)", color: "#22d3ee",
    }}>
      {children}
    </span>
  );
}

function FeedbackCard({ feedback }) {
  if (!feedback) return null;
  const styles = {
    success: { bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)", color: "#a7f3d0" },
    warning: { bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.3)",  color: "#fde68a" },
    danger:  { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", color: "#fecaca" },
    info:    { bg: "rgba(34,211,238,0.1)",  border: "rgba(34,211,238,0.3)",  color: "#a5f3fc" },
  };
  const s = styles[feedback.status] || styles.info;
  return (
    <div style={{ padding: "18px 20px", borderRadius: "16px", background: s.bg, border: `1px solid ${s.border}` }}>
      <div style={{ fontWeight: 700, color: s.color, fontSize: "15px" }}>{feedback.feedbackTitle}</div>
      <div style={{ marginTop: "6px", fontSize: "13px", color: s.color, lineHeight: 1.6, opacity: 0.9 }}>{feedback.feedbackMessage}</div>
      {feedback.explanation && (
        <div style={{ marginTop: "8px", fontSize: "12px", color: s.color, opacity: 0.7 }}>
          Training note: {feedback.explanation}
        </div>
      )}
    </div>
  );
}

function ModalFrame({ children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(2,6,23,0.85)", padding: "16px",
    }}>
      <div style={{
        position: "relative", width: "100%", maxWidth: "480px",
        maxHeight: "90vh", overflowY: "auto",
        borderRadius: "24px", border: "1px solid #334155",
        background: "#fff", boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "12px", right: "12px",
          padding: "6px 12px", borderRadius: "999px",
          border: "1px solid #e2e8f0", background: "#f8fafc",
          fontSize: "12px", fontWeight: 600, color: "#64748b", cursor: "pointer",
        }}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
}

function MicrosoftPhishModal({ url, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <ModalFrame onClose={onClose}>
      <div style={{ padding: "56px 32px 32px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "6px", background: "#2563eb",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 auto 24px",
        }}>M</div>
        <div style={{ textAlign: "center", fontSize: "22px", fontWeight: 600, color: "#1e293b" }}>Sign in</div>
        <div style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "6px" }}>{url}</div>
        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="email" placeholder="Email, phone, or Skype" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", border: "1px solid #cbd5e1", padding: "12px 16px", fontSize: "14px", color: "#1e293b", boxSizing: "border-box", outline: "none" }} />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", border: "1px solid #cbd5e1", padding: "12px 16px", fontSize: "14px", color: "#1e293b", boxSizing: "border-box", outline: "none" }} />
          <button onClick={() => onSubmit({ email, password })}
            style={{ width: "100%", background: "#2563eb", color: "#fff", padding: "12px", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer" }}>
            Sign in
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}

function BankPhishModal({ url, onClose, onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <ModalFrame onClose={onClose}>
      <div style={{ borderRadius: "24px", overflow: "hidden" }}>
        <div style={{ background: "#0f172a", padding: "20px 24px" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>SecureBank Online</div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{url}</div>
        </div>
        <div style={{ padding: "24px" }}>
          <div style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b" }}>Account Login</div>
          <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Sign in to review your payment activity</div>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="Online ID" value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 16px", fontSize: "14px", color: "#1e293b", boxSizing: "border-box", outline: "none" }} />
            <input type="password" placeholder="Passcode" value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 16px", fontSize: "14px", color: "#1e293b", boxSizing: "border-box", outline: "none" }} />
            <button onClick={() => onSubmit({ username, password })}
              style={{ width: "100%", borderRadius: "12px", background: "#0f172a", color: "#fff", padding: "12px", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer" }}>
              Log in
            </button>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
}

function InternalPortalPhishModal({ url, onClose, onSubmit }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  return (
    <ModalFrame onClose={onClose}>
      <div style={{ background: "#f1f5f9", minHeight: "480px", borderRadius: "24px", overflow: "hidden" }}>
        <div style={{ background: "#1e293b", padding: "18px 24px" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>Employee Access Portal</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{url}</div>
        </div>
        <div style={{ padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b" }}>Department Access Review</div>
            <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Confirm your identity to continue</div>
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="Employee ID" value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                style={{ width: "100%", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 16px", fontSize: "14px", color: "#1e293b", boxSizing: "border-box", outline: "none" }} />
              <input type="password" placeholder="Network password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 16px", fontSize: "14px", color: "#1e293b", boxSizing: "border-box", outline: "none" }} />
              <button onClick={() => onSubmit({ employeeId, password })}
                style={{ width: "100%", borderRadius: "12px", background: "#1e293b", color: "#fff", padding: "12px", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer" }}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
}

function LandingPageModal({ type, url, onClose, onSubmit }) {
  if (type === "microsoft") return <MicrosoftPhishModal url={url} onClose={onClose} onSubmit={onSubmit} />;
  if (type === "bank")      return <BankPhishModal      url={url} onClose={onClose} onSubmit={onSubmit} />;
  if (type === "internal")  return <InternalPortalPhishModal url={url} onClose={onClose} onSubmit={onSubmit} />;
  return null;
}

function channelLabel(channel) {
  return { email: "Email", sms: "SMS", push: "Push", voice: "Voice", physical: "Physical" }[channel] || channel;
}

function scenarioLabel(type) {
  return {
    phishing: "Phishing", legitimate: "Legitimate", smishing: "Smishing",
    vishing: "Vishing", mfa_fatigue: "MFA Fatigue", usb_baiting: "USB Baiting",
    authentication: "Authentication", decision_tree: "Decision Tree",
  }[type] || type;
}

function LockOverlay({ difficulty }) {
  const requirements = {
    medium: "Complete 3 easy simulations to unlock",
    hard:   "Complete 5 medium simulations to unlock",
  };
  return (
    <div style={{
      position: "absolute", inset: 0, borderRadius: "16px",
      background: "rgba(2,6,23,0.85)", backdropFilter: "blur(4px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 10, gap: "10px",
    }}>
      <div style={{ fontSize: "32px" }}>🔒</div>
      <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "15px" }}>
        {difficulty === "medium" ? "Medium Locked" : "Hard Locked"}
      </div>
      <div style={{ color: "#94a3b8", fontSize: "12px", textAlign: "center", maxWidth: "200px" }}>
        {requirements[difficulty]}
      </div>
    </div>
  );
}

// ── Simulation type helpers ───────────────────────────────────────────────────

function getSimType(prompt) {
  if (!prompt) return "decision";
  if (prompt.startsWith("DESKTOP_SIM_NETWORK:"))   return "network";
  if (prompt.startsWith("DESKTOP_SIM_TASKMAN:"))   return "taskman";
  if (prompt.startsWith("DESKTOP_SIM_TERMINAL:"))  return "terminal";
  if (prompt.startsWith("DESKTOP_SIM_BROWSER:"))   return "browser";
  if (prompt.startsWith("DESKTOP_SIM_PHONE:"))     return "phone";
  if (prompt.startsWith("DESKTOP_SIM_PASSWORD:"))  return "password";
  if (prompt.startsWith("DESKTOP_SIM_HARDENING:")) return "hardening";
  if (prompt.startsWith("DESKTOP_SIM:"))           return "desktop";
  return "decision";
}

const SIM_TYPE_META = {
  decision:  { icon: "🌿", label: "Decision Tree", color: "#818cf8", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.3)"  },
  desktop:   { icon: "🖥️", label: "Desktop Sim",   color: "#f472b6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.3)" },
  network:   { icon: "🌐", label: "NOC Sim",        color: "#22d3ee", bg: "rgba(34,211,238,0.1)",  border: "rgba(34,211,238,0.3)"  },
  taskman:   { icon: "📊", label: "Task Manager",   color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.3)"  },
  terminal:  { icon: "⌨️", label: "Terminal",       color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.3)"  },
  browser:   { icon: "🔗", label: "Browser Sim",    color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)"  },
  phone:     { icon: "📱", label: "Phone / SMS",    color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.3)"  },
  password:  { icon: "🔑", label: "Password Mgr",   color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.3)"  },
  hardening: { icon: "🔒", label: "Hardening",      color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
};

const TYPE_FILTERS = [
  { key: "all",      label: "All" },
  { key: "decision", label: "🌿 Decision Tree" },
  { key: "terminal", label: "⌨️ Terminal" },
  { key: "browser",  label: "🔗 Browser" },
  { key: "phone",    label: "📱 Phone / SMS" },
  { key: "password", label: "🔑 Password" },
  { key: "desktop",  label: "🖥️ Desktop" },
  { key: "network",  label: "🌐 NOC" },
  { key: "taskman",  label: "📊 Task Manager" },
];

const DIFFICULTY_COLOR = {
  easy:   { color: "#4ade80", border: "rgba(74,222,128,0.3)",  bg: "rgba(74,222,128,0.08)"  },
  medium: { color: "#fbbf24", border: "rgba(251,191,36,0.3)",  bg: "rgba(251,191,36,0.08)"  },
  hard:   { color: "#f87171", border: "rgba(248,113,113,0.3)", bg: "rgba(248,113,113,0.08)" },
};

// ── Interactive Scenario Menu ─────────────────────────────────────────────────

function ScenarioMenu({ scenarios, onLaunch }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch]         = useState("");

  const filtered = useMemo(() => {
    return scenarios.filter(sim => {
      const t = getSimType(sim.prompt);
      const matchType = typeFilter === "all" || t === typeFilter;
      const matchSearch = !search || sim.title.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [scenarios, typeFilter, search]);

  return (
    <div style={{ marginBottom: "32px" }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scenario-card:hover .scenario-launch-btn {
          background: #22d3ee !important;
          color: #020617 !important;
        }
        .scenario-card:hover {
          border-color: rgba(34,211,238,0.4) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontWeight: 800, color: "#f8fafc", fontSize: "18px" }}>Interactive Simulations</div>
          <div style={{ color: "#475569", fontSize: "13px", marginTop: "2px" }}>{scenarios.length} scenarios across {new Set(scenarios.map(s => getSimType(s.prompt))).size} simulation types</div>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search scenarios..."
          style={{ borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#fff", padding: "8px 14px", fontSize: "13px", outline: "none", width: "200px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
        {TYPE_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setTypeFilter(f.key)}
            style={{
              padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600,
              border: typeFilter === f.key ? "1px solid #22d3ee" : "1px solid #334155",
              background: typeFilter === f.key ? "rgba(34,211,238,0.12)" : "transparent",
              color: typeFilter === f.key ? "#22d3ee" : "#64748b",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >{f.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#475569", fontSize: "14px" }}>
          No scenarios match your filters.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
          {filtered.map((sim, i) => {
            const type = getSimType(sim.prompt);
            const meta = SIM_TYPE_META[type] || SIM_TYPE_META.decision;
            const diff = DIFFICULTY_COLOR[sim.difficulty] || DIFFICULTY_COLOR.easy;
            return (
              <div
                key={sim.id}
                className="scenario-card"
                style={{
                  borderRadius: "16px",
                  border: "1px solid #1e293b",
                  background: "#0f172a",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  animation: `fadeSlideIn 0.3s ease ${i * 0.04}s both`,
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => onLaunch(sim.id)}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", borderRadius: "0 0 0 80px", background: meta.bg, opacity: 0.6 }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
                    background: meta.bg, border: `1px solid ${meta.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
                  }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "14px", lineHeight: 1.4, marginBottom: "4px" }}>{sim.title}</div>
                    <div style={{ fontSize: "11px", color: "#475569", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {(sim.prompt || "").replace(/^DESKTOP_SIM[^:]*:/, "").trim()}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}>
                    {meta.label}
                  </span>
                  <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, background: diff.bg, border: `1px solid ${diff.border}`, color: diff.color }}>
                    {sim.difficulty}
                  </span>
                  {sim.bestScore !== null && sim.bestScore !== undefined && (
                    <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }}>
                      Best: {sim.bestScore}%
                    </span>
                  )}
                </div>

                <button
                  className="scenario-launch-btn"
                  onClick={e => { e.stopPropagation(); onLaunch(sim.id); }}
                  style={{
                    padding: "9px 0", borderRadius: "10px", border: "1px solid #334155",
                    background: "transparent", color: "#94a3b8",
                    fontWeight: 700, fontSize: "13px", cursor: "pointer",
                    transition: "all 0.2s ease", width: "100%",
                  }}
                >
                  Launch →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Simulations() {
  const navigate = useNavigate();

  const [simulations, setSimulations]       = useState([]);
  const [unlocked, setUnlocked]             = useState({ easy: true, medium: false, hard: false });
  const [selectedId, setSelectedId]         = useState(null);
  const [selectedSim, setSelectedSim]       = useState(null);
  const [questions, setQuestions]           = useState([]);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [decision, setDecision]             = useState("");
  const [result, setResult]                 = useState(null);
  const [showFlags, setShowFlags]           = useState(false);
  const [error, setError]                   = useState("");
  const [feedback, setFeedback]             = useState(null);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [events, setEvents]                 = useState([]);
  const [searchTerm, setSearchTerm]         = useState("");
  const [riskFilter, setRiskFilter]         = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [channelFilter, setChannelFilter]   = useState("all");
  const [decisionScenarios, setDecisionScenarios] = useState([]);

  useEffect(() => {
    api("/simulations").then((res) => {
      const sims = res.simulations || [];
      setSimulations(sims);
      setUnlocked(res.unlocked || { easy: true, medium: false, hard: false });
      const first = sims.find(s => !s.locked && s.scenario_type !== "decision_tree") || sims[0];
      if (first) setSelectedId(first.id);
    }).catch((e) => setError(e.message));

    api("/scenarios").then((res) => {
      setDecisionScenarios(res.scenarios || []);
    }).catch(() => {});
  }, []);

  const filteredSimulations = useMemo(() => {
    return simulations.filter((sim) => {
      if (sim.scenario_type === "decision_tree") return false;
      const matchesSearch = !searchTerm ||
        `${sim.subject||""} ${sim.sender_name||""} ${sim.sender_email||""} ${sim.scenario_type||""}`
          .toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === "all" ||
        (riskFilter === "risky" && sim.is_phishing) ||
        (riskFilter === "legit" && !sim.is_phishing);
      const matchesDifficulty = difficultyFilter === "all" || sim.difficulty === difficultyFilter;
      const matchesChannel = channelFilter === "all" || sim.channel === channelFilter;
      return matchesSearch && matchesRisk && matchesDifficulty && matchesChannel;
    });
  }, [simulations, searchTerm, riskFilter, difficultyFilter, channelFilter]);

  useEffect(() => {
    if (!filteredSimulations.length) {
      setSelectedId(null); setSelectedSim(null); setQuestions([]); setEvents([]);
      return;
    }
    const exists = filteredSimulations.some(s => s.id === selectedId);
    if (!exists) setSelectedId(filteredSimulations[0].id);
  }, [filteredSimulations, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    setError(""); setSelectedChoice(""); setDecision(""); setResult(null);
    setShowFlags(false); setFeedback(null); setShowLandingPage(false);

    Promise.all([
      api(`/simulations/${selectedId}`),
      api(`/simulations/${selectedId}/events`),
    ]).then(([simRes, eventRes]) => {
      setSelectedSim(simRes.simulation);
      setQuestions(simRes.questions || []);
      setEvents(eventRes.events || []);
    }).catch((e) => {
      if (e.message?.includes("locked") || e.message?.includes("403")) {
        setSelectedSim(null);
      } else {
        setError(e.message);
      }
    });
  }, [selectedId]);

  const latestEvents = useMemo(() => events.slice(0, 5), [events]);

  const refreshEvents = async () => {
    if (!selectedId) return;
    const res = await api(`/simulations/${selectedId}/events`);
    setEvents(res.events || []);
  };

  const logEvent = async (eventType, eventValue = "") => {
    if (!selectedSim) return null;
    const res = await api(`/simulations/${selectedSim.id}/event`, {
      method: "POST",
      body: JSON.stringify({ eventType, eventValue }),
    });
    setFeedback(res);
    await refreshEvents();
    return res;
  };

  const handleSubmit = async () => {
    if (!selectedSim || !questions[0] || !selectedChoice) return;
    try {
      const start = await api("/attempts/start", {
        method: "POST", body: JSON.stringify({ simulationId: selectedSim.id }),
      });
      const submit = await api(`/attempts/${start.attemptId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers: [{ questionId: questions[0].id, selectedChoice }] }),
      });
      setResult(submit);
      setShowFlags(true);

      const res = await api("/simulations");
      setSimulations(res.simulations || []);
      setUnlocked(res.unlocked || { easy: true, medium: false, hard: false });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDecision = async (type) => {
    try {
      setDecision(type === "report" ? "report" : "safe");
      await logEvent(
        type === "report" ? "reported_phishing" : "marked_safe",
        type === "report" ? "User reported the scenario as suspicious" : "User marked the scenario as legitimate"
      );
    } catch (e) { setError(e.message); }
  };

  const handleLinkClick = async () => {
    try {
      await logEvent("clicked_link", selectedSim?.link_url || "");
      if (selectedSim?.is_phishing && selectedSim?.landing_page_type !== "none") {
        setShowLandingPage(true);
      }
    } catch (e) { setError(e.message); }
  };

  const handleCredentialSubmit = async (payload) => {
    try {
      await logEvent("submitted_credentials", JSON.stringify({ fieldsEntered: Object.keys(payload).filter(k => payload[k]) }));
      setShowLandingPage(false);
    } catch (e) { setError(e.message); }
  };

  const selectedSimData = simulations.find(s => s.id === selectedId);
  const selectedIsLocked = selectedSimData?.locked || false;

  const easyDone = simulations.filter(s => s.difficulty === "easy"   && !s.locked).length;
  const medDone  = simulations.filter(s => s.difficulty === "medium"  && !s.locked).length;

  return (
    <Layout title="Simulations & Scenarios">
      {error && (
        <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "10px", background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", fontSize: "13px" }}>
          {error}
        </div>
      )}

      {decisionScenarios.length > 0 && (
        <ScenarioMenu
          scenarios={decisionScenarios}
          onLaunch={(id) => navigate(`/scenarios/${id}`)}
        />
      )}

      <div style={{ borderBottom: "1px solid #1e293b", marginBottom: "24px" }} />

      <div style={{
        marginBottom: "20px", padding: "14px 18px", borderRadius: "14px",
        background: "#0c1a2e", border: "1px solid #1e3a5f",
        display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center",
      }}>
        <div style={{ fontSize: "13px", color: "#93c5fd", fontWeight: 600 }}>🔓 Unlock Progress:</div>
        <div style={{ fontSize: "13px", color: unlocked.medium ? "#4ade80" : "#94a3b8" }}>
          {unlocked.medium ? "✅" : `${Math.min(easyDone, 3)}/3`} Easy → Medium unlocked
        </div>
        <div style={{ fontSize: "13px", color: unlocked.hard ? "#4ade80" : "#94a3b8" }}>
          {unlocked.hard ? "✅" : `${Math.min(medDone, 5)}/5`} Medium → Hard unlocked
        </div>
      </div>

      <div style={{ fontWeight: 800, color: "#f8fafc", fontSize: "18px", marginBottom: "16px" }}>
        📧 Phishing Scenario Library
      </div>

      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "360px 1fr" }}>

        <div style={{ borderRadius: "18px", border: "1px solid #1e293b", background: "#0f172a", overflow: "hidden" }}>
          <div style={{ borderBottom: "1px solid #1e293b", padding: "18px 20px" }}>
            <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "16px" }}>Scenario Library</div>
            <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
              Practice phishing, smishing, MFA, voice, and physical security decisions
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #1e293b", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search subject, sender, or type"
              style={{
                width: "100%", borderRadius: "10px", border: "1px solid #334155",
                background: "#020617", color: "#fff", padding: "9px 12px",
                fontSize: "13px", outline: "none", boxSizing: "border-box",
              }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { value: riskFilter, onChange: setRiskFilter, options: [["all","All risk"],["risky","Risky"],["legit","Legitimate"]] },
                { value: difficultyFilter, onChange: setDifficultyFilter, options: [["all","All levels"],["easy","Easy"],["medium","Medium"],["hard","Hard"]] },
              ].map((sel, i) => (
                <select key={i} value={sel.value} onChange={(e) => sel.onChange(e.target.value)} style={{
                  borderRadius: "10px", border: "1px solid #334155", background: "#020617",
                  color: "#fff", padding: "8px 10px", fontSize: "13px", outline: "none",
                }}>
                  {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              ))}
            </div>
            <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} style={{
              borderRadius: "10px", border: "1px solid #334155", background: "#020617",
              color: "#fff", padding: "8px 10px", fontSize: "13px", outline: "none",
            }}>
              {[["all","All channels"],["email","Email"],["sms","SMS"],["push","Push"],["voice","Voice"],["physical","Physical"]].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <div style={{ fontSize: "12px", color: "#475569" }}>
              Showing {filteredSimulations.length} of {simulations.filter(s => s.scenario_type !== "decision_tree").length} scenarios
            </div>
          </div>

          <div style={{ overflowY: "auto", maxHeight: "600px" }}>
            {filteredSimulations.length === 0 ? (
              <div style={{ padding: "20px", color: "#475569", fontSize: "13px" }}>No scenarios match your filters.</div>
            ) : filteredSimulations.map((sim) => (
              <button
                key={sim.id}
                onClick={() => setSelectedId(sim.id)}
                style={{
                  width: "100%", textAlign: "left", padding: "14px 16px",
                  borderBottom: "1px solid #1e293b",
                  background: selectedId === sim.id ? "rgba(34,211,238,0.08)" : "transparent",
                  cursor: "pointer", position: "relative",
                  opacity: sim.locked ? 0.6 : 1,
                }}
              >
                {sim.locked && (
                  <span style={{ position: "absolute", top: "10px", right: "10px", fontSize: "14px" }}>🔒</span>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: sim.locked ? "#475569" : "#f8fafc", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sim.subject || sim.title}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "12px", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {sim.sender_name} • {sim.sender_email}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end", flexShrink: 0 }}>
                    <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, border: "1px solid #334155", color: "#94a3b8" }}>{sim.difficulty}</span>
                    <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, border: "1px solid #334155", color: "#64748b" }}>{channelLabel(sim.channel)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                  <MetaPill>{scenarioLabel(sim.scenario_type)}</MetaPill>
                  <span style={{
                    padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600,
                    border: sim.is_phishing ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(52,211,153,0.3)",
                    color: sim.is_phishing ? "#fbbf24" : "#34d399",
                  }}>
                    {sim.is_phishing ? "risky" : "legitimate"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FeedbackCard feedback={feedback} />

          <div style={{ borderRadius: "18px", border: "1px solid #1e293b", background: "#0f172a", overflow: "hidden" }}>
            <div style={{ borderBottom: "1px solid #1e293b", padding: "18px 24px" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Scenario analysis view</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>
                {selectedSim?.subject || (selectedIsLocked ? "🔒 Locked Scenario" : "Select a scenario")}
              </div>
            </div>

            <div style={{ padding: "24px", position: "relative" }}>
              {selectedIsLocked ? (
                <div style={{ padding: "48px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontSize: "48px" }}>🔒</div>
                  <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "18px" }}>
                    {selectedSimData?.difficulty === "medium" ? "Medium Difficulty Locked" : "Hard Difficulty Locked"}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "14px", maxWidth: "400px", lineHeight: 1.6 }}>
                    {selectedSimData?.difficulty === "medium"
                      ? "Complete 3 easy simulations to unlock medium difficulty scenarios."
                      : "Complete 5 medium simulations to unlock hard difficulty scenarios."}
                  </div>
                  <button onClick={() => setDifficultyFilter("easy")} style={{
                    marginTop: "8px", padding: "10px 20px", borderRadius: "12px",
                    border: "none", background: "#0e7490", color: "#fff",
                    fontWeight: 700, cursor: "pointer", fontSize: "14px",
                  }}>
                    Try Easy Scenarios
                  </button>
                </div>
              ) : !selectedSim ? (
                <div style={{ color: "#475569", padding: "20px" }}>No scenario selected.</div>
              ) : (
                <>
                  <div style={{ borderRadius: "14px", border: "1px solid #1e293b", background: "#020617", padding: "20px" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <SenderBadge name={selectedSim.sender_name} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                          <div>
                            <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "16px" }}>{selectedSim.sender_name}</div>
                            <div style={{ color: "#22d3ee", fontSize: "13px" }}>{selectedSim.sender_email}</div>
                          </div>
                          <div style={{ color: "#475569", fontSize: "13px" }}>{selectedSim.sent_at}</div>
                        </div>

                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                          <MetaPill>{channelLabel(selectedSim.channel)}</MetaPill>
                          <MetaPill>{scenarioLabel(selectedSim.scenario_type)}</MetaPill>
                          <MetaPill>{selectedSim.difficulty}</MetaPill>
                        </div>

                        <div style={{ marginTop: "16px", borderRadius: "10px", border: "1px solid #1e293b", background: "#0f172a", padding: "12px 14px" }}>
                          <div style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</div>
                          <div style={{ marginTop: "6px", fontWeight: 600, color: "#f8fafc" }}>{selectedSim.subject}</div>
                        </div>

                        <div style={{ marginTop: "12px", borderRadius: "10px", border: "1px solid #1e293b", background: "#0f172a", padding: "12px 14px" }}>
                          <div style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Scenario Prompt</div>
                          <div style={{ marginTop: "6px", fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6 }}>{selectedSim.prompt}</div>
                        </div>

                        <div style={{ marginTop: "16px", whiteSpace: "pre-wrap", lineHeight: 1.8, color: "#cbd5e1", fontSize: "14px" }}>
                          {selectedSim.body_text}
                        </div>

                        <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <div style={{ borderRadius: "10px", border: "1px solid #1e293b", background: "#0f172a", padding: "12px 14px" }}>
                            <div style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Link or Action Target</div>
                            <div style={{ marginTop: "6px", fontWeight: 600, color: "#22d3ee", fontSize: "13px" }}>{selectedSim.link_label || "No link"}</div>
                            <div style={{ marginTop: "2px", fontSize: "11px", color: "#475569", wordBreak: "break-all" }}>{selectedSim.link_url || "No target included"}</div>
                            {!!selectedSim.link_url && (
                              <button onClick={handleLinkClick} style={{
                                marginTop: "10px", padding: "8px 14px", borderRadius: "10px",
                                border: "none", background: "#0e7490", color: "#fff",
                                fontSize: "12px", fontWeight: 600, cursor: "pointer",
                              }}>
                                Open target
                              </button>
                            )}
                          </div>
                          <div style={{ borderRadius: "10px", border: "1px solid #1e293b", background: "#0f172a", padding: "12px 14px" }}>
                            <div style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Attachment</div>
                            <div style={{ marginTop: "6px", fontWeight: 600, color: "#f8fafc", fontSize: "13px" }}>{selectedSim.attachment_name || "No attachment"}</div>
                          </div>
                        </div>

                        <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          {["report", "safe"].map((type) => (
                            <button key={type} onClick={() => handleDecision(type)} style={{
                              padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: 600,
                              border: decision === type ? "1px solid #22d3ee" : "1px solid #334155",
                              background: decision === type ? "rgba(34,211,238,0.1)" : "#0f172a",
                              color: decision === type ? "#22d3ee" : "#94a3b8", cursor: "pointer",
                            }}>
                              {type === "report" ? "Report suspicious" : "Mark legitimate"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {questions[0] && (
                    <div style={{ marginTop: "16px", borderRadius: "14px", border: "1px solid #1e293b", background: "#020617", padding: "20px" }}>
                      <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "16px", marginBottom: "10px" }}>Knowledge Check</div>
                      <div style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "16px" }}>{questions[0].question_text}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {[{ key: "A", text: questions[0].choice_a }, { key: "B", text: questions[0].choice_b }, { key: "C", text: questions[0].choice_c }].map((choice) => (
                          <label key={choice.key} style={{
                            display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer",
                            padding: "12px 14px", borderRadius: "12px",
                            border: selectedChoice === choice.key ? "1px solid #22d3ee" : "1px solid #334155",
                            background: selectedChoice === choice.key ? "rgba(34,211,238,0.08)" : "#0f172a",
                          }}>
                            <input type="radio" name="answer" value={choice.key}
                              checked={selectedChoice === choice.key}
                              onChange={() => setSelectedChoice(choice.key)}
                              style={{ marginTop: "2px" }} />
                            <div>
                              <div style={{ fontWeight: 700, color: "#22d3ee", fontSize: "12px" }}>Choice {choice.key}</div>
                              <div style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "2px" }}>{choice.text}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <button onClick={handleSubmit} disabled={!selectedChoice} style={{
                        marginTop: "14px", padding: "11px 22px", borderRadius: "12px",
                        border: "none", background: selectedChoice ? "#0e7490" : "#1e293b",
                        color: selectedChoice ? "#fff" : "#475569",
                        fontWeight: 700, fontSize: "14px",
                        cursor: selectedChoice ? "pointer" : "not-allowed",
                      }}>
                        Submit scenario
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div style={{ borderRadius: "18px", border: "1px solid #1e293b", background: "#0f172a", padding: "20px" }}>
            <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "15px", marginBottom: "12px" }}>Recent Training Events</div>
            {latestEvents.length === 0 ? (
              <div style={{ color: "#475569", fontSize: "13px" }}>No actions recorded yet.</div>
            ) : latestEvents.map((event) => (
              <div key={event.id} style={{
                borderRadius: "10px", border: "1px solid #1e293b", background: "#020617",
                padding: "10px 14px", marginBottom: "8px",
              }}>
                <div style={{ fontWeight: 600, color: "#22d3ee", fontSize: "13px" }}>{event.event_type}</div>
                <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>{event.event_value || "No detail"}</div>
                <div style={{ color: "#334155", fontSize: "11px", marginTop: "2px" }}>{event.created_at}</div>
              </div>
            ))}
          </div>

          {result && (
            <div style={{ borderRadius: "18px", border: "1px solid rgba(34,211,238,0.2)", background: "#0f172a", padding: "24px" }}>
              <div style={{ fontWeight: 800, color: "#f8fafc", fontSize: "20px", marginBottom: "16px" }}>Scenario Result</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {[
                  { label: "Score", value: `${result.score}%` },
                  { label: "Correct", value: `${result.correct}/${result.total}` },
                  { label: "Assessment", value: decision === "report" ? "Reported" : decision === "safe" ? "Marked Safe" : "None" },
                ].map((s) => (
                  <div key={s.label} style={{ borderRadius: "12px", border: "1px solid #1e293b", background: "#020617", padding: "14px" }}>
                    <div style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                    <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: 700, color: "#22d3ee" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {showFlags && result.details?.[0] && (
                <div style={{ marginTop: "14px", borderRadius: "12px", border: "1px solid #1e293b", background: "#020617", padding: "14px" }}>
                  <div style={{ fontWeight: 600, color: "#f8fafc", fontSize: "13px", marginBottom: "10px" }}>
                    {selectedSim && !selectedSim.is_phishing ? "Legitimacy Indicators" : "Risk Indicators"}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {result.details[0].redFlags.split(",").map((flag, i) => (
                      <IndicatorPill key={i} safe={selectedSim && !selectedSim.is_phishing}>
                        {flag.trim()}
                      </IndicatorPill>
                    ))}
                  </div>
                  <div style={{ marginTop: "10px", fontSize: "13px", color: "#94a3b8" }}>
                    Correct answer: Choice {result.details[0].correctChoice}
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "13px", color: "#64748b" }}>
                    {selectedSim?.explanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showLandingPage && selectedSim && (
        <LandingPageModal
          type={selectedSim.landing_page_type}
          url={selectedSim.link_url}
          onClose={() => setShowLandingPage(false)}
          onSubmit={handleCredentialSubmit}
        />
      )}
    </Layout>
  );
}
