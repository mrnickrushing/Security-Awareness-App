const express = require("express");
const { db } = require("../db");

const router = express.Router();

function getUserRole(req) {
  if (req.user && req.user.role) return req.user.role;
  if (req.session && req.session.user && req.session.user.role) return req.session.user.role;
  if (req.session && req.session.role) return req.session.role;
  return null;
}

function requireAdmin(req, res, next) {
  if (getUserRole(req) !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// ── SIMULATIONS ────────────────────────────────────────────────────────────

router.get("/simulations", requireAdmin, (req, res) => {
  const simulations = db.prepare(`
    SELECT id, title, subject, sender_name, sender_email, prompt, explanation,
      sent_at, body_text, link_label, link_url, attachment_name, is_phishing,
      landing_page_type, difficulty, scenario_type, channel, created_at, updated_at
    FROM simulations
    ORDER BY id DESC
  `).all();

  const getQuestion = db.prepare(`
    SELECT question_text, choice_a, choice_b, choice_c, correct_choice, red_flags
    FROM questions WHERE simulation_id = ? ORDER BY id ASC LIMIT 1
  `);

  const rows = simulations.map((sim) => ({
    ...sim,
    question: getQuestion.get(sim.id) || null,
  }));

  res.json({ simulations: rows });
});

router.post("/simulations", requireAdmin, (req, res) => {
  const d = req.body;
  if (!d.title || !d.subject) {
    return res.status(400).json({ error: "Title and subject are required" });
  }

  const result = db.prepare(`
    INSERT INTO simulations (
      title, prompt, explanation, sender_name, sender_email, subject, sent_at,
      body_text, link_label, link_url, attachment_name, is_phishing,
      landing_page_type, difficulty, scenario_type, channel
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    d.title, d.prompt || "", d.explanation || "",
    d.sender_name || "", d.sender_email || "",
    d.subject, d.sent_at || "Today, 9:00 AM",
    d.body_text || "", d.link_label || "", d.link_url || "",
    d.attachment_name || "", d.is_phishing ? 1 : 0,
    d.landing_page_type || "none",
    d.difficulty || "easy",
    d.scenario_type || "phishing",
    d.channel || "email"
  );

  const simulationId = result.lastInsertRowid;

  if (d.question_text) {
    db.prepare(`
      INSERT INTO questions
        (simulation_id, question_text, choice_a, choice_b, choice_c, correct_choice, red_flags)
      VALUES (?,?,?,?,?,?,?)
    `).run(
      simulationId, d.question_text,
      d.choice_a || "", d.choice_b || "", d.choice_c || "",
      d.correct_choice || "A", d.red_flags || ""
    );
  }

  res.json({ ok: true, id: simulationId });
});

router.put("/simulations/:id", requireAdmin, (req, res) => {
  const simId = Number(req.params.id);
  const d = req.body;

  const existing = db.prepare("SELECT id FROM simulations WHERE id = ?").get(simId);
  if (!existing) return res.status(404).json({ error: "Simulation not found" });

  db.prepare(`
    UPDATE simulations SET
      title=?, prompt=?, explanation=?, sender_name=?, sender_email=?,
      subject=?, sent_at=?, body_text=?, link_label=?, link_url=?,
      attachment_name=?, is_phishing=?, landing_page_type=?,
      difficulty=?, scenario_type=?, channel=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    d.title, d.prompt || "", d.explanation || "",
    d.sender_name || "", d.sender_email || "",
    d.subject, d.sent_at || "Today, 9:00 AM",
    d.body_text || "", d.link_label || "", d.link_url || "",
    d.attachment_name || "", d.is_phishing ? 1 : 0,
    d.landing_page_type || "none",
    d.difficulty || "easy",
    d.scenario_type || "phishing",
    d.channel || "email",
    simId
  );

  if (d.question_text) {
    const existingQ = db.prepare(
      "SELECT id FROM questions WHERE simulation_id = ? ORDER BY id ASC LIMIT 1"
    ).get(simId);

    if (existingQ) {
      db.prepare(`
        UPDATE questions SET
          question_text=?, choice_a=?, choice_b=?, choice_c=?,
          correct_choice=?, red_flags=?
        WHERE id=?
      `).run(
        d.question_text, d.choice_a || "", d.choice_b || "", d.choice_c || "",
        d.correct_choice || "A", d.red_flags || "", existingQ.id
      );
    } else {
      db.prepare(`
        INSERT INTO questions
          (simulation_id, question_text, choice_a, choice_b, choice_c, correct_choice, red_flags)
        VALUES (?,?,?,?,?,?,?)
      `).run(
        simId, d.question_text,
        d.choice_a || "", d.choice_b || "", d.choice_c || "",
        d.correct_choice || "A", d.red_flags || ""
      );
    }
  }

  res.json({ ok: true });
});

router.delete("/simulations/:id", requireAdmin, (req, res) => {
  const simId = Number(req.params.id);
  const existing = db.prepare("SELECT id FROM simulations WHERE id = ?").get(simId);
  if (!existing) return res.status(404).json({ error: "Simulation not found" });

  db.prepare("DELETE FROM questions WHERE simulation_id = ?").run(simId);
  db.prepare("DELETE FROM simulation_events WHERE simulation_id = ?").run(simId);
  db.prepare("DELETE FROM simulations WHERE id = ?").run(simId);

  res.json({ ok: true });
});

router.post("/simulations/bulk", requireAdmin, (req, res) => {
  const { simulations } = req.body || {};
  if (!Array.isArray(simulations) || simulations.length === 0) {
    return res.status(400).json({ error: "simulations array is required" });
  }

  let created = 0;
  let skipped = 0;
  const errors = [];

  for (const d of simulations) {
    try {
      if (!d.title || !d.subject) { skipped++; continue; }
      const exists = db.prepare("SELECT id FROM simulations WHERE title = ?").get(d.title);
      if (exists) { skipped++; continue; }

      const result = db.prepare(`
        INSERT INTO simulations (
          title, prompt, explanation, sender_name, sender_email, subject, sent_at,
          body_text, link_label, link_url, attachment_name, is_phishing,
          landing_page_type, difficulty, scenario_type, channel
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).run(
        d.title, d.prompt || "", d.explanation || "",
        d.sender_name || "", d.sender_email || "",
        d.subject, d.sent_at || "Today, 9:00 AM",
        d.body_text || "", d.link_label || "", d.link_url || "",
        d.attachment_name || "", d.is_phishing ? 1 : 0,
        d.landing_page_type || "none",
        d.difficulty || "easy",
        d.scenario_type || "phishing",
        d.channel || "email"
      );

      if (d.question_text) {
        db.prepare(`
          INSERT INTO questions
            (simulation_id, question_text, choice_a, choice_b, choice_c, correct_choice, red_flags)
          VALUES (?,?,?,?,?,?,?)
        `).run(
          result.lastInsertRowid, d.question_text,
          d.choice_a || "", d.choice_b || "", d.choice_c || "",
          d.correct_choice || "A", d.red_flags || ""
        );
      }

      created++;
    } catch (e) {
      errors.push({ title: d.title, error: e.message });
    }
  }

  res.json({ ok: true, created, skipped, errors });
});

// ── MODULES ────────────────────────────────────────────────────────────────

router.get("/modules", requireAdmin, (req, res) => {
  const modules = db.prepare(`
    SELECT m.id, m.title, m.content, m.category, m.difficulty,
      m.duration_minutes, m.order_index, m.section_id,
      s.name as section_name,
      m.created_at, m.updated_at
    FROM modules m
    JOIN sections s ON s.id = m.section_id
    ORDER BY s.order_index ASC, m.order_index ASC, m.id ASC
  `).all();

  const getQuestions = db.prepare(`
    SELECT id, question_text, choice_a, choice_b, choice_c, correct_choice, explanation
    FROM module_quiz_questions WHERE module_id = ? ORDER BY id ASC
  `);

  const rows = modules.map((m) => ({
    ...m,
    questions: getQuestions.all(m.id),
  }));

  res.json({ modules: rows });
});

router.put("/modules/:id", requireAdmin, (req, res) => {
  const moduleId = Number(req.params.id);
  const d = req.body;

  const existing = db.prepare("SELECT id FROM modules WHERE id = ?").get(moduleId);
  if (!existing) return res.status(404).json({ error: "Module not found" });

  db.prepare(`
    UPDATE modules SET
      title=?, content=?, category=?, difficulty=?,
      duration_minutes=?, order_index=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    d.title, d.content, d.category || "General",
    d.difficulty || "beginner",
    d.duration_minutes || 10,
    d.order_index || 0,
    moduleId
  );

  res.json({ ok: true });
});

router.put("/modules/:id/questions/:qid", requireAdmin, (req, res) => {
  const qid = Number(req.params.qid);
  const d = req.body;

  const existing = db.prepare("SELECT id FROM module_quiz_questions WHERE id = ?").get(qid);
  if (!existing) return res.status(404).json({ error: "Question not found" });

  db.prepare(`
    UPDATE module_quiz_questions
    SET question_text=?, choice_a=?, choice_b=?, choice_c=?,
        correct_choice=?, explanation=?
    WHERE id=?
  `).run(
    d.question_text, d.choice_a, d.choice_b, d.choice_c,
    d.correct_choice, d.explanation || "", qid
  );

  res.json({ ok: true });
});

// ── USERS ──────────────────────────────────────────────────────────────────

router.get("/users", requireAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.email, u.role, u.created_at, u.xp, u.level, u.streak_days, u.last_active,
      COUNT(DISTINCT a.id) as simulations_completed,
      COALESCE(ROUND(AVG(a.score)), 0) as average_score,
      COUNT(DISTINCT ump.module_id) as modules_completed
    FROM users u
    LEFT JOIN attempts a ON a.user_id = u.id AND a.completed_at IS NOT NULL
    LEFT JOIN user_module_progress ump ON ump.user_id = u.id AND ump.completed_at IS NOT NULL
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();

  res.json({ users });
});

router.delete("/users/:id", requireAdmin, (req, res) => {
  const userId = Number(req.params.id);
  const user = db.prepare("SELECT id, role FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.role === "admin") return res.status(400).json({ error: "Cannot delete admin accounts" });

  db.prepare("DELETE FROM attempt_answers WHERE attempt_id IN (SELECT id FROM attempts WHERE user_id = ?)").run(userId);
  db.prepare("DELETE FROM attempts WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM simulation_events WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM user_module_progress WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM certificates WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);

  res.json({ ok: true });
});

router.post("/users/:id/reset-progress", requireAdmin, (req, res) => {
  const userId = Number(req.params.id);
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  db.prepare("DELETE FROM attempt_answers WHERE attempt_id IN (SELECT id FROM attempts WHERE user_id = ?)").run(userId);
  db.prepare("DELETE FROM attempts WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM simulation_events WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM user_module_progress WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM certificates WHERE user_id = ?").run(userId);
  db.prepare("UPDATE users SET xp=0, level=1, streak_days=0, last_active=NULL WHERE id=?").run(userId);

  res.json({ ok: true });
});

router.post("/users/:id/promote", requireAdmin, (req, res) => {
  const userId = Number(req.params.id);
  const { role } = req.body || {};

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Role must be user or admin" });
  }

  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId);
  res.json({ ok: true });
});

// ── STATS ──────────────────────────────────────────────────────────────────

router.get("/stats", requireAdmin, (req, res) => {
  const totalUsers       = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'user'").get().c;
  const totalSimulations = db.prepare("SELECT COUNT(*) as c FROM simulations").get().c;
  const totalModules     = db.prepare("SELECT COUNT(*) as c FROM modules").get().c;
  const totalAttempts    = db.prepare("SELECT COUNT(*) as c FROM attempts WHERE completed_at IS NOT NULL").get().c;
  const avgScore         = db.prepare("SELECT COALESCE(ROUND(AVG(score)),0) as avg FROM attempts WHERE completed_at IS NOT NULL").get().avg;
  const totalCertificates = db.prepare("SELECT COUNT(*) as c FROM certificates").get().c;

  const topUsers = db.prepare(`
    SELECT u.email, COUNT(a.id) as attempts, ROUND(AVG(a.score)) as avg_score
    FROM users u
    JOIN attempts a ON a.user_id = u.id AND a.completed_at IS NOT NULL
    GROUP BY u.id
    ORDER BY avg_score DESC
    LIMIT 5
  `).all();

  const recentAttempts = db.prepare(`
    SELECT u.email, s.title, a.score, a.completed_at
    FROM attempts a
    JOIN users u ON u.id = a.user_id
    JOIN simulations s ON s.id = a.simulation_id
    WHERE a.completed_at IS NOT NULL
    ORDER BY a.completed_at DESC
    LIMIT 10
  `).all();

  res.json({
    totalUsers, totalSimulations, totalModules,
    totalAttempts, avgScore, totalCertificates,
    topUsers, recentAttempts,
  });
});

// ── ACTIVITY FEED ──────────────────────────────────────────────────────────

router.get("/activity-feed", requireAdmin, (req, res) => {
  const moduleActivity = db.prepare(`
    SELECT
      'module_complete' as type,
      u.email,
      m.title,
      ump.quiz_score as score,
      ump.completed_at as date,
      s.name as section_name
    FROM user_module_progress ump
    JOIN users u ON u.id = ump.user_id
    JOIN modules m ON m.id = ump.module_id
    JOIN sections s ON s.id = m.section_id
    WHERE ump.completed_at IS NOT NULL
    ORDER BY ump.completed_at DESC
    LIMIT 20
  `).all();

  const simActivity = db.prepare(`
    SELECT
      'simulation_complete' as type,
      u.email,
      si.title,
      a.score,
      a.completed_at as date,
      '' as section_name
    FROM attempts a
    JOIN users u ON u.id = a.user_id
    JOIN simulations si ON si.id = a.simulation_id
    WHERE a.completed_at IS NOT NULL
    ORDER BY a.completed_at DESC
    LIMIT 20
  `).all();

  const combined = [...moduleActivity, ...simActivity]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20);

  res.json({ feed: combined });
});

// ── CSV EXPORT ─────────────────────────────────────────────────────────────

router.get("/export/csv", requireAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT
      u.id, u.email, u.role, u.created_at, u.last_active,
      u.xp, u.level, u.streak_days,
      COUNT(DISTINCT ump.module_id) as modules_completed,
      COALESCE(ROUND(AVG(ump.quiz_score)), 0) as avg_quiz_score,
      COUNT(DISTINCT a.id) as simulations_completed,
      COALESCE(ROUND(AVG(a.score)), 0) as avg_sim_score,
      MAX(CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END) as certified
    FROM users u
    LEFT JOIN user_module_progress ump ON ump.user_id = u.id AND ump.completed_at IS NOT NULL
    LEFT JOIN attempts a ON a.user_id = u.id AND a.completed_at IS NOT NULL
    LEFT JOIN certificates c ON c.user_id = u.id
    GROUP BY u.id
    ORDER BY u.email ASC
  `).all();

  const headers = [
    "Email", "Role", "XP", "Level", "Streak Days",
    "Modules Completed", "Avg Quiz Score",
    "Simulations Completed", "Avg Sim Score",
    "Certified", "Last Active", "Joined"
  ];

  const rows = users.map((u) => [
    u.email,
    u.role,
    u.xp || 0,
    u.level || 1,
    u.streak_days || 0,
    u.modules_completed,
    u.avg_quiz_score,
    u.simulations_completed,
    u.avg_sim_score,
    u.certified ? "Yes" : "No",
    u.last_active ? u.last_active.slice(0, 10) : "Never",
    u.created_at ? u.created_at.slice(0, 10) : "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="compliance_report_${new Date().toISOString().slice(0,10)}.csv"`);
  res.send(csv);
});

// ── CERTIFICATES ───────────────────────────────────────────────────────────

router.get("/certificates", requireAdmin, (req, res) => {
  const certs = db.prepare(`
    SELECT c.id, c.issued_at, c.modules_completed, c.simulations_completed,
      c.average_score, u.email
    FROM certificates c
    JOIN users u ON u.id = c.user_id
    ORDER BY c.issued_at DESC
  `).all();

  res.json({ certificates: certs });
});

module.exports = router;
