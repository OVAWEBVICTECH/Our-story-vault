import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    if (req.method === 'GET') {
      const settings = db.getSettings('our-story');
      return res.status(200).json({ settings });
    }

    if (req.method === 'PUT') {
      const updated = db.updateSettings(req.body);
      return res.status(200).json({ settings: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('admin/settings error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
