const express = require('express');
const { db } = require('../db');

const router = express.Router();

function getUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.session && req.session.user && req.session.user.id) return req.session.user.id;
  if (req.session && req.session.userId) return req.session.userId;
  return null;
}

// GET /api/module-progress
// Returns all module progress for the current user
router.get('/', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const rows = db.prepare(`
    SELECT
      ump.user_id,
      ump.module_id,
      ump.started_at,
      ump.completed_at,
      ump.quiz_score,
      m.title,
      m.category,
      m.difficulty,
      m.duration_minutes,
      m.order_index,
      s.name AS section_name
    FROM user_module_progress ump
    JOIN modules m ON m.id = ump.module_id
    JOIN sections s ON s.id = m.section_id
    WHERE ump.user_id = ?
    ORDER BY m.order_index ASC
  `).all(userId);

  res.json({ progress: rows });
});

// GET /api/module-progress/:moduleId
// Returns progress for a single module for the current user
router.get('/:moduleId', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const moduleId = Number(req.params.moduleId);

  const row = db.prepare(`
    SELECT
      ump.user_id,
      ump.module_id,
      ump.started_at,
      ump.completed_at,
      ump.quiz_score
    FROM user_module_progress ump
    WHERE ump.user_id = ? AND ump.module_id = ?
  `).get(userId, moduleId);

  if (!row) {
    return res.json({
      user_id: userId,
      module_id: moduleId,
      started_at: null,
      completed_at: null,
      quiz_score: null,
    });
  }

  res.json({ progress: row });
});

// POST /api/module-progress/:moduleId
// Upserts progress for a module
router.post('/:moduleId', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const moduleId = Number(req.params.moduleId);
  const { completed, quiz_score } = req.body || {};

  const existing = db.prepare(`
    SELECT user_id FROM user_module_progress
    WHERE user_id = ? AND module_id = ?
  `).get(userId, moduleId);

  if (!existing) {
    db.prepare(`
      INSERT INTO user_module_progress (user_id, module_id, completed_at, quiz_score)
      VALUES (?, ?, ?, ?)
    `).run(
      userId,
      moduleId,
      completed ? new Date().toISOString() : null,
      quiz_score ?? null
    );
  } else {
    db.prepare(`
      UPDATE user_module_progress
      SET
        completed_at = COALESCE(completed_at, ?),
        quiz_score   = COALESCE(?, quiz_score)
      WHERE user_id = ? AND module_id = ?
    `).run(
      completed ? new Date().toISOString() : null,
      quiz_score ?? null,
      userId,
      moduleId
    );
  }

  const saved = db.prepare(`
    SELECT user_id, module_id, started_at, completed_at, quiz_score
    FROM user_module_progress
    WHERE user_id = ? AND module_id = ?
  `).get(userId, moduleId);

  res.json({ progress: saved });
});

module.exports = router;
