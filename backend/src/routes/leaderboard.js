const express = require("express");
const { db } = require("../db");

const router = express.Router();

function getUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.session && req.session.user && req.session.user.id) return req.session.user.id;
  if (req.session && req.session.userId) return req.session.userId;
  return null;
}

// GET /api/leaderboard
router.get("/", (req, res) => {
  const userId = getUserId(req);

  const rows = db.prepare(`
    SELECT
      u.id,
      u.email,
      COUNT(DISTINCT a.id)                          AS simulations_completed,
      COALESCE(ROUND(AVG(a.score)), 0)              AS average_score,
      COALESCE(MAX(a.score), 0)                     AS best_score,
      COUNT(DISTINCT ump.module_id)                 AS modules_completed,
      CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END  AS certified,
      (
        COUNT(DISTINCT a.id) * 10 +
        COALESCE(ROUND(AVG(a.score)), 0) +
        COUNT(DISTINCT ump.module_id) * 5 +
        CASE WHEN c.id IS NOT NULL THEN 50 ELSE 0 END
      )                                             AS total_points
    FROM users u
    LEFT JOIN attempts a
      ON a.user_id = u.id AND a.completed_at IS NOT NULL
    LEFT JOIN user_module_progress ump
      ON ump.user_id = u.id AND ump.completed_at IS NOT NULL
    LEFT JOIN certificates c
      ON c.user_id = u.id
    GROUP BY u.id
    ORDER BY total_points DESC, average_score DESC
    LIMIT 50
  `).all();

  const leaderboard = rows.map((row, index) => ({
    rank: index + 1,
    userId: row.id,
    email: row.email,
    displayName: row.email.split("@")[0],
    simulationsCompleted: row.simulations_completed,
    averageScore: row.average_score,
    bestScore: row.best_score,
    modulesCompleted: row.modules_completed,
    certified: Boolean(row.certified),
    totalPoints: row.total_points,
    isCurrentUser: userId ? row.id === userId : false,
  }));

  // If current user is not in top 50, append their stats
  if (userId && !leaderboard.find((r) => r.userId === userId)) {
    const userRow = db.prepare(`
      SELECT
        u.id, u.email,
        COUNT(DISTINCT a.id)                          AS simulations_completed,
        COALESCE(ROUND(AVG(a.score)), 0)              AS average_score,
        COALESCE(MAX(a.score), 0)                     AS best_score,
        COUNT(DISTINCT ump.module_id)                 AS modules_completed,
        CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END  AS certified,
        (
          COUNT(DISTINCT a.id) * 10 +
          COALESCE(ROUND(AVG(a.score)), 0) +
          COUNT(DISTINCT ump.module_id) * 5 +
          CASE WHEN c.id IS NOT NULL THEN 50 ELSE 0 END
        )                                             AS total_points
      FROM users u
      LEFT JOIN attempts a
        ON a.user_id = u.id AND a.completed_at IS NOT NULL
      LEFT JOIN user_module_progress ump
        ON ump.user_id = u.id AND ump.completed_at IS NOT NULL
      LEFT JOIN certificates c
        ON c.user_id = u.id
      WHERE u.id = ?
      GROUP BY u.id
    `).get(userId);

    if (userRow) {
      const allRows = db.prepare(`
        SELECT u.id,
          (
            COUNT(DISTINCT a.id) * 10 +
            COALESCE(ROUND(AVG(a.score)), 0) +
            COUNT(DISTINCT ump.module_id) * 5 +
            CASE WHEN c.id IS NOT NULL THEN 50 ELSE 0 END
          ) AS total_points
        FROM users u
        LEFT JOIN attempts a ON a.user_id = u.id AND a.completed_at IS NOT NULL
        LEFT JOIN user_module_progress ump ON ump.user_id = u.id AND ump.completed_at IS NOT NULL
        LEFT JOIN certificates c ON c.user_id = u.id
        GROUP BY u.id
        ORDER BY total_points DESC
      `).all();

      const userRank = allRows.findIndex((r) => r.id === userId) + 1;

      leaderboard.push({
        rank: userRank,
        userId: userRow.id,
        email: userRow.email,
        displayName: userRow.email.split("@")[0],
        simulationsCompleted: userRow.simulations_completed,
        averageScore: userRow.average_score,
        bestScore: userRow.best_score,
        modulesCompleted: userRow.modules_completed,
        certified: Boolean(userRow.certified),
        totalPoints: userRow.total_points,
        isCurrentUser: true,
        outsideTop50: true,
      });
    }
  }

  res.json({ leaderboard });
});

// GET /api/leaderboard/me
router.get("/me", (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const stats = db.prepare(`
    SELECT
      COUNT(DISTINCT a.id)                          AS simulations_completed,
      COALESCE(ROUND(AVG(a.score)), 0)              AS average_score,
      COALESCE(MAX(a.score), 0)                     AS best_score,
      COUNT(DISTINCT ump.module_id)                 AS modules_completed,
      CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END  AS certified,
      (
        COUNT(DISTINCT a.id) * 10 +
        COALESCE(ROUND(AVG(a.score)), 0) +
        COUNT(DISTINCT ump.module_id) * 5 +
        CASE WHEN c.id IS NOT NULL THEN 50 ELSE 0 END
      )                                             AS total_points
    FROM users u
    LEFT JOIN attempts a
      ON a.user_id = u.id AND a.completed_at IS NOT NULL
    LEFT JOIN user_module_progress ump
      ON ump.user_id = u.id AND ump.completed_at IS NOT NULL
    LEFT JOIN certificates c
      ON c.user_id = u.id
    WHERE u.id = ?
    GROUP BY u.id
  `).get(userId);

  const allRows = db.prepare(`
    SELECT u.id,
      (
        COUNT(DISTINCT a.id) * 10 +
        COALESCE(ROUND(AVG(a.score)), 0) +
        COUNT(DISTINCT ump.module_id) * 5 +
        CASE WHEN c.id IS NOT NULL THEN 50 ELSE 0 END
      ) AS total_points
    FROM users u
    LEFT JOIN attempts a ON a.user_id = u.id AND a.completed_at IS NOT NULL
    LEFT JOIN user_module_progress ump ON ump.user_id = u.id AND ump.completed_at IS NOT NULL
    LEFT JOIN certificates c ON c.user_id = u.id
    GROUP BY u.id
    ORDER BY total_points DESC
  `).all();

  const rank = allRows.findIndex((r) => r.id === userId) + 1;

  res.json({
    rank: rank || null,
    totalUsers: allRows.length,
    ...(stats || {
      simulations_completed: 0,
      average_score: 0,
      best_score: 0,
      modules_completed: 0,
      certified: 0,
      total_points: 0,
    }),
  });
});

module.exports = router;
