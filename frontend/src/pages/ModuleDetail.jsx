import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";

const DIFFICULTY_COLORS = {
  beginner:     { bg: "#052e16", border: "#14532d", text: "#4ade80" },
  intermediate: { bg: "#1c1400", border: "#422006", text: "#fbbf24" },
  advanced:     { bg: "#2d0a0a", border: "#5f1d1d", text: "#f87171" },
};

const LEVEL_TITLES = [
  "Security Newcomer", "Threat Spotter", "Risk Analyst", "Defense Specialist",
  "Cyber Sentinel", "Threat Hunter", "Intrusion Detector", "Security Architect",
  "Elite Defender", "Security Expert",
];

function Badge({ label, colors }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: "999px",
      fontSize: "12px", fontWeight: 700,
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

// ── XP Popup ───────────────────────────────────────────────────────────────
function XpPopup({ xpAwarded, totalXP, level, onDone }) {
  const levelTitle = LEVEL_TITLES[(level || 1) - 1] || "Security Newcomer";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 50);
    const hide = setTimeout(() => { setVisible(false); setTimeout(onDone, 400); }, 3200);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0c1a2e, #0a0f1e)",
        border: "1px solid rgba(34,211,238,0.4)",
        borderRadius: "24px", padding: "36px 48px",
        textAlign: "center", boxShadow: "0 0 60px rgba(34,211,238,0.15)",
        transform: visible ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
        minWidth: "300px",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>⚡</div>
        <div style={{ fontSize: "14px", color: "#64748b", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          XP Earned
        </div>
        <div style={{
          fontSize: "56px", fontWeight: 900,
          background: "linear-gradient(135deg, #22d3ee, #38bdf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1.1, marginBottom: "8px",
        }}>
          +{xpAwarded}
        </div>
        <div style={{ fontSize: "13px", color: "#475569", marginBottom: "16px" }}>
          Total XP: {totalXP}
        </div>
        <div style={{
          padding: "10px 20px", borderRadius: "12px",
          background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
          color: "#34d399", fontSize: "14px", fontWeight: 700,
        }}>
          {levelTitle}
        </div>
      </div>
    </div>
  );
}

// ── Quiz component ─────────────────────────────────────────────────────────
function Quiz({ moduleId, questions, onComplete }) {
  const [current, setCurrent]     = useState(0);
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults]     = useState(null);
  const [score, setScore]         = useState(null);
  const [passed, setPassed]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const q        = questions[current];
  const totalQ   = questions.length;
  const answered = Object.keys(answers).length;

  function selectAnswer(questionId, choice) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
  }

  async function submitQuiz() {
    if (answered < totalQ) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = Object.entries(answers).map(([questionId, selectedChoice]) => ({
        questionId: Number(questionId),
        selectedChoice,
      }));
      const res = await api(`/modules/${moduleId}/quiz`, {
        method: "POST",
        body: JSON.stringify({ answers: payload }),
      });
      setResults(res.results || []);
      setScore(res.score);
      setPassed(res.passed || false);
      setSubmitted(true);
      onComplete(res.score, res.passed || false, res.xpAwarded || 0, res.totalXP || 0, res.level || 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function retakeQuiz() {
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setResults(null);
    setScore(null);
    setPassed(false);
    setError("");
  }

  const choices = [
    { key: "A", label: q.choice_a },
    { key: "B", label: q.choice_b },
    { key: "C", label: q.choice_c },
  ];

  const selectedForCurrent = answers[q.id];

  if (submitted && results) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{
          padding: "24px", borderRadius: "16px", textAlign: "center",
          background: passed ? "#052e16" : score >= 60 ? "#1c1400" : "#2d0a0a",
          border: `1px solid ${passed ? "#14532d" : score >= 60 ? "#422006" : "#5f1d1d"}`,
        }}>
          <div style={{
            fontSize: "48px", fontWeight: 800,
            color: passed ? "#4ade80" : score >= 60 ? "#fbbf24" : "#f87171",
          }}>
            {score}%
          </div>
          <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: "16px", marginTop: "8px" }}>
            {passed ? "🎉 Module complete! Great work." : "❌ Score below 80% — module not yet complete."}
          </div>
          <div style={{ color: "#94a3b8", marginTop: "6px", fontSize: "13px" }}>
            {passed
              ? "This module has been marked as complete on your profile."
              : "Review the explanations below and retake the quiz when ready."}
          </div>
          {!passed && (
            <button onClick={retakeQuiz} style={{
              marginTop: "16px", padding: "10px 24px", borderRadius: "12px",
              border: "none", background: "#0e7490", color: "#fff",
              fontWeight: 700, cursor: "pointer", fontSize: "14px",
            }}>
              🔄 Retake Quiz
            </button>
          )}
        </div>

        {results.map((r, i) => {
          const orig = questions.find((q) => q.id === r.questionId);
          return (
            <div key={r.questionId} style={{
              padding: "20px", borderRadius: "14px",
              background: r.isCorrect ? "#052e16" : "#2d0a0a",
              border: `1px solid ${r.isCorrect ? "#14532d" : "#5f1d1d"}`,
            }}>
              <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: "12px" }}>
                Q{i + 1}: {orig?.question_text}
              </div>
              <div style={{ fontSize: "13px", color: r.isCorrect ? "#4ade80" : "#f87171", marginBottom: "8px" }}>
                {r.isCorrect ? "✅ Correct" : `❌ You answered ${r.selectedChoice} — Correct answer: ${r.correctChoice}`}
              </div>
              {r.explanation && (
                <div style={{
                  padding: "12px", borderRadius: "10px",
                  background: "rgba(0,0,0,0.3)", color: "#cbd5e1",
                  fontSize: "13px", lineHeight: 1.6,
                }}>
                  💡 {r.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#94a3b8", fontSize: "13px" }}>Question {current + 1} of {totalQ}</div>
        <div style={{ color: "#22d3ee", fontSize: "13px", fontWeight: 600 }}>{answered} / {totalQ} answered</div>
      </div>
      <ProgressBar value={((current + 1) / totalQ) * 100} color="#22d3ee" />

      <div style={{ padding: "20px", borderRadius: "14px", background: "#020617", border: "1px solid #334155" }}>
        <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "15px", lineHeight: 1.5 }}>{q.question_text}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {choices.map((c) => {
          const isSelected = selectedForCurrent === c.key;
          return (
            <button key={c.key} onClick={() => selectAnswer(q.id, c.key)} style={{
              padding: "14px 18px", borderRadius: "12px", textAlign: "left",
              border: isSelected ? "1px solid #22d3ee" : "1px solid #334155",
              background: isSelected ? "#0e3a5a" : "#0f172a",
              color: isSelected ? "#f0f9ff" : "#cbd5e1",
              cursor: "pointer", fontWeight: isSelected ? 700 : 400,
              fontSize: "14px", transition: "all 0.15s",
            }}>
              <span style={{
                display: "inline-block", width: "24px", height: "24px",
                borderRadius: "50%", textAlign: "center", lineHeight: "24px",
                marginRight: "12px", fontSize: "12px", fontWeight: 700,
                background: isSelected ? "#22d3ee" : "#1e293b",
                color: isSelected ? "#020617" : "#94a3b8",
              }}>{c.key}</span>
              {c.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <button onClick={() => setCurrent((p) => Math.max(0, p - 1))} disabled={current === 0} style={{
          padding: "10px 20px", borderRadius: "12px",
          border: "1px solid #334155", background: "#1e293b",
          color: current === 0 ? "#475569" : "#e2e8f0",
          cursor: current === 0 ? "not-allowed" : "pointer", fontWeight: 600,
        }}>
          ← Previous
        </button>

        {current < totalQ - 1 ? (
          <button onClick={() => setCurrent((p) => p + 1)} style={{
            padding: "10px 20px", borderRadius: "12px", border: "none",
            background: "#0e7490", color: "#fff", fontWeight: 700, cursor: "pointer",
          }}>
            Next →
          </button>
        ) : (
          <button onClick={submitQuiz} disabled={loading || answered < totalQ} style={{
            padding: "10px 20px", borderRadius: "12px", border: "none",
            background: answered < totalQ ? "#1e293b" : "#16a34a",
            color: answered < totalQ ? "#475569" : "#fff",
            fontWeight: 700, cursor: answered < totalQ ? "not-allowed" : "pointer",
          }}>
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {questions.map((q2, i) => (
          <button key={q2.id} onClick={() => setCurrent(i)} style={{
            width: "28px", height: "28px", borderRadius: "50%", border: "none",
            background: i === current ? "#22d3ee" : answers[q2.id] ? "#14532d" : "#1e293b",
            color: i === current ? "#020617" : answers[q2.id] ? "#4ade80" : "#94a3b8",
            fontWeight: 700, fontSize: "11px", cursor: "pointer",
          }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function ModuleDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const contentRef = useRef(null);

  const [module, setModule]         = useState(null);
  const [questions, setQuestions]   = useState([]);
  const [error, setError]           = useState("");
  const [tab, setTab]               = useState("content");
  const [quizScore, setQuizScore]   = useState(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [xpPopup, setXpPopup]       = useState(null);

  useEffect(() => {
    api(`/modules/${id}`)
      .then((res) => {
        setModule(res.module);
        setQuestions(res.questions || []);
        if (res.module?.quiz_score !== null && res.module?.quiz_score !== undefined) {
          setQuizScore(res.module.quiz_score);
          if (res.module.completed) setQuizPassed(true);
        }
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleStart() {
    await api(`/modules/${id}/start`, { method: "POST", body: JSON.stringify({}) });
    const res = await api(`/modules/${id}`);
    setModule(res.module);
    setTab("content");
  }

  function handleQuizComplete(score, passed, xpAwarded, totalXP, level) {
    setQuizScore(score);
    setQuizPassed(passed);
    if (passed) {
      setModule((prev) => prev ? { ...prev, completed: true, quiz_score: score } : prev);
      if (xpAwarded > 0) setXpPopup({ xpAwarded, totalXP, level });
    } else {
      setModule((prev) => prev ? { ...prev, quiz_score: score } : prev);
    }
  }

  if (error) return <Layout title="Module Detail"><div style={{ color: "#f87171", padding: "20px" }}>{error}</div></Layout>;
  if (!module) return <Layout title="Module Detail"><div style={{ color: "#94a3b8", padding: "20px" }}>Loading...</div></Layout>;

  const diffColors = DIFFICULTY_COLORS[module.difficulty] || DIFFICULTY_COLORS["beginner"];

  return (
    <Layout title="Module Detail">
      {xpPopup && (
        <XpPopup
          xpAwarded={xpPopup.xpAwarded}
          totalXP={xpPopup.totalXP}
          level={xpPopup.level}
          onDone={() => setXpPopup(null)}
        />
      )}

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "18px", padding: "28px", marginBottom: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#f8fafc" }}>{module.title}</h1>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                <Badge label={module.category || "General"} colors={{ bg: "#0c1a2e", border: "#1e3a5f", text: "#60a5fa" }} />
                <Badge label={module.difficulty || "beginner"} colors={diffColors} />
                <Badge label={`⏱ ${module.duration_minutes || 10} min`} colors={{ bg: "#0f172a", border: "#334155", text: "#94a3b8" }} />
                {module.completed && <Badge label="✅ Completed" colors={{ bg: "#052e16", border: "#14532d", text: "#4ade80" }} />}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
              {!module.started && (
                <button onClick={handleStart} style={{
                  padding: "10px 20px", borderRadius: "12px", border: "none",
                  background: "#0e7490", color: "#fff", fontWeight: 700, cursor: "pointer",
                }}>
                  Start Module
                </button>
              )}
              {quizScore !== null && (
                <div style={{
                  padding: "8px 14px", borderRadius: "10px",
                  background: quizPassed ? "#052e16" : "#1c1400",
                  border: `1px solid ${quizPassed ? "#14532d" : "#422006"}`,
                  color: quizPassed ? "#4ade80" : "#fbbf24",
                  fontWeight: 700, fontSize: "14px",
                }}>
                  🎯 Quiz: {quizScore}% {quizPassed ? "— Passed" : "— Retake needed"}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
          <button onClick={() => setTab("content")} style={{
            padding: "10px 20px", borderRadius: "10px", fontWeight: 700,
            border: tab === "content" ? "1px solid #22d3ee" : "1px solid #334155",
            background: tab === "content" ? "#0e3a5a" : "#0f172a",
            color: tab === "content" ? "#22d3ee" : "#94a3b8", cursor: "pointer",
          }}>
            📖 Content
          </button>
          {questions.length > 0 && (
            <button onClick={() => setTab("quiz")} style={{
              padding: "10px 20px", borderRadius: "10px", fontWeight: 700,
              border: tab === "quiz" ? "1px solid #22d3ee" : "1px solid #334155",
              background: tab === "quiz" ? "#0e3a5a" : "#0f172a",
              color: tab === "quiz" ? "#22d3ee" : "#94a3b8", cursor: "pointer",
            }}>
              🧠 Quiz {quizScore !== null ? `(${quizScore}%)` : ""}
            </button>
          )}
        </div>

        {tab === "content" && (
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "18px", padding: "32px" }}>
            <div ref={contentRef} style={{ color: "#cbd5e1", lineHeight: 1.9, fontSize: "15px", whiteSpace: "pre-wrap" }}>
              {module.content}
            </div>
            {questions.length > 0 && (
              <button onClick={() => setTab("quiz")} style={{
                marginTop: "28px", padding: "12px 24px", borderRadius: "12px",
                border: "none", background: "#0e7490", color: "#fff",
                fontWeight: 700, cursor: "pointer", fontSize: "15px",
              }}>
                Take the Quiz →
              </button>
            )}
          </div>
        )}

        {tab === "quiz" && questions.length > 0 && (
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "18px", padding: "28px" }}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc" }}>Knowledge Check</div>
              <div style={{ color: "#94a3b8", marginTop: "4px", fontSize: "13px" }}>
                {questions.length} questions — you need 80% or higher to complete this module
              </div>
            </div>
            <Quiz moduleId={id} questions={questions} onComplete={handleQuizComplete} />
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <button onClick={() => navigate(-1)} style={{
            padding: "10px 18px", borderRadius: "12px",
            border: "1px solid #334155", background: "#0f172a",
            color: "#94a3b8", cursor: "pointer", fontWeight: 600,
          }}>
            ← Back
          </button>
        </div>
      </div>
    </Layout>
  );
}
