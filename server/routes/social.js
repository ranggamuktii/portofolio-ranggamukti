import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/social - Get all social links
router.get('/', async (req, res) => {
  try {
    const [links] = await db.query(`
      SELECT * FROM social_links 
      ORDER BY order_index ASC
    `);
    res.json(links);
  } catch (error) {
    console.error('Get social links error:', error);
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

// PUT /api/social - Update all social links (admin only)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { links } = req.body; // Array of social links

    if (!Array.isArray(links)) {
      return res.status(400).json({ error: 'Links must be an array' });
    }

    // Delete all existing links and insert new ones
    await db.query('DELETE FROM social_links');

    if (links.length > 0) {
      const values = links.map((link) => [link.platform, link.label, link.href, link.icon || null, link.order_index || 0]);

      await db.query(`INSERT INTO social_links (platform, label, href, icon, order_index) VALUES ?`, [values]);
    }

    res.json({ message: 'Social links updated successfully' });
  } catch (error) {
    console.error('Update social links error:', error);
    res.status(500).json({ error: 'Failed to update social links' });
  }
});

export default router;
