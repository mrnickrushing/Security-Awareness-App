import { useEffect, useState } from "react";

const FEEDS = [
  "https://feeds.feedburner.com/TheHackersNews",
  "https://krebsonsecurity.com/feed/",
  "https://www.bleepingcomputer.com/feed/",
];

async function tryFetch(url) {
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];
  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const text = await res.text();
        return text;
      }
    } catch (_) {}
  }
  return null;
}

export default function ThreatNewsFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [source, setSource] = useState("");

  async function fetchFeed() {
    setLoading(true);
    setError(false);
    for (const feedUrl of FEEDS) {
      const text = await tryFetch(feedUrl);
      if (!text) continue;
      try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const entries = Array.from(xml.querySelectorAll("item")).slice(0, 6).map((item) => ({
          title: item.querySelector("title")?.textContent?.trim() || "Untitled",
          link: item.querySelector("link")?.textContent?.trim() || "#",
          date: item.querySelector("pubDate")?.textContent || "",
          desc: (item.querySelector("description")?.textContent || "").replace(/<[^>]*>/g, "").trim().slice(0, 130),
        }));
        if (entries.length > 0) {
          setItems(entries);
          setSource(new URL(feedUrl).hostname.replace("www.", "").replace("feeds.feedburner.com", "The Hacker News"));
          setLastUpdated(new Date().toLocaleTimeString());
          setLoading(false);
          return;
        }
      } catch (_) {}
    }
    setError(true);
    setLoading(false);
  }

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ borderRadius: "18px", border: "1px solid #1e293b", background: "#0f172a", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <div style={{ fontSize: "17px", fontWeight: 700, color: "#f8fafc" }}>Live Threat Intelligence</div>
          <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>
            {source ? `Source: ${source}` : "Latest security news"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {lastUpdated && <span style={{ fontSize: "11px", color: "#475569" }}>Updated {lastUpdated}</span>}
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: error ? "#f87171" : loading ? "#fbbf24" : "#4ade80", boxShadow: error || loading ? "none" : "0 0 6px #4ade80" }} />
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#475569", fontSize: "13px" }}>Fetching latest security news...</div>
      ) : error ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ color: "#f87171", fontSize: "13px" }}>Live feed unavailable. Check these sources directly:</div>
          {[
            { label: "The Hacker News", url: "https://thehackernews.com" },
            { label: "Krebs on Security", url: "https://krebsonsecurity.com" },
            { label: "Bleeping Computer", url: "https://www.bleepingcomputer.com" },
            { label: "CISA Advisories", url: "https://www.cisa.gov/cybersecurity-advisories" },
          ].map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: "10px", padding: "12px 14px", background: "#020617", border: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f87171"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e293b"; }}
              >
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>{s.label}</span>
                <span style={{ fontSize: "11px", color: "#f87171" }}>Visit →</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div
                style={{ borderRadius: "12px", padding: "14px 16px", background: "#020617", border: "1px solid #1e293b", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f87171"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e293b"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 600, color: "#f8fafc", fontSize: "13px", flex: 1 }}>{item.title}</div>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", whiteSpace: "nowrap", flexShrink: 0 }}>LIVE</span>
                </div>
                {item.desc && <div style={{ marginTop: "6px", fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>{item.desc}...</div>}
                {item.date && <div style={{ marginTop: "6px", fontSize: "11px", color: "#334155" }}>{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
