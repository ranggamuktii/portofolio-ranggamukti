import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// POST /api/chat - Handle chat messages
router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Search for FAQ match
    const [faqs] = await db.query(
      `
      SELECT * FROM faqs 
      WHERE LOWER(question) LIKE LOWER(?) 
      ORDER BY order_index ASC 
      LIMIT 1
    `,
      [`%${message}%`]
    );

    let response;
    let isFaq = true;

    if (faqs.length > 0) {
      response = faqs[0].answer;
    } else {
      // Default response when no FAQ match
      response = 'Maaf, saya belum bisa menjawab pertanyaan tersebut. Silakan hubungi saya langsung melalui form kontak atau social media yang tertera di footer.';
      isFaq = false;
    }

    // Log the conversation
    await db.query('INSERT INTO chat_messages (session_id, message, response, is_faq) VALUES (?, ?, ?, ?)', [sessionId || null, message, response, isFaq]);

    res.json({
      response,
      isFaq,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// GET /api/chat/faqs - Get all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const [faqs] = await db.query(`
      SELECT id, question, answer, category, order_index 
      FROM faqs 
      ORDER BY order_index ASC
    `);
    res.json(faqs);
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

export default router;
