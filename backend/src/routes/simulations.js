const express = require("express");
const { db } = require("../db");

const router = express.Router();

function getUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.session && req.session.user && req.session.user.id) return req.session.user.id;
  if (req.session && req.session.userId) return req.session.userId;
  return null;
}

// ── Difficulty gating logic ────────────────────────────────────────────────
// Easy:   always unlocked
// Medium: unlock after completing 3 easy simulations
// Hard:   unlock after completing 5 medium simulations
function getSimulationUnlockStatus(userId) {
  if (!userId) return { easy: true, medium: false, hard: false };

  const completed = db.prepare(`
    SELECT s.difficulty, COUNT(*) as count
    FROM attempts a
    JOIN simulations s ON s.id = a.simulation_id
    WHERE a.user_id = ? AND a.completed_at IS NOT NULL
    GROUP BY s.difficulty
  `).all(userId);

  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const row of completed) {
    if (counts[row.difficulty] !== undefined) counts[row.difficulty] = row.count;
  }

  return {
    easy:   true,
    medium: counts.easy >= 3,
    hard:   counts.medium >= 5,
  };
}

router.get("/", (req, res) => {
  const userId = getUserId(req);
  const unlocked = getSimulationUnlockStatus(userId);

  const simulations = db.prepare(`
    SELECT id, title, subject, sender_name, sender_email, sent_at,
      difficulty, is_phishing, scenario_type, channel
    FROM simulations ORDER BY id ASC
  `).all();

  const withLock = simulations.map((sim) => ({
    ...sim,
    locked: !unlocked[sim.difficulty],
  }));

  res.json({ simulations: withLock, unlocked });
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const userId = getUserId(req);

  const sim = db.prepare(`
    SELECT id, title, prompt, explanation, sender_name, sender_email,
      subject, sent_at, body_text, link_label, link_url, attachment_name,
      is_phishing, landing_page_type, difficulty, scenario_type, channel
    FROM simulations WHERE id = ?
  `).get(id);

  if (!sim) return res.status(404).json({ error: "Not found" });

  const unlocked = getSimulationUnlockStatus(userId);
  const locked = !unlocked[sim.difficulty];

  if (locked) {
    const requirements = {
      medium: "Complete 3 easy simulations to unlock medium difficulty",
      hard:   "Complete 5 medium simulations to unlock hard difficulty",
    };
    return res.status(403).json({
      error: requirements[sim.difficulty] || "This simulation is locked",
      locked: true,
      difficulty: sim.difficulty,
    });
  }

  const questions = db.prepare(`
    SELECT id, question_text, choice_a, choice_b, choice_c
    FROM questions WHERE simulation_id = ? ORDER BY id ASC
  `).all(id);

  res.json({ simulation: sim, questions });
});

router.post("/:id/event", (req, res) => {
  const simulationId = Number(req.params.id);
  const userId = getUserId(req);
  const { eventType, eventValue = "" } = req.body || {};

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!simulationId || !eventType) return res.status(400).json({ error: "simulationId and eventType are required" });

  const sim = db.prepare(`
    SELECT id, is_phishing, landing_page_type, explanation, difficulty
    FROM simulations WHERE id = ?
  `).get(simulationId);

  if (!sim) return res.status(404).json({ error: "Simulation not found" });

  const unlocked = getSimulationUnlockStatus(userId);
  if (!unlocked[sim.difficulty]) {
    return res.status(403).json({ error: "This simulation is locked" });
  }

  db.prepare(`
    INSERT INTO simulation_events (user_id, simulation_id, event_type, event_value)
    VALUES (?, ?, ?, ?)
  `).run(userId, simulationId, eventType, String(eventValue));

  let feedbackTitle = "Action recorded";
  let feedbackMessage = "Your action was recorded for this training simulation.";
  let status = "info";

  if (eventType === "clicked_link") {
    if (sim.is_phishing) {
      feedbackTitle = "Risky interaction";
      feedbackMessage = "You interacted with a suspicious training link. In a real attack this could lead to credential theft or malware.";
      status = "warning";
    } else {
      feedbackTitle = "Legitimate action";
      feedbackMessage = "This training case appears legitimate. Context matters because not every link is malicious.";
      status = "success";
    }
  }

  if (eventType === "reported_phishing") {
    if (sim.is_phishing) {
      feedbackTitle = "Good catch";
      feedbackMessage = "You correctly treated this scenario as suspicious.";
      status = "success";
    } else {
      feedbackTitle = "False positive";
      feedbackMessage = "This scenario appears legitimate. Reporting every message can create noise so context and verification still matter.";
      status = "warning";
    }
  }

  if (eventType === "marked_safe") {
    if (sim.is_phishing) {
      feedbackTitle = "Missed threat";
      feedbackMessage = "This scenario was risky. Marking it as safe would increase exposure in a real environment.";
      status = "danger";
    } else {
      feedbackTitle = "Correct assessment";
      feedbackMessage = "This scenario appears legitimate in this training case.";
      status = "success";
    }
  }

  if (eventType === "submitted_credentials") {
    feedbackTitle = "Credential capture simulated";
    feedbackMessage = "You entered credentials into a training phishing page. This counts as a failed simulation but no real credentials were stored.";
    status = "danger";
  }

  res.json({
    ok: true, status, feedbackTitle, feedbackMessage,
    landingPageType: sim.landing_page_type,
    explanation: sim.explanation,
  });
});

router.get("/:id/events", (req, res) => {
  const simulationId = Number(req.params.id);
  const userId = getUserId(req);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const events = db.prepare(`
    SELECT id, event_type, event_value, created_at
    FROM simulation_events
    WHERE user_id = ? AND simulation_id = ?
    ORDER BY id DESC
  `).all(userId, simulationId);

  res.json({ events });
});

module.exports = router;
