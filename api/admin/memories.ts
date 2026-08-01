import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    if (req.method === 'GET') {
      const memories = db.getMemories('our-story', false);
      return res.status(200).json({ memories });
    }

    if (req.method === 'POST') {
      const newMem = db.createMemory(req.body);
      return res.status(200).json({ memory: newMem });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('admin/memories error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
