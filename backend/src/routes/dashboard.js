const express = require('express');
const { db } = require('../db');

const router = express.Router();

function getUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.session && req.session.user && req.session.user.id) return req.session.user.id;
  if (req.session && req.session.userId) return req.session.userId;
  return null;
}

// ── XP and level helpers ─────────────────────────────────────────────────────
const LEVEL_TITLES = [
  { level: 1,  title: "Security Newcomer",    xpNeeded: 0    },
  { level: 2,  title: "Awareness Trainee",    xpNeeded: 100  },
  { level: 3,  title: "Phishing Spotter",     xpNeeded: 250  },
  { level: 4,  title: "Threat Observer",      xpNeeded: 500  },
  { level: 5,  title: "Defense Apprentice",   xpNeeded: 800  },
  { level: 6,  title: "Security Analyst",     xpNeeded: 1200 },
  { level: 7,  title: "Cyber Defender",       xpNeeded: 1700 },
  { level: 8,  title: "Threat Hunter",        xpNeeded: 2300 },
  { level: 9,  title: "Security Specialist",  xpNeeded: 3000 },
  { level: 10, title: "Security Expert",      xpNeeded: 4000 },
];

function getLevelInfo(xp) {
  let current = LEVEL_TITLES[0];
  let next = LEVEL_TITLES[1];
  for (let i = 0; i < LEVEL_TITLES.length; i++) {
    if (xp >= LEVEL_TITLES[i].xpNeeded) {
      current = LEVEL_TITLES[i];
      next = LEVEL_TITLES[i + 1] || null;
    }
  }
  const xpIntoLevel = next ? xp - current.xpNeeded : 0;
  const xpNeededForNext = next ? next.xpNeeded - current.xpNeeded : 0;
  const levelPercent = next && xpNeededForNext > 0
    ? Math.round((xpIntoLevel / xpNeededForNext) * 100)
    : 100;
  return {
    level: current.level,
    title: current.title,
    xp,
    nextLevelXp: next ? next.xpNeeded : null,
    nextLevelTitle: next ? next.title : null,
    levelPercent,
    xpToNext: next ? next.xpNeeded - xp : 0,
  };
}

function updateStreak(userId) {
  const user = db.prepare('SELECT last_active, streak_days FROM users WHERE id = ?').get(userId);
  if (!user) return;

  const today = new Date().toISOString().slice(0, 10);
  const last  = user.last_active ? user.last_active.slice(0, 10) : null;

  if (last === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = last === yesterday ? (user.streak_days || 0) + 1 : 1;

  db.prepare('UPDATE users SET streak_days = ?, last_active = ? WHERE id = ?')
    .run(newStreak, today, userId);

  if (newStreak % 7 === 0) {
    awardXP(userId, 100);
  }
}

function awardXP(userId, amount) {
  db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').run(amount, userId);
  const user = db.prepare('SELECT xp FROM users WHERE id = ?').get(userId);
  const info = getLevelInfo(user.xp);
  db.prepare('UPDATE users SET level = ? WHERE id = ?').run(info.level, userId);
}

// ── Daily challenge helper ────────────────────────────────────────────────────
function getDailyChallenge(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const seed  = today.replace(/-/g, '');
  const allModules = db.prepare(`
    SELECT m.id, m.title, m.difficulty, s.name as section_name
    FROM modules m
    JOIN sections s ON s.id = m.section_id
    ORDER BY m.id ASC
  `).all();
  if (!allModules.length) return null;
  const idx = parseInt(seed) % allModules.length;
  const mod = allModules[idx];
  const progress = db.prepare(`
    SELECT completed_at FROM user_module_progress
    WHERE user_id = ? AND module_id = ?
  `).get(userId, mod.id);
  return {
    ...mod,
    completed: !!(progress && progress.completed_at),
  };
}

// ── GET /api/dashboard/stats ─────────────────────────────────────────────────
router.get('/stats', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  updateStreak(userId);

  const attemptStats = db.prepare(`
    SELECT
      COUNT(*) as totalAttempts,
      COALESCE(ROUND(AVG(score)), 0) as averageScore,
      COALESCE(MAX(score), 0) as bestScore
    FROM attempts
    WHERE user_id = ? AND completed_at IS NOT NULL
  `).get(userId);

  const totalModules = db.prepare(
    `SELECT COUNT(*) as c FROM modules`
  ).get().c;

  const completedModules = db.prepare(`
    SELECT COUNT(*) as c FROM user_module_progress
    WHERE user_id = ? AND completed_at IS NOT NULL
  `).get(userId).c;

  const avgQuizScore = db.prepare(`
    SELECT COALESCE(AVG(quiz_score), 0) as avg
    FROM user_module_progress
    WHERE user_id = ? AND quiz_score IS NOT NULL
  `).get(userId).avg;

  const reportStats = db.prepare(`
    SELECT COUNT(*) as c FROM simulation_events
    WHERE user_id = ? AND event_type = 'reported_phishing'
  `).get(userId);

  const safeStats = db.prepare(`
    SELECT COUNT(*) as c FROM simulation_events
    WHERE user_id = ? AND event_type = 'marked_safe'
  `).get(userId);

  const credStats = db.prepare(`
    SELECT COUNT(*) as c FROM simulation_events
    WHERE user_id = ? AND event_type = 'submitted_credentials'
  `).get(userId);

  const linkStats = db.prepare(`
    SELECT COUNT(*) as c FROM simulation_events
    WHERE user_id = ? AND event_type = 'clicked_link'
  `).get(userId);

  const totalAttempts = Number(attemptStats.totalAttempts || 0);
  const averageScore  = Number(attemptStats.averageScore || 0);
  const bestScore     = Number(attemptStats.bestScore || 0);

  const detectionRate = totalAttempts > 0
    ? Math.round((Number(reportStats.c) / totalAttempts) * 100)
    : 0;

  const decisionEvents = db.prepare(`
    SELECT se.event_type, s.is_phishing
    FROM simulation_events se
    JOIN simulations s ON se.simulation_id = s.id
    WHERE se.user_id = ?
    AND se.event_type IN ('reported_phishing', 'marked_safe')
  `).all(userId);

  let correctDecisions = 0;
  for (const row of decisionEvents) {
    if (row.event_type === 'reported_phishing' && row.is_phishing) correctDecisions++;
    if (row.event_type === 'marked_safe' && !row.is_phishing) correctDecisions++;
  }

  const decisionAccuracy = decisionEvents.length > 0
    ? Math.round((correctDecisions / decisionEvents.length) * 100)
    : 0;

  const cert = db.prepare(
    `SELECT id FROM certificates WHERE user_id = ?`
  ).get(userId);

  const user = db.prepare(
    'SELECT xp, level, streak_days FROM users WHERE id = ?'
  ).get(userId);

  const levelInfo = getLevelInfo(user ? user.xp || 0 : 0);

  const sectionProgress = db.prepare(`
    SELECT
      s.id, s.name, s.icon, s.color,
      COUNT(m.id) as total,
      COALESCE(SUM(CASE WHEN ump.completed_at IS NOT NULL THEN 1 ELSE 0 END), 0) as completed
    FROM sections s
    LEFT JOIN modules m ON m.section_id = s.id
    LEFT JOIN user_module_progress ump ON ump.module_id = m.id AND ump.user_id = ?
    GROUP BY s.id
    ORDER BY s.order_index ASC
  `).all(userId);

  const dailyChallenge = getDailyChallenge(userId);

  const leaderboard = db.prepare(`
    SELECT u.id, u.email, u.xp, u.level,
      COUNT(ump.module_id) as modules_completed
    FROM users u
    LEFT JOIN user_module_progress ump ON ump.user_id = u.id AND ump.completed_at IS NOT NULL
    GROUP BY u.id
    ORDER BY u.xp DESC
    LIMIT 5
  `).all();

  const userRank = db.prepare(`
    SELECT COUNT(*) + 1 as rank FROM users WHERE xp > (
      SELECT xp FROM users WHERE id = ?
    )
  `).get(userId);

  const recentTimeline = db.prepare(`
    SELECT 'module' as type, m.title, ump.completed_at as date, ump.quiz_score as score, s.name as section_name
    FROM user_module_progress ump
    JOIN modules m ON m.id = ump.module_id
    JOIN sections s ON s.id = m.section_id
    WHERE ump.user_id = ? AND ump.completed_at IS NOT NULL
    UNION ALL
    SELECT 'simulation' as type, si.title, a.completed_at as date, a.score, '' as section_name
    FROM attempts a
    JOIN simulations si ON si.id = a.simulation_id
    WHERE a.user_id = ? AND a.completed_at IS NOT NULL
    ORDER BY date DESC
    LIMIT 8
  `).all(userId, userId);

  res.json({
    totalAttempts,
    averageScore,
    bestScore,
    detectionRate,
    decisionAccuracy,
    totalReports:        Number(reportStats.c || 0),
    totalMarkedSafe:     Number(safeStats.c || 0),
    credentialFailures:  Number(credStats.c || 0),
    linkClicks:          Number(linkStats.c || 0),
    modulesCompleted:    completedModules,
    totalModules,
    avgQuizScore:        Math.round(avgQuizScore),
    modulePercent:       totalModules > 0
      ? Math.round((completedModules / totalModules) * 100)
      : 0,
    certified:           !!cert,
    xp:                  user ? user.xp || 0 : 0,
    streakDays:          user ? user.streak_days || 0 : 0,
    levelInfo,
    sectionProgress,
    dailyChallenge,
    leaderboard,
    userRank:            userRank ? userRank.rank : 1,
    recentTimeline,
  });
});

// ── GET /api/dashboard/recent-activity ───────────────────────────────────────
router.get('/recent-activity', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const recentAttempts = db.prepare(`
    SELECT
      a.id, a.score, a.started_at, a.completed_at,
      s.title, s.subject, s.difficulty, s.is_phishing
    FROM attempts a
    JOIN simulations s ON s.id = a.simulation_id
    WHERE a.user_id = ? AND a.completed_at IS NOT NULL
    ORDER BY a.id DESC
    LIMIT 10
  `).all(userId);

  const recentModules = db.prepare(`
    SELECT
      ump.module_id, ump.completed_at, ump.quiz_score,
      m.title, m.difficulty, s.name AS section_name
    FROM user_module_progress ump
    JOIN modules m ON m.id = ump.module_id
    JOIN sections s ON s.id = m.section_id
    WHERE ump.user_id = ? AND ump.completed_at IS NOT NULL
    ORDER BY ump.completed_at DESC
    LIMIT 5
  `).all(userId);

  res.json({ recentAttempts, recentModules });
});

// ── GET /api/dashboard/sections ──────────────────────────────────────────────
router.get('/sections', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const sections = db.prepare(`
    SELECT
      s.id, s.name, s.description, s.icon, s.color, s.order_index,
      COUNT(m.id) as total_modules,
      COALESCE(SUM(
        CASE WHEN ump.completed_at IS NOT NULL THEN 1 ELSE 0 END
      ), 0) as completed_modules
    FROM sections s
    LEFT JOIN modules m ON m.section_id = s.id
    LEFT JOIN user_module_progress ump
      ON ump.module_id = m.id AND ump.user_id = ?
    GROUP BY s.id
    ORDER BY s.order_index ASC
  `).all(userId);

  res.json({ sections });
});

// ── POST /api/dashboard/award-xp ─────────────────────────────────────────────
router.post('/award-xp', (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { amount } = req.body || {};
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  awardXP(userId, amount);
  const user = db.prepare('SELECT xp FROM users WHERE id = ?').get(userId);
  res.json({ ok: true, ...getLevelInfo(user.xp) });
});

module.exports = router;
