import { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import api from "../api";

const initialForm = {
  title: "", prompt: "", explanation: "",
  sender_name: "", sender_email: "", subject: "",
  sent_at: "Today, 9:00 AM", body_text: "",
  link_label: "", link_url: "", attachment_name: "",
  is_phishing: true, landing_page_type: "microsoft",
  difficulty: "easy", scenario_type: "phishing", channel: "email",
  question_text: "", choice_a: "", choice_b: "", choice_c: "",
  correct_choice: "A", red_flags: "",
};

function Field({ label, children }) {
  return (
    <div>
      <div style={{ marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#94a3b8" }}>{label}</div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder = "" }) {
  return (
    <Field label={label}>
      <input value={value} onChange={onChange} placeholder={placeholder} style={{
        width: "100%", padding: "10px 12px", borderRadius: "10px",
        border: "1px solid #334155", background: "#020617", color: "#e2e8f0",
        fontSize: "13px", boxSizing: "border-box", outline: "none",
      }} />
    </Field>
  );
}

function TextArea({ label, value, onChange, rows = 5, placeholder = "" }) {
  return (
    <Field label={label}>
      <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} style={{
        width: "100%", padding: "10px 12px", borderRadius: "10px",
        border: "1px solid #334155", background: "#020617", color: "#e2e8f0",
        fontSize: "13px", boxSizing: "border-box", outline: "none", resize: "vertical",
      }} />
    </Field>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <Field label={label}>
      <select value={value} onChange={onChange} style={{
        width: "100%", padding: "10px 12px", borderRadius: "10px",
        border: "1px solid #334155", background: "#020617", color: "#e2e8f0",
        fontSize: "13px", outline: "none",
      }}>
        {children}
      </select>
    </Field>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "13px",
      border: active ? "1px solid #22d3ee" : "1px solid #334155",
      background: active ? "#0e3a5a" : "#0f172a",
      color: active ? "#22d3ee" : "#94a3b8", cursor: "pointer",
    }}>
      {children}
    </button>
  );
}

// ── Simulations Tab ────────────────────────────────────────────────────────
function SimulationsTab() {
  const [form, setForm] = useState(initialForm);
  const [simulations, setSimulations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [bulkJson, setBulkJson] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await api("/admin/simulations");
      setSimulations(res.simulations || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const fillForm = (sim) => {
    setEditingId(sim.id);
    setForm({
      title: sim.title || "", prompt: sim.prompt || "", explanation: sim.explanation || "",
      sender_name: sim.sender_name || "", sender_email: sim.sender_email || "",
      subject: sim.subject || "", sent_at: sim.sent_at || "Today, 9:00 AM",
      body_text: sim.body_text || "", link_label: sim.link_label || "",
      link_url: sim.link_url || "", attachment_name: sim.attachment_name || "",
      is_phishing: Boolean(sim.is_phishing),
      landing_page_type: sim.landing_page_type || "microsoft",
      difficulty: sim.difficulty || "easy",
      scenario_type: sim.scenario_type || "phishing",
      channel: sim.channel || "email",
      question_text: sim.question?.question_text || "",
      choice_a: sim.question?.choice_a || "", choice_b: sim.question?.choice_b || "",
      choice_c: sim.question?.choice_c || "",
      correct_choice: sim.question?.correct_choice || "A",
      red_flags: sim.question?.red_flags || "",
    });
    setSuccess(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => { setForm(initialForm); setEditingId(null); setError(""); setSuccess(""); };

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    try {
      if (editingId) {
        await api(`/admin/simulations/${editingId}`, { method: "PUT", body: JSON.stringify(form) });
        setSuccess("Simulation updated.");
      } else {
        await api("/admin/simulations", { method: "POST", body: JSON.stringify(form) });
        setSuccess("Simulation created.");
      }
      reset(); await load();
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this simulation? This cannot be undone.")) return;
    setError(""); setSuccess("");
    try {
      await api(`/admin/simulations/${id}`, { method: "DELETE" });
      if (editingId === id) reset();
      setSuccess("Simulation deleted.");
      await load();
    } catch (e) { setError(e.message); }
  };

  const handleBulk = async () => {
    setError(""); setBulkResult(null);
    try {
      const parsed = JSON.parse(bulkJson);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const res = await api("/admin/simulations/bulk", {
        method: "POST", body: JSON.stringify({ simulations: arr }),
      });
      setBulkResult(res);
      await load();
    } catch (e) { setError(e.message || "Invalid JSON"); }
  };

  const filtered = simulations.filter((s) =>
    !search || [s.title, s.subject, s.sender_name, s.difficulty]
      .join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1fr" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>
              {editingId ? "Edit Simulation" : "Create Simulation"}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setBulkMode(!bulkMode)} style={{
                padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                border: "1px solid #334155", background: bulkMode ? "#0e3a5a" : "#1e293b",
                color: bulkMode ? "#22d3ee" : "#94a3b8", cursor: "pointer",
              }}>
                {bulkMode ? "Single Mode" : "Bulk Import"}
              </button>
              {editingId && (
                <button onClick={reset} style={{
                  padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
                  border: "1px solid #334155", background: "#1e293b", color: "#94a3b8", cursor: "pointer",
                }}>Cancel Edit</button>
              )}
            </div>
          </div>

          {error && <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", marginBottom: "12px", fontSize: "13px" }}>{error}</div>}
          {success && <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#052e16", border: "1px solid #14532d", color: "#4ade80", marginBottom: "12px", fontSize: "13px" }}>{success}</div>}

          {bulkMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.6 }}>
                Paste a JSON array of simulation objects. Each must have <code style={{ color: "#22d3ee" }}>title</code> and <code style={{ color: "#22d3ee" }}>subject</code>. Duplicates are skipped.
              </div>
              <TextArea label="JSON Payload" value={bulkJson} onChange={(e) => setBulkJson(e.target.value)} rows={12} placeholder='[{"title":"...", "subject":"...", ...}]' />
              <button onClick={handleBulk} style={{ padding: "10px", borderRadius: "10px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                Import Simulations
              </button>
              {bulkResult && (
                <div style={{ padding: "12px", borderRadius: "10px", background: "#052e16", border: "1px solid #14532d", color: "#4ade80", fontSize: "13px" }}>
                  Created: {bulkResult.created} | Skipped: {bulkResult.skipped} | Errors: {bulkResult.errors?.length || 0}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Input label="Title" value={form.title} onChange={(e) => update("title", e.target.value)} />
                <Input label="Subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Input label="Sender Name" value={form.sender_name} onChange={(e) => update("sender_name", e.target.value)} />
                <Input label="Sender Email" value={form.sender_email} onChange={(e) => update("sender_email", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <Input label="Sent At" value={form.sent_at} onChange={(e) => update("sent_at", e.target.value)} />
                <Select label="Difficulty" value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
                <Select label="Channel" value={form.channel} onChange={(e) => update("channel", e.target.value)}>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="voice">Voice</option>
                  <option value="push">Push</option>
                  <option value="physical">Physical</option>
                </Select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Select label="Scenario Type" value={form.scenario_type} onChange={(e) => update("scenario_type", e.target.value)}>
                  <option value="phishing">Phishing</option>
                  <option value="smishing">Smishing</option>
                  <option value="vishing">Vishing</option>
                  <option value="mfa_fatigue">MFA Fatigue</option>
                  <option value="usb_baiting">USB Baiting</option>
                  <option value="authentication">Authentication</option>
                  <option value="legitimate">Legitimate</option>
                </Select>
                <Select label="Landing Page" value={form.landing_page_type} onChange={(e) => update("landing_page_type", e.target.value)}>
                  <option value="microsoft">Microsoft</option>
                  <option value="bank">Bank</option>
                  <option value="internal">Internal</option>
                  <option value="none">None</option>
                </Select>
              </div>
              <TextArea label="Prompt" value={form.prompt} onChange={(e) => update("prompt", e.target.value)} rows={2} />
              <TextArea label="Explanation" value={form.explanation} onChange={(e) => update("explanation", e.target.value)} rows={3} />
              <TextArea label="Email Body" value={form.body_text} onChange={(e) => update("body_text", e.target.value)} rows={6} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <Input label="Link Label" value={form.link_label} onChange={(e) => update("link_label", e.target.value)} />
                <Input label="Link URL" value={form.link_url} onChange={(e) => update("link_url", e.target.value)} />
                <Input label="Attachment" value={form.attachment_name} onChange={(e) => update("attachment_name", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Select label="Type" value={String(form.is_phishing)} onChange={(e) => update("is_phishing", e.target.value === "true")}>
                  <option value="true">Phishing</option>
                  <option value="false">Legitimate</option>
                </Select>
              </div>
              <div style={{ padding: "16px", borderRadius: "12px", background: "#020617", border: "1px solid #334155" }}>
                <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: "12px" }}>Knowledge Check Question</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <TextArea label="Question" value={form.question_text} onChange={(e) => update("question_text", e.target.value)} rows={2} />
                  <Input label="Choice A" value={form.choice_a} onChange={(e) => update("choice_a", e.target.value)} />
                  <Input label="Choice B" value={form.choice_b} onChange={(e) => update("choice_b", e.target.value)} />
                  <Input label="Choice C" value={form.choice_c} onChange={(e) => update("choice_c", e.target.value)} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <Select label="Correct Choice" value={form.correct_choice} onChange={(e) => update("correct_choice", e.target.value)}>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </Select>
                  </div>
                  <Input label="Red Flags (comma separated)" value={form.red_flags} onChange={(e) => update("red_flags", e.target.value)} placeholder="Urgency, fake domain, suspicious link" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleSubmit} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                  {editingId ? "Save Changes" : "Create Simulation"}
                </button>
                <button onClick={reset} style={{ padding: "12px 18px", borderRadius: "12px", border: "1px solid #334155", background: "#1e293b", color: "#94a3b8", cursor: "pointer", fontWeight: 600 }}>
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px" }}>
        <div style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", marginBottom: "12px" }}>
          Existing Simulations ({simulations.length})
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search simulations..." style={{
          width: "100%", padding: "9px 12px", borderRadius: "10px", marginBottom: "14px",
          border: "1px solid #334155", background: "#020617", color: "#e2e8f0",
          fontSize: "13px", boxSizing: "border-box", outline: "none",
        }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "680px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ color: "#94a3b8", fontSize: "13px" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "13px" }}>No simulations found.</div>
          ) : filtered.map((sim) => (
            <div key={sim.id} style={{ padding: "14px", borderRadius: "12px", background: "#020617", border: editingId === sim.id ? "1px solid #22d3ee" : "1px solid #1e293b" }}>
              <div style={{ fontWeight: 600, color: "#f8fafc", fontSize: "13px" }}>{sim.subject || sim.title}</div>
              <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>{sim.sender_name} · {sim.difficulty} · {sim.scenario_type}</div>
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button onClick={() => fillForm(sim)} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #22d3ee", background: "transparent", color: "#22d3ee", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDelete(sim.id)} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #f87171", background: "transparent", color: "#f87171", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Modules Tab ────────────────────────────────────────────────────────────
function ModulesTab() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await api("/admin/modules");
      setModules(res.modules || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const sections = ["all", ...Array.from(new Set(modules.map((m) => m.section_name).filter(Boolean)))];

  const filtered = modules.filter((m) => {
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
    const matchSection = selectedSection === "all" || m.section_name === selectedSection;
    return matchSearch && matchSection;
  });

  const handleSaveModule = async () => {
    setError(""); setSuccess("");
    try {
      await api(`/admin/modules/${editingModule.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editingModule.title,
          content: editingModule.content,
          category: editingModule.category,
          difficulty: editingModule.difficulty,
          duration_minutes: editingModule.duration_minutes,
          order_index: editingModule.order_index,
        }),
      });
      setSuccess("Module saved.");
      setEditingModule(null);
      await load();
    } catch (e) { setError(e.message); }
  };

  const handleSaveQuestion = async () => {
    setError(""); setSuccess("");
    try {
      await api(`/admin/modules/${editingQuestion.module_id}/questions/${editingQuestion.id}`, {
        method: "PUT",
        body: JSON.stringify({
          question_text: editingQuestion.question_text,
          choice_a: editingQuestion.choice_a,
          choice_b: editingQuestion.choice_b,
          choice_c: editingQuestion.choice_c,
          correct_choice: editingQuestion.correct_choice,
          explanation: editingQuestion.explanation,
        }),
      });
      setSuccess("Question saved.");
      setEditingQuestion(null);
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {error && <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", fontSize: "13px" }}>{error}</div>}
      {success && <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#052e16", border: "1px solid #14532d", color: "#4ade80", fontSize: "13px" }}>{success}</div>}

      {editingModule && (
        <div style={{ background: "#0f172a", border: "1px solid #22d3ee", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#22d3ee" }}>Editing Module</div>
            <button onClick={() => setEditingModule(null)} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #334155", background: "#1e293b", color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
          </div>
          <Input label="Title" value={editingModule.title} onChange={(e) => setEditingModule((p) => ({ ...p, title: e.target.value }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <Field label="Difficulty">
              <select value={editingModule.difficulty} onChange={(e) => setEditingModule((p) => ({ ...p, difficulty: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#e2e8f0", fontSize: "13px", outline: "none" }}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
            <Input label="Duration (min)" value={editingModule.duration_minutes} onChange={(e) => setEditingModule((p) => ({ ...p, duration_minutes: Number(e.target.value) }))} />
            <Input label="Order Index" value={editingModule.order_index} onChange={(e) => setEditingModule((p) => ({ ...p, order_index: Number(e.target.value) }))} />
          </div>
          <TextArea label="Content" value={editingModule.content} onChange={(e) => setEditingModule((p) => ({ ...p, content: e.target.value }))} rows={12} />
          <button onClick={handleSaveModule} style={{ padding: "12px", borderRadius: "12px", border: "none", background: "#0e7490", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Save Module
          </button>
        </div>
      )}

      {editingQuestion && (
        <div style={{ background: "#0f172a", border: "1px solid #a78bfa", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#a78bfa" }}>Editing Quiz Question</div>
            <button onClick={() => setEditingQuestion(null)} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #334155", background: "#1e293b", color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
          </div>
          <TextArea label="Question Text" value={editingQuestion.question_text} onChange={(e) => setEditingQuestion((p) => ({ ...p, question_text: e.target.value }))} rows={3} />
          <Input label="Choice A" value={editingQuestion.choice_a} onChange={(e) => setEditingQuestion((p) => ({ ...p, choice_a: e.target.value }))} />
          <Input label="Choice B" value={editingQuestion.choice_b} onChange={(e) => setEditingQuestion((p) => ({ ...p, choice_b: e.target.value }))} />
          <Input label="Choice C" value={editingQuestion.choice_c} onChange={(e) => setEditingQuestion((p) => ({ ...p, choice_c: e.target.value }))} />
          <Field label="Correct Choice">
            <select value={editingQuestion.correct_choice} onChange={(e) => setEditingQuestion((p) => ({ ...p, correct_choice: e.target.value }))} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#e2e8f0", fontSize: "13px", outline: "none" }}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </Field>
          <TextArea label="Explanation" value={editingQuestion.explanation} onChange={(e) => setEditingQuestion((p) => ({ ...p, explanation: e.target.value }))} rows={3} />
          <button onClick={handleSaveQuestion} style={{ padding: "12px", borderRadius: "12px", border: "none", background: "#6d28d9", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Save Question
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search modules..." style={{ flex: 1, minWidth: "200px", padding: "10px 14px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#e2e8f0", fontSize: "13px", outline: "none" }} />
        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#e2e8f0", fontSize: "13px", outline: "none" }}>
          {sections.map((s) => <option key={s} value={s}>{s === "all" ? "All Sections" : s}</option>)}
        </select>
      </div>

      <div style={{ fontSize: "13px", color: "#64748b" }}>
        Showing {filtered.length} of {modules.length} modules
      </div>

      {loading ? (
        <div style={{ color: "#94a3b8" }}>Loading modules...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((mod) => (
            <div key={mod.id} style={{ background: "#0f172a", border: expandedId === mod.id ? "1px solid #22d3ee" : "1px solid #1e293b", borderRadius: "14px", overflow: "hidden" }}>
              <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setExpandedId(expandedId === mod.id ? null : mod.id)}>
                <div>
                  <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "14px" }}>{mod.title}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    {mod.section_name} · {mod.difficulty} · {mod.duration_minutes} min · {mod.questions?.length || 0} questions
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button onClick={(e) => { e.stopPropagation(); setEditingModule({ ...mod }); setExpandedId(null); }} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: "1px solid #22d3ee", background: "transparent", color: "#22d3ee", cursor: "pointer" }}>Edit</button>
                  <span style={{ color: "#475569", fontSize: "18px" }}>{expandedId === mod.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {expandedId === mod.id && (
                <div style={{ borderTop: "1px solid #1e293b", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ background: "#020617", borderRadius: "10px", padding: "14px", fontSize: "13px", color: "#94a3b8", lineHeight: 1.7, maxHeight: "200px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
                    {mod.content}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "13px", marginBottom: "10px" }}>Quiz Questions</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(mod.questions || []).map((q, qi) => (
                        <div key={q.id} style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: "10px", padding: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                            <div style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 600, flex: 1 }}>Q{qi + 1}: {q.question_text}</div>
                            <button onClick={() => setEditingQuestion({ ...q, module_id: mod.id })} style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, border: "1px solid #a78bfa", background: "transparent", color: "#a78bfa", cursor: "pointer", flexShrink: 0 }}>Edit</button>
                          </div>
                          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                            {["A", "B", "C"].map((letter) => (
                              <div key={letter} style={{ fontSize: "12px", padding: "6px 10px", borderRadius: "8px", background: q.correct_choice === letter ? "#052e16" : "transparent", border: q.correct_choice === letter ? "1px solid #14532d" : "1px solid transparent", color: q.correct_choice === letter ? "#4ade80" : "#94a3b8" }}>
                                {letter}: {q[`choice_${letter.toLowerCase()}`]}
                                {q.correct_choice === letter && <span style={{ marginLeft: "8px", fontSize: "11px" }}>Correct</span>}
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <div style={{ marginTop: "8px", fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await api("/admin/users");
      setUsers(res.users || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) return;
    try {
      await api(`/admin/users/${id}`, { method: "DELETE" });
      setSuccess(`User ${email} deleted.`);
      await load();
    } catch (e) { setError(e.message); }
  };

  const handleReset = async (id, email) => {
    if (!window.confirm(`Reset all progress for ${email}?`)) return;
    try {
      await api(`/admin/users/${id}/reset-progress`, { method: "POST", body: JSON.stringify({}) });
      setSuccess(`Progress reset for ${email}.`);
      await load();
    } catch (e) { setError(e.message); }
  };

  const handlePromote = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await api(`/admin/users/${id}/promote`, { method: "POST", body: JSON.stringify({ role: newRole }) });
      setSuccess(`Role updated to ${newRole}.`);
      await load();
    } catch (e) { setError(e.message); }
  };

  const filtered = users.filter((u) =>
    !search || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {error && <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#2d0a0a", border: "1px solid #5f1d1d", color: "#f87171", fontSize: "13px" }}>{error}</div>}
      {success && <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#052e16", border: "1px solid #14532d", color: "#4ade80", fontSize: "13px" }}>{success}</div>}

      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #334155", background: "#020617", color: "#e2e8f0", fontSize: "13px", boxSizing: "border-box", outline: "none" }} />

      {loading ? (
        <div style={{ color: "#94a3b8" }}>Loading users...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "#94a3b8" }}>No users found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((u) => (
            <div key={u.id} style={{ padding: "18px", borderRadius: "14px", background: "#0f172a", border: "1px solid #1e293b" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#f8fafc" }}>{u.email}</div>
                  <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>Joined: {u.created_at?.slice(0, 10)}</div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "10px", flexWrap: "wrap" }}>
                    <Stat label="Simulations" value={u.simulations_completed} />
                    <Stat label="Avg Score" value={`${u.average_score}%`} />
                    <Stat label="Modules Done" value={u.modules_completed} />
                    <Stat label="XP" value={u.xp || 0} />
                    <Stat label="Level" value={u.level || 1} />
                    <Stat label="Streak" value={`${u.streak_days || 0}d`} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, background: u.role === "admin" ? "#1c1400" : "#0c1a2e", border: u.role === "admin" ? "1px solid #422006" : "1px solid #1e3a5f", color: u.role === "admin" ? "#fbbf24" : "#60a5fa" }}>
                    {u.role}
                  </span>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <button onClick={() => handleReset(u.id, u.email)} style={{ padding: "6px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, border: "1px solid #422006", background: "transparent", color: "#fbbf24", cursor: "pointer" }}>Reset Progress</button>
                    <button onClick={() => handlePromote(u.id, u.role)} style={{ padding: "6px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, border: "1px solid #1e3a5f", background: "transparent", color: "#60a5fa", cursor: "pointer" }}>
                      {u.role === "admin" ? "Demote" : "Promote"}
                    </button>
                    {u.role !== "admin" && (
                      <button onClick={() => handleDelete(u.id, u.email)} style={{ padding: "6px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, border: "1px solid #5f1d1d", background: "transparent", color: "#f87171", cursor: "pointer" }}>Delete</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Stats Tab ──────────────────────────────────────────────────────────────
function StatsTab() {
  const [stats, setStats] = useState(null);
  const [certs, setCerts] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadFeed = useCallback(async () => {
    try {
      const res = await api("/admin/activity-feed");
      setFeed(res.feed || []);
    } catch (_) {}
  }, []);

  useEffect(() => {
    Promise.all([
      api("/admin/stats"),
      api("/admin/certificates"),
    ]).then(([s, c]) => {
      setStats(s);
      setCerts(c.certificates || []);
    }).finally(() => setLoading(false));

    loadFeed();
    const interval = setInterval(loadFeed, 30000);
    return () => clearInterval(interval);
  }, [loadFeed]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/admin/export/csv", { credentials: "include" });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compliance_report_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Export failed: " + e.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div style={{ color: "#94a3b8" }}>Loading stats...</div>;
  if (!stats) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleExport} disabled={exporting} style={{ padding: "10px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "13px", border: "1px solid #14532d", background: "#052e16", color: "#4ade80", cursor: exporting ? "not-allowed" : "pointer", opacity: exporting ? 0.7 : 1 }}>
          {exporting ? "Exporting..." : "Export CSV Report"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
        {[
          { label: "Total Users", value: stats.totalUsers, color: "#60a5fa" },
          { label: "Simulations", value: stats.totalSimulations, color: "#22d3ee" },
          { label: "Modules", value: stats.totalModules, color: "#a78bfa" },
          { label: "Attempts", value: stats.totalAttempts, color: "#34d399" },
          { label: "Avg Score", value: `${stats.avgScore}%`, color: "#fbbf24" },
          { label: "Certificates", value: stats.totalCertificates, color: "#f472b6" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "18px", borderRadius: "14px", background: "#0f172a", border: "1px solid #1e293b", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ padding: "20px", borderRadius: "14px", background: "#0f172a", border: "1px solid #1e293b" }}>
          <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: "14px" }}>Top Performers</div>
          {stats.topUsers.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "13px" }}>No attempts yet.</div>
          ) : stats.topUsers.map((u, i) => (
            <div key={u.email} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e293b", fontSize: "13px" }}>
              <span style={{ color: "#94a3b8" }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`} {u.email.split("@")[0]}
              </span>
              <span style={{ color: "#fbbf24", fontWeight: 700 }}>{u.avg_score}%</span>
            </div>
          ))}
        </div>

        <div style={{ padding: "20px", borderRadius: "14px", background: "#0f172a", border: "1px solid #1e293b" }}>
          <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: "14px" }}>Recent Attempts</div>
          {stats.recentAttempts.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "13px" }}>No attempts yet.</div>
          ) : stats.recentAttempts.map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e293b", fontSize: "12px" }}>
              <div>
                <div style={{ color: "#e2e8f0" }}>{a.email.split("@")[0]}</div>
                <div style={{ color: "#64748b" }}>{a.title}</div>
              </div>
              <span style={{ fontWeight: 700, color: a.score >= 80 ? "#34d399" : a.score >= 60 ? "#fbbf24" : "#f87171" }}>{a.score}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px", borderRadius: "14px", background: "#0f172a", border: "1px solid #1e293b" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ fontWeight: 700, color: "#f8fafc" }}>Live Activity Feed</div>
          <span style={{ fontSize: "11px", color: "#475569" }}>Refreshes every 30 seconds</span>
        </div>
        {feed.length === 0 ? (
          <div style={{ color: "#94a3b8", fontSize: "13px" }}>No activity yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
            {feed.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "#020617", border: "1px solid #1e293b", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>{item.type === "module_complete" ? "📘" : "🎯"}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#f8fafc" }}>{item.email?.split("@")[0]}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{item.title}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: item.score >= 80 ? "#4ade80" : item.score >= 60 ? "#fbbf24" : "#f87171" }}>
                    {item.score}%
                  </span>
                  <span style={{ fontSize: "11px", color: "#475569" }}>
                    {item.date ? new Date(item.date).toLocaleString() : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "20px", borderRadius: "14px", background: "#0f172a", border: "1px solid #1e293b" }}>
        <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: "14px" }}>Certificates Issued</div>
        {certs.length === 0 ? (
          <div style={{ color: "#94a3b8", fontSize: "13px" }}>No certificates issued yet.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
            {certs.map((c) => (
              <div key={c.id} style={{ padding: "14px", borderRadius: "12px", background: "#020617", border: "1px solid #14532d" }}>
                <div style={{ fontWeight: 700, color: "#4ade80" }}>{c.email.split("@")[0]}</div>
                <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>Issued: {c.issued_at?.slice(0, 10)}</div>
                <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "6px" }}>
                  Modules: {c.modules_completed} · Sims: {c.simulations_completed} · Avg: {c.average_score}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>{value}</div>
      <div style={{ fontSize: "11px", color: "#64748b" }}>{label}</div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AdminBuilder() {
  const [tab, setTab] = useState("simulations");

  return (
    <Layout title="Admin Panel">
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <TabBtn active={tab === "simulations"} onClick={() => setTab("simulations")}>🎯 Simulations</TabBtn>
          <TabBtn active={tab === "modules"} onClick={() => setTab("modules")}>📚 Modules</TabBtn>
          <TabBtn active={tab === "users"} onClick={() => setTab("users")}>👥 Users</TabBtn>
          <TabBtn active={tab === "stats"} onClick={() => setTab("stats")}>📊 Stats</TabBtn>
        </div>

        {tab === "simulations" && <SimulationsTab />}
        {tab === "modules" && <ModulesTab />}
        {tab === "users" && <UsersTab />}
        {tab === "stats" && <StatsTab />}
      </div>
    </Layout>
  );
}
