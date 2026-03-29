import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api";
import ThreatNewsFeed from "../components/ThreatNewsFeed";

const SECTION_GRADIENTS = [
  { border: "#1e3a5f", glow: "#0e7490", accent: "#22d3ee" },
  { border: "#3b1f5f", glow: "#6d28d9", accent: "#a78bfa" },
  { border: "#1f5f3b", glow: "#15803d", accent: "#34d399" },
  { border: "#5f3b1f", glow: "#b45309", accent: "#fbbf24" },
  { border: "#5f1f3b", glow: "#be185d", accent: "#f472b6" },
  { border: "#1f5f5f", glow: "#0e7490", accent: "#67e8f9" },
  { border: "#3b5f1f", glow: "#4d7c0f", accent: "#a3e635" },
];

const SECTION_ICONS = {
  "Security Awareness": "🛡",
  "Computer Troubleshooting": "🖥",
  "Anti-Hacking Defense": "🔒",
  "Network Fundamentals": "🌐",
  "Safe Internet Habits": "🌍",
  "Device Security": "📱",
  "Privacy Protection": "👁",
};

function safeNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatDateTime(value) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).replace("T", " ").slice(0, 16);
  }
  return date.toLocaleString();
}

function StatCard({ label, value, helper, color = "#22d3ee" }) {
  return (
    <div
      style={{
        borderRadius: "16px",
        border: "1px solid #1e293b",
        background: "#0f172a",
        padding: "20px",
      }}
    >
      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{label}</div>
      <div
        style={{
          marginTop: "8px",
          fontSize: "28px",
          fontWeight: 800,
          color,
        }}
      >
        {value}
      </div>
      {helper && (
        <div style={{ marginTop: "6px", fontSize: "12px", color: "#475569" }}>
          {helper}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ value, color = "#22d3ee" }) {
  return (
    <div
      style={{
        height: "8px",
        borderRadius: "999px",
        background: "#1e293b",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(100, Math.max(0, value || 0))}%`,
          background: color,
          borderRadius: "999px",
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

function BadgeCard({ badge, locked = false }) {
  return (
    <div
      style={{
        borderRadius: "14px",
        padding: "16px",
        border: locked ? "1px solid #1e293b" : "1px solid #0e3a5a",
        background: locked ? "#0a0f1a" : "#0c1f35",
        opacity: locked ? 0.6 : 1,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: locked ? "#64748b" : "#22d3ee",
          fontSize: "13px",
        }}
      >
        {badge.name}
      </div>
      <div
        style={{
          marginTop: "6px",
          fontSize: "12px",
          color: "#94a3b8",
          lineHeight: 1.5,
        }}
      >
        {badge.description}
      </div>
      <div
        style={{
          marginTop: "8px",
          fontSize: "11px",
          color: locked ? "#334155" : "#0e7490",
          fontWeight: 600,
        }}
      >
        {locked ? "🔒 Locked" : "✅ Earned"}
      </div>
    </div>
  );
}

function MilestoneCard({ item }) {
  return (
    <div
      style={{
        borderRadius: "14px",
        padding: "16px",
        border: "1px solid #1e293b",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={{ fontWeight: 600, color: "#f8fafc", fontSize: "13px" }}>
          {item.label}
        </div>
        <div style={{ fontSize: "12px", color: "#22d3ee", fontWeight: 700 }}>
          {item.current} / {item.target}
        </div>
      </div>
      <ProgressBar
        value={item.percent}
        color={item.complete ? "#4ade80" : "#22d3ee"}
      />
      <div
        style={{
          marginTop: "6px",
          fontSize: "11px",
          color: item.complete ? "#4ade80" : "#475569",
        }}
      >
        {item.complete ? "✅ Complete" : `${item.percent}% complete`}
      </div>
    </div>
  );
}

function RecommendationCard({ item }) {
  const colors = {
    high: { bg: "#2d0a0a", border: "#5f1d1d", text: "#fca5a5" },
    medium: { bg: "#1c1400", border: "#422006", text: "#fde68a" },
    low: { bg: "#052e16", border: "#14532d", text: "#bbf7d0" },
  };

  const c = colors[item.priority] || colors.low;

  return (
    <div
      style={{
        borderRadius: "14px",
        padding: "16px",
        background: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      <div style={{ fontWeight: 700, color: c.text, fontSize: "13px" }}>
        {item.title}
      </div>
      <div
        style={{
          marginTop: "6px",
          fontSize: "13px",
          color: "#cbd5e1",
          lineHeight: 1.6,
        }}
      >
        {item.text}
      </div>
    </div>
  );
}

function ActivityCard({ item }) {
  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "12px 16px",
        border: "1px solid #1e293b",
        background: "#020617",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ fontWeight: 600, color: "#f8fafc", fontSize: "13px" }}>
          {item.subject || item.title}
        </div>
        <span
          style={{
            padding: "2px 10px",
            borderRadius: "999px",
            fontSize: "10px",
            fontWeight: 700,
            border: item.is_phishing
              ? "1px solid #422006"
              : "1px solid #14532d",
            color: item.is_phishing ? "#fbbf24" : "#4ade80",
          }}
        >
          {item.is_phishing ? "phishing" : "safe"}
        </span>
      </div>
      <div style={{ marginTop: "4px", fontSize: "12px", color: "#22d3ee" }}>
        {item.event_type || item.section_name || item.difficulty || "Activity"}
      </div>
      <div style={{ marginTop: "2px", fontSize: "11px", color: "#475569" }}>
        {item.created_at || item.completed_at || item.started_at
          ? formatDateTime(item.created_at || item.completed_at || item.started_at)
          : "No timestamp"}
      </div>
    </div>
  );
}

function ProgressChart({ data }) {
  const points = useMemo(() => {
    if (!data.length) return "";
    if (data.length === 1) return "20,110";
    return data
      .map((item, i) => {
        const x = 20 + (i * 260) / (data.length - 1);
        const y = 110 - (Math.max(0, Math.min(100, safeNum(item.score))) / 100) * 90;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data]);

  return (
    <div
      style={{
        borderRadius: "18px",
        border: "1px solid #1e293b",
        background: "#0f172a",
        padding: "24px",
      }}
    >
      <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
        Score Progress
      </div>
      <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
        Completed simulation trend over time
      </div>
      {data.length === 0 ? (
        <div style={{ marginTop: "20px", color: "#475569", fontSize: "13px" }}>
          No completed simulations yet.
        </div>
      ) : (
        <div
          style={{
            marginTop: "20px",
            borderRadius: "14px",
            border: "1px solid #1e293b",
            background: "#020617",
            padding: "16px",
          }}
        >
          <svg viewBox="0 0 300 130" style={{ width: "100%", height: "160px" }}>
            <line
              x1="20"
              y1="20"
              x2="20"
              y2="110"
              stroke="rgba(148,163,184,0.35)"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="110"
              x2="280"
              y2="110"
              stroke="rgba(148,163,184,0.35)"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="20"
              x2="280"
              y2="20"
              stroke="rgba(148,163,184,0.12)"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="65"
              x2="280"
              y2="65"
              stroke="rgba(148,163,184,0.12)"
              strokeWidth="1"
            />
            <polyline
              fill="none"
              stroke="rgb(34,211,238)"
              strokeWidth="3"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((item, i) => {
              const x = data.length === 1 ? 20 : 20 + (i * 260) / (data.length - 1);
              const y = 110 - (Math.max(0, Math.min(100, safeNum(item.score))) / 100) * 90;
              return <circle key={i} cx={x} cy={y} r="4" fill="rgb(34,211,238)" />;
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

function QuickActionButton({ label, onClick, color = "#0e7490" }) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: "14px",
        border: "1px solid #1e293b",
        background: "#0f172a",
        padding: "16px",
        textAlign: "left",
        fontSize: "13px",
        fontWeight: 700,
        color: "#f8fafc",
        cursor: "pointer",
        transition: "border-color 0.2s",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1e293b";
      }}
    >
      {label}
    </button>
  );
}

function SectionProgressCard({ section, index, onClick }) {
  const style = SECTION_GRADIENTS[index % SECTION_GRADIENTS.length];
  const icon = SECTION_ICONS[section.name] || "📋";
  const percent =
    section.total_modules > 0
      ? Math.round((section.completed_modules / section.total_modules) * 100)
      : 0;
  const allDone = percent === 100;

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: "16px",
        padding: "18px",
        border: `1px solid ${allDone ? "#14532d" : style.border}`,
        background: "#0f172a",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "transform 0.15s, box-shadow 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 6px 24px ${style.glow}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${style.accent}, transparent)`,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            flexShrink: 0,
            background: `${style.glow}22`,
            border: `1px solid ${style.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#f8fafc",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {section.name}
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
            {section.completed_modules} of {section.total_modules} modules
          </div>
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 800,
            color: style.accent,
            flexShrink: 0,
          }}
        >
          {percent}%
        </div>
      </div>
      <div
        style={{
          height: "5px",
          borderRadius: "999px",
          background: "#1e293b",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: allDone
              ? "linear-gradient(90deg, #15803d, #34d399)"
              : `linear-gradient(90deg, ${style.glow}, ${style.accent})`,
            borderRadius: "999px",
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

function XpLevelCard({ dashboardStats }) {
  const levelInfo = dashboardStats?.levelInfo || {};
  const xp = safeNum(dashboardStats?.xp);
  const streakDays = safeNum(dashboardStats?.streakDays);
  const percent = safeNum(levelInfo.levelPercent);
  const rank = safeNum(dashboardStats?.userRank, 1);

  return (
    <div
      style={{
        borderRadius: "18px",
        padding: "24px",
        background: "linear-gradient(135deg, #081424 0%, #0f172a 100%)",
        border: "1px solid #1e3a5f",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", color: "#67e8f9", fontWeight: 700, letterSpacing: "0.08em" }}>
            LEVEL AND XP
          </div>
          <div style={{ marginTop: "10px", fontSize: "30px", fontWeight: 800, color: "#f8fafc" }}>
            Level {safeNum(levelInfo.level, 1)}
          </div>
          <div style={{ marginTop: "4px", fontSize: "14px", color: "#94a3b8" }}>
            {levelInfo.title || "Security Newcomer"}
          </div>
        </div>
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "12px",
            border: "1px solid #14532d",
            background: "#052e16",
            color: "#4ade80",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          🔥 {streakDays} day streak
        </div>
      </div>

      <div style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
        <div
          style={{
            borderRadius: "14px",
            padding: "14px",
            background: "#020617",
            border: "1px solid #1e293b",
          }}
        >
          <div style={{ fontSize: "11px", color: "#64748b" }}>Total XP</div>
          <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: 800, color: "#22d3ee" }}>
            {xp}
          </div>
        </div>
        <div
          style={{
            borderRadius: "14px",
            padding: "14px",
            background: "#020617",
            border: "1px solid #1e293b",
          }}
        >
          <div style={{ fontSize: "11px", color: "#64748b" }}>Current rank</div>
          <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: 800, color: "#a78bfa" }}>
            #{rank}
          </div>
        </div>
        <div
          style={{
            borderRadius: "14px",
            padding: "14px",
            background: "#020617",
            border: "1px solid #1e293b",
          }}
        >
          <div style={{ fontSize: "11px", color: "#64748b" }}>XP to next</div>
          <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: 800, color: "#fbbf24" }}>
            {levelInfo.nextLevelXp ? safeNum(levelInfo.xpToNext) : 0}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "18px" }}>
        <ProgressBar value={percent} color="#22d3ee" />
      </div>
      <div style={{ marginTop: "8px", fontSize: "12px", color: "#94a3b8" }}>
        {levelInfo.nextLevelTitle
          ? `${percent}% toward ${levelInfo.nextLevelTitle}`
          : "Max level reached"}
      </div>
    </div>
  );
}

function DailyChallengeCard({ item, onOpen }) {
  if (!item) {
    return (
      <div
        style={{
          borderRadius: "18px",
          border: "1px solid #1e293b",
          background: "#0f172a",
          padding: "24px",
        }}
      >
        <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
          Daily Challenge
        </div>
        <div style={{ marginTop: "10px", fontSize: "13px", color: "#475569" }}>
          No daily challenge is available yet.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: "18px",
        border: item.completed ? "1px solid #14532d" : "1px solid #3b1f5f",
        background: item.completed
          ? "linear-gradient(135deg, #052e16 0%, #0f172a 100%)"
          : "linear-gradient(135deg, #1a1030 0%, #0f172a 100%)",
        padding: "24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "12px", color: item.completed ? "#4ade80" : "#c4b5fd", fontWeight: 700, letterSpacing: "0.08em" }}>
            DAILY CHALLENGE
          </div>
          <div style={{ marginTop: "10px", fontSize: "20px", fontWeight: 800, color: "#f8fafc" }}>
            {item.title}
          </div>
        </div>
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "12px",
            border: item.completed ? "1px solid #14532d" : "1px solid #4c1d95",
            background: item.completed ? "#052e16" : "#2e1065",
            color: item.completed ? "#4ade80" : "#ddd6fe",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          {item.completed ? "✅ Completed" : "🎯 Ready"}
        </div>
      </div>

      <div style={{ marginTop: "12px", fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6 }}>
        {item.section_name} • {item.difficulty || "Standard"} difficulty
      </div>

      <button
        onClick={onOpen}
        style={{
          marginTop: "16px",
          padding: "10px 16px",
          borderRadius: "10px",
          border: item.completed ? "1px solid #14532d" : "1px solid #6d28d9",
          background: "transparent",
          color: item.completed ? "#4ade80" : "#c4b5fd",
          fontSize: "12px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {item.completed ? "Review Module →" : "Open Challenge →"}
      </button>
    </div>
  );
}

function LeaderboardPreviewCard({ items, currentUserRank, onOpen }) {
  return (
    <div
      style={{
        borderRadius: "18px",
        border: "1px solid #1e293b",
        background: "#0f172a",
        padding: "24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
            Leaderboard Preview
          </div>
          <div style={{ marginTop: "4px", fontSize: "13px", color: "#94a3b8" }}>
            Top users by XP
          </div>
        </div>
        <button
          onClick={onOpen}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            border: "1px solid #1e3a5f",
            background: "transparent",
            color: "#22d3ee",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          View All →
        </button>
      </div>

      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.length === 0 ? (
          <div style={{ color: "#475569", fontSize: "13px" }}>No leaderboard data available.</div>
        ) : (
          items.map((entry, index) => (
            <div
              key={`${entry.id || entry.email || index}`}
              style={{
                borderRadius: "12px",
                border: "1px solid #1e293b",
                background: "#020617",
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "999px",
                    background: index === 0 ? "#3f2a00" : index === 1 ? "#1f2937" : "#2d1b1b",
                    border: "1px solid #1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    color: index === 0 ? "#fbbf24" : index === 1 ? "#cbd5e1" : "#fca5a5",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#f8fafc",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {entry.email || `User ${index + 1}`}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>
                    Level {safeNum(entry.level, 1)} • {safeNum(entry.modules_completed)} modules completed
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#22d3ee" }}>
                {safeNum(entry.xp)} XP
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: "14px",
          padding: "12px 14px",
          borderRadius: "12px",
          background: "#0c1f35",
          border: "1px solid #0e3a5a",
          color: "#67e8f9",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        Your current rank: #{safeNum(currentUserRank, 1)}
      </div>
    </div>
  );
}

function RadarChartCard({ metrics }) {
  const size = 280;
  const center = size / 2;
  const radius = 90;
  const levels = [20, 40, 60, 80, 100];
  const labels = metrics.map((m) => m.label);

  const pointAt = (index, value, r = radius) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const scaled = (r * value) / 100;
    return {
      x: center + Math.cos(angle) * scaled,
      y: center + Math.sin(angle) * scaled,
    };
  };

  const polygonPoints = metrics
    .map((metric, index) => {
      const point = pointAt(index, Math.max(0, Math.min(100, safeNum(metric.value))));
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <div
      style={{
        borderRadius: "18px",
        border: "1px solid #1e293b",
        background: "#0f172a",
        padding: "24px",
      }}
    >
      <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
        Skills Radar
      </div>
      <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
        Snapshot of your current awareness strengths
      </div>

      <div
        style={{
          marginTop: "18px",
          borderRadius: "14px",
          border: "1px solid #1e293b",
          background: "#020617",
          padding: "14px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: "320px", height: "320px" }}>
          {levels.map((level) => {
            const ring = metrics
              .map((_, index) => {
                const point = pointAt(index, level);
                return `${point.x},${point.y}`;
              })
              .join(" ");
            return (
              <polygon
                key={level}
                points={ring}
                fill="none"
                stroke="rgba(148,163,184,0.18)"
                strokeWidth="1"
              />
            );
          })}

          {metrics.map((_, index) => {
            const edge = pointAt(index, 100);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={edge.x}
                y2={edge.y}
                stroke="rgba(148,163,184,0.18)"
                strokeWidth="1"
              />
            );
          })}

          <polygon
            points={polygonPoints}
            fill="rgba(34,211,238,0.18)"
            stroke="rgb(34,211,238)"
            strokeWidth="2"
          />

          {metrics.map((metric, index) => {
            const point = pointAt(index, Math.max(0, Math.min(100, safeNum(metric.value))));
            const labelPoint = pointAt(index, 116);
            return (
              <g key={metric.label}>
                <circle cx={point.x} cy={point.y} r="4" fill="rgb(34,211,238)" />
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  fill="#cbd5e1"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {metric.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
        {metrics.map((metric) => (
          <div
            key={metric.label}
            style={{
              borderRadius: "12px",
              border: "1px solid #1e293b",
              background: "#020617",
              padding: "12px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{metric.label}</div>
            <div style={{ marginTop: "6px", fontSize: "18px", fontWeight: 800, color: "#22d3ee" }}>
              {safeNum(metric.value)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineCard({ items }) {
  return (
    <div
      style={{
        borderRadius: "18px",
        border: "1px solid #1e293b",
        background: "#0f172a",
        padding: "24px",
      }}
    >
      <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
        Recent Timeline
      </div>
      <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
        Your latest module and simulation completions
      </div>

      <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.length === 0 ? (
          <div style={{ color: "#475569", fontSize: "13px" }}>No timeline items available.</div>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item.type}-${item.title}-${item.date}-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: "12px",
                alignItems: "start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "999px",
                    background: item.type === "module" ? "#0c1f35" : "#1c1400",
                    border: item.type === "module" ? "1px solid #0e7490" : "1px solid #b45309",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.type === "module" ? "#22d3ee" : "#fbbf24",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {item.type === "module" ? "📘" : "🎯"}
                </div>
                {index < items.length - 1 && (
                  <div
                    style={{
                      width: "2px",
                      flex: 1,
                      background: "#1e293b",
                      minHeight: "36px",
                      marginTop: "6px",
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  borderRadius: "12px",
                  border: "1px solid #1e293b",
                  background: "#020617",
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "13px" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    {formatDateTime(item.date)}
                  </div>
                </div>
                <div style={{ marginTop: "6px", fontSize: "12px", color: "#94a3b8" }}>
                  {item.type === "module" ? "Module completed" : "Simulation completed"}
                  {item.section_name ? ` • ${item.section_name}` : ""}
                </div>
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#22d3ee", fontWeight: 700 }}>
                  Score: {safeNum(item.score)}%
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [trainingData, setTrainingData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [sections, setSections] = useState([]);
  const [recentActivityData, setRecentActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      const [trainingRes, dashboardRes, sectionsRes, recentRes] = await Promise.allSettled([
        api("/training/stats"),
        api("/dashboard/stats"),
        api("/dashboard/sections"),
        api("/dashboard/recent-activity"),
      ]);

      if (!active) return;

      const trainingOk = trainingRes.status === "fulfilled";
      const dashboardOk = dashboardRes.status === "fulfilled";
      const sectionsOk = sectionsRes.status === "fulfilled";
      const recentOk = recentRes.status === "fulfilled";

      if (!trainingOk && !dashboardOk) {
        const firstError =
          trainingRes.status === "rejected"
            ? trainingRes.reason
            : dashboardRes.status === "rejected"
              ? dashboardRes.reason
              : new Error("Failed to load dashboard data.");
        setError(firstError?.message || "Failed to load dashboard data.");
        setLoading(false);
        return;
      }

      setTrainingData(trainingOk ? trainingRes.value : {});
      setDashboardStats(dashboardOk ? dashboardRes.value : {});
      setSections(sectionsOk ? sectionsRes.value?.sections || [] : []);
      setRecentActivityData(recentOk ? recentRes.value : {});
      setLoading(false);
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Layout title="Training Dashboard">
        <div style={{ color: "#94a3b8", padding: "20px" }}>Loading dashboard...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Training Dashboard">
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
            background: "#2d0a0a",
            border: "1px solid #5f1d1d",
            color: "#f87171",
          }}
        >
          {error}
        </div>
      </Layout>
    );
  }

  const td = trainingData || {};
  const ds = dashboardStats || {};
  const ra = recentActivityData || {};

  const stats = td.stats || {
    detectionRate: ds.detectionRate || 0,
    correctAnswers: ds.totalReports || 0,
    totalAnswers: ds.totalAttempts || 0,
    totalAttempts: ds.totalAttempts || 0,
    averageScore: ds.averageScore || 0,
    credentialFailures: ds.credentialFailures || 0,
    totalReports: ds.totalReports || 0,
    totalMarkedSafe: ds.totalMarkedSafe || 0,
    linkClicks: ds.linkClicks || 0,
  };

  const decisionStats = td.decisionStats || {
    decisionAccuracy: ds.decisionAccuracy || 0,
    totalDecisions: safeNum(ds.totalReports) + safeNum(ds.totalMarkedSafe),
    correctReports: td?.decisionStats?.correctReports || 0,
    correctSafe: td?.decisionStats?.correctSafe || 0,
    falsePositives: td?.decisionStats?.falsePositives || 0,
    missedPhishing: td?.decisionStats?.missedPhishing || 0,
  };

  const moduleStats = td.moduleStats || {
    completed: ds.modulesCompleted || 0,
    total: ds.totalModules || 0,
    percentComplete: ds.modulePercent || 0,
  };

  const leaderboardRank = td.leaderboardRank || ds.userRank || 1;
  const totalUsers = td.totalUsers || Math.max((ds.leaderboard || []).length, leaderboardRank || 1);
  const certified = typeof td.certified === "boolean" ? td.certified : !!ds.certified;
  const certificate = td.certificate || null;
  const earnedBadges = Array.isArray(td.earnedBadges) ? td.earnedBadges : [];
  const lockedBadges = Array.isArray(td.lockedBadges) ? td.lockedBadges : [];
  const milestones = Array.isArray(td.milestones) ? td.milestones : [];
  const recommendations = Array.isArray(td.recommendations) ? td.recommendations : [];
  const recentScores = Array.isArray(td.recentScores)
    ? td.recentScores
    : Array.isArray(ra.recentAttempts)
      ? ra.recentAttempts
      : [];
  const chartData = Array.isArray(td.chartData)
    ? td.chartData
    : recentScores
        .slice()
        .reverse()
        .map((attempt, index) => ({
          id: attempt.id || index,
          score: safeNum(attempt.score),
        }));

  const recentActivity = Array.isArray(td.recentActivity)
    ? td.recentActivity
    : [
        ...(Array.isArray(ra.recentAttempts) ? ra.recentAttempts : []),
        ...(Array.isArray(ra.recentModules) ? ra.recentModules : []),
      ]
        .sort((a, b) => {
          const aTime = new Date(a.created_at || a.completed_at || a.started_at || 0).getTime();
          const bTime = new Date(b.created_at || b.completed_at || b.started_at || 0).getTime();
          return bTime - aTime;
        })
        .slice(0, 10);

  const totalSectionModules = sections.reduce((s, sec) => s + safeNum(sec.total_modules), 0);
  const completedSectionModules = sections.reduce((s, sec) => s + safeNum(sec.completed_modules), 0);
  const overallSectionPercent =
    totalSectionModules > 0 ? Math.round((completedSectionModules / totalSectionModules) * 100) : 0;

  const radarMetrics = [
    { label: "Detection", value: safeNum(ds.detectionRate || stats.detectionRate) },
    { label: "Decision", value: safeNum(ds.decisionAccuracy || decisionStats.decisionAccuracy) },
    { label: "Quiz", value: safeNum(ds.avgQuizScore || 0) },
    { label: "Modules", value: safeNum(ds.modulePercent || moduleStats.percentComplete) },
    {
      label: "Safety",
      value: Math.max(
        0,
        100 - Math.min(100, safeNum(ds.credentialFailures) * 10 + safeNum(ds.linkClicks) * 5)
      ),
    },
  ];

  return (
    <Layout title="Training Dashboard">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
          }}
        >
          <QuickActionButton label="🎯 Start Simulation" onClick={() => navigate("/simulations")} color="#22d3ee" />
          <QuickActionButton label="📖 Resume Module" onClick={() => navigate("/sections")} color="#a78bfa" />
          <QuickActionButton label="🛡 Threat Library" onClick={() => navigate("/threat-library")} color="#34d399" />
          <QuickActionButton label="📋 Training History" onClick={() => navigate("/attempts-history")} color="#fbbf24" />
          <QuickActionButton label="🏆 Leaderboard" onClick={() => navigate("/leaderboard")} color="#f472b6" />
          <QuickActionButton label="🎓 Certificate" onClick={() => navigate("/certificate")} color="#4ade80" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "20px" }}>
          <XpLevelCard dashboardStats={ds} />
          <DailyChallengeCard
            item={ds.dailyChallenge}
            onOpen={() => {
              if (ds?.dailyChallenge?.id) {
                navigate("/sections");
              } else {
                navigate("/sections");
              }
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          <div
            style={{
              borderRadius: "18px",
              padding: "24px",
              background: "linear-gradient(135deg, #0e3a5a 0%, #0f172a 100%)",
              border: "1px solid #22d3ee",
            }}
          >
            <div style={{ fontSize: "12px", color: "#67e8f9", fontWeight: 600, letterSpacing: "0.08em" }}>
              LEADERBOARD RANK
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "#f8fafc",
                lineHeight: 1.1,
                marginTop: "8px",
              }}
            >
              #{leaderboardRank || "?"}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
              of {totalUsers} users
            </div>
            <button
              onClick={() => navigate("/leaderboard")}
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid #22d3ee",
                background: "transparent",
                color: "#22d3ee",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View Leaderboard →
            </button>
          </div>

          <div
            style={{
              borderRadius: "18px",
              padding: "24px",
              background: "#0f172a",
              border: "1px solid #1e293b",
            }}
          >
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em" }}>
              MODULE PROGRESS
            </div>
            <div style={{ marginTop: "8px", display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontSize: "48px", fontWeight: 800, color: "#a78bfa", lineHeight: 1.1 }}>
                {safeNum(moduleStats.completed)}
              </span>
              <span style={{ fontSize: "20px", color: "#475569", fontWeight: 600 }}>
                /{safeNum(moduleStats.total)}
              </span>
            </div>
            <div style={{ marginTop: "12px" }}>
              <ProgressBar value={safeNum(moduleStats.percentComplete)} color="#a78bfa" />
            </div>
            <div style={{ marginTop: "6px", fontSize: "12px", color: "#94a3b8" }}>
              {safeNum(moduleStats.percentComplete)}% complete
            </div>
            <button
              onClick={() => navigate("/sections")}
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid #3b1f5f",
                background: "transparent",
                color: "#a78bfa",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Continue Modules →
            </button>
          </div>

          <div
            style={{
              borderRadius: "18px",
              padding: "24px",
              background: certified ? "linear-gradient(135deg, #052e16 0%, #0f172a 100%)" : "#0f172a",
              border: certified ? "1px solid #14532d" : "1px solid #1e293b",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: certified ? "#4ade80" : "#94a3b8",
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              CERTIFICATE
            </div>
            <div style={{ marginTop: "12px", fontSize: "40px" }}>{certified ? "🎓" : "🔒"}</div>
            <div
              style={{
                marginTop: "8px",
                fontWeight: 700,
                color: certified ? "#4ade80" : "#475569",
                fontSize: "16px",
              }}
            >
              {certified ? "Earned!" : "Not yet earned"}
            </div>
            {certified && certificate && (
              <div style={{ marginTop: "4px", fontSize: "12px", color: "#94a3b8" }}>
                Issued • Avg score: {safeNum(certificate.averageScore)}%
              </div>
            )}
            <button
              onClick={() => navigate("/certificate")}
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                borderRadius: "10px",
                border: certified ? "1px solid #14532d" : "1px solid #1e293b",
                background: "transparent",
                color: certified ? "#4ade80" : "#94a3b8",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View Certificate →
            </button>
          </div>
        </div>

        <div
          style={{
            borderRadius: "18px",
            border: "1px solid #1e293b",
            background: "#0f172a",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
                Training Sections
              </div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                {completedSectionModules} of {totalSectionModules} modules completed across all sections
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#22d3ee" }}>
                {overallSectionPercent}%
              </div>
              <button
                onClick={() => navigate("/sections")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "1px solid #1e3a5f",
                  background: "transparent",
                  color: "#22d3ee",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                View All →
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <ProgressBar value={overallSectionPercent} color="#22d3ee" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "14px",
            }}
          >
            {sections.map((section, i) => (
              <SectionProgressCard
                key={section.id}
                section={section}
                index={i}
                onClick={() => navigate(`/sections/${section.id}/modules`)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          <StatCard
            label="Detection Rate"
            value={`${safeNum(stats.detectionRate)}%`}
            helper={`${safeNum(stats.correctAnswers || stats.totalReports)} correct of ${safeNum(stats.totalAnswers || stats.totalAttempts)}`}
            color="#22d3ee"
          />
          <StatCard
            label="Simulations Completed"
            value={safeNum(stats.totalAttempts)}
            helper="Completed training scenarios"
            color="#a78bfa"
          />
          <StatCard
            label="Average Score"
            value={`${safeNum(stats.averageScore)}%`}
            helper="Across all completed attempts"
            color="#fbbf24"
          />
          <StatCard
            label="Credential Failures"
            value={safeNum(stats.credentialFailures)}
            helper="Times credentials were entered"
            color="#f87171"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          <StatCard
            label="Phishing Reports"
            value={safeNum(stats.totalReports)}
            helper="Messages reported suspicious"
            color="#34d399"
          />
          <StatCard
            label="Marked Safe"
            value={safeNum(stats.totalMarkedSafe)}
            helper="Messages treated as legitimate"
            color="#60a5fa"
          />
          <StatCard
            label="Link Clicks"
            value={safeNum(stats.linkClicks)}
            helper="Suspicious links opened"
            color="#fb923c"
          />
          <StatCard
            label="Decision Accuracy"
            value={`${safeNum(decisionStats.decisionAccuracy)}%`}
            helper={`${safeNum(decisionStats.totalDecisions)} decisions recorded`}
            color="#f472b6"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "20px" }}>
          <ProgressChart data={chartData} />
          <div
            style={{
              borderRadius: "18px",
              border: "1px solid #1e293b",
              background: "#0f172a",
              padding: "24px",
            }}
          >
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
              Decision Analytics
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px", marginBottom: "16px" }}>
              How you handled suspicious and legitimate messages
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <StatCard
                label="Correct Reports"
                value={safeNum(decisionStats.correctReports)}
                helper="Phishing correctly reported"
                color="#4ade80"
              />
              <StatCard
                label="Correct Safe"
                value={safeNum(decisionStats.correctSafe)}
                helper="Legitimate correctly marked safe"
                color="#60a5fa"
              />
              <StatCard
                label="False Positives"
                value={safeNum(decisionStats.falsePositives)}
                helper="Legitimate incorrectly reported"
                color="#fbbf24"
              />
              <StatCard
                label="Missed Phishing"
                value={safeNum(decisionStats.missedPhishing)}
                helper="Phishing incorrectly marked safe"
                color="#f87171"
              />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "20px" }}>
          <RadarChartCard metrics={radarMetrics} />
          <LeaderboardPreviewCard
            items={Array.isArray(ds.leaderboard) ? ds.leaderboard : []}
            currentUserRank={ds.userRank}
            onOpen={() => navigate("/leaderboard")}
          />
        </div>

        <TimelineCard items={Array.isArray(ds.recentTimeline) ? ds.recentTimeline : []} />

        <div
          style={{
            borderRadius: "18px",
            border: "1px solid #1e293b",
            background: "#0f172a",
            padding: "24px",
          }}
        >
          <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc", marginBottom: "4px" }}>
            Progress Milestones
          </div>
          <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
            Track your personal security awareness progress
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {milestones.length === 0 ? (
              <div style={{ color: "#475569", fontSize: "13px" }}>No milestones available.</div>
            ) : (
              milestones.map((item) => <MilestoneCard key={item.id} item={item} />)
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div
            style={{
              borderRadius: "18px",
              border: "1px solid #1e293b",
              background: "#0f172a",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
                Earned Badges
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: "1px solid #0e3a5a",
                  color: "#22d3ee",
                  background: "#0c1f35",
                }}
              >
                {earnedBadges.length} earned
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {earnedBadges.length === 0 ? (
                <div style={{ color: "#475569", fontSize: "13px" }}>No badges earned yet.</div>
              ) : (
                earnedBadges.map((b) => <BadgeCard key={b.id} badge={b} />)
              )}
            </div>
          </div>

          <div
            style={{
              borderRadius: "18px",
              border: "1px solid #1e293b",
              background: "#0f172a",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>
                Locked Badges
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: "1px solid #1e293b",
                  color: "#64748b",
                  background: "#0f172a",
                }}
              >
                {lockedBadges.length} locked
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {lockedBadges.length === 0 ? (
                <div style={{ color: "#4ade80", fontSize: "13px" }}>All badges unlocked! 🎉</div>
              ) : (
                lockedBadges.map((b) => <BadgeCard key={b.id} badge={b} locked />)
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div
            style={{
              borderRadius: "18px",
              border: "1px solid #1e293b",
              background: "#0f172a",
              padding: "24px",
            }}
          >
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc", marginBottom: "4px" }}>
              Training Recommendations
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
              Suggestions based on your recent decisions and scores
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {recommendations.length === 0 ? (
                <div style={{ color: "#475569", fontSize: "13px" }}>No recommendations available.</div>
              ) : (
                recommendations.map((item, i) => <RecommendationCard key={i} item={item} />)
              )}
            </div>
          </div>

          <div
            style={{
              borderRadius: "18px",
              border: "1px solid #1e293b",
              background: "#0f172a",
              padding: "24px",
            }}
          >
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc", marginBottom: "4px" }}>
              Recent Activity
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
              Latest actions recorded across your training
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentActivity.length === 0 ? (
                <div style={{ color: "#475569", fontSize: "13px" }}>No activity recorded yet.</div>
              ) : (
                recentActivity.map((item, index) => (
                  <ActivityCard key={item.id || item.module_id || index} item={item} />
                ))
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: "18px",
            border: "1px solid #1e293b",
            background: "#0f172a",
            padding: "24px",
          }}
        >
<ThreatNewsFeed />
          <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc", marginBottom: "16px" }}>
            Recent Scores
          </div>
          {recentScores.length === 0 ? (
            <div style={{ color: "#475569", fontSize: "13px" }}>No completed simulations yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {recentScores.map((attempt, index) => {
                const score = safeNum(attempt.score);
                return (
                  <div
                    key={attempt.id || index}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #1e293b",
                      background: "#020617",
                      padding: "14px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#f8fafc", fontSize: "13px" }}>
                        {attempt.subject || attempt.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>
                        {formatDateTime(attempt.completed_at || attempt.created_at || attempt.started_at)}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 14px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: 700,
                        background: score >= 80 ? "#052e16" : score >= 60 ? "#1c1400" : "#2d0a0a",
                        border: score >= 80 ? "1px solid #14532d" : score >= 60 ? "1px solid #422006" : "1px solid #5f1d1d",
                        color: score >= 80 ? "#4ade80" : score >= 60 ? "#fbbf24" : "#f87171",
                      }}
                    >
                      {score}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
