import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { slug, senderName, message, favoriteMemoryId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const settings = db.getSettings(slug || 'our-story');
    const reply = db.addReply({
      vaultSlug: slug || 'our-story',
      senderName: senderName || settings.recipientName || 'My Love',
      message,
      favoriteMemoryId,
    });

    res.json({ success: true, reply });
  } catch (err: any) {
    console.error('reply handler error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
