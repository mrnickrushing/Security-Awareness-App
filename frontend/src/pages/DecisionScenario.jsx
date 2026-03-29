import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api";

// ── Utilities ────────────────────────────────────────────────────────────────

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function DraggableWindow({ id, title, children, onClose, zIndex, onFocus, initialPos = { x: 120, y: 80 } }) {
  const [pos, setPos] = useState(initialPos);
  const [minimized, setMinimized] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const onMouseDown = (e) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    onFocus(id);
    e.preventDefault();
  };
  useEffect(() => {
    const move = (e) => { if (!dragging.current) return; setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y }); };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);
  return (
    <div onMouseDown={() => onFocus(id)} style={{ position: "absolute", left: pos.x, top: pos.y, width: "480px", zIndex, borderRadius: "8px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", border: "1px solid #4a4a6a" }}>
      <div onMouseDown={onMouseDown} style={{ background: "linear-gradient(90deg, #1a1a3e, #2d2d5e)", padding: "8px 12px", cursor: "grab", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{title}</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => setMinimized(!minimized)} style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#fbbf24", border: "none", cursor: "pointer" }} />
          <button onClick={onClose} style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#f87171", border: "none", cursor: "pointer" }} />
        </div>
      </div>
      {!minimized && <div style={{ background: "#1e1e2e", padding: "16px" }}>{children}</div>}
    </div>
  );
}

// ── Malware Desktop Windows ───────────────────────────────────────────────────

function AntivirusPopup({ onChoice }) {
  return (
    <div>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ fontSize: "32px" }}>🛡️</div>
        <div>
          <div style={{ fontWeight: 700, color: "#f87171", fontSize: "15px" }}>Threat Detected</div>
          <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px", lineHeight: 1.5 }}>
            Windows Defender has detected a threat.<br />
            <strong style={{ color: "#fbbf24" }}>Trojan:Win32/CryptInject.MK</strong><br />
            Location: C:\Users\User\AppData\Roaming\svchost32.exe
          </div>
        </div>
      </div>
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "14px" }}>Severity: High | Status: Active | Category: Trojan</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { label: "Remove threat now", correct: true, outcome: "Quarantining and removing the threat immediately is the right first response." },
          { label: "Ignore and continue working", correct: false, outcome: "Ignoring an active trojan allows it to continue stealing data and spreading." },
          { label: "Turn off Windows Defender so the popup stops", correct: false, outcome: "Disabling your antivirus while a trojan is active is one of the worst things you can do." },
        ].map((opt, i) => (
          <button key={i} onClick={() => onChoice(opt)} style={{ textAlign: "left", padding: "10px 14px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#cbd5e1", fontSize: "13px", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.background = "#0f172a"; }}
          >{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

function TaskManagerWindow({ onChoice }) {
  const processes = [
    { name: "svchost32.exe", cpu: "87%", mem: "342 MB", suspicious: true },
    { name: "chrome.exe",    cpu: "4%",  mem: "210 MB", suspicious: false },
    { name: "explorer.exe",  cpu: "1%",  mem: "48 MB",  suspicious: false },
    { name: "Discord.exe",   cpu: "2%",  mem: "180 MB", suspicious: false },
  ];
  return (
    <div>
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>Processes | Performance | Startup</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "14px" }}>
        <thead><tr style={{ borderBottom: "1px solid #334155" }}>{["Name","CPU","Memory"].map(h => <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#64748b", fontWeight: 600 }}>{h}</th>)}</tr></thead>
        <tbody>{processes.map((p, i) => (
          <tr key={i} style={{ background: p.suspicious ? "rgba(248,113,113,0.08)" : "transparent", borderBottom: "1px solid #1e293b" }}>
            <td style={{ padding: "7px 8px", color: p.suspicious ? "#f87171" : "#cbd5e1", fontWeight: p.suspicious ? 700 : 400 }}>{p.suspicious ? "⚠️ " : ""}{p.name}</td>
            <td style={{ padding: "7px 8px", color: p.suspicious ? "#f87171" : "#94a3b8" }}>{p.cpu}</td>
            <td style={{ padding: "7px 8px", color: p.suspicious ? "#f87171" : "#94a3b8" }}>{p.mem}</td>
          </tr>
        ))}</tbody>
      </table>
      <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px" }}>svchost32.exe is consuming 87% CPU. The real svchost.exe never has a number suffix. What do you do?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { label: "End the svchost32.exe process and flag it for removal", correct: true, outcome: "Ending the malicious process stops active damage. svchost32 is a classic malware impersonation tactic." },
          { label: "Restart the PC to clear the high CPU usage", correct: false, outcome: "Restarting without ending the process just lets the malware reload at startup." },
          { label: "Leave it running since svchost is a Windows process", correct: false, outcome: "The real svchost.exe never has a number suffix. svchost32.exe is a malware impersonation." },
        ].map((opt, i) => (
          <button key={i} onClick={() => onChoice(opt)} style={{ textAlign: "left", padding: "10px 14px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#cbd5e1", fontSize: "13px", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.background = "#0f172a"; }}
          >{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

function BrowserHijackWindow({ onChoice }) {
  return (
    <div>
      <div style={{ background: "#0a0a1a", borderRadius: "6px", padding: "10px 14px", marginBottom: "14px", border: "1px solid #334155" }}>
        <div style={{ fontSize: "11px", color: "#475569", marginBottom: "4px" }}>🔒 http://secure-scan-now.xyz/alert</div>
        <div style={{ fontWeight: 700, color: "#f87171", fontSize: "16px", marginBottom: "6px" }}>⚠️ YOUR COMPUTER IS INFECTED</div>
        <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6 }}>5 viruses detected. Call Microsoft Support:<br /><span style={{ color: "#fbbf24", fontWeight: 700 }}>1-800-FAKE-NUM</span><br />Do NOT close this window.</div>
      </div>
      <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px" }}>A browser tab opened this fullscreen alert. What do you do?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { label: "Close the browser tab and ignore the fake alert — this is scareware", correct: true, outcome: "Correct. Legitimate security software never displays phone numbers or locks your browser." },
          { label: "Call the number to get help removing the viruses", correct: false, outcome: "That number connects to scammers who will charge you money and install real malware." },
          { label: "Click the button on the page to run their recommended scan tool", correct: false, outcome: "Downloading software from a scareware page will almost certainly install additional malware." },
        ].map((opt, i) => (
          <button key={i} onClick={() => onChoice(opt)} style={{ textAlign: "left", padding: "10px 14px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#cbd5e1", fontSize: "13px", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.background = "#0f172a"; }}
          >{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

function FinalScanWindow({ score, onFinish }) {
  const clean = score >= 2;
  return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>{clean ? "✅" : "⚠️"}</div>
      <div style={{ fontWeight: 700, color: clean ? "#34d399" : "#f87171", fontSize: "16px", marginBottom: "8px" }}>{clean ? "System Clean" : "Threats May Remain"}</div>
      <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "16px" }}>{clean ? "You handled all threats correctly. No remaining infections detected." : "Some threats were not handled correctly. Run a full scan before resuming use."}</div>
      <div style={{ fontSize: "12px", color: "#475569", marginBottom: "16px" }}>Correct responses: {score} / 3</div>
      <button onClick={onFinish} style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>View Results</button>
    </div>
  );
}

function DesktopIcon({ icon, label, onClick, pulse = false }) {
  return (
    <button onClick={onClick} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px", borderRadius: "8px", width: "80px", position: "relative" }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {pulse && <div style={{ position: "absolute", top: "6px", right: "6px", width: "10px", height: "10px", borderRadius: "50%", background: "#f87171", animation: "pulse 1.2s infinite" }} />}
      <div style={{ fontSize: "32px" }}>{icon}</div>
      <div style={{ fontSize: "11px", color: "#e2e8f0", textAlign: "center", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>{label}</div>
    </button>
  );
}

function FeedbackToast({ feedback, onDismiss }) {
  if (!feedback) return null;
  return (
    <div style={{ position: "absolute", bottom: "60px", left: "50%", transform: "translateX(-50%)", zIndex: 200, width: "420px", borderRadius: "14px", padding: "16px 20px", background: feedback.correct ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)", border: feedback.correct ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(248,113,113,0.4)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
      <div style={{ fontWeight: 700, color: feedback.correct ? "#34d399" : "#f87171", fontSize: "14px", marginBottom: "4px" }}>{feedback.correct ? "Good call" : "Not the best move"}</div>
      <div style={{ fontSize: "13px", color: feedback.correct ? "#a7f3d0" : "#fecaca", lineHeight: 1.5 }}>{feedback.outcome}</div>
      <button onClick={onDismiss} style={{ marginTop: "10px", padding: "6px 16px", borderRadius: "8px", border: "none", background: feedback.correct ? "#065f46" : "#7f1d1d", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Continue</button>
    </div>
  );
}

// ── Simulated Desktop (Malware scenario) ─────────────────────────────────────

function SimulatedDesktop({ simulation, onComplete }) {
  const clock = useClock();
  const [stage, setStage]               = useState(0);
  const [windows, setWindows]           = useState([]);
  const [zOrder, setZOrder]             = useState({});
  const [zCounter, setZCounter]         = useState(10);
  const [feedback, setFeedback]         = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [pendingNext, setPendingNext]   = useState(null);

  const openWindow = (id, title, content, pos) => {
    setWindows(prev => prev.find(w => w.id === id) ? prev : [...prev, { id, title, content, pos }]);
    bringToFront(id);
  };
  const closeWindow = (id) => setWindows(prev => prev.filter(w => w.id !== id));
  const bringToFront = (id) => {
    setZCounter(z => { const next = z + 1; setZOrder(o => ({ ...o, [id]: next })); return next; });
  };

  useEffect(() => {
    if (stage === 0) setTimeout(() => openWindow("antivirus", "Windows Defender — Threat Alert", "antivirus", { x: 80, y: 60 }), 800);
    if (stage === 1) openWindow("taskman", "Task Manager", "taskman", { x: 140, y: 100 });
    if (stage === 2) openWindow("browser", "Browser Alert — secure-scan-now.xyz", "browser", { x: 100, y: 80 });
    if (stage === 3) openWindow("finalscan", "Windows Defender — Full Scan Results", "finalscan", { x: 120, y: 100 });
  }, [stage]);

  const handleChoice = (opt) => {
    const newCorrect = opt.correct ? correctCount + 1 : correctCount;
    if (opt.correct) setCorrectCount(newCorrect);
    setFeedback({ correct: opt.correct, outcome: opt.outcome, nextCorrect: newCorrect });
    setPendingNext(stage + 1);
  };

  const handleDismiss = () => {
    const next = pendingNext;
    setFeedback(null);
    setPendingNext(null);
    closeWindow(["antivirus", "taskman", "browser", "finalscan"][stage]);
    setStage(next);
    if (next >= 3) setTimeout(() => openWindow("finalscan", "Windows Defender — Full Scan Results", "finalscan", { x: 120, y: 100 }), 300);
  };

  const renderWindowContent = (w) => {
    if (w.content === "antivirus") return <AntivirusPopup onChoice={handleChoice} />;
    if (w.content === "taskman")   return <TaskManagerWindow onChoice={handleChoice} />;
    if (w.content === "browser")   return <BrowserHijackWindow onChoice={handleChoice} />;
    if (w.content === "finalscan") return <FinalScanWindow score={correctCount} onFinish={() => onComplete(correctCount)} />;
    return null;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "600px", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155", background: "linear-gradient(135deg, #1a1a4e 0%, #0d0d2b 60%, #1a0d2e 100%)" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }`}</style>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
        <DesktopIcon icon="🖥️" label="This PC" onClick={() => {}} />
        <DesktopIcon icon="🗂️" label="File Explorer" onClick={() => {}} />
        <DesktopIcon icon="🗑️" label="Recycle Bin" onClick={() => {}} />
        <DesktopIcon icon="🛡️" label="Defender" pulse={stage === 0} onClick={() => stage === 0 && openWindow("antivirus", "Windows Defender — Threat Alert", "antivirus", { x: 80, y: 60 })} />
        <DesktopIcon icon="📊" label="Task Manager" pulse={stage === 1} onClick={() => stage === 1 && openWindow("taskman", "Task Manager", "taskman", { x: 140, y: 100 })} />
      </div>
      <div style={{ position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(34,211,238,0.2)", borderRadius: "10px", padding: "8px 18px", fontSize: "12px", color: "#22d3ee", whiteSpace: "nowrap" }}>
        {stage === 0 && "Step 1 of 3 — Respond to the antivirus alert"}
        {stage === 1 && "Step 2 of 3 — Investigate suspicious processes"}
        {stage === 2 && "Step 3 of 3 — Handle the browser alert"}
        {stage >= 3 && "Reviewing results..."}
      </div>
      {windows.map(w => (
        <DraggableWindow key={w.id} id={w.id} title={w.title} onClose={() => closeWindow(w.id)} zIndex={zOrder[w.id] || 10} onFocus={bringToFront} initialPos={w.pos}>
          {renderWindowContent(w)}
        </DraggableWindow>
      ))}
      {feedback && <FeedbackToast feedback={feedback} onDismiss={handleDismiss} />}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "44px", background: "rgba(10,10,30,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid #1e293b", display: "flex", alignItems: "center", padding: "0 12px", gap: "8px", zIndex: 50 }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", cursor: "pointer" }}>⊞</div>
        <div style={{ flex: 1, display: "flex", gap: "4px" }}>
          {windows.map(w => (<button key={w.id} onClick={() => bringToFront(w.id)} style={{ padding: "4px 12px", borderRadius: "6px", border: "1px solid #334155", background: "rgba(255,255,255,0.06)", color: "#cbd5e1", fontSize: "11px", cursor: "pointer", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.title}</button>))}
        </div>
        <div style={{ fontSize: "12px", color: "#94a3b8", padding: "4px 10px", borderLeft: "1px solid #1e293b" }}>{clock}</div>
      </div>
    </div>
  );
}

// ── Task Manager Desktop ──────────────────────────────────────────────────────

function TaskManagerDesktop({ simulation, onComplete }) {
  const clock = useClock();
  const [stage, setStage]               = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [pendingFeedback, setPendingFeedback] = useState(null);
  const [startupEntries, setStartupEntries] = useState([
    { name: "updater32.exe", publisher: "Unknown",        status: "Enabled",  suspicious: true  },
    { name: "OneDrive.exe",  publisher: "Microsoft Corp", status: "Enabled",  suspicious: false },
    { name: "Discord.exe",   publisher: "Discord Inc",    status: "Enabled",  suspicious: false },
    { name: "SteamService",  publisher: "Valve Corp",     status: "Disabled", suspicious: false },
  ]);
  const [activeTab, setActiveTab] = useState("processes");

  const processes = [
    { name: "updater32.exe", cpu: "74%", mem: "298 MB", pid: "4872", suspicious: true  },
    { name: "chrome.exe",    cpu: "6%",  mem: "310 MB", pid: "1204", suspicious: false },
    { name: "explorer.exe",  cpu: "1%",  mem: "52 MB",  pid: "892",  suspicious: false },
    { name: "svchost.exe",   cpu: "2%",  mem: "88 MB",  pid: "644",  suspicious: false },
    { name: "Teams.exe",     cpu: "3%",  mem: "220 MB", pid: "2340", suspicious: false },
  ];

  const eventLog = [
    { time: "20:14:02", level: "Warning",     source: "Security",       message: "updater32.exe established outbound connection to 185.220.101.12:443" },
    { time: "20:13:47", level: "Warning",     source: "Security",       message: "updater32.exe modified registry run key HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" },
    { time: "20:12:31", level: "Information", source: "Kernel-General", message: "System uptime: 4 hours 22 minutes" },
    { time: "20:11:05", level: "Warning",     source: "Security",       message: "Failed login attempt on Administrator (3 attempts)" },
  ];

  const stageConfig = [
    {
      tab: "processes",
      instruction: "Step 1 of 3 — Identify and end the suspicious process",
      question: "updater32.exe is consuming 74% CPU and making outbound connections. It is not a recognized Windows process. What do you do?",
      choices: [
        { label: "Right click updater32.exe and select End Task", correct: true,  outcome: "Ending the process immediately stops its active network activity and CPU drain." },
        { label: "Leave it running and monitor for a few more minutes", correct: false, outcome: "Leaving an active suspicious process running gives it time to exfiltrate data or download payloads." },
        { label: "Restart the PC to clear all running processes", correct: false, outcome: "Restarting without ending the process first lets it save state and reload at startup." },
      ],
    },
    {
      tab: "startup",
      instruction: "Step 2 of 3 — Block the malware from restarting at boot",
      question: "The Startup tab shows updater32.exe set to launch automatically. What do you do?",
      choices: [
        { label: "Right click updater32.exe and select Disable", correct: true,  outcome: "Disabling the startup entry prevents the malware from reloading after a reboot." },
        { label: "Delete the entry from the list", correct: false, outcome: "Task Manager does not let you delete startup entries directly. You need Registry Editor or Autoruns." },
        { label: "Leave it — you already ended the process so it is fine", correct: false, outcome: "Ending the process only stops it now. Without disabling the startup entry it comes back every reboot." },
      ],
    },
    {
      tab: "eventlog",
      instruction: "Step 3 of 3 — Review the event log and decide next steps",
      question: "The event log shows updater32.exe made outbound connections and modified a registry run key. What is the correct next step?",
      choices: [
        { label: "Run a full antivirus scan and report the incident to your security team", correct: true,  outcome: "A full scan catches any additional files dropped. Reporting ensures the team can check for lateral spread." },
        { label: "The process is ended and startup is disabled so the machine is clean", correct: false, outcome: "Registry modifications and outbound connections mean additional persistence may exist. A full scan is mandatory." },
        { label: "Wipe and reinstall Windows immediately", correct: false, outcome: "A full wipe is premature before scanning. Most infections are fully cleaned without reinstalling." },
      ],
    },
  ];

  const current = stageConfig[stage];

  const handleChoice = (choice) => {
    const newCorrect = choice.correct ? correctCount + 1 : correctCount;
    if (choice.correct) setCorrectCount(newCorrect);
    if (stage === 1 && choice.correct) {
      setStartupEntries(prev => prev.map(e => e.suspicious ? { ...e, status: "Disabled" } : e));
    }
    setPendingFeedback({ ...choice, newCorrect });
  };

  const handleDismiss = () => {
    const next = stage + 1;
    const nc = pendingFeedback.newCorrect;
    setPendingFeedback(null);
    if (next >= 3) { onComplete(nc); return; }
    setStage(next);
    setActiveTab(stageConfig[next].tab);
  };

  const tabStyle = (tab) => ({
    padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
    border: "none", borderBottom: activeTab === tab ? "2px solid #22d3ee" : "2px solid transparent",
    background: "transparent", color: activeTab === tab ? "#22d3ee" : "#64748b",
  });

  return (
    <div style={{ borderRadius: "12px", border: "1px solid #334155", overflow: "hidden", background: "#1e1e2e" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div style={{ background: "linear-gradient(90deg, #1a1a3e, #2d2d5e)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>📊 Task Manager</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#34d399" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#fbbf24" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f87171" }} />
        </div>
      </div>
      <div style={{ padding: "10px 16px", background: "#0c1a2e", borderBottom: "1px solid #1e293b", fontSize: "12px", color: "#22d3ee", fontWeight: 600 }}>
        {current?.instruction}
      </div>
      <div style={{ display: "flex", borderBottom: "1px solid #1e293b", background: "#0f172a" }}>
        {["processes", "startup", "eventlog"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>
            {tab === "processes" ? "Processes" : tab === "startup" ? "Startup" : "Event Log"}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "8px 16px", fontSize: "11px", color: "#334155" }}>{clock}</div>
      </div>
      <div style={{ minHeight: "280px", background: "#020617" }}>
        {activeTab === "processes" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead><tr style={{ borderBottom: "1px solid #1e293b" }}>{["Name","PID","CPU","Memory"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>{processes.map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0f172a", background: p.suspicious ? "rgba(248,113,113,0.06)" : "transparent" }}>
                <td style={{ padding: "8px 12px", color: p.suspicious ? "#f87171" : "#cbd5e1", fontWeight: p.suspicious ? 700 : 400 }}>{p.suspicious && <span style={{ animation: "pulse 1s infinite", marginRight: "6px" }}>⚠️</span>}{p.name}</td>
                <td style={{ padding: "8px 12px", color: "#475569" }}>{p.pid}</td>
                <td style={{ padding: "8px 12px", color: p.suspicious ? "#f87171" : "#94a3b8" }}>{p.cpu}</td>
                <td style={{ padding: "8px 12px", color: p.suspicious ? "#f87171" : "#94a3b8" }}>{p.mem}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {activeTab === "startup" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead><tr style={{ borderBottom: "1px solid #1e293b" }}>{["Name","Publisher","Status"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>{startupEntries.map((e, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0f172a", background: e.suspicious ? "rgba(248,113,113,0.06)" : "transparent" }}>
                <td style={{ padding: "8px 12px", color: e.suspicious ? "#f87171" : "#cbd5e1", fontWeight: e.suspicious ? 700 : 400 }}>{e.suspicious && <span style={{ marginRight: "6px" }}>⚠️</span>}{e.name}</td>
                <td style={{ padding: "8px 12px", color: "#475569" }}>{e.publisher}</td>
                <td style={{ padding: "8px 12px" }}>
                  <span style={{ padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, background: e.status === "Enabled" ? (e.suspicious ? "rgba(248,113,113,0.15)" : "rgba(52,211,153,0.1)") : "rgba(100,116,139,0.15)", color: e.status === "Enabled" ? (e.suspicious ? "#f87171" : "#34d399") : "#64748b", border: e.status === "Enabled" ? (e.suspicious ? "1px solid rgba(248,113,113,0.3)" : "1px solid rgba(52,211,153,0.3)") : "1px solid #334155" }}>{e.status}</span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {activeTab === "eventlog" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead><tr style={{ borderBottom: "1px solid #1e293b" }}>{["Time","Level","Source","Message"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>{eventLog.map((e, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0f172a", background: e.level === "Warning" ? "rgba(251,191,36,0.04)" : "transparent" }}>
                <td style={{ padding: "8px 12px", color: "#475569", whiteSpace: "nowrap" }}>{e.time}</td>
                <td style={{ padding: "8px 12px" }}><span style={{ color: e.level === "Warning" ? "#fbbf24" : "#64748b", fontWeight: 600 }}>{e.level}</span></td>
                <td style={{ padding: "8px 12px", color: "#64748b", whiteSpace: "nowrap" }}>{e.source}</td>
                <td style={{ padding: "8px 12px", color: "#94a3b8", lineHeight: 1.4 }}>{e.message}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      <div style={{ borderTop: "1px solid #1e293b", padding: "16px", background: "#0a0f1e" }}>
        <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px", lineHeight: 1.6 }}>{current?.question}</div>
        {pendingFeedback ? (
          <div>
            <div style={{ padding: "14px 16px", borderRadius: "10px", marginBottom: "12px", background: pendingFeedback.correct ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: pendingFeedback.correct ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(248,113,113,0.3)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: pendingFeedback.correct ? "#34d399" : "#f87171", marginBottom: "4px" }}>{pendingFeedback.correct ? "Good call" : "Wrong move"}</div>
              <div style={{ fontSize: "12px", color: pendingFeedback.correct ? "#a7f3d0" : "#fecaca", lineHeight: 1.5 }}>{pendingFeedback.outcome}</div>
            </div>
            <button onClick={handleDismiss} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
              {stage < 2 ? "Next Step →" : "See Results"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {current?.choices.map((c, i) => (
              <button key={i} onClick={() => handleChoice(c)} style={{ textAlign: "left", padding: "11px 14px", borderRadius: "9px", border: "1px solid #1e293b", background: "#020617", color: "#cbd5e1", fontSize: "12px", lineHeight: 1.5, cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.background = "#020617"; }}
              >{c.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Network Intrusion ─────────────────────────────────────────────────────────

function NetworkNode({ id, label, icon, x, y, status, onClick, pulse }) {
  const colors = {
    healthy:  { bg: "rgba(52,211,153,0.15)",  border: "#34d399", glow: "drop-shadow(0 0 12px rgba(52,211,153,0.4))"  },
    warning:  { bg: "rgba(251,191,36,0.15)",  border: "#fbbf24", glow: "drop-shadow(0 0 12px rgba(251,191,36,0.4))"  },
    attack:   { bg: "rgba(248,113,113,0.2)",  border: "#f87171", glow: "drop-shadow(0 0 16px rgba(248,113,113,0.6))" },
    isolated: { bg: "rgba(100,116,139,0.15)", border: "#475569", glow: "none" },
    blocked:  { bg: "rgba(34,211,238,0.15)",  border: "#22d3ee", glow: "drop-shadow(0 0 12px rgba(34,211,238,0.4))"  },
  };
  const c = colors[status] || colors.healthy;
  return (
    <g onClick={() => onClick && onClick(id)} style={{ cursor: onClick ? "pointer" : "default" }}>
      <circle cx={x} cy={y} r={28} fill={c.bg} stroke={c.border} strokeWidth={2} style={{ filter: c.glow !== "none" ? c.glow : "none" }} />
      {pulse && (
        <circle cx={x} cy={y} r={28} fill="none" stroke={c.border} strokeWidth={2} opacity={0.4}>
          <animate attributeName="r" values="28;42;28" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}
      <text x={x} y={y + 5} textAnchor="middle" fontSize={18} style={{ userSelect: "none" }}>{icon}</text>
      <text x={x} y={y + 44} textAnchor="middle" fontSize={11} fill="#94a3b8" fontWeight={600} style={{ userSelect: "none" }}>{label}</text>
    </g>
  );
}

function AnimatedPacket({ x1, y1, x2, y2, color, duration, delay }) {
  return (
    <circle r={4} fill={color} opacity={0.9}>
      <animate attributeName="cx" values={`${x1};${x2};${x1}`} dur={`${duration * 2}s`} repeatCount="indefinite" begin={`${delay}s`} />
      <animate attributeName="cy" values={`${y1};${y2};${y1}`} dur={`${duration * 2}s`} repeatCount="indefinite" begin={`${delay}s`} />
    </circle>
  );
}

const NODES = {
  router:       { label: "Router",      icon: "🌐", x: 300, y: 60  },
  firewall:     { label: "Firewall",    icon: "🛡️", x: 300, y: 150 },
  webserver:    { label: "Web Server",  icon: "🖥️", x: 160, y: 260 },
  database:     { label: "Database",   icon: "🗄️", x: 300, y: 280 },
  workstationA: { label: "Station A",  icon: "💻", x: 160, y: 380 },
  workstationB: { label: "Station B",  icon: "💻", x: 440, y: 380 },
};

const EDGES = [
  { from: "router",       to: "firewall"      },
  { from: "firewall",     to: "webserver"     },
  { from: "firewall",     to: "database"      },
  { from: "firewall",     to: "workstationB"  },
  { from: "webserver",    to: "workstationA"  },
  { from: "database",     to: "workstationA"  },
];

function NetworkMap({ nodeStatuses, attackEdges, onNodeClick }) {
  return (
    <svg width="600" height="460" style={{ overflow: "visible" }}>
      {EDGES.map((e, i) => {
        const a = NODES[e.from];
        const b = NODES[e.to];
        const isAttack = attackEdges.includes(`${e.from}-${e.to}`) || attackEdges.includes(`${e.to}-${e.from}`);
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={isAttack ? "#f87171" : "#1e3a5f"} strokeWidth={isAttack ? 2.5 : 1.5} strokeDasharray={isAttack ? "6,3" : "none"} opacity={0.8} />
            {isAttack ? (
              <>
                <AnimatedPacket x1={a.x} y1={a.y} x2={b.x} y2={b.y} color="#f87171" duration={0.8} delay={0} />
                <AnimatedPacket x1={a.x} y1={a.y} x2={b.x} y2={b.y} color="#fbbf24" duration={0.8} delay={0.3} />
                <AnimatedPacket x1={a.x} y1={a.y} x2={b.x} y2={b.y} color="#f87171" duration={0.8} delay={0.6} />
              </>
            ) : (
              <AnimatedPacket x1={a.x} y1={a.y} x2={b.x} y2={b.y} color="#22d3ee" duration={2.5} delay={i * 0.4} />
            )}
          </g>
        );
      })}
      {Object.entries(NODES).map(([id, node]) => (
        <NetworkNode key={id} id={id} label={node.label} icon={node.icon} x={node.x} y={node.y} status={nodeStatuses[id] || "healthy"} pulse={nodeStatuses[id] === "attack" || nodeStatuses[id] === "warning"} onClick={onNodeClick} />
      ))}
    </svg>
  );
}

function ThreatFeed({ events }) {
  return (
    <div style={{ width: "220px", flexShrink: 0, borderRadius: "10px", border: "1px solid #1e293b", background: "#020617", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid #1e293b", fontSize: "11px", fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em" }}>⚡ Live Threat Feed</div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
        {events.map((e, i) => (
          <div key={i} style={{ padding: "7px 10px", borderRadius: "7px", marginBottom: "5px", background: e.severity === "high" ? "rgba(248,113,113,0.08)" : "rgba(251,191,36,0.06)", border: e.severity === "high" ? "1px solid rgba(248,113,113,0.2)" : "1px solid rgba(251,191,36,0.15)" }}>
            <div style={{ fontSize: "10px", color: e.severity === "high" ? "#f87171" : "#fbbf24", fontWeight: 700 }}>{e.severity === "high" ? "HIGH" : "MED"} — {e.time}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px", lineHeight: 1.4 }}>{e.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionPanel({ stage, onChoice, pendingFeedback, onDismiss }) {
  const stages = [
    {
      title: "Stage 1 — Reconnaissance Detected",
      description: "Port scan packets are flooding in from external IP 185.220.101.47 targeting the firewall. The scan has been running for 90 seconds.",
      choices: [
        { label: "Block the source IP at the router and alert the security team", correct: true,  outcome: "Blocking at the router stops the scan immediately and cuts off the attacker's visibility." },
        { label: "Wait and monitor — it might just be a misconfigured service",   correct: false, outcome: "Waiting during an active port scan gives the attacker a full map of your exposed services." },
        { label: "Reboot the firewall to reset the connections",                  correct: false, outcome: "Rebooting the firewall takes your network protection offline and does nothing to stop the attacker." },
      ],
    },
    {
      title: "Stage 2 — Lateral Movement",
      description: "The attacker has breached Workstation A using a stolen credential and is attempting to move to the database server.",
      choices: [
        { label: "Isolate Workstation A from the network immediately",          correct: true,  outcome: "Network isolation stops the lateral movement and contains the breach to a single endpoint." },
        { label: "Change the user password and hope the attacker loses access", correct: false, outcome: "Password changes alone are too slow. The attacker likely already has a persistent session open." },
        { label: "Shut down the database server to protect it",                 correct: false, outcome: "Taking the database offline disrupts business and does not address the compromised workstation." },
      ],
    },
    {
      title: "Stage 3 — Data Exfiltration Attempt",
      description: "Large outbound transfers are detected from the database server to an external IP. The attacker is actively pulling records.",
      choices: [
        { label: "Block all outbound traffic from the database server and engage incident response", correct: true,  outcome: "Cutting outbound traffic stops the exfiltration. Engaging IR immediately is the correct escalation path." },
        { label: "Disconnect the internet router to stop all traffic",                              correct: false, outcome: "A full internet disconnect stops exfiltration but takes the entire business offline unnecessarily." },
        { label: "Let it complete so you can analyze what was taken afterward",                     correct: false, outcome: "Allowing exfiltration to complete exposes customer data and triggers regulatory obligations." },
      ],
    },
  ];
  const current = stages[stage];
  if (!current) return null;
  return (
    <div style={{ borderRadius: "10px", border: "1px solid #1e293b", background: "#0a0f1e", padding: "16px" }}>
      <div style={{ fontWeight: 700, color: "#f87171", fontSize: "13px", marginBottom: "6px" }}>{current.title}</div>
      <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "14px" }}>{current.description}</div>
      {pendingFeedback ? (
        <div>
          <div style={{ padding: "14px 16px", borderRadius: "10px", marginBottom: "12px", background: pendingFeedback.correct ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: pendingFeedback.correct ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(248,113,113,0.3)" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: pendingFeedback.correct ? "#34d399" : "#f87171", marginBottom: "4px" }}>{pendingFeedback.correct ? "Good call" : "Wrong move"}</div>
            <div style={{ fontSize: "12px", color: pendingFeedback.correct ? "#a7f3d0" : "#fecaca", lineHeight: 1.5 }}>{pendingFeedback.outcome}</div>
          </div>
          <button onClick={onDismiss} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
            {stage < 2 ? "Next Stage →" : "See Results"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {current.choices.map((c, i) => (
            <button key={i} onClick={() => onChoice(c)} style={{ textAlign: "left", padding: "11px 14px", borderRadius: "9px", border: "1px solid #1e3a5f", background: "#020617", color: "#cbd5e1", fontSize: "12px", lineHeight: 1.5, cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e3a5f"; e.currentTarget.style.background = "#020617"; }}
            >{c.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function NetworkIntrusionDesktop({ simulation, onComplete }) {
  const [stage, setStage]                     = useState(0);
  const [nodeStatuses, setNodeStatuses]       = useState({ router: "healthy", firewall: "warning", webserver: "healthy", database: "healthy", workstationA: "healthy", workstationB: "healthy" });
  const [attackEdges, setAttackEdges]         = useState(["router-firewall"]);
  const [threatEvents, setThreatEvents]       = useState([
    { time: "21:04:11", severity: "high",   message: "Port scan from 185.220.101.47" },
    { time: "21:04:08", severity: "medium", message: "SYN flood detected on port 443" },
    { time: "21:03:55", severity: "medium", message: "Repeated auth failures on firewall" },
    { time: "21:03:41", severity: "high",   message: "External probe on ports 22, 80, 443, 3306" },
  ]);
  const [health, setHealth]                   = useState(72);
  const [correctCount, setCorrectCount]       = useState(0);
  const [pendingFeedback, setPendingFeedback] = useState(null);

  const stageConfigs = [
    { nodeUpdates: { firewall: "attack" },                            attackEdges: ["router-firewall"],       newEvent: { time: "21:04:15", severity: "high", message: "Active port scan — firewall under probe" } },
    { nodeUpdates: { firewall: "blocked", workstationA: "attack", database: "warning" }, attackEdges: ["workstationA-database"], newEvent: { time: "21:04:31", severity: "high", message: "Lateral movement: Station A → Database" } },
    { nodeUpdates: { workstationA: "isolated", database: "attack" }, attackEdges: ["database-router"],       newEvent: { time: "21:04:48", severity: "high", message: "Exfil attempt: Database → External IP" } },
  ];

  useEffect(() => {
    const config = stageConfigs[stage];
    if (!config) return;
    setNodeStatuses(prev => ({ ...prev, ...config.nodeUpdates }));
    setAttackEdges(config.attackEdges);
    setThreatEvents(prev => [config.newEvent, ...prev]);
    setHealth(prev => Math.max(prev - 12, 20));
  }, [stage]);

  const handleChoice = (choice) => {
    const newCorrect = choice.correct ? correctCount + 1 : correctCount;
    if (choice.correct) setCorrectCount(newCorrect);
    setPendingFeedback({ ...choice, nextCorrect: newCorrect });
  };

  const handleDismiss = () => {
    const next = stage + 1;
    const nc = pendingFeedback.nextCorrect ?? correctCount;
    setPendingFeedback(null);
    if (next >= 3) {
      setNodeStatuses({ router: "healthy", firewall: "blocked", webserver: "healthy", database: "blocked", workstationA: "isolated", workstationB: "healthy" });
      setAttackEdges([]);
      setHealth(prev => Math.min(prev + (pendingFeedback.correct ? 20 : 5), 100));
      onComplete(nc);
      return;
    }
    setStage(next);
  };

  const healthColor = health > 60 ? "#34d399" : health > 35 ? "#fbbf24" : "#f87171";

  return (
    <div style={{ borderRadius: "12px", border: "1px solid #1e3a5f", overflow: "hidden", background: "#020917" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.2)} }`}</style>
      <div style={{ background: "linear-gradient(90deg, #0a0f1e, #0d1a2e)", padding: "12px 20px", borderBottom: "1px solid #1e3a5f", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ fontWeight: 800, color: "#22d3ee", fontSize: "14px", letterSpacing: "0.1em" }}>⬡ NETWORK OPERATIONS CENTER</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Network Health</span>
          <div style={{ width: "120px", height: "8px", borderRadius: "999px", background: "#1e293b" }}>
            <div style={{ height: "100%", borderRadius: "999px", width: `${health}%`, background: healthColor, transition: "width 0.8s ease, background 0.5s ease", boxShadow: `0 0 8px ${healthColor}` }} />
          </div>
          <span style={{ fontSize: "12px", color: healthColor, fontWeight: 700 }}>{health}%</span>
        </div>
        <div style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", animation: "pulse 1.5s infinite" }}>● INCIDENT ACTIVE</div>
      </div>
      <div style={{ display: "flex", minHeight: "480px" }}>
        <div style={{ flex: 1, padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at center, #0a1628 0%, #020917 70%)", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <NetworkMap nodeStatuses={nodeStatuses} attackEdges={attackEdges} onNodeClick={null} />
        </div>
        <div style={{ width: "260px", borderLeft: "1px solid #1e293b", display: "flex", flexDirection: "column", background: "#030b18" }}>
          <ThreatFeed events={threatEvents} />
        </div>
      </div>
      <div style={{ borderTop: "1px solid #1e293b", padding: "16px", background: "#030b18" }}>
        <ActionPanel stage={stage} onChoice={handleChoice} pendingFeedback={pendingFeedback} onDismiss={handleDismiss} />
      </div>
    </div>
  );
}

// ── Terminal Simulation ───────────────────────────────────────────────────────

function TerminalSim({ simulation, onComplete }) {
  const [stage, setStage]               = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [history, setHistory]           = useState([]);
  const [pendingFeedback, setPendingFeedback] = useState(null);
  const bottomRef = useRef(null);

  const isCloud     = simulation?.prompt?.startsWith("DESKTOP_SIM_TERMINAL:") && simulation?.title?.toLowerCase().includes("cloud");
  const isIncident  = simulation?.prompt?.startsWith("DESKTOP_SIM_TERMINAL:") && simulation?.title?.toLowerCase().includes("incident");
  const isPhishingT = simulation?.prompt?.startsWith("DESKTOP_SIM_TERMINAL:") && simulation?.title?.toLowerCase().includes("phishing");
  const isHardening = simulation?.prompt?.startsWith("DESKTOP_SIM_TERMINAL:") && simulation?.title?.toLowerCase().includes("hardening");
  const isPacket    = simulation?.prompt?.startsWith("DESKTOP_SIM_TERMINAL:") && simulation?.title?.toLowerCase().includes("packet");

  const cloudStages = [
    {
      prompt: "$ aws s3api get-bucket-acl --bucket company-data-prod",
      output: `{\n  "Grants": [\n    { "Grantee": { "Type": "Group", "URI": "http://acs.amazonaws.com/groups/global/AllUsers" }, "Permission": "READ" }\n  ]\n}`,
      question: "The S3 bucket company-data-prod has a public READ grant. What is the correct fix?",
      choices: [
        { label: "aws s3api put-bucket-acl --bucket company-data-prod --acl private", correct: true,  outcome: "Setting the ACL to private removes the public grant and locks the bucket down immediately." },
        { label: "aws s3 rb s3://company-data-prod --force", correct: false, outcome: "Deleting the bucket destroys all data. The fix is to change the ACL, not delete the bucket." },
        { label: "Leave it — read-only public access is probably intentional", correct: false, outcome: "Public read access to a bucket named company-data-prod is almost certainly a misconfiguration. Never assume it is intentional without verification." },
      ],
    },
    {
      prompt: "$ aws iam list-attached-user-policies --user-name deploy-bot",
      output: `{\n  "AttachedPolicies": [\n    { "PolicyName": "AdministratorAccess", "PolicyArn": "arn:aws:iam::aws:policy/AdministratorAccess" }\n  ]\n}`,
      question: "The deploy-bot service account has full AdministratorAccess. What is the correct action?",
      choices: [
        { label: "aws iam detach-user-policy --user-name deploy-bot --policy-arn arn:aws:iam::aws:policy/AdministratorAccess  then attach a minimal deployment-only policy", correct: true,  outcome: "Service accounts should have only the permissions they need. AdministratorAccess on a deploy bot violates least privilege." },
        { label: "Rename the policy to something less obvious", correct: false, outcome: "Renaming a policy does not change its permissions. The bot still has full admin access." },
        { label: "Add an MFA requirement to the account", correct: false, outcome: "Service accounts cannot use MFA interactively. The fix is least privilege, not MFA." },
      ],
    },
    {
      prompt: "$ aws cloudtrail get-trail-status --name main-trail",
      output: `{\n  "IsLogging": false,\n  "LatestDeliveryTime": "2024-01-15T08:22:11Z"\n}`,
      question: "CloudTrail logging is disabled. What do you run to re-enable it?",
      choices: [
        { label: "aws cloudtrail start-logging --name main-trail", correct: true,  outcome: "Re-enabling CloudTrail restores API activity logging across the environment immediately." },
        { label: "aws cloudtrail delete-trail --name main-trail", correct: false, outcome: "Deleting the trail removes logging configuration entirely. You want to enable logging, not delete the trail." },
        { label: "Create a new trail since the old one is probably broken", correct: false, outcome: "The trail exists and is correctly configured — it is just stopped. Starting it is faster and safer than rebuilding." },
      ],
    },
  ];

  const incidentStages = [
    {
      prompt: "$ last -n 20",
      output: `root     pts/0   185.220.101.47  Sat Jan 20 03:14   still logged in\ndeployer pts/1   10.0.1.5        Fri Jan 19 22:31 - 23:02  (00:31)\nadmin    pts/0   192.168.1.10    Fri Jan 19 17:05 - 18:44  (01:39)`,
      question: "The last command shows root logged in from external IP 185.220.101.47 at 3:14 AM. What is your first action?",
      choices: [
        { label: "pkill -u root  then  passwd root to revoke the session and rotate credentials", correct: true,  outcome: "Killing the active session stops the attacker immediately. Rotating root credentials prevents reconnection with the same key." },
        { label: "Reboot the server to kick all sessions", correct: false, outcome: "Rebooting clears the session but also destroys in-memory forensic evidence like running processes and network connections." },
        { label: "Send an email to the attacker asking them to log off", correct: false, outcome: "This is not a valid incident response action. The attacker will not comply and this delays containment." },
      ],
    },
    {
      prompt: "$ ps aux --sort=-%cpu | head -15",
      output: `USER       PID %CPU %MEM    VSZ   RSS COMMAND\nroot      4821 94.3  2.1 124832 43128 /tmp/.x/miner\nroot       892  1.2  0.8  89332 17240 sshd\nroot       643  0.4  0.3  28672  6144 systemd`,
      question: "A process called /tmp/.x/miner is consuming 94% CPU. What do you do?",
      choices: [
        { label: "kill -9 4821  then  find /tmp -name 'miner' -delete", correct: true,  outcome: "Force killing the process stops the cryptominer immediately. Removing the binary from /tmp prevents it from being restarted manually." },
        { label: "nice -n 19 -p 4821 to lower its priority", correct: false, outcome: "Lowering priority keeps the malicious process running. It needs to be killed and removed." },
        { label: "Wait until the next reboot to clear it", correct: false, outcome: "The miner is actively consuming resources and may have additional persistence. It needs to be killed now." },
      ],
    },
    {
      prompt: "$ netstat -tulpn | grep LISTEN",
      output: `tcp  0  0  0.0.0.0:22    0.0.0.0:*  LISTEN  892/sshd\ntcp  0  0  0.0.0.0:4444  0.0.0.0:*  LISTEN  4821/.x/shell\ntcp  0  0  0.0.0.0:80    0.0.0.0:*  LISTEN  1204/nginx`,
      question: "Port 4444 has a backdoor shell listening. What is the correct containment command?",
      choices: [
        { label: "iptables -A INPUT -p tcp --dport 4444 -j DROP  then  kill -9 4821", correct: true,  outcome: "Dropping inbound traffic on port 4444 prevents new connections to the backdoor. Killing the process removes the listener." },
        { label: "service networking restart", correct: false, outcome: "Restarting networking briefly disrupts all services and the backdoor process will still restart if it has persistence." },
        { label: "Change the SSH port to avoid confusion with the backdoor", correct: false, outcome: "Changing the SSH port does not address the backdoor on 4444. The backdoor process needs to be killed and blocked." },
      ],
    },
  ];

  const phishingStages = [
    {
      prompt: "$ cat /var/mail/flagged_email.txt | grep -E 'Received|From|Reply-To|Return-Path|X-Originating-IP'",
      output: `Return-Path: <support@micros0ft-helpdesk.ru>\nReceived: from mail.micros0ft-helpdesk.ru (185.220.101.12)\nFrom: "Microsoft Support" <support@microsoft.com>\nReply-To: support@micros0ft-helpdesk.ru\nX-Originating-IP: 185.220.101.12`,
      question: "The From field shows microsoft.com but the Return-Path and Reply-To show micros0ft-helpdesk.ru from a Russian IP. What does this tell you?",
      choices: [
        { label: "The email is spoofed — the From address is forged. Flag it as phishing and block the sending domain micros0ft-helpdesk.ru at the mail gateway.", correct: true,  outcome: "The From field can be freely forged. The Return-Path and Reply-To reveal the actual attacker infrastructure. A Russian IP sending as Microsoft combined with a zero-substituted lookalike domain is a definitive phishing indicator." },
        { label: "The email is legitimate — microsoft.com in the From field confirms the sender", correct: false, outcome: "The From field is trivially forgeable and means nothing on its own. Always check the Return-Path, Reply-To, and Received headers to determine where the email actually came from." },
        { label: "Run a full virus scan on the email attachment before deciding", correct: false, outcome: "Header analysis is complete enough to make a decision here. The spoofed From with a Russian IP and lookalike domain is conclusive without needing to open any attachment." },
      ],
    },
    {
      prompt: "$ dig TXT micros0ft-helpdesk.ru +short && nslookup -type=TXT _dmarc.microsoft.com",
      output: `; micros0ft-helpdesk.ru TXT records:\n"v=spf1 +all"\n\n; _dmarc.microsoft.com TXT record:\n"v=DMARC1; p=reject; rua=mailto:dmarc@microsoft.com; ruf=mailto:dmarc@microsoft.com"`,
      question: "The attacker domain uses SPF +all (trust everyone) and Microsoft has a strict DMARC reject policy. What do these findings mean?",
      choices: [
        { label: "+all in SPF means any server can send as this domain — a deliberate misconfiguration. Microsoft DMARC reject means this spoofed email should have been blocked before delivery.", correct: true,  outcome: "SPF +all is a red flag — legitimate domains use -all to deny unauthorized senders. The Microsoft DMARC reject policy means any mail failing DMARC should be rejected. This email slipping through indicates a gap in the mail gateway configuration." },
        { label: "+all means the domain has strong sender verification enabled", correct: false, outcome: "+all is the opposite of strong verification — it tells receiving servers to accept mail from any IP claiming to be this domain. Legitimate organizations use -all to reject unauthorized senders." },
        { label: "DMARC reject only applies to consumer email accounts not business mail", correct: false, outcome: "DMARC policies apply to all receiving mail servers that implement DMARC checking. A p=reject policy instructs all compliant mail servers to reject non-compliant messages." },
      ],
    },
    {
      prompt: "$ grep -i 'link\\|href\\|url' /var/mail/flagged_email_body.txt | head -5",
      output: `Click here to verify: https://micros0ft-account-verify.xyz/login?token=a8f2k9\nUpdate your billing: https://micros0ft-account-verify.xyz/billing\nCall support: 1-800-438-8299\nView your account: https://micros0ft-account-verify.xyz/dashboard`,
      question: "All links go to micros0ft-account-verify.xyz. What actions do you take to protect the organization?",
      choices: [
        { label: "Block micros0ft-account-verify.xyz at the DNS resolver and web proxy, quarantine the email for all recipients, and send a user alert describing the campaign.", correct: true,  outcome: "Blocking at DNS and proxy prevents users from reaching the phishing page even if they click the link. Quarantining protects anyone who has not opened it yet. A user alert about the specific campaign helps people recognize it if they see similar messages." },
        { label: "Just delete the email from the flagged user's inbox and monitor for more reports", correct: false, outcome: "Deleting from one inbox does not protect other recipients. Blocking the domain and alerting users are both necessary to contain the campaign." },
        { label: "Reply to the sender demanding they remove the organization from their list", correct: false, outcome: "Replying to phishing senders confirms your email address is active and monitored. It will result in more targeted attacks, not fewer." },
      ],
    },
  ];

  const hardeningStages = [
    {
      prompt: "$ systemctl list-units --type=service --state=running",
      output: `  apache2.service    loaded active running The Apache HTTP Server\n  bluetooth.service  loaded active running Bluetooth service\n  cups.service       loaded active running CUPS Scheduler\n  mysql.service      loaded active running MySQL Community Server\n  telnet.service     loaded active running Telnet Server\n  vsftpd.service     loaded active running vsftpd FTP daemon`,
      question: "This is a web server that only needs Apache and MySQL. Telnet, FTP, Bluetooth, and CUPS are all running. What do you do?",
      choices: [
        { label: "systemctl stop telnet && systemctl disable telnet && systemctl stop vsftpd && systemctl disable vsftpd && systemctl stop bluetooth && systemctl disable bluetooth && systemctl stop cups && systemctl disable cups", correct: true,  outcome: "Stopping and disabling all unnecessary services eliminates the attack surface they represent. Telnet transmits credentials in plaintext. FTP shares the same problem. Bluetooth and printing have no place on a production web server." },
        { label: "Leave them running since they are not causing any current problems", correct: false, outcome: "Every running service is a potential attack vector regardless of whether it is currently being exploited. Attack surface reduction means eliminating anything not required for the server's function." },
        { label: "Just disable telnet since that is the most obviously dangerous one", correct: false, outcome: "Telnet is the most critical to remove but FTP also transmits in plaintext and Bluetooth and CUPS add unnecessary attack surface. All four should be disabled on a web server." },
      ],
    },
    {
      prompt: "$ iptables -L INPUT -n -v --line-numbers",
      output: `Chain INPUT (policy ACCEPT)\nnum  pkts bytes target  prot opt source       destination\n1    1.2K  84K  ACCEPT  all  --  0.0.0.0/0    0.0.0.0/0\n2     892  61K  ACCEPT  tcp  --  0.0.0.0/0    0.0.0.0/0   tcp dpt:22\n3    4.3K 312K  ACCEPT  tcp  --  0.0.0.0/0    0.0.0.0/0   tcp dpt:80\n4    8.1K 591K  ACCEPT  tcp  --  0.0.0.0/0    0.0.0.0/0   tcp dpt:443\n5       0     0  ACCEPT  tcp  --  0.0.0.0/0    0.0.0.0/0   tcp dpt:3306`,
      question: "MySQL port 3306 is open to the internet (0.0.0.0/0) and there is no default deny rule. What needs to change?",
      choices: [
        { label: "iptables -R INPUT 5 -p tcp --dport 3306 -s 127.0.0.1 -j ACCEPT && iptables -A INPUT -j DROP", correct: true,  outcome: "Restricting MySQL to localhost only prevents external connections to the database. Adding a default DROP rule means anything not explicitly allowed is denied. These two changes close the most critical gaps." },
        { label: "Change the MySQL port to a non-standard number to reduce scanning", correct: false, outcome: "Port obfuscation is not a security control. Attackers scan all ports. The fix is restricting the source to localhost and adding a default deny rule." },
        { label: "Install a WAF to filter malicious MySQL traffic from the internet", correct: false, outcome: "A WAF filters HTTP traffic, not raw database connections. The correct fix is firewall-level restriction of the MySQL port to localhost only." },
      ],
    },
    {
      prompt: "$ grep -E 'PermitRootLogin|PasswordAuthentication|MaxAuthTries|Protocol' /etc/ssh/sshd_config",
      output: `Protocol 2\nPermitRootLogin yes\nPasswordAuthentication yes\nMaxAuthTries 6`,
      question: "SSH allows root login, password authentication, and 6 auth attempts. What changes does hardening require?",
      choices: [
        { label: "Set PermitRootLogin no, PasswordAuthentication no, MaxAuthTries 3 in sshd_config then systemctl restart sshd", correct: true,  outcome: "Disabling root login forces attackers to escalate privilege after initial access. Disabling password auth requires key-based authentication which cannot be brute forced. Reducing MaxAuthTries limits brute force attempts." },
        { label: "Change the SSH port from 22 to something above 1024 to stop automated scans", correct: false, outcome: "Port changing reduces automated noise but does not prevent determined attackers. The three configuration changes address real authentication weaknesses." },
        { label: "These settings are fine since Protocol 2 is already enabled", correct: false, outcome: "Protocol 2 is the minimum baseline but the three remaining settings represent significant hardening gaps that need to change." },
      ],
    },
  ];

  const packetStages = [
    {
      prompt: "$ tcpdump -r capture.pcap -nn 'not port 443 and not port 80' | head -20",
      output: `14:22:01.441 IP 10.0.1.44.52341 > 185.220.101.47.4444: Flags [S]\n14:22:01.882 IP 185.220.101.47.4444 > 10.0.1.44.52341: Flags [SA]\n14:22:01.883 IP 10.0.1.44.52341 > 185.220.101.47.4444: Flags [A]\n14:22:02.104 IP 10.0.1.44.52341 > 185.220.101.47.4444: Flags [PA] length 148\n14:22:32.104 IP 10.0.1.44.52341 > 185.220.101.47.4444: Flags [PA] length 148\n14:23:02.105 IP 10.0.1.44.52341 > 185.220.101.47.4444: Flags [PA] length 148`,
      question: "Host 10.0.1.44 is making regular 30-second interval connections to 185.220.101.47 on port 4444. What does this indicate?",
      choices: [
        { label: "This is C2 beaconing — regular interval connections to an external IP on a non-standard port indicate malware checking in with attacker infrastructure. Isolate 10.0.1.44 immediately.", correct: true,  outcome: "The 30-second interval is a textbook beaconing pattern. Legitimate software does not connect to random external IPs on port 4444 at precise intervals. This host is compromised and communicating with a command and control server." },
        { label: "Regular traffic patterns are normal for software that checks for updates in the background", correct: false, outcome: "Legitimate update traffic goes to known vendor infrastructure on standard ports. Connections to unknown IPs on port 4444 at precise intervals are a strong compromise indicator." },
        { label: "Wait for 24 hours of captures to establish a baseline before drawing conclusions", correct: false, outcome: "You already have a clear beaconing pattern. Waiting allows the attacker more time to move laterally and exfiltrate data. Act on what you can see now." },
      ],
    },
    {
      prompt: "$ tcpdump -r capture.pcap -nn -A 'host 10.0.1.44 and port 53' | grep 'exfil'",
      output: `14:23:15.221 data-1.exfil-channel.xyz A?\n14:23:15.443 data-2.exfil-channel.xyz A?\n14:23:15.661 data-3.exfil-channel.xyz A?\n14:23:16.104 aGVsbG8gd29ybGQ=.exfil-channel.xyz A?\n14:23:16.321 dGhpcyBpcyBleGZpbA==.exfil-channel.xyz A?`,
      question: "DNS queries from 10.0.1.44 include base64-encoded subdomains going to exfil-channel.xyz. What is happening?",
      choices: [
        { label: "This is DNS exfiltration — data is being encoded in DNS query subdomains to bypass firewalls. Block exfil-channel.xyz at the DNS resolver and isolate the host.", correct: true,  outcome: "DNS exfiltration encodes stolen data in subdomain strings. DNS traffic bypasses many firewalls because port 53 is almost always allowed. Blocking at the resolver cuts the exfiltration channel immediately." },
        { label: "The base64 strings are just application session tokens used for authentication", correct: false, outcome: "Legitimate applications do not encode session tokens into DNS subdomain queries. Sequential numbered subdomains plus base64 encoded data going to a suspicious domain is a clear DNS exfiltration indicator." },
        { label: "DNS queries are too small to exfiltrate meaningful data so this is low priority", correct: false, outcome: "DNS exfiltration is slower than direct transfer but can exfiltrate significant data over time and evades many detection controls. The technique is specifically chosen to bypass firewall rules." },
      ],
    },
    {
      prompt: "$ tcpdump -r capture.pcap -nn 'src 10.0.1.44 and tcp-syn' | awk '{print $5}' | cut -d. -f1-4 | sort | uniq -c | sort -rn | head -10",
      output: `     47 10.0.1.10\n     43 10.0.1.12\n     39 10.0.1.15\n     38 10.0.1.8\n     35 10.0.1.20\n     31 10.0.1.3\n     28 10.0.1.22\n     24 10.0.1.18`,
      question: "Host 10.0.1.44 has sent SYN packets to every other host on the subnet. What does this indicate?",
      choices: [
        { label: "This is internal network scanning — lateral movement reconnaissance. Isolate 10.0.1.44 immediately and begin full incident response.", correct: true,  outcome: "SYN packets to every host on a subnet is a port scan. Combined with C2 beaconing and DNS exfiltration already confirmed from this host, this is active lateral movement reconnaissance during a confirmed breach." },
        { label: "Internal SYN traffic is normal for network discovery protocols like ARP and mDNS", correct: false, outcome: "ARP and mDNS use broadcast mechanisms, not individual SYN packets to every host. Targeted SYN packets to every IP within a short window is a port scan pattern." },
        { label: "Run another capture for a few hours before escalating", correct: false, outcome: "You have already confirmed C2 beaconing, DNS exfiltration, and now internal scanning from the same host. This is a confirmed active incident. Waiting allows lateral movement to succeed." },
      ],
    },
  ];

  const stages = isCloud ? cloudStages : isIncident ? incidentStages : isPhishingT ? phishingStages : isHardening ? hardeningStages : isPacket ? packetStages : cloudStages;
  const current = stages[stage];

  useEffect(() => {
    if (stage === 0 && history.length === 0) {
      setHistory([{ type: "system", text: "Connected to remote host. Session established." }]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, pendingFeedback]);

  const handleChoice = (choice) => {
    const newCorrect = choice.correct ? correctCount + 1 : correctCount;
    if (choice.correct) setCorrectCount(newCorrect);
    setHistory(prev => [...prev, { type: "cmd", text: current.prompt }, { type: "output", text: current.output }, { type: "action", text: choice.label }]);
    setPendingFeedback({ ...choice, newCorrect });
  };

  const handleDismiss = () => {
    const next = stage + 1;
    const nc = pendingFeedback.newCorrect;
    setPendingFeedback(null);
    if (next >= 3) { onComplete(nc); return; }
    setStage(next);
  };

  return (
    <div style={{ borderRadius: "12px", border: "1px solid #1e293b", overflow: "hidden", background: "#0a0a0a", fontFamily: "monospace" }}>
      <div style={{ background: "linear-gradient(90deg, #1a1a1a, #222)", padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #333" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f87171" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#fbbf24" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#34d399" }} />
        </div>
        <span style={{ color: "#64748b", fontSize: "12px", flex: 1, textAlign: "center" }}>
          {isCloud ? "bash — aws-admin@security-console" : "bash — analyst@incident-server"}
        </span>
      </div>
      <div style={{ minHeight: "240px", maxHeight: "300px", overflowY: "auto", padding: "16px", background: "#0a0a0a" }}>
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            {h.type === "system" && <div style={{ color: "#475569", fontSize: "12px" }}>{h.text}</div>}
            {h.type === "cmd"    && <div style={{ color: "#22d3ee", fontSize: "12px" }}>{h.text}</div>}
            {h.type === "output" && <pre style={{ color: "#94a3b8", fontSize: "11px", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{h.text}</pre>}
            {h.type === "action" && <div style={{ color: "#fbbf24", fontSize: "12px" }}>$ {h.text}</div>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ borderTop: "1px solid #1e293b", padding: "16px", background: "#0f172a" }}>
        {current && !pendingFeedback && (
          <>
            <div style={{ color: "#22d3ee", fontSize: "12px", marginBottom: "6px", fontFamily: "monospace" }}>{current.prompt}</div>
            <pre style={{ color: "#64748b", fontSize: "11px", margin: "0 0 14px 0", whiteSpace: "pre-wrap", lineHeight: 1.6, background: "#020617", padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e293b" }}>{current.output}</pre>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px", lineHeight: 1.6 }}>{current.question}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {current.choices.map((c, i) => (
                <button key={i} onClick={() => handleChoice(c)} style={{ textAlign: "left", padding: "10px 14px", borderRadius: "8px", border: "1px solid #1e293b", background: "#020617", color: "#22d3ee", fontSize: "12px", fontFamily: "monospace", lineHeight: 1.5, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.background = "#020617"; }}
                >$ {c.label}</button>
              ))}
            </div>
          </>
        )}
        {pendingFeedback && (
          <div>
            <div style={{ padding: "14px 16px", borderRadius: "10px", marginBottom: "12px", background: pendingFeedback.correct ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: pendingFeedback.correct ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(248,113,113,0.3)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: pendingFeedback.correct ? "#34d399" : "#f87171", marginBottom: "4px", fontFamily: "sans-serif" }}>{pendingFeedback.correct ? "Good call" : "Wrong move"}</div>
              <div style={{ fontSize: "12px", color: pendingFeedback.correct ? "#a7f3d0" : "#fecaca", lineHeight: 1.5, fontFamily: "sans-serif" }}>{pendingFeedback.outcome}</div>
            </div>
            <button onClick={handleDismiss} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "sans-serif" }}>
              {stage < 2 ? "Next Command →" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Browser Simulation ────────────────────────────────────────────────────────

function BrowserSim({ simulation, onComplete }) {
  const [stage, setStage]               = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [pendingFeedback, setPendingFeedback] = useState(null);

  const isNetwork  = simulation?.title?.toLowerCase().includes("network");
  const isDriver   = simulation?.title?.toLowerCase().includes("driver");
  const isSideload = simulation?.title?.toLowerCase().includes("sideload") || simulation?.title?.toLowerCase().includes("app store");

  const browsingSites = [
    {
      url: "http://g00gle-security-update.net/download",
      favicon: "🔴",
      title: "Google Security Update — Download Required",
      content: (
        <div style={{ padding: "20px", background: "#fff", borderRadius: "4px", color: "#1a1a1a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ fontSize: "32px" }}>🔵</div>
            <div style={{ fontWeight: 700, fontSize: "18px" }}>Google Chrome Update Required</div>
          </div>
          <div style={{ fontSize: "14px", color: "#444", marginBottom: "16px", lineHeight: 1.6 }}>Your browser is out of date. Download the latest security patch immediately to protect against known vulnerabilities.</div>
          <div style={{ background: "#1a73e8", color: "#fff", padding: "12px 24px", borderRadius: "4px", display: "inline-block", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Download Update Now</div>
        </div>
      ),
      question: "You landed on this page after clicking a search result. What do you do?",
      choices: [
        { label: "Close the tab immediately — the URL is a lookalike domain, not google.com", correct: true,  outcome: "g00gle-security-update.net is a typosquatting domain. Legitimate browser updates come from the browser's built-in update mechanism, never from a website you visit." },
        { label: "Download the update since Chrome does need to be kept current", correct: false, outcome: "This is malware disguised as a browser update. The URL is not google.com. Legitimate updates never come from third-party sites." },
        { label: "Click back and try a different search result", correct: false, outcome: "Going back is better than downloading, but you should close the tab entirely and clear it from your browser history." },
      ],
    },
    {
      url: "https://www.amaz0n.com/account/verify",
      favicon: "🔴",
      title: "Amazon — Verify Your Account",
      content: (
        <div style={{ padding: "20px", background: "#232f3e", borderRadius: "4px" }}>
          <div style={{ color: "#ff9900", fontWeight: 800, fontSize: "22px", marginBottom: "16px" }}>amazon</div>
          <div style={{ color: "#fff", fontSize: "14px", marginBottom: "16px" }}>Your account has been temporarily suspended. Enter your credentials to restore access.</div>
          <input placeholder="Email" style={{ width: "100%", padding: "10px", marginBottom: "8px", borderRadius: "4px", border: "1px solid #555", background: "#1a1a2e", color: "#fff", fontSize: "13px", boxSizing: "border-box" }} readOnly />
          <input placeholder="Password" type="password" style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "4px", border: "1px solid #555", background: "#1a1a2e", color: "#fff", fontSize: "13px", boxSizing: "border-box" }} readOnly />
          <div style={{ background: "#ff9900", color: "#1a1a1a", padding: "10px", borderRadius: "4px", textAlign: "center", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Sign In</div>
        </div>
      ),
      question: "This page looks exactly like Amazon's login. What do you notice and do?",
      choices: [
        { label: "Check the URL — amaz0n.com with a zero is a lookalike domain. Close the tab and navigate to amazon.com directly.", correct: true,  outcome: "The zero in amaz0n.com is the giveaway. Attackers register lookalike domains and copy legitimate site designs pixel-perfectly. Always check the URL before entering credentials." },
        { label: "Log in since your account is suspended and you need to fix it urgently", correct: false, outcome: "This is a credential phishing page. Entering your credentials sends them directly to the attacker. Urgency is a manipulation tactic." },
        { label: "Log in but use a fake password first to test if the site is real", correct: false, outcome: "Even entering a fake password confirms the site is reachable from your device and may submit tracking data. Do not interact with phishing pages." },
      ],
    },
    {
      url: "https://news-article.com/read?ref=popup",
      favicon: "🟡",
      title: "You Are Our 1,000,000th Visitor!",
      content: (
        <div style={{ padding: "20px", background: "linear-gradient(135deg, #ff6b35, #f7c59f)", borderRadius: "4px", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
          <div style={{ fontWeight: 800, fontSize: "20px", color: "#1a1a1a", marginBottom: "8px" }}>Congratulations! You won!</div>
          <div style={{ fontSize: "14px", color: "#333", marginBottom: "16px" }}>You are our 1,000,000th visitor! Claim your $500 Amazon gift card. Offer expires in 00:04:32</div>
          <div style={{ background: "#1a73e8", color: "#fff", padding: "12px 24px", borderRadius: "4px", display: "inline-block", fontWeight: 700, fontSize: "14px", cursor: "pointer", marginBottom: "10px" }}>Claim Prize Now</div>
          <div style={{ fontSize: "11px", color: "#555" }}>Enter your shipping address and credit card to cover $2.99 shipping</div>
        </div>
      ),
      question: "This popup appeared while browsing a news site. What do you do?",
      choices: [
        { label: "Close the popup — prize popups are always scams designed to collect personal or payment information", correct: true,  outcome: "No legitimate website gives prizes to the millionth visitor. These popups collect personal information or payment details for fraud. The countdown timer is a manipulation tactic. Close it." },
        { label: "Claim the prize since the $2.99 shipping fee is very small", correct: false, outcome: "The $2.99 is a pretense to collect your credit card number. This is a classic card harvesting scam. You will not receive a gift card." },
        { label: "Share your email address only and skip the credit card", correct: false, outcome: "Even sharing your email address enrolls you in spam and phishing campaigns. Do not interact with scam popups at all." },
      ],
    },
  ];

  const networkSites = [
    {
      url: "chrome://network-internals",
      favicon: "🔵",
      title: "Network Diagnostics — Connection Log",
      content: (
        <div style={{ background: "#0a0a0a", padding: "16px", borderRadius: "4px", fontFamily: "monospace" }}>
          <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "10px" }}>CONNECTION LOG — Last 60 minutes</div>
          {[
            { dst: "142.250.80.46",   port: "443", proto: "HTTPS", bytes: "2.1 MB",  app: "google.com",       suspicious: false },
            { dst: "185.220.101.47",  port: "4444",proto: "TCP",   bytes: "48.2 MB", app: "unknown",          suspicious: true  },
            { dst: "13.107.42.12",    port: "443", proto: "HTTPS", bytes: "1.4 MB",  app: "microsoft.com",    suspicious: false },
            { dst: "185.220.101.47",  port: "4444",proto: "TCP",   bytes: "12.1 MB", app: "unknown",          suspicious: true  },
            { dst: "151.101.65.140",  port: "443", proto: "HTTPS", bytes: "800 KB",  app: "reddit.com",       suspicious: false },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 60px 70px 80px 1fr", gap: "8px", padding: "6px 0", borderBottom: "1px solid #1e293b", fontSize: "11px", background: row.suspicious ? "rgba(248,113,113,0.06)" : "transparent" }}>
              <span style={{ color: row.suspicious ? "#f87171" : "#94a3b8" }}>{row.dst}</span>
              <span style={{ color: row.suspicious ? "#fbbf24" : "#475569" }}>:{row.port}</span>
              <span style={{ color: "#475569" }}>{row.proto}</span>
              <span style={{ color: row.suspicious ? "#f87171" : "#64748b" }}>{row.bytes}</span>
              <span style={{ color: row.suspicious ? "#f87171" : "#64748b" }}>{row.app}</span>
            </div>
          ))}
        </div>
      ),
      question: "You see repeated large transfers to 185.220.101.47 on port 4444 with no known application. What does this indicate and what do you do?",
      choices: [
        { label: "This looks like a command and control beacon or data exfiltration. Block the IP at the firewall and escalate to security.", correct: true,  outcome: "Port 4444 is commonly used by attacker tools. Repeated large transfers to an unknown external IP with no legitimate application is a strong indicator of exfiltration or C2 communication. Block and escalate immediately." },
        { label: "Port 4444 transfers are probably a software update or backup running in the background", correct: false, outcome: "Legitimate backup and update software uses known ports and identifies its application. Unknown application on a non-standard port with large outbound transfers is not a normal software behavior pattern." },
        { label: "Monitor for another 24 hours to gather more data before escalating", correct: false, outcome: "48 MB of unknown outbound traffic is already enough to escalate. Waiting 24 hours gives an attacker massive additional time to exfiltrate data." },
      ],
    },
    {
      url: "https://admin.company.internal/firewall",
      favicon: "🛡️",
      title: "Firewall Management — Inbound Rules",
      content: (
        <div style={{ background: "#0f172a", padding: "16px", borderRadius: "4px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>INBOUND RULES — Active</div>
          {[
            { rule: "ALLOW",  src: "0.0.0.0/0",      port: "22",   proto: "SSH",   note: "Any IP", suspicious: true  },
            { rule: "ALLOW",  src: "10.0.0.0/8",      port: "3389", proto: "RDP",   note: "Internal only", suspicious: false },
            { rule: "ALLOW",  src: "0.0.0.0/0",      port: "80",   proto: "HTTP",  note: "Web server", suspicious: false },
            { rule: "ALLOW",  src: "0.0.0.0/0",      port: "443",  proto: "HTTPS", note: "Web server", suspicious: false },
            { rule: "DENY",   src: "0.0.0.0/0",      port: "ALL",  proto: "ANY",   note: "Default deny", suspicious: false },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 140px 60px 70px 1fr", gap: "8px", padding: "7px 0", borderBottom: "1px solid #1e293b", fontSize: "12px", background: row.suspicious ? "rgba(248,113,113,0.06)" : "transparent" }}>
              <span style={{ color: row.rule === "ALLOW" ? "#34d399" : "#f87171", fontWeight: 700 }}>{row.rule}</span>
              <span style={{ color: row.suspicious ? "#f87171" : "#94a3b8" }}>{row.src}</span>
              <span style={{ color: "#475569" }}>{row.port}</span>
              <span style={{ color: "#64748b" }}>{row.proto}</span>
              <span style={{ color: row.suspicious ? "#fbbf24" : "#475569", fontSize: "11px" }}>{row.note}</span>
            </div>
          ))}
        </div>
      ),
      question: "SSH port 22 is open to all IP addresses on the internet (0.0.0.0/0). What is wrong with this and how should it be fixed?",
      choices: [
        { label: "Restrict the SSH rule source to specific trusted IP ranges or a VPN gateway, not 0.0.0.0/0", correct: true,  outcome: "SSH exposed to all internet IPs is one of the most common attack vectors. Restricting it to known admin IPs or requiring VPN access before SSH is available dramatically reduces the attack surface." },
        { label: "Change the SSH port from 22 to an obscure number to prevent scanning", correct: false, outcome: "Security through obscurity is not a real defense. Attackers scan all ports, not just 22. Port obfuscation reduces noise but does not prevent determined attackers and makes administration harder." },
        { label: "Disable SSH and use RDP for all remote administration instead", correct: false, outcome: "RDP exposed to the internet is equally dangerous and often worse. The problem is the 0.0.0.0/0 source, not the protocol." },
      ],
    },
    {
      url: "https://admin.company.internal/dns",
      favicon: "🌐",
      title: "DNS Query Log — Suspicious Entries",
      content: (
        <div style={{ background: "#0a0a0a", padding: "16px", borderRadius: "4px", fontFamily: "monospace" }}>
          <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "10px" }}>DNS QUERY LOG — Last 30 minutes</div>
          {[
            { time: "14:22:01", query: "data-1.malware-c2.ru",      type: "A", client: "10.0.1.44", suspicious: true  },
            { time: "14:21:58", query: "api.company.internal",       type: "A", client: "10.0.1.10", suspicious: false },
            { time: "14:21:55", query: "data-2.malware-c2.ru",      type: "A", client: "10.0.1.44", suspicious: true  },
            { time: "14:21:52", query: "update.microsoft.com",       type: "A", client: "10.0.1.22", suspicious: false },
            { time: "14:21:49", query: "data-3.malware-c2.ru",      type: "A", client: "10.0.1.44", suspicious: true  },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 220px 40px 1fr", gap: "8px", padding: "6px 0", borderBottom: "1px solid #1e293b", fontSize: "11px", background: row.suspicious ? "rgba(248,113,113,0.06)" : "transparent" }}>
              <span style={{ color: "#475569" }}>{row.time}</span>
              <span style={{ color: row.suspicious ? "#f87171" : "#94a3b8" }}>{row.query}</span>
              <span style={{ color: "#475569" }}>{row.type}</span>
              <span style={{ color: row.suspicious ? "#fbbf24" : "#64748b" }}>{row.client}</span>
            </div>
          ))}
        </div>
      ),
      question: "Host 10.0.1.44 is making repeated DNS queries to malware-c2.ru subdomains. What does this indicate?",
      choices: [
        { label: "This is DNS beaconing — a classic C2 communication pattern. Isolate 10.0.1.44 immediately and block malware-c2.ru at the DNS resolver.", correct: true,  outcome: "Repeated sequential DNS queries to numbered subdomains of a suspicious domain is a textbook command and control beaconing pattern. Isolate the host to prevent lateral movement and block the domain to cut C2 communication." },
        { label: "The sequential subdomains are probably a CDN or load balancing mechanism", correct: false, outcome: "Legitimate CDNs do not number their subdomains sequentially as data-1, data-2, data-3. The .ru TLD combined with the domain name and pattern is a strong C2 indicator." },
        { label: "DNS queries are harmless since they do not transfer data", correct: false, outcome: "DNS can be used as a data exfiltration and C2 channel. Data is encoded in subdomain strings and the DNS response carries commands back. DNS-based C2 bypasses many firewalls." },
      ],
    },
  ];

  const driverSites = [
    {
      url: "https://www.nvidia.com/en-us/geforce/drivers/",
      favicon: "🟢",
      title: "NVIDIA Driver Downloads — Official",
      content: <div style={{ padding: "20px", background: "#76b900", borderRadius: "4px", color: "#fff", textAlign: "center" }}><div style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>NVIDIA</div><div style={{ fontSize: "13px" }}>Official GeForce Driver Downloads</div></div>,
      question: "Your coworker navigated to nvidia.com to download their GPU driver. The URL is correct and the SSL certificate is valid. What do you recommend?",
      choices: [
        { label: "Download from here — nvidia.com is the official manufacturer site and the correct source for NVIDIA drivers", correct: true,  outcome: "Manufacturer websites are always the correct source for hardware drivers. nvidia.com is the official NVIDIA domain. This is a safe download." },
        { label: "Search for a third-party site since manufacturers are slow to update their downloads", correct: false, outcome: "Manufacturer sites are the only trustworthy source. Third-party driver sites almost always bundle malware or adware regardless of how professional they look." },
        { label: "Skip the driver update since drivers rarely affect security", correct: false, outcome: "Driver updates frequently include security patches for GPU firmware and driver code vulnerabilities. Keeping drivers current is a legitimate security practice." },
      ],
    },
    {
      url: "https://driver-update-center.net/nvidia-rtx-4090-latest",
      favicon: "🔴",
      title: "NVIDIA RTX 4090 Driver — Latest Version Free Download",
      content: <div style={{ padding: "20px", background: "#1a1a1a", borderRadius: "4px" }}><div style={{ color: "#76b900", fontWeight: 800, fontSize: "18px", marginBottom: "8px" }}>NVIDIA RTX 4090 Driver v560.81</div><div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "12px" }}>Latest WHQL Certified — Free Download</div><div style={{ background: "#76b900", color: "#000", padding: "10px 20px", borderRadius: "4px", display: "inline-block", fontWeight: 700, cursor: "pointer" }}>⬇ Download Now (856 MB)</div></div>,
      question: "Your coworker found this site in a search result offering the exact driver they need. The page looks professional. What do you do?",
      choices: [
        { label: "Close the tab — driver-update-center.net is not nvidia.com. Third-party driver sites almost always bundle malware. Go back to the official NVIDIA site.", correct: true,  outcome: "The domain driver-update-center.net has no affiliation with NVIDIA. These sites appear in search results specifically to intercept users looking for drivers and deliver malware-bundled installers." },
        { label: "Download it since the file is free and the page looks professional", correct: false, outcome: "Professional appearance is not a safety indicator. Malware distribution sites invest heavily in looking legitimate. The domain name alone is enough to reject this source." },
        { label: "Scan the downloaded file with antivirus before installing", correct: false, outcome: "Antivirus cannot catch zero-day threats or novel bundled adware. Do not download from third-party driver sites at all." },
      ],
    },
    {
      url: "https://driverpack.io/en/catalogue",
      favicon: "🟡",
      title: "DriverPack Solution — Update All Drivers Automatically",
      content: <div style={{ padding: "20px", background: "#f8f9fa", borderRadius: "4px", color: "#1a1a1a" }}><div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "8px", color: "#e63946" }}>DriverPack Solution</div><div style={{ fontSize: "13px", color: "#444", marginBottom: "12px" }}>Automatically update all your drivers for free. 350M+ users worldwide.</div><div style={{ background: "#e63946", color: "#fff", padding: "10px 20px", borderRadius: "4px", display: "inline-block", fontWeight: 700, cursor: "pointer" }}>Download Free</div></div>,
      question: "DriverPack claims to update all drivers automatically. Your coworker wants to install it to keep everything current. What do you advise?",
      choices: [
        { label: "Advise against it — driver pack tools bundle adware, make unauthorized system changes, and replace manufacturer drivers with generic versions. Use Windows Update and manufacturer sites instead.", correct: true,  outcome: "Driver pack tools have a long history of bundling adware, making system changes without disclosure, and installing generic drivers that may be less stable or secure than manufacturer versions. Windows Update and manufacturer sites handle this safely." },
        { label: "Install it since automating driver updates is a good security practice", correct: false, outcome: "Automating updates through a trusted source is good practice but DriverPack is not a trusted source. The automation convenience does not outweigh the risk of bundled software." },
        { label: "Install the paid version since that one does not include adware", correct: false, outcome: "Paid versions still make the same questionable system changes. The fundamental problem is replacing manufacturer drivers with generic alternatives from an unaffiliated source." },
      ],
    },
  ];

  const sideloadSites = [
    {
      url: "https://play.google.com/store/apps/details?id=com.target.app",
      favicon: "🟢",
      title: "Google Play Store — Official App Listing",
      content: <div style={{ padding: "20px", background: "#fff", borderRadius: "4px", color: "#1a1a1a" }}><div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><div style={{ fontSize: "32px" }}>▶</div><div><div style={{ fontWeight: 700 }}>Google Play</div><div style={{ fontSize: "12px", color: "#64748b" }}>Official Store</div></div></div><div style={{ fontSize: "13px", color: "#444" }}>The app your coworker needs is available here in your region.</div></div>,
      question: "The app your coworker wants is available on the official Google Play Store in their region after all. What do you recommend?",
      choices: [
        { label: "Download from the Play Store — official app stores perform security reviews and provide a trusted installation path", correct: true,  outcome: "Official app stores are the correct and safe source. Google Play performs malware scanning and policy enforcement. When an app is available through official channels there is no legitimate reason to use any other source." },
        { label: "Sideload it anyway since the Play Store version might have regional restrictions built in", correct: false, outcome: "If the app is available in the Play Store in your region there is no reason to sideload. Regional variants are handled by the app developer and are safe to install from official channels." },
        { label: "Use an APK download site since those are usually the same file", correct: false, outcome: "APK files from third-party sites are not verified and frequently contain malware injected into legitimate app packages even if the underlying app is the same." },
      ],
    },
    {
      url: "https://apk-mirror-downloads.com/whatsapp-mod-pro-v2.23",
      favicon: "🔴",
      title: "WhatsApp Mod Pro — Download APK Free",
      content: <div style={{ padding: "20px", background: "#128C7E", borderRadius: "4px", color: "#fff" }}><div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "6px" }}>WhatsApp Mod Pro</div><div style={{ fontSize: "13px", marginBottom: "12px" }}>Extra features not in the official app — hide online status, download stories, custom themes</div><div style={{ background: "#25D366", padding: "10px 20px", borderRadius: "4px", display: "inline-block", fontWeight: 700, cursor: "pointer" }}>⬇ Download APK</div></div>,
      question: "Your coworker found a modified WhatsApp APK claiming to add extra features. What do you do?",
      choices: [
        { label: "Refuse to install it — modified app APKs consistently contain spyware and credential stealers regardless of what features they advertise", correct: true,  outcome: "Modified app APKs are one of the most reliable malware delivery vectors. The extra features are real but come bundled with surveillance capabilities that steal messages, contacts, and credentials." },
        { label: "Install it since the extra features are useful and the reviews look positive", correct: false, outcome: "Reviews on malware distribution sites are fabricated. The extra features are real but they come bundled with spyware the user cannot audit." },
        { label: "Install it but revoke its permissions after installation to limit what it can access", correct: false, outcome: "Some malware capabilities operate regardless of declared permissions. Permission restriction is not an adequate control against a compromised APK." },
      ],
    },
    {
      url: "https://f-droid.org/en/packages/org.fdroid.fdroid/",
      favicon: "🟡",
      title: "F-Droid — Open Source App Repository",
      content: <div style={{ padding: "20px", background: "#1b5e20", borderRadius: "4px", color: "#fff" }}><div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "6px" }}>F-Droid</div><div style={{ fontSize: "13px", marginBottom: "8px" }}>Free and Open Source Android App Repository</div><div style={{ fontSize: "11px", color: "#a5d6a7" }}>All apps built from verified source code. No proprietary software.</div></div>,
      question: "F-Droid is a third-party store for open source Android apps. Your coworker wants it for an open source app not on Google Play. How do you assess this?",
      choices: [
        { label: "F-Droid is a legitimate open source repository with its own security review process, but it requires enabling unknown sources which increases overall device risk. The tradeoff should be a conscious decision.", correct: true,  outcome: "F-Droid is meaningfully different from random APK sites — it builds from verified source code with its own review process. However enabling unknown sources does reduce security posture. The risk is lower than random APK sites but the tradeoff should be deliberate." },
        { label: "F-Droid is just another APK site and should be treated the same as any other third-party source", correct: false, outcome: "F-Droid is meaningfully different from random APK sites. It builds from verified source code and has a transparent process. Treating all non-Play-Store sources identically misses important distinctions." },
        { label: "Always use F-Droid instead of Google Play since open source is always safer", correct: false, outcome: "Open source does not automatically mean safer and F-Droid does introduce the unknown sources risk. For most users and use cases the official Play Store remains the safer default." },
      ],
    },
  ];

  const sites = isNetwork ? networkSites : isDriver ? driverSites : isSideload ? sideloadSites : browsingSites;
  const current = sites[stage];

  const handleChoice = (choice) => {
    const newCorrect = choice.correct ? correctCount + 1 : correctCount;
    if (choice.correct) setCorrectCount(newCorrect);
    setPendingFeedback({ ...choice, newCorrect });
  };

  const handleDismiss = () => {
    const next = stage + 1;
    const nc = pendingFeedback.newCorrect;
    setPendingFeedback(null);
    if (next >= 3) { onComplete(nc); return; }
    setStage(next);
  };

  return (
    <div style={{ borderRadius: "12px", border: "1px solid #334155", overflow: "hidden", background: "#1e1e2e" }}>
      <div style={{ background: "linear-gradient(90deg, #2d2d2d, #3a3a3a)", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", gap: "5px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f87171" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#fbbf24" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#34d399" }} />
        </div>
        <div style={{ flex: 1, background: "#1a1a1a", borderRadius: "6px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "13px" }}>{current?.favicon}</span>
          <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current?.url}</span>
        </div>
        <span style={{ fontSize: "11px", color: "#475569" }}>Step {stage + 1} / 3</span>
      </div>
      <div style={{ padding: "0", borderBottom: "1px solid #1e293b", background: "#111", minHeight: "160px" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #1e293b", fontSize: "12px", fontWeight: 600, color: "#94a3b8" }}>{current?.title}</div>
        <div style={{ padding: "16px" }}>{current?.content}</div>
      </div>
      <div style={{ padding: "16px", background: "#0f172a" }}>
        <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px", lineHeight: 1.6 }}>{current?.question}</div>
        {pendingFeedback ? (
          <div>
            <div style={{ padding: "14px 16px", borderRadius: "10px", marginBottom: "12px", background: pendingFeedback.correct ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: pendingFeedback.correct ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(248,113,113,0.3)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: pendingFeedback.correct ? "#34d399" : "#f87171", marginBottom: "4px" }}>{pendingFeedback.correct ? "Good call" : "Wrong move"}</div>
              <div style={{ fontSize: "12px", color: pendingFeedback.correct ? "#a7f3d0" : "#fecaca", lineHeight: 1.5 }}>{pendingFeedback.outcome}</div>
            </div>
            <button onClick={handleDismiss} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
              {stage < 2 ? "Next Site →" : "See Results"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {current?.choices.map((c, i) => (
              <button key={i} onClick={() => handleChoice(c)} style={{ textAlign: "left", padding: "11px 14px", borderRadius: "9px", border: "1px solid #334155", background: "#020617", color: "#cbd5e1", fontSize: "13px", lineHeight: 1.5, cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.background = "#020617"; }}
              >{c.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Phone / SMS Simulation ────────────────────────────────────────────────────

function PhoneSim({ simulation, onComplete }) {
  const [stage, setStage]               = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [pendingFeedback, setPendingFeedback] = useState(null);

  const isPrivacy    = simulation?.title?.toLowerCase().includes("privacy");
  const isAI         = simulation?.title?.toLowerCase().includes("ai") || simulation?.title?.toLowerCase().includes("deepfake");
  const isSocialMedia = simulation?.title?.toLowerCase().includes("social");

  const deviceMessages = [
    {
      type: "sms",
      from: "+1 (888) 492-1038",
      sender: "FedEx Delivery",
      message: "Your package could not be delivered. Confirm your address and pay the $1.49 redelivery fee at: http://fedex-redeliver.xyz/track?id=8482910",
      time: "2:14 PM",
      question: "You receive this text. What do you do?",
      choices: [
        { label: "Delete the message and check your package status directly at fedex.com or the FedEx app", correct: true,  outcome: "The link goes to fedex-redeliver.xyz, not fedex.com. Legitimate carriers send you to their official domains. Check package status directly through the official app or website, never through a link in an unexpected text." },
        { label: "Tap the link since $1.49 is a small fee and you might have a package coming", correct: false, outcome: "The link leads to a credential and payment harvesting page. The small fee is designed to make compliance seem low-risk. Your card details will be charged far more than $1.49." },
        { label: "Reply STOP to opt out of the messages", correct: false, outcome: "Replying to smishing messages confirms your number is active and monitored. This leads to more targeted attacks, not fewer." },
      ],
    },
    {
      type: "sms",
      from: "IT-HELPDESK",
      sender: "IT Helpdesk",
      message: "URGENT: Your Microsoft 365 account will be deactivated in 2 hours due to suspicious activity. Verify now: http://m365-verify.co/login or call 1-844-288-4921",
      time: "10:47 AM",
      question: "This text claims to be from your IT helpdesk. What do you do?",
      choices: [
        { label: "Contact IT through your company directory or internal portal — do not use the link or number in the message", correct: true,  outcome: "Legitimate IT helpdesks do not send account suspension notices via SMS with third-party links. Verify by contacting IT through a channel you already know and trust, not the one provided in the suspicious message." },
        { label: "Click the link since your M365 access is critical for work", correct: false, outcome: "This is a credential phishing page. Entering your Microsoft credentials gives the attacker access to your entire Microsoft 365 account and everything connected to it." },
        { label: "Call the number in the text to verify before clicking anything", correct: false, outcome: "The phone number is also attacker-controlled. Calling it reaches a fake helpdesk that will attempt to socially engineer your credentials or MFA codes." },
      ],
    },
    {
      type: "sms",
      from: "+1 (415) 203-9847",
      sender: "Unknown",
      message: "Hey! It's Sarah from marketing. I lost my phone and I'm using a temp number. Can you send me a $50 Amazon gift card for a client gift? I'll pay you back Monday. Super urgent!",
      time: "3:28 PM",
      question: "You receive this from an unknown number claiming to be a coworker. What do you do?",
      choices: [
        { label: "Call or message Sarah through her known work contact to verify before doing anything", correct: true,  outcome: "Gift card requests from unknown numbers claiming to be colleagues are a classic social engineering attack. The urgency and the unknown number are both red flags. Verify through a channel you already have for this person." },
        { label: "Send the gift card since $50 is not much and Sarah sounds like she needs help", correct: false, outcome: "This is a gift card scam. Once you send the code, the money is gone. The attacker has already researched Sarah's name from your company directory or LinkedIn." },
        { label: "Reply asking for Sarah's employee ID to verify her identity", correct: false, outcome: "Replying gives the attacker time to prepare a convincing answer. The verification should happen through a channel you already have for Sarah, not through further dialogue with the unknown number." },
      ],
    },
  ];

  const privacyMessages = [
    {
      type: "call",
      from: "202-555-0147",
      sender: "IRS — Tax Enforcement",
      message: "FINAL NOTICE: This is the Internal Revenue Service. A warrant has been issued for your arrest due to unpaid taxes. You must call back immediately at 202-555-0147 or face arrest within 2 hours.",
      time: "Missed call + voicemail",
      question: "You receive this voicemail claiming to be the IRS threatening arrest. What do you do?",
      choices: [
        { label: "Ignore and delete it — the IRS contacts taxpayers by mail first and never threatens immediate arrest by phone", correct: true,  outcome: "The IRS initiates contact through postal mail, not phone calls. Threatening immediate arrest is a scare tactic used exclusively by scammers. If you have concerns about your taxes, contact the IRS directly through irs.gov or 1-800-829-1040." },
        { label: "Call back immediately since you cannot afford to be arrested", correct: false, outcome: "Calling back connects you to a scammer who will pressure you to pay with gift cards or wire transfer. The IRS does not operate this way." },
        { label: "Call your attorney before calling back to protect yourself legally", correct: false, outcome: "This is still engaging with the scam. Deleting the message and ignoring it is the correct response. If you have real tax concerns, contact the IRS through official channels." },
      ],
    },
    {
      type: "call",
      from: "Unknown",
      sender: "Grandchild (voice sounds familiar)",
      message: "Grandma/Grandpa? It's me. I'm in trouble. I was in a car accident and I'm in jail. Please don't tell Mom and Dad. I need you to send $2,000 in gift cards right now. Please hurry.",
      time: "11:32 PM",
      question: "You receive a late night call from what sounds exactly like your grandchild's voice saying they are in jail. What do you do?",
      choices: [
        { label: "Hang up and call your grandchild directly on their known number to verify before doing anything", correct: true,  outcome: "AI voice cloning can replicate voices from social media clips. The request for secrecy and gift card payment are attack signatures. Hanging up and calling your grandchild's real number takes 30 seconds and defeats the attack entirely." },
        { label: "Send the gift cards since your grandchild sounds distressed and needs help immediately", correct: false, outcome: "This is a grandparent scam using AI voice cloning. Gift card codes cannot be recovered once sent. The urgency and secrecy request are deliberate tactics to prevent you from verifying." },
        { label: "Ask them a question only your real grandchild would know to verify identity", correct: false, outcome: "AI systems can be prompted to answer personal questions using information gathered from social media. Calling back on their actual phone number is the only reliable verification method." },
      ],
    },
    {
      type: "sms",
      from: "Your Bank (spoofed)",
      sender: "BANKOFAMERICA",
      message: "ALERT: Suspicious transaction detected on your account for $847.00. If this was not you, reply NO or call 1-800-432-1000 immediately to freeze your account.",
      time: "8:15 AM",
      question: "You receive this bank alert about a transaction you do not recognize. What do you do?",
      choices: [
        { label: "Call the number on the back of your debit card or log in to your bank's official app to check your account", correct: true,  outcome: "Bank SMS sender names can be spoofed. The phone number in the message may reach a fake bank. Always contact your bank through the number on your card or by going directly to their official website or app." },
        { label: "Reply NO immediately to stop the transaction", correct: false, outcome: "Replying confirms your number is active. If this is a spoofed message, your reply tells the attacker you are monitoring texts. Always verify through official channels rather than responding to the message itself." },
        { label: "Call 1-800-432-1000 from the text since it looks like the real Bank of America number", correct: false, outcome: "SMS sender names and included phone numbers can both be spoofed. The number in the text may reach a fake bank representative who will ask for your account details." },
      ],
    },
  ];

  const aiMessages = [
    {
      type: "call",
      from: "Office — CEO Direct Line",
      sender: "CEO (voice clone)",
      message: "Hey, I need you to process an urgent wire transfer of $85,000 to a new vendor before end of day. This is time-sensitive and confidential — do not discuss with anyone else. I will send you the account details by email in the next few minutes.",
      time: "4:47 PM",
      question: "Your CEO calls with an urgent wire request marked confidential. The voice sounds exactly right. What do you do?",
      choices: [
        { label: "End the call and contact your CEO through a separate channel you already have to verify before taking any financial action", correct: true,  outcome: "Urgency plus confidentiality plus financial request is the signature of AI voice clone fraud. The voice being correct proves nothing. Call your CEO back on a number you already have or walk to their office. Real executives understand verification." },
        { label: "Process the wire since the CEO's voice is confirmed and the request seems legitimate", correct: false, outcome: "AI voice cloning can replicate voices from a few seconds of audio. The voice being correct is not verification. This attack has cost organizations millions of dollars." },
        { label: "Ask the CEO to send the request in writing by email before processing", correct: false, outcome: "The attacker will send a spoofed email immediately as a follow-up. Multi-channel attacks are common. Verification must happen through a channel you independently initiate, not one the attacker also controls." },
      ],
    },
    {
      type: "sms",
      from: "+1 (628) 304-8821",
      sender: "Unknown",
      message: "Hi! I saw your profile and I think we have a lot in common. I work in tech and just moved to the area. Would love to connect! Here's a photo of me: [AI-generated profile photo attached]",
      time: "7:22 PM",
      question: "A stranger contacts you with a suspiciously perfect profile photo. What are the red flags and what do you do?",
      choices: [
        { label: "Be cautious — reverse image search the photo and avoid sharing personal information until you can verify this is a real person through a video call", correct: true,  outcome: "AI-generated profile photos are increasingly used in romance scams and social engineering. Reverse image searching often reveals AI-generated images have no other web presence. Real people appear in multiple contexts. A video call request also tests whether they are real." },
        { label: "Respond since they seem friendly and it is just a text message", correct: false, outcome: "Romance scam and social engineering scripts are designed to build trust gradually. Initial contact is always friendly. Engaging begins a relationship-building process that ends in financial fraud or credential theft." },
        { label: "Block immediately since all strangers contacting you are scammers", correct: false, outcome: "While blocking is a reasonable choice, the more valuable skill is recognizing the AI-generated photo indicator and knowing how to verify legitimacy. Not all stranger contacts are scams but the combination of out-of-nowhere contact plus a suspiciously perfect photo warrants caution." },
      ],
    },
    {
      type: "sms",
      from: "ALERT-SYS",
      sender: "Security Alert",
      message: "Your account login was detected from Moscow, Russia. If this was not you, verify your identity immediately: https://secure-account-verify.net/confirm?token=a8f2k",
      time: "2:03 AM",
      question: "You receive a 2 AM security alert about a login from Russia. The link looks urgent. What do you do?",
      choices: [
        { label: "Go to the official website or app for the relevant account directly and check your login history there — do not use the link in the text", correct: true,  outcome: "Urgent security alerts sent via SMS with third-party links are a common phishing vector. The fear of an unauthorized login is used to make you click without thinking. Check your account directly through the official app. If there is a real unauthorized login, you will see it there." },
        { label: "Click the link immediately since a Russia login could mean your account is actively being accessed", correct: false, outcome: "The urgency is the attack. The link goes to a phishing page that will collect your credentials to actually compromise the account you are trying to protect. Go to the real site directly." },
        { label: "Reply to the text asking for more details about which account was accessed", correct: false, outcome: "The message does not specify which account because it is a mass-sent phishing message. Replying confirms your number. Contact the relevant service directly through their official channels." },
      ],
    },
  ];

  const socialMessages = [
    {
      type: "sms",
      from: "Instagram",
      sender: "Instagram Security",
      message: "Your account has been compromised. Click here to secure it immediately: http://instagram-account-secure.net/verify?id=48291",
      time: "9:14 AM",
      question: "You receive this security alert appearing to be from Instagram. What do you do?",
      choices: [
        { label: "Go to instagram.com directly or open the Instagram app to check for any real alerts — do not use the link in the message", correct: true,  outcome: "Instagram sends security alerts through the app and to your registered email, not through SMS with third-party links. instagram-account-secure.net is not Instagram. Check your account status directly through the official app." },
        { label: "Click the link immediately since a compromised account is urgent", correct: false, outcome: "The urgency is engineered to make you click without thinking. The link goes to a credential phishing page that will actually compromise your account." },
        { label: "Reply STOP to unsubscribe from security alerts", correct: false, outcome: "Replying to smishing messages confirms your number is active. Legitimate security services do not use SMS opt-out mechanisms." },
      ],
    },
    {
      type: "sms",
      from: "+1 (312) 847-2091",
      sender: "Unknown",
      message: "Hey! Sarah shared a photo of you and tagged you. You should see this before anyone else does lol: http://fb-photo-tag.xyz/view?ref=sarah_j",
      time: "2:33 PM",
      question: "A text from an unknown number claims a friend tagged you in a photo with a suspicious link. What do you do?",
      choices: [
        { label: "Delete the message — if Sarah tagged you in a photo the notification would come through Facebook or Instagram directly, not an SMS from an unknown number with a third-party URL", correct: true,  outcome: "Social media tagging notifications come through the platform's own notification system, not SMS from unknown numbers. fb-photo-tag.xyz is not Facebook. This is a smishing attempt designed to harvest your credentials when you try to log in." },
        { label: "Click the link since you want to see the photo before others do", correct: false, outcome: "The FOMO trigger is deliberate manipulation. The link leads to a fake Facebook login page. If Sarah tagged you in a real photo you will see it when you open Facebook normally." },
        { label: "Text back asking Sarah if she actually tagged you", correct: false, outcome: "Replying to the unknown number confirms your number is active and monitored. Contact Sarah through Facebook directly, not by responding to the suspicious SMS." },
      ],
    },
    {
      type: "sms",
      from: "Meta",
      sender: "Meta Business",
      message: "Your Facebook Business page has been reported for policy violations and will be permanently disabled in 24 hours. Provide verification to appeal: http://meta-business-appeals.net/verify",
      time: "11:47 AM",
      question: "Your business page allegedly faces permanent removal in 24 hours. What do you do?",
      choices: [
        { label: "Check your actual Facebook Business page and Business Support inbox for any real policy notices — meta-business-appeals.net is not Meta and the 24-hour deadline is a pressure tactic", correct: true,  outcome: "Meta communicates policy violations through notifications within the platform and to the registered email address. Third-party URLs in SMS messages are not how Meta handles appeals. The artificial deadline prevents verification." },
        { label: "Click the link and complete verification quickly since losing the business page would be catastrophic", correct: false, outcome: "The catastrophic consequence and tight deadline are manipulation tactics. Clicking the link leads to a page that harvests your Facebook business credentials." },
        { label: "Call Meta customer support using the number in the text to verify the violation", correct: false, outcome: "The phone number in the text is also attacker-controlled. Meta does not provide phone support through SMS alerts. Check the issue directly through your Facebook Business Manager." },
      ],
    },
  ];

  const messages = isAI ? aiMessages : isPrivacy ? privacyMessages : isSocialMedia ? socialMessages : deviceMessages;
  const current = messages[stage];

  const handleChoice = (choice) => {
    const newCorrect = choice.correct ? correctCount + 1 : correctCount;
    if (choice.correct) setCorrectCount(newCorrect);
    setPendingFeedback({ ...choice, newCorrect });
  };

  const handleDismiss = () => {
    const next = stage + 1;
    const nc = pendingFeedback.newCorrect;
    setPendingFeedback(null);
    if (next >= 3) { onComplete(nc); return; }
    setStage(next);
  };

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
      <div style={{ width: "260px", flexShrink: 0 }}>
        <div style={{ borderRadius: "32px", border: "3px solid #334155", overflow: "hidden", background: "#0a0a0a", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <div style={{ background: "#1a1a1a", padding: "12px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "60px", height: "6px", borderRadius: "3px", background: "#333" }} />
          </div>
          <div style={{ background: "#0f172a", padding: "0" }}>
            <div style={{ background: current?.type === "call" ? "linear-gradient(180deg, #1a2744, #0f172a)" : "#1e293b", padding: "12px", borderBottom: "1px solid #334155" }}>
              {current?.type === "call" ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 8px" }}>👤</div>
                  <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: "14px" }}>{current?.sender}</div>
                  <div style={{ color: "#64748b", fontSize: "11px", marginTop: "2px" }}>{current?.from}</div>
                  <div style={{ color: "#f87171", fontSize: "11px", marginTop: "4px" }}>📞 {current?.time}</div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: "13px" }}>{current?.sender}</div>
                    <div style={{ color: "#64748b", fontSize: "10px" }}>{current?.time}</div>
                  </div>
                  <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "8px" }}>{current?.from}</div>
                  <div style={{ background: "#334155", borderRadius: "12px 12px 12px 2px", padding: "10px 12px" }}>
                    <div style={{ color: "#e2e8f0", fontSize: "12px", lineHeight: 1.5 }}>{current?.message}</div>
                  </div>
                </div>
              )}
            </div>
            {current?.type === "call" && (
              <div style={{ padding: "10px 12px", background: "#0f172a" }}>
                <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>Voicemail transcript:</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: 1.5, fontStyle: "italic" }}>"{current?.message}"</div>
              </div>
            )}
          </div>
          <div style={{ background: "#0a0a0a", padding: "12px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1e293b" }} />
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "10px", fontSize: "11px", color: "#334155" }}>Step {stage + 1} of 3</div>
      </div>
      <div style={{ flex: 1, background: "#0f172a", borderRadius: "14px", border: "1px solid #1e293b", padding: "20px" }}>
        <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "14px", lineHeight: 1.6 }}>{current?.question}</div>
        {pendingFeedback ? (
          <div>
            <div style={{ padding: "14px 16px", borderRadius: "10px", marginBottom: "12px", background: pendingFeedback.correct ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: pendingFeedback.correct ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(248,113,113,0.3)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: pendingFeedback.correct ? "#34d399" : "#f87171", marginBottom: "4px" }}>{pendingFeedback.correct ? "Good call" : "Wrong move"}</div>
              <div style={{ fontSize: "12px", color: pendingFeedback.correct ? "#a7f3d0" : "#fecaca", lineHeight: 1.5 }}>{pendingFeedback.outcome}</div>
            </div>
            <button onClick={handleDismiss} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
              {stage < 2 ? "Next Message →" : "See Results"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {current?.choices.map((c, i) => (
              <button key={i} onClick={() => handleChoice(c)} style={{ textAlign: "left", padding: "12px 14px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#cbd5e1", fontSize: "13px", lineHeight: 1.5, cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.background = "#020617"; }}
              >{c.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Password Manager Simulation ───────────────────────────────────────────────

function PasswordManagerSim({ simulation, onComplete }) {
  const [stage, setStage]               = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [pendingFeedback, setPendingFeedback] = useState(null);
  const [vaultEntries, setVaultEntries] = useState([
    { site: "gmail.com",       username: "nick@example.com", password: "password123",    mfa: false, strength: "weak",   reused: true  },
    { site: "github.com",      username: "nick@example.com", password: "password123",    mfa: false, strength: "weak",   reused: true  },
    { site: "bankofamerica.com", username: "nick@example.com", password: "Summer2019!",  mfa: false, strength: "medium", reused: false },
    { site: "amazon.com",      username: "nick@example.com", password: "NickRules99",    mfa: false, strength: "weak",   reused: false },
    { site: "linkedin.com",    username: "nick@example.com", password: "Summer2019!",    mfa: false, strength: "medium", reused: true  },
  ]);

  const isPrivacyAudit = simulation?.title?.toLowerCase().includes("privacy");

  const auditStages = [
    {
      instruction: "Step 1 of 3 — Fix reused passwords",
      question: "Your vault shows three accounts sharing passwords. gmail.com and github.com both use 'password123'. linkedin.com shares the bank password. What is the correct action?",
      choices: [
        { label: "Generate unique random passwords for gmail.com, github.com, and linkedin.com using the password manager", correct: true,  outcome: "Unique randomly generated passwords for each account eliminate credential stuffing risk. The password manager stores them so you never need to remember them.", action: () => setVaultEntries(prev => prev.map(e => e.reused ? { ...e, password: `[Generated — ${Math.random().toString(36).slice(2, 14)}]`, reused: false, strength: "strong" } : e)) },
        { label: "Change the shared password to something more complex but use the same one across the three sites to make it easier to remember", correct: false, outcome: "A more complex shared password is still a shared password. One breach still compromises all three accounts. Use unique passwords for every account." },
        { label: "Only fix the bank password sharing since that is the most sensitive", correct: false, outcome: "Email and GitHub are also high-value targets. A compromised Gmail can be used to reset every other account. All reused passwords need unique replacements." },
      ],
    },
    {
      instruction: "Step 2 of 3 — Enable MFA on critical accounts",
      question: "None of your accounts have MFA enabled. Which account should you prioritize first and why?",
      choices: [
        { label: "Enable MFA on gmail.com first since email is the recovery mechanism for every other account, making it the highest value target", correct: true,  outcome: "Email is the master key. With email MFA enabled, an attacker who steals your email password still cannot access your account or use it to reset other accounts. This is the highest-impact single action.", action: () => setVaultEntries(prev => prev.map(e => e.site === "gmail.com" ? { ...e, mfa: true } : e)) },
        { label: "Enable MFA on bankofamerica.com first since financial accounts have the most direct risk", correct: false, outcome: "Bank MFA is important, but your email controls your bank account recovery. If an attacker resets your bank password using your email, your bank MFA is bypassed. Email is the higher priority." },
        { label: "Enable MFA on all accounts simultaneously since they are all equally important", correct: false, outcome: "All MFA is good, but this question is about priority when you have limited time. Email is the clear first priority because it controls account recovery for everything else." },
      ],
    },
    {
      instruction: "Step 3 of 3 — Handle the weak master password",
      question: "Your password manager audit shows your master password is only 10 characters. What is the correct approach?",
      choices: [
        { label: "Change the master password to a long passphrase of 5 or more random words, which is both highly secure and memorable", correct: true,  outcome: "A long random passphrase is the correct master password format. It is the one password you must remember, so memorability matters. Five random words provide enormous entropy while remaining memorable with brief practice." },
        { label: "Add a symbol and a number to the existing 10-character password to increase its strength", correct: false, outcome: "Adding complexity to a short password gives you a marginally stronger short password. Length matters far more than complexity. A 10-character password with symbols is still much weaker than a 25-character passphrase." },
        { label: "The master password is fine since the password manager encrypts everything anyway", correct: false, outcome: "The master password is the key to the encryption. A weak master password means the entire vault is only as strong as that password. It is the most important single password you have." },
      ],
    },
  ];

  const privacyStages = [
    {
      instruction: "Step 1 of 3 — Revoke excessive app permissions",
      question: "Your audit shows five apps with permissions they should not need: a flashlight app with contacts access, a calculator with microphone access, a weather app with SMS read access, a game with camera access, and a recipe app with location always-on. What is the correct action?",
      choices: [
        { label: "Revoke all permissions that are not required for the app's core function — a flashlight needs no contacts, a calculator needs no microphone, a weather app needs no SMS access", correct: true,  outcome: "Permission minimization is the correct approach. Apps frequently request permissions beyond their functional needs to collect data for advertising or resale. Revoking unnecessary permissions limits data exposure without breaking app functionality." },
        { label: "Uninstall all five apps since any app requesting unnecessary permissions is malware", correct: false, outcome: "Unnecessary permission requests are common but do not automatically indicate malware. Revoking the specific permissions is the proportionate response. Uninstalling is warranted if the app has no legitimate use." },
        { label: "Leave the permissions since revoking them might break the apps", correct: false, outcome: "Apps are required to function without permissions they do not actually need for their core purpose. A flashlight that cannot function without your contacts list is either broken by design or deliberately harvesting your data." },
      ],
    },
    {
      instruction: "Step 2 of 3 — Respond to breach notifications",
      question: "Your audit found two of your email addresses in recent data breaches. nick@example.com was in the LinkedIn breach exposing passwords. nick@personal.com was in a forum breach exposing only the email address. What do you do for each?",
      choices: [
        { label: "Change the LinkedIn password immediately and audit every account using the same password. For the forum breach, monitor for phishing targeting that address but no password change is needed.", correct: true,  outcome: "The LinkedIn breach exposed a password requiring immediate rotation on LinkedIn and credential stuffing checks everywhere else. The forum breach exposed only an email address so no password change is needed but that address may receive more targeted phishing." },
        { label: "Change passwords on both breached accounts and all other accounts as a precaution", correct: false, outcome: "Changing every account password is unnecessary and unsustainable. Focus proportionally — the password breach requires action on LinkedIn and reused accounts. The email-only breach requires monitoring, not mass password changes." },
        { label: "Only act if you notice unauthorized activity on your accounts", correct: false, outcome: "Credential stuffing attacks happen within hours of breach data becoming available. Waiting for unauthorized activity means the attacker has already had time to access your accounts." },
      ],
    },
    {
      instruction: "Step 3 of 3 — Opt out of data sharing",
      question: "Three services are sharing your data with advertisers by default: your phone carrier sells location data to brokers, your smart TV tracks viewing habits, and your fitness app shares health data with insurers. What is the correct approach?",
      choices: [
        { label: "Opt out of each service's data sharing through their privacy settings — carrier location sharing through account settings, TV tracking through the TV's privacy menu, and fitness app sharing through the app's data settings", correct: true,  outcome: "Each of these can be opted out of individually through the service's own settings. Most carriers now provide opt-out options. Smart TV ACR tracking is a privacy menu item. Health data sharing for insurance purposes may also have legal implications worth reviewing." },
        { label: "Delete all three services since data sharing cannot be fully controlled", correct: false, outcome: "Opting out of data sharing is effective for the specific data types each service controls. Deletion is a valid choice for services you do not need but is not required if opt-out options exist." },
        { label: "Accept the data sharing since these services are free and data is the tradeoff", correct: false, outcome: "Informed consent is the principle that matters here. Accepting data sharing as a deliberate choice is valid. Accepting it without knowing it is happening or without exploring opt-out options is not informed consent." },
      ],
    },
  ];

  const stages = isPrivacyAudit ? privacyStages : auditStages;
  const current = stages[stage];

  const handleChoice = (choice) => {
    const newCorrect = choice.correct ? correctCount + 1 : correctCount;
    if (choice.correct) {
      setCorrectCount(newCorrect);
      choice.action && choice.action();
    }
    setPendingFeedback({ ...choice, newCorrect });
  };

  const handleDismiss = () => {
    const next = stage + 1;
    const nc = pendingFeedback.newCorrect;
    setPendingFeedback(null);
    if (next >= 3) { onComplete(nc); return; }
    setStage(next);
  };

  const strengthColor = (s) => s === "strong" ? "#34d399" : s === "medium" ? "#fbbf24" : "#f87171";

  return (
    <div style={{ borderRadius: "12px", border: "1px solid #334155", overflow: "hidden", background: "#1e1e2e" }}>
      <div style={{ background: "linear-gradient(90deg, #1a1a3e, #2d2d5e)", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "18px" }}>🔑</span>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>Password Manager — Security Audit</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 600 }}>⚠️ 5 issues found</span>
      </div>
      <div style={{ padding: "12px 16px", background: "#0c1a2e", borderBottom: "1px solid #1e293b", fontSize: "12px", color: "#22d3ee", fontWeight: 600 }}>
        {current?.instruction}
      </div>
      <div style={{ background: "#020617", minHeight: "200px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e293b" }}>
              {["Site", "Username", "Password", "MFA", "Strength"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vaultEntries.map((e, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0f172a", background: (e.reused || e.strength === "weak" || !e.mfa) ? "rgba(251,191,36,0.03)" : "transparent" }}>
                <td style={{ padding: "9px 12px", color: "#f8fafc", fontWeight: 600 }}>{e.site}</td>
                <td style={{ padding: "9px 12px", color: "#64748b" }}>{e.username}</td>
                <td style={{ padding: "9px 12px", color: "#94a3b8", fontFamily: "monospace" }}>
                  {e.password.startsWith("[Generated") ? <span style={{ color: "#34d399" }}>{e.password}</span> : "•".repeat(Math.min(e.password.length, 12))}
                  {e.reused && <span style={{ marginLeft: "6px", fontSize: "10px", color: "#fbbf24", fontFamily: "sans-serif" }}>REUSED</span>}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, background: e.mfa ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)", color: e.mfa ? "#34d399" : "#f87171", border: e.mfa ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(248,113,113,0.3)" }}>
                    {e.mfa ? "ON" : "OFF"}
                  </span>
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <span style={{ color: strengthColor(e.strength), fontWeight: 600, fontSize: "11px" }}>
                    {e.strength === "strong" ? "●●●" : e.strength === "medium" ? "●●○" : "●○○"} {e.strength}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ borderTop: "1px solid #1e293b", padding: "16px", background: "#0a0f1e" }}>
        <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px", lineHeight: 1.6 }}>{current?.question}</div>
        {pendingFeedback ? (
          <div>
            <div style={{ padding: "14px 16px", borderRadius: "10px", marginBottom: "12px", background: pendingFeedback.correct ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: pendingFeedback.correct ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(248,113,113,0.3)" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: pendingFeedback.correct ? "#34d399" : "#f87171", marginBottom: "4px" }}>{pendingFeedback.correct ? "Good call" : "Wrong move"}</div>
              <div style={{ fontSize: "12px", color: pendingFeedback.correct ? "#a7f3d0" : "#fecaca", lineHeight: 1.5 }}>{pendingFeedback.outcome}</div>
            </div>
            <button onClick={handleDismiss} style={{ padding: "9px 20px", borderRadius: "8px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
              {stage < 2 ? "Next Step →" : "See Results"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {current?.choices.map((c, i) => (
              <button key={i} onClick={() => handleChoice(c)} style={{ textAlign: "left", padding: "11px 14px", borderRadius: "9px", border: "1px solid #1e293b", background: "#020617", color: "#cbd5e1", fontSize: "13px", lineHeight: 1.5, cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.background = "#020617"; }}
              >{c.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Text Decision Tree ────────────────────────────────────────────────────────

function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#64748b" }}>Progress</span>
        <span style={{ fontSize: "12px", color: "#22d3ee" }}>{pct}%</span>
      </div>
      <div style={{ height: "6px", borderRadius: "999px", background: "#1e293b" }}>
        <div style={{ height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #0e7490, #22d3ee)", width: `${pct}%`, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function TextDecisionTree({ simulation, nodes, rootKey, onComplete }) {
  const [currentKey, setCurrentKey]         = useState(rootKey);
  const [trail, setTrail]                   = useState([]);
  const [choicesMade, setChoicesMade]       = useState([]);
  const [pendingOutcome, setPendingOutcome] = useState(null);
  const currentNode = nodes[currentKey];
  const totalNodes  = Object.keys(nodes).length;

  const handleChoice = (choice) => {
    if (pendingOutcome) return;
    setChoicesMade(prev => [...prev, { nodeKey: currentKey, choiceText: choice.choice_text, isCorrect: choice.is_correct }]);
    setPendingOutcome(choice);
  };

  const handleContinue = () => {
    const choice = pendingOutcome;
    setPendingOutcome(null);
    if (!choice.next_node_key || !nodes[choice.next_node_key]) {
      const correct = [...choicesMade].filter(c => c.isCorrect).length;
      onComplete(choicesMade, Math.round((correct / choicesMade.length) * 100));
      return;
    }
    setTrail(prev => [...prev, currentKey]);
    setCurrentKey(choice.next_node_key);
  };

  return (
    <>
      <ProgressBar current={trail.length} total={totalNodes} />
      {currentNode && (
        <div style={{ borderRadius: "18px", border: "1px solid #1e293b", background: "#0f172a", overflow: "hidden" }}>
          {currentNode.context && <div style={{ padding: "14px 24px", background: "#020617", borderBottom: "1px solid #1e293b", fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>{currentNode.context}</div>}
          <div style={{ padding: "28px 24px" }}>
            <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "18px", lineHeight: 1.5, marginBottom: "24px" }}>{currentNode.prompt}</div>
            {pendingOutcome ? (
              <div>
                <div style={{ padding: "16px 20px", borderRadius: "12px", marginBottom: "14px", background: pendingOutcome.is_correct ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: pendingOutcome.is_correct ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(248,113,113,0.3)" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: pendingOutcome.is_correct ? "#34d399" : "#f87171", marginBottom: "6px" }}>{pendingOutcome.is_correct ? "Good call" : "Not the best move"}</div>
                  <div style={{ fontSize: "13px", lineHeight: 1.6, color: pendingOutcome.is_correct ? "#a7f3d0" : "#fecaca" }}>{pendingOutcome.outcome_text}</div>
                </div>
                <button onClick={handleContinue} style={{ padding: "12px 24px", borderRadius: "12px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                  {pendingOutcome.next_node_key && nodes[pendingOutcome.next_node_key] ? "Continue →" : "See Results"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentNode.choices.map(choice => (
                  <button key={choice.id} onClick={() => handleChoice(choice)} style={{ textAlign: "left", padding: "16px 18px", borderRadius: "14px", border: "1px solid #334155", background: "#020617", color: "#cbd5e1", fontSize: "14px", lineHeight: 1.5, cursor: "pointer", fontWeight: 500 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#22d3ee"; e.currentTarget.style.background = "rgba(34,211,238,0.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.background = "#020617"; }}
                  >{choice.choice_text}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Outcome Screen ────────────────────────────────────────────────────────────

function OutcomeScreen({ score, xpAwarded, levelTitle, simulation, onRestart, onBack }) {
  const pct = Math.round((score / 3) * 100);
  const passed = pct >= 70;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100, background: "rgba(2,6,23,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "480px", width: "100%", borderRadius: "20px", border: "1px solid #1e293b", background: "#0f172a", padding: "40px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <div style={{ fontSize: "52px" }}>{passed ? "🎉" : "🔁"}</div>
        <div style={{ fontWeight: 800, color: "#f8fafc", fontSize: "24px" }}>{passed ? "Threat Neutralized" : "Keep Practicing"}</div>
        <div style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.6, maxWidth: "360px" }}>{simulation?.explanation}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", width: "100%" }}>
          {[{ label: "Score", value: `${pct}%` }, { label: "Correct", value: `${score}/3` }, { label: "XP Earned", value: `+${xpAwarded}` }].map(s => (
            <div key={s.label} style={{ borderRadius: "12px", border: "1px solid #1e293b", background: "#020617", padding: "14px" }}>
              <div style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
              <div style={{ marginTop: "6px", fontSize: "22px", fontWeight: 700, color: "#22d3ee" }}>{s.value}</div>
            </div>
          ))}
        </div>
        {xpAwarded > 0 && <div style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", fontSize: "14px", fontWeight: 600 }}>You are now a {levelTitle}</div>}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={onRestart} style={{ padding: "12px 24px", borderRadius: "12px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Try Again</button>
          <button onClick={onBack} style={{ padding: "12px 24px", borderRadius: "12px", border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Back to Scenarios</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DecisionScenario() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [simulation, setSimulation] = useState(null);
  const [nodes, setNodes]           = useState({});
  const [rootKey, setRootKey]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [done, setDone]             = useState(false);
  const [score, setScore]           = useState(0);
  const [rawCorrect, setRawCorrect] = useState(0);
  const [xpAwarded, setXpAwarded]   = useState(0);
  const [levelTitle, setLevelTitle] = useState("");
  const [key, setKey]               = useState(0);

  useEffect(() => {
    setLoading(true);
    api(`/scenarios/${id}`)
      .then(res => { setSimulation(res.simulation); setNodes(res.nodes); setRootKey(res.rootKey); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [id]);

  const prompt = simulation?.prompt || "";
  const isNetworkSim  = prompt.startsWith("DESKTOP_SIM_NETWORK:");
  const isTaskmanSim  = prompt.startsWith("DESKTOP_SIM_TASKMAN:");
  const isTerminalSim = prompt.startsWith("DESKTOP_SIM_TERMINAL:");
  const isBrowserSim  = prompt.startsWith("DESKTOP_SIM_BROWSER:");
  const isPhoneSim    = prompt.startsWith("DESKTOP_SIM_PHONE:");
  const isPasswordSim = prompt.startsWith("DESKTOP_SIM_PASSWORD:");
  const isHardeningSim = prompt.startsWith("DESKTOP_SIM_HARDENING:");
  const isDesktopSim  = prompt.startsWith("DESKTOP_SIM:") && !isNetworkSim && !isTaskmanSim && !isTerminalSim && !isBrowserSim && !isPhoneSim && !isPasswordSim && !isHardeningSim;

  const isAnyGUISim = isDesktopSim || isNetworkSim || isTaskmanSim || isTerminalSim || isBrowserSim || isPhoneSim || isPasswordSim || isHardeningSim;

  const getSimLabel = () => {
    if (isNetworkSim)   return "NOC Simulation";
    if (isTaskmanSim)   return "Task Manager Simulation";
    if (isTerminalSim)  return "Terminal Simulation";
    if (isBrowserSim)   return "Browser Simulation";
    if (isPhoneSim)     return "Phone / SMS Simulation";
    if (isPasswordSim)  return "Password Manager Simulation";
    if (isHardeningSim) return "Desktop Hardening Simulation";
    if (isDesktopSim)   return "Desktop Simulation";
    return "Decision Tree";
  };

  const getSimType = () => {
    if (isNetworkSim)  return "Network Operations Simulation";
    if (isAnyGUISim)   return "Interactive Simulation";
    return "Decision Scenario";
  };

  const handleDesktopComplete = async (correctCount) => {
    const finalScore = Math.round((correctCount / 3) * 100);
    setRawCorrect(correctCount);
    setScore(finalScore);
    try {
      const res = await api(`/scenarios/${id}/complete`, { method: "POST", body: JSON.stringify({ choicesMade: [], score: finalScore }) });
      setXpAwarded(res.xpAwarded || 0);
      setLevelTitle(res.levelTitle || "");
    } catch {}
    setDone(true);
  };

  const handleTextComplete = async (choicesMade, finalScore) => {
    setScore(finalScore);
    try {
      const res = await api(`/scenarios/${id}/complete`, { method: "POST", body: JSON.stringify({ choicesMade, score: finalScore }) });
      setXpAwarded(res.xpAwarded || 0);
      setLevelTitle(res.levelTitle || "");
    } catch {}
    setDone(true);
  };

  const handleRestart = () => { setDone(false); setScore(0); setRawCorrect(0); setXpAwarded(0); setLevelTitle(""); setKey(k => k + 1); };

  if (loading) return <Layout title="Decision Scenario"><div style={{ color: "#475569", padding: "40px", textAlign: "center" }}>Loading scenario...</div></Layout>;
  if (error)   return <Layout title="Decision Scenario"><div style={{ padding: "12px 16px", borderRadius: "10px", background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", fontSize: "13px" }}>{error}</div></Layout>;

  return (
    <Layout title={simulation?.title || "Decision Scenario"}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <button onClick={() => navigate("/simulations")} style={{ marginBottom: "20px", padding: "8px 16px", borderRadius: "10px", border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: "13px", cursor: "pointer" }}>
          ← Back to Scenarios
        </button>
        <div style={{ marginBottom: "24px", padding: "20px 24px", borderRadius: "18px", border: "1px solid #1e293b", background: "#0f172a" }}>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>{getSimType()}</div>
          <div style={{ fontWeight: 800, color: "#f8fafc", fontSize: "22px" }}>{simulation?.title}</div>
          {!isAnyGUISim && (
            <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "8px", lineHeight: 1.6 }}>{simulation?.prompt}</div>
          )}
          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            <span style={{ padding: "3px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, border: "1px solid #334155", color: "#94a3b8" }}>{simulation?.difficulty}</span>
            <span style={{ padding: "3px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, border: "1px solid rgba(34,211,238,0.3)", color: "#22d3ee" }}>{getSimLabel()}</span>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {done ? (
            <OutcomeScreen
              score={isAnyGUISim ? rawCorrect : Math.round(score / 100 * 3)}
              xpAwarded={xpAwarded}
              levelTitle={levelTitle}
              simulation={simulation}
              onRestart={handleRestart}
              onBack={() => navigate("/simulations")}
            />
          ) : isNetworkSim ? (
            <NetworkIntrusionDesktop key={key} simulation={simulation} onComplete={handleDesktopComplete} />
          ) : isTaskmanSim ? (
            <TaskManagerDesktop key={key} simulation={simulation} onComplete={handleDesktopComplete} />
          ) : isDesktopSim ? (
            <SimulatedDesktop key={key} simulation={simulation} onComplete={handleDesktopComplete} />
          ) : isTerminalSim ? (
            <TerminalSim key={key} simulation={simulation} onComplete={handleDesktopComplete} />
          ) : isBrowserSim ? (
            <BrowserSim key={key} simulation={simulation} onComplete={handleDesktopComplete} />
          ) : isPhoneSim ? (
            <PhoneSim key={key} simulation={simulation} onComplete={handleDesktopComplete} />
          ) : isPasswordSim ? (
            <PasswordManagerSim key={key} simulation={simulation} onComplete={handleDesktopComplete} />
          ) : isHardeningSim ? (
            <SimulatedDesktop key={key} simulation={simulation} onComplete={handleDesktopComplete} />
          ) : (
            <TextDecisionTree key={key} simulation={simulation} nodes={nodes} rootKey={rootKey} onComplete={handleTextComplete} />
          )}
        </div>
      </div>
    </Layout>
  );
}
