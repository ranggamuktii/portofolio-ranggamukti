import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [settings] = await db.query('SELECT key_name, value FROM settings');
    // Convert array of Objects to { key_name: value }
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key_name] = curr.value;
      return acc;
    }, {});
    
    // Fallbacks just in case the db is empty
    const defaultSettings = {
      hero_title: "Hi, I'm Rangga Mukti",
      hero_subtitle: "Fullstack Web Developer crafting seamless digital experiences.",
      about_text: "I am an enthusiastic Fullstack Developer with a passion for building scalable web applications. I love solving complex problems and turning ideas into reality.",
      cv_link: "#",
      contact_email: 'hello@ranggamukti.com',
      ...settingsObj
    };
    
    res.json(defaultSettings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/', authenticateToken, async (req, res) => {
  try {
    const settings = req.body.settings; // Expected { key_name: value, ... }
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings format' });
    }

    const keys = Object.keys(settings);
    for (const key of keys) {
      const val = settings[key];
      // Insert or Update the key
      await db.query(`
        INSERT INTO settings (key_name, value) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE value = ?
      `, [key, val, val]);
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
