import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [experiences] = await db.query('SELECT * FROM experiences ORDER BY order_index ASC, created_at DESC');
    res.json(experiences.map(e => ({ ...e, is_education: Boolean(e.is_education) })));
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, company, location, start_date, end_date, description, is_education, order_index, logo_icon, company_logo } = req.body;
    const [result] = await db.query(
      'INSERT INTO experiences (title, company, location, start_date, end_date, description, is_education, order_index, logo_icon, company_logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, company, location, start_date, end_date, description, is_education || false, order_index || 0, logo_icon || 'work', company_logo || '']
    );
    res.status(201).json({ message: 'Experience created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, company, location, start_date, end_date, description, is_education, order_index, logo_icon, company_logo } = req.body;
    const [result] = await db.query(
      'UPDATE experiences SET title = ?, company = ?, location = ?, start_date = ?, end_date = ?, description = ?, is_education = ?, order_index = ?, logo_icon = ?, company_logo = ? WHERE id = ?',
      [title, company, location, start_date, end_date, description, is_education || false, order_index || 0, logo_icon || 'work', company_logo || '', req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Experience not found' });
    res.json({ message: 'Experience updated successfully' });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM experiences WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Experience not found' });
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

export default router;
