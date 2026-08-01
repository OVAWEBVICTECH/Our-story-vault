import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const {
      email,
      password,
      creatorName,
      recipientName,
      creatorGender,
      partnerGender,
      relationshipStartDate,
      passcode,
    } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = db.registerUser({
      email,
      password,
      creatorName: creatorName || 'Alex',
      recipientName: recipientName || 'Elena',
      creatorGender: creatorGender || 'Male',
      partnerGender: partnerGender || 'Female',
      relationshipStartDate: relationshipStartDate || new Date().toISOString().split('T')[0],
      passcode: passcode || '0801',
    });

    const updatedSettings = db.updateSettings({
      creatorName: user.creatorName,
      recipientName: user.recipientName,
      creatorGender: user.creatorGender,
      partnerGender: user.partnerGender,
      relationshipStartDate: user.relationshipStartDate,
      passcode: user.passcode,
      vaultTitle: `${user.recipientName} & ${user.creatorName}'s Vault`,
      subtitle: `For my love, ${user.recipientName}`,
      loveLetterTitle: `To My Forever & Always, ${user.recipientName} ❤️`,
      loveLetterBody: `${user.recipientName}, looking back at all the memories we've built together fills my heart with so much warmth...`,
    });

    res.json({ success: true, user: { id: user.id, email: user.email, creatorName: user.creatorName, recipientName: user.recipientName }, settings: updatedSettings });
  } catch (err: any) {
    console.error('signup handler error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
