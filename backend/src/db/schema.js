const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { initDb } = require("./src/db");

const authRoutes           = require("./src/routes/auth");
const moduleRoutes         = require("./src/routes/modules");
const simRoutes            = require("./src/routes/simulations");
const attemptRoutes        = require("./src/routes/attempts");
const adminRoutes          = require("./src/routes/admin");
const trainingRoutes       = require("./src/routes/training");
const leaderboardRoutes    = require("./src/routes/leaderboard");
const certRoutes           = require("./src/routes/certificates");
const sectionRoutes        = require("./src/routes/sections");
const dashboardRoutes      = require("./src/routes/dashboard");
const moduleProgressRoutes = require("./src/routes/moduleProgress");
const faqRoutes            = require("./src/routes/faq");
const scenarioRoutes       = require("./src/routes/scenarios");

const app  = express();
const PORT = process.env.PORT || 5174;
const isProd = process.env.NODE_ENV === "production";

initDb();

// ── Versioned migrations (run once per version, never again) ──────────────────
try {
  const { db } = require("./src/db");
  const { hasMigration, recordMigration } = require("./src/db/schema");

  // v1 — full module content for sections 1-7
  if (!hasMigration(db, 1)) {
    console.log("Migration v1: updating module content sections 1-7...");
    require("./updateS1toS7Content");
    recordMigration(db, 1);
    console.log("Migration v1 complete.");
  }

  // v2 — full module content for sections 8-11
  if (!hasMigration(db, 2)) {
    console.log("Migration v2: updating module content sections 8-11...");
    require("./updateNewSectionsContent");
    recordMigration(db, 2);
    console.log("Migration v2 complete.");
  }

  // v3 — rotate answer positions so correct answer cycles A/B/C
  if (!hasMigration(db, 3)) {
    console.log("Migration v3: balancing answer positions...");
    require("./fixAnswerLengths");
    recordMigration(db, 3);
    console.log("Migration v3 complete.");
  }

  // v4 — pad wrong answers so longest is not always correct
  if (!hasMigration(db, 4)) {
    console.log("Migration v4: padding wrong answer lengths...");
    require("./fixAnswerLengthBalance");
    recordMigration(db, 4);
    console.log("Migration v4 complete.");
  }

} catch (e) {
  console.error("Migration error:", e.message);
}
// ─────────────────────────────────────────────────────────────────────────────

if (isProd) app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

if (isProd) {
  app.use(cors({
    origin: "https://security-awareness-app-production.up.railway.app",
    credentials: true,
  }));
} else {
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
}

app.use(
  session({
    name: "sa.sid",
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth",            authRoutes);
app.use("/api/sections",        sectionRoutes);
app.use("/api/modules",         moduleRoutes);
app.use("/api/simulations",     simRoutes);
app.use("/api/attempts",        attemptRoutes);
app.use("/api/admin",           adminRoutes);
app.use("/api/training",        trainingRoutes);
app.use("/api/leaderboard",     leaderboardRoutes);
app.use("/api/certificates",    certRoutes);
app.use("/api/dashboard",       dashboardRoutes);
app.use("/api/module-progress", moduleProgressRoutes);
app.use("/api/faq",             faqRoutes);
app.use("/api/scenarios",       scenarioRoutes);

if (isProd) {
  const frontendDist = path.join(__dirname, "../frontend/dist");
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
