// Compteur de visites — utilise Vercel KV (à activer dans le dashboard Vercel)
// Dashboard → Storage → Create KV Store → lier au projet
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    try {
      const count = await kv.incr('portfolio:views');
      return res.status(200).json({ views: count });
    } catch {
      return res.status(200).json({ views: null });
    }
  }

  if (req.method === 'GET') {
    try {
      const count = (await kv.get('portfolio:views')) ?? 0;
      return res.status(200).json({ views: count });
    } catch {
      return res.status(200).json({ views: null });
    }
  }

  return res.status(405).end();
}
