const express = require("express");
const bcrypt  = require("bcrypt");
const { db }  = require("../db");

const router = express.Router();

const SALT_ROUNDS = 10;

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = db.prepare(`
      INSERT INTO users (email, password_hash, role, created_at)
      VALUES (?, ?, 'user', datetime('now'))
    `).run(email, hash);

    const userData = {
      id:    result.lastInsertRowid,
      email,
      role:  "user",
    };

    req.session.user = userData;

    res.status(201).json({ ok: true, user: userData });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Registration failed." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    return res.status(401).json({ error: "Invalid login" });
  }

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return res.status(401).json({ error: "Invalid login" });
  }

  const userData = {
    id:    user.id,
    email: user.email,
    role:  user.role,
  };

  req.session.user = userData;

  res.json({ ok: true, user: userData });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ user: req.session.user });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed." });
    }
    res.clearCookie("sa.sid");
    res.json({ ok: true });
  });
});

module.exports = router;
