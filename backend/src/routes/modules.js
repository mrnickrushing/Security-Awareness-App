const express = require('express');
const { db }  = require('../db');

const router = express.Router();

function getUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.session && req.session.user && req.session.user.id) return req.session.user.id;
  if (req.session && req.session.userId) return req.session.userId;
  return null;
}

function isAdmin(userId) {
  if (!userId) return false;
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
  return user && user.role === 'admin';
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

// ── Unlock logic ──────────────────────────────────────────────────────────────

function getModuleUnlockStatus(userId) {
  const modules = db.prepare(`
    SELECT id, order_index, section_id FROM modules
    ORDER BY section_id ASC, order_index ASC, id ASC
  `).all();

  if (isAdmin(userId)) {
    const unlockMap = {};
    for (const mod of modules) unlockMap[mod.id] = true;
    return unlockMap;
  }

  const progress = db.prepare(`
    SELECT module_id, completed_at FROM user_module_progress WHERE user_id = ?
  `).all(userId);

  const completedIds = new Set(
    progress.filter(p => p.completed_at).map(p => p.module_id)
  );

  const bySection = {};
  for (const mod of modules) {
    if (!bySection[mod.section_id]) bySection[mod.section_id] = [];
    bySection[mod.section_id].push(mod);
  }

  const unlockMap = {};
  for (const sectionMods of Object.values(bySection)) {
    for (let i = 0; i < sectionMods.length; i++) {
      const mod = sectionMods[i];
      if (i === 0) {
        unlockMap[mod.id] = true;
      } else {
        const prev = sectionMods[i - 1];
        unlockMap[mod.id] = completedIds.has(prev.id);
      }
    }
  }
  return unlockMap;
}

// GET /api/modules
router.get('/', (req, res) => {
  const userId = getUserId(req);
  const { section_id } = req.query;

  try {
    const modules = section_id
      ? db.prepare(`
          SELECT
            m.id, m.section_id, m.title, m.content, m.category,
            m.difficulty, m.duration_minutes, m.order_index,
            s.name AS section_name
          FROM modules m
          JOIN sections s ON s.id = m.section_id
          WHERE m.section_id = ?
          ORDER BY m.order_index ASC, m.id ASC
        `).all(Number(section_id))
      : db.prepare(`
          SELECT
            m.id, m.section_id, m.title, m.content, m.category,
            m.difficulty, m.duration_minutes, m.order_index,
            s.name AS section_name
          FROM modules m
          JOIN sections s ON s.id = m.section_id
          ORDER BY m.order_index ASC, m.id ASC
        `).all();

    if (!userId) {
      return res.json({
        modules: modules.map((m, i) => ({
          ...m, started: false, completed: false, quiz_score: null, locked: i > 0,
        }))
      });
    }

    const progress = db.prepare(`
      SELECT module_id, started_at, completed_at, quiz_score
      FROM user_module_progress WHERE user_id = ?
    `).all(userId);

    const progressMap = {};
    for (const p of progress) progressMap[p.module_id] = p;

    const unlockMap = getModuleUnlockStatus(userId);
    const adminUser = isAdmin(userId);

    const modulesWithProgress = modules.map((m) => ({
      ...m,
      started:    adminUser ? true : !!progressMap[m.id],
      completed:  adminUser ? true : !!(progressMap[m.id] && progressMap[m.id].completed_at),
      quiz_score: adminUser ? 100  : (progressMap[m.id] ? progressMap[m.id].quiz_score : null),
      locked:     !unlockMap[m.id],
    }));

    res.json({ modules: modulesWithProgress });
  } catch (err) {
    console.error('Error fetching modules:', err.message);
    res.status(500).json({ error: 'Failed to retrieve modules.' });
  }
});

// GET /api/modules/progress/all
router.get('/progress/all', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const progress = db.prepare(`
      SELECT module_id, started_at, completed_at, quiz_score
      FROM user_module_progress WHERE user_id = ?
    `).all(userId);
    res.json({ progress });
  } catch (err) {
    console.error('Error fetching progress:', err.message);
    res.status(500).json({ error: 'Failed to retrieve progress.' });
  }
});

// GET /api/modules/:id
router.get('/:id', (req, res) => {
  const moduleId = Number(req.params.id);
  const userId   = getUserId(req);

  try {
    const module = db.prepare(`
      SELECT
        m.id, m.section_id, m.title, m.content, m.category,
        m.difficulty, m.duration_minutes, m.order_index,
        s.name AS section_name
      FROM modules m
      JOIN sections s ON s.id = m.section_id
      WHERE m.id = ?
    `).get(moduleId);

    if (!module) return res.status(404).json({ error: 'Module not found' });

    const questions = db.prepare(`
      SELECT id, question_text, choice_a, choice_b, choice_c, correct_choice, explanation
      FROM module_quiz_questions WHERE module_id = ? ORDER BY id ASC
    `).all(moduleId);

    let progress = null;
    let locked   = false;
    const adminUser = isAdmin(userId);

    if (userId) {
      progress = db.prepare(`
        SELECT started_at, completed_at, quiz_score
        FROM user_module_progress WHERE user_id = ? AND module_id = ?
      `).get(userId, moduleId);

      const unlockMap = getModuleUnlockStatus(userId);
      locked = !unlockMap[moduleId];
    }

    res.json({
      module: {
        ...module,
        started:    adminUser ? true : !!progress,
        completed:  adminUser ? true : !!(progress && progress.completed_at),
        quiz_score: adminUser ? 100  : (progress ? progress.quiz_score : null),
        locked,
      },
      questions,
    });
  } catch (err) {
    console.error('Error fetching module:', err.message);
    res.status(500).json({ error: 'Failed to retrieve module.' });
  }
});

// POST /api/modules/:id/start
router.post('/:id/start', (req, res) => {
  const userId   = getUserId(req);
  const moduleId = Number(req.params.id);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const module = db.prepare('SELECT id FROM modules WHERE id = ?').get(moduleId);
    if (!module) return res.status(404).json({ error: 'Module not found' });

    const unlockMap = getModuleUnlockStatus(userId);
    if (!unlockMap[moduleId]) {
      return res.status(403).json({ error: 'Complete the previous module first' });
    }

    db.prepare(`
      INSERT INTO user_module_progress (user_id, module_id)
      VALUES (?, ?) ON CONFLICT(user_id, module_id) DO NOTHING
    `).run(userId, moduleId);

    res.json({ ok: true });
  } catch (err) {
    console.error('Error starting module:', err.message);
    res.status(500).json({ error: 'Failed to start module.' });
  }
});

// POST /api/modules/:id/complete
router.post('/:id/complete', (req, res) => {
  const userId   = getUserId(req);
  const moduleId = Number(req.params.id);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const module = db.prepare('SELECT id FROM modules WHERE id = ?').get(moduleId);
    if (!module) return res.status(404).json({ error: 'Module not found' });

    const unlockMap = getModuleUnlockStatus(userId);
    if (!unlockMap[moduleId]) {
      return res.status(403).json({ error: 'Complete the previous module first' });
    }

    db.prepare(`
      INSERT INTO user_module_progress (user_id, module_id)
      VALUES (?, ?) ON CONFLICT(user_id, module_id) DO NOTHING
    `).run(userId, moduleId);

    db.prepare(`
      UPDATE user_module_progress
      SET completed_at = datetime('now')
      WHERE user_id = ? AND module_id = ? AND completed_at IS NULL
    `).run(userId, moduleId);

    checkAndIssueCertificate(userId);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error completing module:', err.message);
    res.status(500).json({ error: 'Failed to complete module.' });
  }
});

// POST /api/modules/:id/quiz
router.post('/:id/quiz', (req, res) => {
  const userId   = getUserId(req);
  const moduleId = Number(req.params.id);
  const { answers } = req.body || {};

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Answers are required' });
  }

  try {
    const unlockMap = getModuleUnlockStatus(userId);
    if (!unlockMap[moduleId]) {
      return res.status(403).json({ error: 'Complete the previous module first' });
    }

    const questions = db.prepare(`
      SELECT id, correct_choice, explanation FROM module_quiz_questions WHERE module_id = ?
    `).all(moduleId);

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No quiz questions found for this module' });
    }

    const questionMap = {};
    for (const q of questions) questionMap[q.id] = q;

    let correct = 0;
    const results = [];

    for (const answer of answers) {
      const q = questionMap[answer.questionId];
      if (!q) continue;
      const isCorrect = q.correct_choice === answer.selectedChoice;
      if (isCorrect) correct++;
      results.push({
        questionId:     q.id,
        selectedChoice: answer.selectedChoice,
        correctChoice:  q.correct_choice,
        isCorrect,
        explanation:    q.explanation,
      });
    }

    const score = Math.round((correct / questions.length) * 100);

    // Only award XP on first-time pass
    const existing = db.prepare(`
      SELECT completed_at, quiz_score FROM user_module_progress
      WHERE user_id = ? AND module_id = ?
    `).get(userId, moduleId);

    const isFirstPass = !existing || !existing.completed_at;

    db.prepare(`
      INSERT INTO user_module_progress (user_id, module_id)
      VALUES (?, ?) ON CONFLICT(user_id, module_id) DO NOTHING
    `).run(userId, moduleId);

    db.prepare(`
      UPDATE user_module_progress
      SET quiz_score = ?, completed_at = COALESCE(completed_at, datetime('now'))
      WHERE user_id = ? AND module_id = ?
    `).run(score, userId, moduleId);

    // Award XP for passing — only on first completion
    if (isFirstPass && score >= 80 && !isAdmin(userId)) {
      const xp = score === 100 ? 75 : 50;
      awardXP(userId, xp);
    }

    checkAndIssueCertificate(userId);

    const userXP = db.prepare('SELECT xp, level FROM users WHERE id = ?').get(userId);

    res.json({
      score,
      correct,
      total: questions.length,
      results,
      passed: score >= 80,
      xpAwarded: isFirstPass && score >= 80 && !isAdmin(userId) ? (score === 100 ? 75 : 50) : 0,
      totalXP: userXP ? userXP.xp : 0,
      level: userXP ? userXP.level : 1,
    });
  } catch (err) {
    console.error('Error submitting quiz:', err.message);
    res.status(500).json({ error: 'Failed to submit quiz.' });
  }
});

function checkAndIssueCertificate(userId) {
  try {
    const totalModules = db.prepare('SELECT COUNT(*) as count FROM modules').get().count;
    const completedModules = db.prepare(`
      SELECT COUNT(*) as count FROM user_module_progress
      WHERE user_id = ? AND completed_at IS NOT NULL
    `).get(userId).count;

    if (completedModules < totalModules) return;

    const simStats = db.prepare(`
      SELECT COUNT(*) as count, COALESCE(AVG(score), 0) as avg_score
      FROM attempts WHERE user_id = ? AND completed_at IS NOT NULL
    `).get(userId);

    db.prepare(`
      INSERT INTO certificates (user_id, modules_completed, simulations_completed, average_score)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        issued_at = datetime('now'),
        modules_completed = excluded.modules_completed,
        simulations_completed = excluded.simulations_completed,
        average_score = excluded.average_score
    `).run(userId, completedModules, simStats.count, Math.round(simStats.avg_score));
  } catch (e) {
    console.error('Certificate check error:', e);
  }
}

module.exports = router;
