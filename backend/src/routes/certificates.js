const express = require("express");
const { db } = require("../db");

const router = express.Router();

function getUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.session && req.session.user && req.session.user.id) return req.session.user.id;
  if (req.session && req.session.userId) return req.session.userId;
  return null;
}

function isAdmin(userId) {
  if (!userId) return false;
  const user = db.prepare("SELECT role FROM users WHERE id = ?").get(userId);
  return user && user.role === "admin";
}

function getSectionProgress(userId, adminOverride) {
  const sections = db.prepare(`
    SELECT s.id, s.name, s.icon, s.color, s.order_index,
      COUNT(m.id) as total_modules
    FROM sections s
    LEFT JOIN modules m ON m.section_id = s.id
    GROUP BY s.id
    ORDER BY s.order_index ASC
  `).all();

  const results = [];

  for (const section of sections) {
    const completed = adminOverride
      ? section.total_modules
      : db.prepare(`
          SELECT COUNT(*) as c FROM user_module_progress ump
          JOIN modules m ON m.id = ump.module_id
          WHERE ump.user_id = ? AND m.section_id = ? AND ump.completed_at IS NOT NULL
        `).get(userId, section.id).c;

    const avgScore = adminOverride
      ? 100
      : db.prepare(`
          SELECT COALESCE(AVG(ump.quiz_score), 0) as avg
          FROM user_module_progress ump
          JOIN modules m ON m.id = ump.module_id
          WHERE ump.user_id = ? AND m.section_id = ? AND ump.quiz_score IS NOT NULL
        `).get(userId, section.id).avg;

    const isComplete = completed >= section.total_modules && section.total_modules > 0;
    const percent = section.total_modules > 0
      ? Math.round((completed / section.total_modules) * 100)
      : 0;

    let cert = db.prepare(`
      SELECT * FROM section_certificates WHERE user_id = ? AND section_id = ?
    `).get(userId, section.id);

    if (isComplete && !cert) {
      db.prepare(`
        INSERT INTO section_certificates (user_id, section_id, modules_completed, avg_quiz_score)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id, section_id) DO UPDATE SET
          modules_completed = excluded.modules_completed,
          avg_quiz_score = excluded.avg_quiz_score
      `).run(userId, section.id, completed, Math.round(avgScore));
      cert = db.prepare(`
        SELECT * FROM section_certificates WHERE user_id = ? AND section_id = ?
      `).get(userId, section.id);
    }

    if (isComplete && cert && adminOverride) {
      db.prepare(`
        UPDATE section_certificates SET modules_completed = ?, avg_quiz_score = 100
        WHERE user_id = ? AND section_id = ?
      `).run(section.total_modules, userId, section.id);
      cert = db.prepare(`
        SELECT * FROM section_certificates WHERE user_id = ? AND section_id = ?
      `).get(userId, section.id);
    }

    results.push({
      sectionId:       section.id,
      sectionName:     section.name,
      icon:            section.icon,
      color:           section.color,
      orderIndex:      section.order_index,
      totalModules:    section.total_modules,
      completedModules: completed,
      avgQuizScore:    Math.round(avgScore),
      percent,
      isComplete,
      issuedAt:        cert ? cert.issued_at : null,
      certId:          cert ? cert.id : null,
    });
  }

  return results;
}

// GET /api/certificates/me
router.get("/me", (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const admin = isAdmin(userId);
  const user  = db.prepare("SELECT email FROM users WHERE id = ?").get(userId);
  const sectionProgress = getSectionProgress(userId, admin);

  const totalSections    = sectionProgress.length;
  const completedSections = sectionProgress.filter(s => s.isComplete).length;
  const allComplete      = completedSections === totalSections;

  const masterCert = db.prepare("SELECT * FROM certificates WHERE user_id = ?").get(userId);

  if (allComplete && !masterCert) {
    const simStats = db.prepare(`
      SELECT COUNT(*) as count, COALESCE(AVG(score), 0) as avg_score
      FROM attempts WHERE user_id = ? AND completed_at IS NOT NULL
    `).get(userId);
    const totalMods = db.prepare("SELECT COUNT(*) as c FROM modules").get().c;
    db.prepare(`
      INSERT INTO certificates (user_id, modules_completed, simulations_completed, average_score)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO NOTHING
    `).run(userId, totalMods, simStats.count, Math.round(simStats.avg_score));
  }

  const updatedMasterCert = db.prepare("SELECT * FROM certificates WHERE user_id = ?").get(userId);

  res.json({
    userName:          user ? user.email.split("@")[0] : "Trainee",
    sectionProgress,
    completedSections,
    totalSections,
    allComplete,
    masterCert: updatedMasterCert ? {
      issuedAt:             updatedMasterCert.issued_at,
      modulesCompleted:     updatedMasterCert.modules_completed,
      simulationsCompleted: updatedMasterCert.simulations_completed,
      averageScore:         updatedMasterCert.average_score,
    } : null,
  });
});

// POST /api/certificates/claim
router.post("/claim", (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const admin = isAdmin(userId);
  const sectionProgress = getSectionProgress(userId, admin);
  const allComplete = sectionProgress.every(s => s.isComplete);

  if (!allComplete) {
    return res.status(400).json({
      error: "Complete all sections to claim your master certificate",
    });
  }

  const totalMods = db.prepare("SELECT COUNT(*) as c FROM modules").get().c;
  const simStats  = db.prepare(`
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
  `).run(userId, totalMods, simStats.count, Math.round(simStats.avg_score));

  res.json({ ok: true });
});

module.exports = router;
