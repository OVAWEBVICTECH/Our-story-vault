import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const settings = db.updateSettings({
      creatorName: user.creatorName,
      recipientName: user.recipientName,
      creatorGender: user.creatorGender,
      partnerGender: user.partnerGender,
      relationshipStartDate: user.relationshipStartDate,
      passcode: user.passcode,
      vaultTitle: `${user.recipientName} & ${user.creatorName}'s Vault`,
      subtitle: `For my love, ${user.recipientName}`,
    });

    res.json({ success: true, user: { id: user.id, email: user.email, creatorName: user.creatorName, recipientName: user.recipientName }, settings });
  } catch (err: any) {
    console.error('signin handler error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
