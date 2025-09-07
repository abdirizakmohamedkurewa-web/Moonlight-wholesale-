import express from 'express';
import axios from 'axios';
import dayjs from 'dayjs';
import crypto from 'crypto';

const router = express.Router();

function baseUrl() {
  return process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
}

async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const res = await axios.get(baseUrl() + '/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` },
  });
  return res.data.access_token;
}

function timestamp() {
  const d = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

router.post('/stk-push', async (req, res) => {
  try {
    const token = await getAccessToken();
    const time = timestamp();
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const password = Buffer.from(shortCode + passkey + time).toString('base64');

    const {
      phone,         // 2547XXXXXXXX
      amount,        // e.g., 10
      accountRef,    // e.g., ORDER123
      description    // e.g., "Order payment"
    } = req.body;

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: time,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: accountRef || 'MOONLIGHT',
      TransactionDesc: description || 'Payment'
    };

    const resp = await axios.post(baseUrl() + '/mpesa/stkpush/v1/processrequest', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json(resp.data);
  } catch (e) {
    res.status(400).json({ error: e.response?.data || e.message });
  }
});

// callback receiver (configure URL in Daraja portal to point here)
router.post('/callback', async (req, res) => {
  console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
  // TODO: update order status upon success code 0
  res.json({ ok: true });
});

export default router;
