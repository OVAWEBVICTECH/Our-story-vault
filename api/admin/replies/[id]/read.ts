import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    if (req.method === 'PATCH') {
      const { id } = req.query;
      const replyId = Array.isArray(id) ? id[0] : (id as string);
      const reply = db.markReplyAsRead(replyId);
      return res.status(200).json({ reply });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('admin/replies/[id]/read error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
