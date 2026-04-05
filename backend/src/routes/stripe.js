const express = require("express");
const Stripe   = require("stripe");
const bcrypt   = require("bcrypt");
const { db }   = require("../db");

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const SALT_ROUNDS = 10;

// POST /api/stripe/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: { email, password },
      success_url: `${process.env.CLIENT_URL}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.CLIENT_URL}/register`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ error: "Could not create checkout session." });
  }
});

// GET /api/stripe/verify-session
router.get("/verify-session", async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id." });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(402).json({ error: "Payment not completed." });
    }

    const { email, password } = session.metadata;

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      const userData = { id: existing.id, email, role: existing.role };
      req.session.user = userData;
      return res.json({ ok: true, user: userData });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = db.prepare(`
      INSERT INTO users (email, password_hash, role, created_at)
      VALUES (?, ?, 'user', datetime('now'))
    `).run(email, hash);

    const userData = { id: result.lastInsertRowid, email, role: "user" };
    req.session.user = userData;

    res.status(201).json({ ok: true, user: userData });
  } catch (err) {
    console.error("Verify session error:", err.message);
    res.status(500).json({ error: "Could not verify payment." });
  }
});

module.exports = router;
