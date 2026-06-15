import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [skills] = await db.query('SELECT * FROM skills ORDER BY order_index ASC, created_at DESC');
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { img_src, label, description, category, order_index } = req.body;
    const [result] = await db.query(
      'INSERT INTO skills (img_src, label, description, category, order_index) VALUES (?, ?, ?, ?, ?)',
      [img_src, label, description, category, order_index || 0]
    );
    res.status(201).json({ message: 'Skill created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { img_src, label, description, category, order_index } = req.body;
    const [result] = await db.query(
      'UPDATE skills SET img_src = ?, label = ?, description = ?, category = ?, order_index = ? WHERE id = ?',
      [img_src, label, description, category, order_index || 0, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM skills WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Skill not found' });
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router;
