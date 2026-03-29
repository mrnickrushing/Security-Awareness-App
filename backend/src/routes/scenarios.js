const express = require("express");
const { db } = require("../db");

const router = express.Router();

function getUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.session && req.session.user && req.session.user.id) return req.session.user.id;
  if (req.session && req.session.userId) return req.session.userId;
  return null;
}

const LEVEL_TITLES = [
  "Security Newcomer",
  "Threat Spotter",
  "Risk Analyst",
  "Defense Specialist",
  "Cyber Sentinel",
  "Threat Hunter",
  "Intrusion Detector",
  "Security Architect",
  "Elite Defender",
  "Security Expert",
];

function getLevel(xp) {
  if (xp < 100)  return 1;
  if (xp < 250)  return 2;
  if (xp < 500)  return 3;
  if (xp < 800)  return 4;
  if (xp < 1200) return 5;
  if (xp < 1700) return 6;
  if (xp < 2300) return 7;
  if (xp < 3000) return 8;
  if (xp < 4000) return 9;
  return 10;
}

function awardXP(userId, amount) {
  db.prepare(`UPDATE users SET xp = xp + ? WHERE id = ?`).run(amount, userId);
  const user = db.prepare(`SELECT xp FROM users WHERE id = ?`).get(userId);
  const level = getLevel(user.xp);
  db.prepare(`UPDATE users SET level = ? WHERE id = ?`).run(level, userId);
  return { totalXP: user.xp, level, levelTitle: LEVEL_TITLES[level - 1] };
}

// GET /api/scenarios
// Returns all simulations with scenario_type = decision_tree
router.get("/", (req, res) => {
  const userId = getUserId(req);

  const scenarios = db.prepare(`
    SELECT id, title, prompt, explanation, difficulty, scenario_type, channel
    FROM simulations
    WHERE scenario_type = 'decision_tree'
    ORDER BY id ASC
  `).all();

  const withProgress = scenarios.map((s) => {
    let bestScore = null;
    if (userId) {
      const run = db.prepare(`
        SELECT MAX(score) as best FROM decision_runs
        WHERE user_id = ? AND simulation_id = ?
      `).get(userId, s.id);
      bestScore = run?.best ?? null;
    }
    return { ...s, bestScore };
  });

  res.json({ scenarios: withProgress });
});

// GET /api/scenarios/:id
// Returns a simulation and its full node tree
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const sim = db.prepare(`
    SELECT id, title, prompt, explanation, difficulty, scenario_type, channel
    FROM simulations WHERE id = ? AND scenario_type = 'decision_tree'
  `).get(id);

  if (!sim) return res.status(404).json({ error: "Decision tree scenario not found" });

  const nodes = db.prepare(`
    SELECT id, node_key, is_root, prompt, context, image_hint
    FROM decision_nodes WHERE simulation_id = ? ORDER BY id ASC
  `).all(id);

  const nodeMap = {};
  for (const node of nodes) {
    const choices = db.prepare(`
      SELECT id, choice_text, outcome_text, is_correct, next_node_key
      FROM decision_choices WHERE node_id = ? ORDER BY id ASC
    `).all(node.id);
    nodeMap[node.node_key] = { ...node, choices };
  }

  const rootNode = nodes.find((n) => n.is_root);

  res.json({ simulation: sim, nodes: nodeMap, rootKey: rootNode?.node_key || null });
});

// POST /api/scenarios/:id/complete
// Records a completed run and awards XP
router.post("/:id/complete", (req, res) => {
  const simulationId = Number(req.params.id);
  const userId = getUserId(req);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const sim = db.prepare(`
    SELECT id FROM simulations WHERE id = ? AND scenario_type = 'decision_tree'
  `).get(simulationId);

  if (!sim) return res.status(404).json({ error: "Scenario not found" });

  const { choicesMade = [], score = 0 } = req.body || {};

  db.prepare(`
    INSERT INTO decision_runs (user_id, simulation_id, choices_made, score)
    VALUES (?, ?, ?, ?)
  `).run(userId, simulationId, JSON.stringify(choicesMade), score);

  const user = db.prepare(`SELECT role FROM users WHERE id = ?`).get(userId);
  if (user?.role === "admin") {
    return res.json({ ok: true, xpAwarded: 0, totalXP: 0, level: 1, levelTitle: LEVEL_TITLES[0] });
  }

  const xpAmount = score === 100 ? 50 : 30;
  const xpResult = awardXP(userId, xpAmount);

  res.json({ ok: true, xpAwarded: xpAmount, ...xpResult });
});

module.exports = router;
