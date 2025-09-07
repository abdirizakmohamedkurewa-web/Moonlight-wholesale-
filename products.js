import express from 'express';
import { pool } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// list products
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
  res.json(result.rows);
});

// create product
router.post('/', authRequired, async (req, res) => {
  try {
    const { name, price, stock, unit, category } = req.body;
    const ownerId = req.user?.id || null;
    const result = await pool.query(
      'INSERT INTO products (name, price, stock, unit, category, owner_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, price, stock, unit, category, ownerId]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// update product
router.put('/:id', authRequired, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, stock, unit, category } = req.body;
    const result = await pool.query(
      'UPDATE products SET name=$1, price=$2, stock=$3, unit=$4, category=$5 WHERE id=$6 RETURNING *',
      [name, price, stock, unit, category, id]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// delete product
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM products WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
