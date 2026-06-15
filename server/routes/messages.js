import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public: Send a message
router.post('/', async (req, res) => {
  try {
    const { name, email, company, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const [result] = await db.query(
      'INSERT INTO messages (name, email, company, message) VALUES (?, ?, ?, ?)',
      [name, email, company || '', message]
    );
    res.status(201).json({ message: 'Message sent successfully', id: result.insertId });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Private: Get all messages
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [messages] = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages.map(m => ({ ...m, is_read: Boolean(m.is_read) })));
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Private: Mark as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('UPDATE messages SET is_read = TRUE WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Private: Delete message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
