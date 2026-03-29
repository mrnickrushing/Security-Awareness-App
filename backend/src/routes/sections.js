const express = require('express');
const { db }  = require('../db');

const router = express.Router();

// GET /api/sections
router.get('/', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT id, name, description, icon, color, order_index
      FROM sections
      ORDER BY order_index ASC
    `).all();
    res.json({ sections: rows });
  } catch (err) {
    console.error('Error fetching sections:', err.message);
    res.status(500).json({ error: 'Failed to retrieve sections.' });
  }
});

// GET /api/sections/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare(`
      SELECT id, name, description, icon, color, order_index
      FROM sections
      WHERE id = ?
    `).get(Number(req.params.id));

    if (!row) return res.status(404).json({ error: 'Section not found.' });
    res.json({ section: row });
  } catch (err) {
    console.error('Error fetching section:', err.message);
    res.status(500).json({ error: 'Failed to retrieve section.' });
  }
});

module.exports = router;
