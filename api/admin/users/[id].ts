import { NowRequest, NowResponse } from '@vercel/node';
import { db } from '../../../src/server/db';

export default function handler(req: NowRequest, res: NowResponse) {
  try {
    const { id } = req.query;
    const userId = Array.isArray(id) ? id[0] : (id as string);

    if (req.method === 'PUT') {
      const {
        creatorName,
        recipientName,
        creatorGender,
        partnerGender,
        relationshipStartDate,
        passcode,
        occasionDay,
        occasionTitle,
      } = req.body;

      const updatedUser = db.updateUser(userId, {
        creatorName,
        recipientName,
        creatorGender,
        partnerGender,
        relationshipStartDate,
        passcode,
        occasionDay,
        occasionTitle,
      });

      const updatedSettings = db.updateSettings({
        ...(creatorName && { creatorName }),
        ...(recipientName && { recipientName }),
        ...(creatorGender && { creatorGender }),
        ...(partnerGender && { partnerGender }),
        ...(relationshipStartDate && { relationshipStartDate }),
        ...(passcode && { passcode }),
        ...(occasionDay !== undefined && { occasionDay }),
        ...(occasionTitle !== undefined && { occasionTitle }),
      });

      return res.status(200).json({ success: true, user: updatedUser, settings: updatedSettings });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('admin/users/[id] error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
