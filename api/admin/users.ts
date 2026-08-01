import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    if (req.method === 'GET') {
      const users = db.getAllUsers();
      return res.status(200).json({ users });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('admin/users error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
