const express = require('express');
const { db }  = require('../db');

const router = express.Router();

// GET /api/faq
// Optional query param: ?category=General
router.get('/', (req, res) => {
  const { category } = req.query;

  try {
    const rows = category
      ? db.prepare(`
          SELECT id, question, answer, category, order_index
          FROM faq_items WHERE category = ?
          ORDER BY order_index ASC
        `).all(category)
      : db.prepare(`
          SELECT id, question, answer, category, order_index
          FROM faq_items
          ORDER BY category ASC, order_index ASC
        `).all();

    const categories = [...new Set(rows.map(r => r.category))];

    res.json({ faq: rows, categories });
  } catch (err) {
    console.error('Error fetching FAQ:', err.message);
    res.status(500).json({ error: 'Failed to retrieve FAQ items.' });
  }
});

module.exports = router;
