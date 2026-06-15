import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public: Track page view
router.post('/track', async (req, res) => {
  try {
    const { path } = req.body;
    if (!path) return res.status(400).json({ error: 'Path is required' });

    await db.query(
      'INSERT INTO page_views (page_path, view_count) VALUES (?, 1) ON DUPLICATE KEY UPDATE view_count = view_count + 1',
      [path]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Private: Get analytics summary
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [views] = await db.query('SELECT * FROM page_views ORDER BY view_count DESC');
    const [totalViewsResult] = await db.query('SELECT SUM(view_count) as total FROM page_views');
    const [unreadMessages] = await db.query('SELECT COUNT(*) as unread FROM messages WHERE is_read = FALSE');
    
    res.json({
      details: views,
      totalViews: totalViewsResult[0].total || 0,
      unreadCount: unreadMessages[0].unread || 0
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
