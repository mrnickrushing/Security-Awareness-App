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

// ── Content migration: ensure all modules have full long-form content ─────────
try {
  const { db } = require("./src/db");
  const shortest = db.prepare(
    "SELECT MIN(LENGTH(content)) as min FROM modules"
  ).get();
  if (shortest && shortest.min < 1500) {
    console.log("Running content migration...");
    require("./updateS1toS7Content");
    require("./updateNewSectionsContent");
    console.log("Content migration complete.");
  }
} catch (e) {
  console.error("Content migration error:", e.message);
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
