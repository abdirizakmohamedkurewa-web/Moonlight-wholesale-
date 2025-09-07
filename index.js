import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import mpesaRoutes from './routes/mpesa.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, message: 'Moonlight API running' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/mpesa', mpesaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`API listening on http://localhost:${PORT}`);
  // quick test to ensure DB connection
  await pool.query('SELECT 1');
  console.log('PostgreSQL connected');
});
