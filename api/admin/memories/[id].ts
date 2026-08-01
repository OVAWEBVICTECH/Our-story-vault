import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    const { id } = req.query;
    const memId = Array.isArray(id) ? id[0] : (id as string);

    if (req.method === 'PUT') {
      const updated = db.updateMemory(memId, req.body);
      if (!updated) return res.status(404).json({ error: 'Memory not found' });
      return res.status(200).json({ memory: updated });
    }

    if (req.method === 'DELETE') {
      const success = db.deleteMemory(memId);
      return res.status(200).json({ success });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('admin/memories/[id] error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
