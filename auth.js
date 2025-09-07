import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, phone, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, phone, role',
      [name, phone, hash, role || 'retailer']
    );
    return res.json(result.rows[0]);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE phone=$1', [phone]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'User not found' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Incorrect password' });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || '7d',
    });
    return res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
