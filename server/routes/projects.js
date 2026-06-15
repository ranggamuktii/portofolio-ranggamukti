import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT id, slug, title, img_src, tags, demo_link, github_link, 
             description, role, problem, solution, technologies, features, screenshots, is_featured, order_index 
      FROM projects 
      ORDER BY order_index ASC, created_at DESC
    `);

    // Parse JSON fields
    const parsedProjects = projects.map((p) => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
      technologies: p.technologies ? JSON.parse(p.technologies) : [],
      features: p.features ? JSON.parse(p.features) : [],
      screenshots: p.screenshots ? JSON.parse(p.screenshots) : [],
      is_featured: Boolean(p.is_featured),
    }));

    res.json(parsedProjects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:slug - Get single project
router.get('/:slug', async (req, res) => {
  try {
    const [projects] = await db.query('SELECT * FROM projects WHERE slug = ?', [req.params.slug]);

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projects[0];

    // Parse JSON fields
    const parsedProject = {
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      features: project.features ? JSON.parse(project.features) : [],
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
      is_featured: Boolean(project.is_featured),
    };

    res.json(parsedProject);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create new project (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { slug, title, img_src, tags, demo_link, github_link, description, role, problem, solution, technologies, features, screenshots, is_featured, order_index } = req.body;

    if (!slug || !title) {
      return res.status(400).json({ error: 'Slug and title are required' });
    }

    const [result] = await db.query(
      `INSERT INTO projects 
       (slug, title, img_src, tags, demo_link, github_link, description, 
        role, problem, solution, technologies, features, screenshots, is_featured, order_index) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        img_src || null,
        tags ? JSON.stringify(tags) : null,
        demo_link || null,
        github_link || null,
        description || null,
        role || null,
        problem || null,
        solution || null,
        technologies ? JSON.stringify(technologies) : null,
        features ? JSON.stringify(features) : null,
        screenshots ? JSON.stringify(screenshots) : null,
        is_featured || false,
        order_index || 0,
      ]
    );

    res.status(201).json({
      message: 'Project created successfully',
      id: result.insertId,
    });
  } catch (error) {
    console.error('Create project error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Project with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Update project (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { slug, title, img_src, tags, demo_link, github_link, description, role, problem, solution, technologies, features, screenshots, is_featured, order_index } = req.body;

    const [result] = await db.query(
      `UPDATE projects SET 
       slug = ?, title = ?, img_src = ?, tags = ?, demo_link = ?, 
       github_link = ?, description = ?, role = ?, problem = ?, solution = ?, technologies = ?, features = ?, 
       screenshots = ?, is_featured = ?, order_index = ?
       WHERE id = ?`,
      [
        slug,
        title,
        img_src || null,
        tags ? JSON.stringify(tags) : null,
        demo_link || null,
        github_link || null,
        description || null,
        role || null,
        problem || null,
        solution || null,
        technologies ? JSON.stringify(technologies) : null,
        features ? JSON.stringify(features) : null,
        screenshots ? JSON.stringify(screenshots) : null,
        is_featured || false,
        order_index || 0,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
