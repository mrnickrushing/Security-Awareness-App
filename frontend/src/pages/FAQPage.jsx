import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";

const CATEGORY_COLORS = {
  "General":         { bg: "#0c1a2e", border: "#1e3a5f", text: "#22d3ee" },
  "Phishing":        { bg: "#2d0a0a", border: "#5f1d1d", text: "#f87171" },
  "Passwords":       { bg: "#1a0c2e", border: "#3b1f5f", text: "#a78bfa" },
  "Network":         { bg: "#0c2e1a", border: "#1f5f3b", text: "#34d399" },
  "Devices":         { bg: "#2e1a0c", border: "#5f3b1f", text: "#fbbf24" },
  "Privacy":         { bg: "#2e0c1a", border: "#5f1f3b", text: "#f472b6" },
  "Simulations":     { bg: "#0c2e2e", border: "#1f5f5f", text: "#67e8f9" },
  "Certificates":    { bg: "#1a2e0c", border: "#3b5f1f", text: "#a3e635" },
};

function getCategoryColors(category) {
  return CATEGORY_COLORS[category] || { bg: "#0f172a", border: "#1e293b", text: "#94a3b8" };
}

function FAQItem({ item, isOpen, onToggle }) {
  const colors = getCategoryColors(item.category);

  return (
    <div style={{
      borderRadius: "14px",
      border: isOpen ? `1px solid ${colors.border}` : "1px solid #1e293b",
      background: isOpen ? colors.bg : "#0f172a",
      overflow: "hidden",
      transition: "border-color 0.2s, background 0.2s",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", padding: "18px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "transparent", border: "none", cursor: "pointer",
          gap: "16px", textAlign: "left",
        }}
      >
        <span style={{
          fontSize: "14px", fontWeight: 600,
          color: isOpen ? colors.text : "#e2e8f0",
          lineHeight: 1.5, flex: 1,
        }}>
          {item.question}
        </span>
        <span style={{
          fontSize: "18px", color: isOpen ? colors.text : "#475569",
          flexShrink: 0, transition: "transform 0.2s",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          display: "inline-block",
        }}>
          +
        </span>
      </button>

      {isOpen && (
        <div style={{
          padding: "0 20px 18px",
          fontSize: "14px", color: "#cbd5e1",
          lineHeight: 1.8,
          borderTop: `1px solid ${colors.border}`,
          paddingTop: "16px",
        }}>
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [faq, setFaq]               = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId]         = useState(null);
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    api("/faq")
      .then((res) => {
        setFaq(res.faq || []);
        setCategories(["All", ...(res.categories || [])]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = faq.filter((item) => {
    const matchCategory = activeCategory === "All" || item.category === activeCategory;
    const matchSearch   = !search ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  function handleToggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <Layout title="FAQ">
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Search bar */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "16px", padding: "16px 20px",
          marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px",
        }}>
          <span style={{ fontSize: "18px" }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenId(null); }}
            placeholder="Search questions and answers..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#f8fafc", fontSize: "14px",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "transparent", border: "none",
                color: "#475569", cursor: "pointer", fontSize: "16px",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category filters */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "16px", padding: "14px 18px",
          marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "8px",
        }}>
          {categories.map((cat) => {
            const colors = getCategoryColors(cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenId(null); }}
                style={{
                  padding: "6px 14px", borderRadius: "999px",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  border: isActive ? `1px solid ${colors.border}` : "1px solid #334155",
                  background: isActive ? colors.bg : "#1e293b",
                  color: isActive ? colors.text : "#94a3b8",
                  transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            );
          })}
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
          <div style={{ color: "#94a3b8", padding: "24px" }}>Loading FAQ...</div>
        ) : filtered.length === 0 ? (
          <div style={{
            padding: "40px", borderRadius: "18px", textAlign: "center",
            background: "#0f172a", border: "1px solid #1e293b", color: "#475569",
          }}>
            No questions match your search.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {Object.entries(grouped).map(([category, items]) => {
              const colors = getCategoryColors(category);
              return (
                <div key={category}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    marginBottom: "14px",
                  }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: "999px",
                      fontSize: "12px", fontWeight: 700,
                      background: colors.bg, border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}>
                      {category}
                    </span>
                    <span style={{ fontSize: "12px", color: "#475569" }}>
                      {items.length} {items.length === 1 ? "question" : "questions"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {items.map((item) => (
                      <FAQItem
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onToggle={() => handleToggle(item.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div style={{
            marginTop: "28px", textAlign: "center",
            fontSize: "13px", color: "#334155",
          }}>
            Showing {filtered.length} of {faq.length} questions
          </div>
        )}

      </div>
    </Layout>
  );
}
