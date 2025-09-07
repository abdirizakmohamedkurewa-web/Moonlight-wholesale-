import express from 'express';
import { pool } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// create order with items [{product_id, quantity}]
router.post('/', authRequired, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items } = req.body;
    await client.query('BEGIN');
    const order = await client.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES ($1, 0, $2) RETURNING *',
      [req.user.id, 'pending']
    );
    const orderId = order.rows[0].id;
    let total = 0;
    for (const it of items) {
      const p = await client.query('SELECT id, price, stock FROM products WHERE id=$1', [it.product_id]);
      if (!p.rows[0]) throw new Error('Product not found');
      if (p.rows[0].stock < it.quantity) throw new Error('Insufficient stock');
      const price = Number(p.rows[0].price);
      const subtotal = price * it.quantity;
      total += subtotal;
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES ($1,$2,$3,$4,$5)',
        [orderId, it.product_id, it.quantity, price, subtotal]
      );
      await client.query('UPDATE products SET stock = stock - $1 WHERE id=$2', [it.quantity, it.product_id]);
    }
    await client.query('UPDATE orders SET total_price=$1 WHERE id=$2', [total, orderId]);
    await client.query('COMMIT');
    res.json({ order_id: orderId, total });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
});

// get my orders
router.get('/mine', authRequired, async (req, res) => {
  const orders = await pool.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY id DESC', [req.user.id]);
  res.json(orders.rows);
});

export default router;
