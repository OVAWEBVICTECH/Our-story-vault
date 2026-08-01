import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { slug, passcode } = req.body;
    const settings = db.getSettings(slug || 'our-story');

    if (!settings.passcode || settings.passcode.trim() === '') {
      return res.json({ success: true });
    }

    if (settings.passcode === passcode) {
      return res.json({ success: true });
    }

    return res.status(401).json({ success: false, error: 'Incorrect secret key passcode' });
  } catch (err: any) {
    console.error('verify-passcode error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
