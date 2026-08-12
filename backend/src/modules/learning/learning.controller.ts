import type { Request, Response } from 'express';
import { pool } from '../../database/pool.js';

export async function getLearningModules(req: Request, res: Response) {
  try {
    const { category } = req.query;

    const values: string[] = [];
    let query = `
      SELECT lm.id, lm.title, lm.slug, lm.reading_time, lm.fiba_rule_reference,
             c.name AS category_name, c.slug AS category_slug
      FROM learning_modules lm
      JOIN categories c ON lm.category_id = c.id
    `;

    if (category) {
      query += ' WHERE c.slug = $1';
      values.push(category as string);
    }

    query += ' ORDER BY c.name, lm.title';

    const result = await pool.query(query, values);
    res.json({ modules: result.rows });
  } catch (err) {
    console.error('Error fetching learning modules:', err);
    res.status(500).json({ message: 'Failed to fetch learning modules' });
  }
}


export async function getLearningModuleBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const query = `
      SELECT lm.id, lm.title, lm.slug, lm.content, lm.reading_time, lm.fiba_rule_reference,
             c.name AS category_name, c.slug AS category_slug
      FROM learning_modules lm
      JOIN categories c ON lm.category_id = c.id
      WHERE lm.slug = $1
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ module: result.rows[0] });
  } catch (err) {
    console.error('Error fetching learning module:', err);
    res.status(500).json({ message: 'Failed to fetch learning module' });
  }
}