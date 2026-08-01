import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : (req.query.slug as string) || 'our-story';
    if (req.method === 'GET') {
      const settings = db.getSettings(slug);
      const memories = db.getMemories(slug, true);
      const { passcode, ...publicSettings } = settings;
      const requiresPasscode = Boolean(passcode && passcode.trim() !== '');
      return res.status(200).json({ settings: publicSettings, memories, requiresPasscode });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('vault handler error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
