const express = require("express");
const { db } = require("../db");

const router = express.Router();

function getUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.session && req.session.user && req.session.user.id) return req.session.user.id;
  if (req.session && req.session.userId) return req.session.userId;
  return null;
}

router.get("/stats", (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  // ── Attempt stats ──────────────────────────────────────────────────────
  const attemptStats = db.prepare(`
    SELECT COUNT(*) as totalAttempts, COALESCE(AVG(score), 0) as averageScore
    FROM attempts WHERE user_id = ? AND completed_at IS NOT NULL
  `).get(userId);

  const answerStats = db.prepare(`
    SELECT COUNT(*) as totalAnswers, COALESCE(SUM(is_correct), 0) as correctAnswers
    FROM attempt_answers aa
    JOIN attempts a ON aa.attempt_id = a.id
    WHERE a.user_id = ?
  `).get(userId);

  const reportStats   = db.prepare(`SELECT COUNT(*) as c FROM simulation_events WHERE user_id=? AND event_type='reported_phishing'`).get(userId);
  const safeStats     = db.prepare(`SELECT COUNT(*) as c FROM simulation_events WHERE user_id=? AND event_type='marked_safe'`).get(userId);
  const credStats     = db.prepare(`SELECT COUNT(*) as c FROM simulation_events WHERE user_id=? AND event_type='submitted_credentials'`).get(userId);
  const linkStats     = db.prepare(`SELECT COUNT(*) as c FROM simulation_events WHERE user_id=? AND event_type='clicked_link'`).get(userId);

  // ── Module stats ───────────────────────────────────────────────────────
  const totalModules  = db.prepare(`SELECT COUNT(*) as c FROM modules`).get().c;
  const completedMods = db.prepare(`SELECT COUNT(*) as c FROM user_module_progress WHERE user_id=? AND completed_at IS NOT NULL`).get(userId).c;
  const avgQuizScore  = db.prepare(`SELECT COALESCE(AVG(quiz_score),0) as avg FROM user_module_progress WHERE user_id=? AND quiz_score IS NOT NULL`).get(userId).avg;

  // ── Certificate ────────────────────────────────────────────────────────
  const cert = db.prepare(`SELECT * FROM certificates WHERE user_id=?`).get(userId);

  // ── Leaderboard rank ───────────────────────────────────────────────────
  const allRanks = db.prepare(`
    SELECT u.id,
      (COUNT(DISTINCT a.id)*10 + COALESCE(ROUND(AVG(a.score)),0) + COUNT(DISTINCT ump.module_id)*5 + CASE WHEN c.id IS NOT NULL THEN 50 ELSE 0 END) as pts
    FROM users u
    LEFT JOIN attempts a ON a.user_id=u.id AND a.completed_at IS NOT NULL
    LEFT JOIN user_module_progress ump ON ump.user_id=u.id AND ump.completed_at IS NOT NULL
    LEFT JOIN certificates c ON c.user_id=u.id
    GROUP BY u.id ORDER BY pts DESC
  `).all();
  const rankIndex = allRanks.findIndex(r => r.id === userId);
  const leaderboardRank = rankIndex >= 0 ? rankIndex + 1 : null;

  // ── Recent scores ──────────────────────────────────────────────────────
  const recentScores = db.prepare(`
    SELECT a.id, a.score, a.completed_at, s.title, s.subject, s.is_phishing
    FROM attempts a JOIN simulations s ON a.simulation_id=s.id
    WHERE a.user_id=? AND a.completed_at IS NOT NULL
    ORDER BY a.id DESC LIMIT 10
  `).all(userId);

  const chartData = [...recentScores].reverse().map((a, i) => ({
    label: `Attempt ${i+1}`,
    score: Number(a.score || 0),
    subject: a.subject || a.title,
    completed_at: a.completed_at,
  }));

  // ── Recent activity ────────────────────────────────────────────────────
  const recentActivity = db.prepare(`
    SELECT se.id, se.event_type, se.event_value, se.created_at, s.subject, s.title, s.is_phishing
    FROM simulation_events se JOIN simulations s ON se.simulation_id=s.id
    WHERE se.user_id=? ORDER BY se.id DESC LIMIT 12
  `).all(userId);

  // ── Decision analytics ─────────────────────────────────────────────────
  const decisionRows = db.prepare(`
    SELECT se.event_type, s.is_phishing FROM simulation_events se
    JOIN simulations s ON se.simulation_id=s.id
    WHERE se.user_id=? AND se.event_type IN ('reported_phishing','marked_safe')
  `).all(userId);

  let correctReports=0, falsePositives=0, missedPhishing=0, correctSafe=0;
  for (const row of decisionRows) {
    if      (row.event_type==='reported_phishing' && row.is_phishing)  correctReports++;
    else if (row.event_type==='reported_phishing' && !row.is_phishing) falsePositives++;
    else if (row.event_type==='marked_safe'       && row.is_phishing)  missedPhishing++;
    else if (row.event_type==='marked_safe'       && !row.is_phishing) correctSafe++;
  }
  const decisionTotal = correctReports+falsePositives+missedPhishing+correctSafe;
  const decisionAccuracy = decisionTotal > 0 ? Math.round(((correctReports+correctSafe)/decisionTotal)*100) : 0;
  const detectionRate = Number(answerStats.totalAnswers) > 0
    ? Math.round((Number(answerStats.correctAnswers)/Number(answerStats.totalAnswers))*100) : 0;

  const totalAttempts = Number(attemptStats.totalAttempts || 0);
  const averageScore  = Math.round(Number(attemptStats.averageScore || 0));

  // ── Badges ─────────────────────────────────────────────────────────────
  const allBadges = [
    { id: "first_sim",    name: "First Step",        description: "Complete your first simulation",              earned: totalAttempts >= 1 },
    { id: "five_sims",    name: "Getting Started",   description: "Complete 5 simulations",                     earned: totalAttempts >= 5 },
    { id: "ten_sims",     name: "Dedicated Learner", description: "Complete 10 simulations",                    earned: totalAttempts >= 10 },
    { id: "perfect",      name: "Perfect Score",     description: "Score 100% on a simulation",                 earned: recentScores.some(s => s.score === 100) },
    { id: "avg80",        name: "High Achiever",     description: "Maintain an average score above 80%",        earned: averageScore >= 80 },
    { id: "first_module", name: "Scholar",           description: "Complete your first training module",        earned: completedMods >= 1 },
    { id: "five_modules", name: "Knowledge Seeker",  description: "Complete 5 training modules",               earned: completedMods >= 5 },
    { id: "all_modules",  name: "Module Master",     description: "Complete all 15 training modules",           earned: completedMods >= totalModules && totalModules > 0 },
    { id: "quiz_ace",     name: "Quiz Ace",          description: "Average 90% or higher on module quizzes",   earned: Math.round(avgQuizScore) >= 90 },
    { id: "certified",    name: "Certified",         description: "Earn your completion certificate",           earned: !!cert },
    { id: "top3",         name: "Podium Finish",     description: "Reach the top 3 on the leaderboard",        earned: leaderboardRank !== null && leaderboardRank <= 3 },
    { id: "reporter",     name: "Threat Reporter",   description: "Report 5 phishing scenarios correctly",      earned: correctReports >= 5 },
  ];

  const earnedBadges = allBadges.filter(b => b.earned);
  const lockedBadges = allBadges.filter(b => !b.earned);

  // ── Milestones ─────────────────────────────────────────────────────────
  const milestones = [
    {
      id: "sims",
      label: "Simulations Completed",
      current: totalAttempts,
      target: 10,
      percent: Math.min(100, Math.round((totalAttempts/10)*100)),
      complete: totalAttempts >= 10,
    },
    {
      id: "modules",
      label: "Modules Completed",
      current: completedMods,
      target: totalModules,
      percent: totalModules > 0 ? Math.min(100, Math.round((completedMods/totalModules)*100)) : 0,
      complete: completedMods >= totalModules && totalModules > 0,
    },
    {
      id: "score",
      label: "Average Score Goal (80%)",
      current: averageScore,
      target: 80,
      percent: Math.min(100, Math.round((averageScore/80)*100)),
      complete: averageScore >= 80,
    },
    {
      id: "reports",
      label: "Correct Phishing Reports",
      current: correctReports,
      target: 5,
      percent: Math.min(100, Math.round((correctReports/5)*100)),
      complete: correctReports >= 5,
    },
  ];

  // ── Recommendations ────────────────────────────────────────────────────
  const recommendations = [];
  if (missedPhishing > 0) recommendations.push({ title: "Watch for Phishing", text: "You have missed phishing scenarios by marking them safe. Review the Threat Library for common red flags.", priority: "high" });
  if (falsePositives > 0) recommendations.push({ title: "Reduce False Positives", text: "You have reported legitimate emails as suspicious. Practice identifying trusted internal senders and expected communications.", priority: "medium" });
  if (averageScore < 70 && totalAttempts > 2) recommendations.push({ title: "Boost Your Score", text: "Your average score is below 70%. Try re-reading each module before attempting its related scenarios.", priority: "high" });
  if (completedMods < totalModules) recommendations.push({ title: "Complete Your Modules", text: `You have completed ${completedMods} of ${totalModules} modules. Finish the remaining modules to earn your certificate.`, priority: completedMods < totalModules/2 ? "high" : "medium" });
  if (recommendations.length === 0) recommendations.push({ title: "Keep It Up", text: "You are performing well across all areas. Keep completing simulations and modules to maintain your skills.", priority: "low" });

  res.json({
    stats: {
      totalAttempts,
      averageScore,
      totalAnswers: Number(answerStats.totalAnswers || 0),
      correctAnswers: Number(answerStats.correctAnswers || 0),
      detectionRate,
      totalReports: Number(reportStats.c || 0),
      totalMarkedSafe: Number(safeStats.c || 0),
      credentialFailures: Number(credStats.c || 0),
      linkClicks: Number(linkStats.c || 0),
    },
    decisionStats: { correctReports, falsePositives, missedPhishing, correctSafe, decisionAccuracy, totalDecisions: decisionTotal },
    moduleStats: { completed: completedMods, total: totalModules, avgQuizScore: Math.round(avgQuizScore), percentComplete: totalModules > 0 ? Math.round((completedMods/totalModules)*100) : 0 },
    leaderboardRank,
    totalUsers: allRanks.length,
    certified: !!cert,
    certificate: cert ? { issuedAt: cert.issued_at, averageScore: cert.average_score } : null,
    earnedBadges,
    lockedBadges,
    allBadges,
    milestones,
    recommendations,
    recentScores,
    chartData,
    recentActivity,
  });
});

module.exports = router;
