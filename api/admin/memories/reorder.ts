import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds must be an array' });
    const memories = db.reorderMemories(orderedIds);
    return res.status(200).json({ memories });
  } catch (err: any) {
    console.error('admin/memories/reorder error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
