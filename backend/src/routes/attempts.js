const express = require("express");
const { db } = require("../db");

const router = express.Router();

function getUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.session && req.session.user && req.session.user.id) return req.session.user.id;
  if (req.session && req.session.userId) return req.session.userId;
  return null;
}

// ── XP helpers ────────────────────────────────────────────────────────────────

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000];

function recalcLevel(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return level;
}

function awardXP(userId, amount) {
  if (!amount || amount <= 0) return;
  db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').run(amount, userId);
  const user = db.prepare('SELECT xp FROM users WHERE id = ?').get(userId);
  if (user) {
    const newLevel = recalcLevel(user.xp);
    db.prepare('UPDATE users SET level = ? WHERE id = ?').run(newLevel, userId);
  }
}

function isAdmin(userId) {
  if (!userId) return false;
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
  return user && user.role === 'admin';
}

// ── Routes ────────────────────────────────────────────────────────────────────

router.post("/start", (req, res) => {
  const userId = getUserId(req);
  const { simulationId } = req.body || {};

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!simulationId) return res.status(400).json({ error: "simulationId is required" });

  const simulation = db.prepare("SELECT id FROM simulations WHERE id = ?").get(simulationId);
  if (!simulation) return res.status(404).json({ error: "Simulation not found" });

  const result = db.prepare(`
    INSERT INTO attempts (user_id, simulation_id, score)
    VALUES (?, ?, 0)
  `).run(userId, simulationId);

  res.json({ attemptId: result.lastInsertRowid });
});

router.post("/:attemptId/submit", (req, res) => {
  const userId    = getUserId(req);
  const attemptId = Number(req.params.attemptId);
  const { answers } = req.body || {};

  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  if (!attemptId || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Valid attempt and answers are required" });
  }

  const attempt = db.prepare(`
    SELECT id, user_id, simulation_id, completed_at
    FROM attempts WHERE id = ?
  `).get(attemptId);

  if (!attempt || attempt.user_id !== userId) {
    return res.status(404).json({ error: "Attempt not found" });
  }

  if (attempt.completed_at) {
    return res.status(400).json({ error: "Attempt already submitted" });
  }

  const insertAnswer = db.prepare(`
    INSERT INTO attempt_answers (attempt_id, question_id, selected_choice, is_correct)
    VALUES (?, ?, ?, ?)
  `);

  const getQuestion = db.prepare(`
    SELECT id, correct_choice, red_flags
    FROM questions
    WHERE id = ? AND simulation_id = ?
  `);

  let correct = 0;
  const details = [];

  for (const answer of answers) {
    const question = getQuestion.get(answer.questionId, attempt.simulation_id);
    if (!question) continue;

    const isCorrect = question.correct_choice === answer.selectedChoice ? 1 : 0;
    insertAnswer.run(attemptId, question.id, answer.selectedChoice, isCorrect);
    if (isCorrect) correct++;

    details.push({
      questionId:     question.id,
      selectedChoice: answer.selectedChoice,
      correctChoice:  question.correct_choice,
      isCorrect:      Boolean(isCorrect),
      redFlags:       question.red_flags,
    });
  }

  const total = details.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  db.prepare(`
    UPDATE attempts
    SET score = ?, completed_at = datetime('now')
    WHERE id = ?
  `).run(score, attemptId);

  // Award XP for simulation completion
  let xpAwarded = 0;
  if (!isAdmin(userId)) {
    xpAwarded = score === 100 ? 50 : 30;
    awardXP(userId, xpAwarded);
  }

  const userXP = db.prepare('SELECT xp, level FROM users WHERE id = ?').get(userId);

  res.json({
    score,
    correct,
    total,
    details,
    xpAwarded,
    totalXP: userXP ? userXP.xp : 0,
    level:   userXP ? userXP.level : 1,
  });
});

router.get("/history", (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const history = db.prepare(`
    SELECT
      a.id, a.simulation_id, a.score,
      a.started_at, a.completed_at,
      s.title, s.subject, s.sender_name, s.difficulty
    FROM attempts a
    JOIN simulations s ON a.simulation_id = s.id
    WHERE a.user_id = ? AND a.completed_at IS NOT NULL
    ORDER BY a.id DESC
  `).all(userId);

  res.json({ history, attempts: history });
});

router.get("/:attemptId", (req, res) => {
  const userId    = getUserId(req);
  const attemptId = Number(req.params.attemptId);

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const attempt = db.prepare(`
    SELECT
      a.id, a.score, a.started_at, a.completed_at,
      s.title, s.subject, s.sender_name, s.sender_email,
      s.explanation, s.difficulty
    FROM attempts a
    JOIN simulations s ON a.simulation_id = s.id
    WHERE a.id = ? AND a.user_id = ?
  `).get(attemptId, userId);

  if (!attempt) return res.status(404).json({ error: "Attempt not found" });

  const answers = db.prepare(`
    SELECT
      aa.question_id, aa.selected_choice, aa.is_correct,
      q.question_text, q.correct_choice, q.red_flags
    FROM attempt_answers aa
    JOIN questions q ON aa.question_id = q.id
    WHERE aa.attempt_id = ?
    ORDER BY aa.id ASC
  `).all(attemptId);

  res.json({ attempt, answers });
});

module.exports = router;
