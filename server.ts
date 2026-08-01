import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/server/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Helper to get Gemini client lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// =========================================
// AUTHENTICATION API ENDPOINTS
// =========================================

// Sign Up
app.post('/api/auth/signup', (req, res) => {
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

  // Also update default vault settings
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
    loveLetterBody: `${user.recipientName}, looking back at all the memories we've built together fills my heart with so much warmth. From quiet coffee mornings to starry late-night talks, every moment with you is a gift I cherish deeply.\n\nHappy National Girlfriend's Day, my love. Here's to endless more chapters of our story.`,
  });

  res.json({ success: true, user: { id: user.id, email: user.email, creatorName: user.creatorName, recipientName: user.recipientName }, settings: updatedSettings });
});

// Sign In
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // First check if signing in with system admin credentials
  if (db.verifyAdminCredentials(email, password)) {
    const adminCreds = db.getAdminCredentials();
    return res.json({
      success: true,
      isAdmin: true,
      user: {
        id: 'admin-1',
        email: adminCreds.email,
        creatorName: 'System Admin',
        recipientName: 'Story Vault Admin',
        role: 'admin',
      },
      settings: db.getSettings(),
    });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Load vault settings for user
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

  res.json({
    success: true,
    isAdmin: false,
    user: { id: user.id, email: user.email, creatorName: user.creatorName, recipientName: user.recipientName },
    settings,
  });
});

// =========================================
// PUBLIC VAULT API ENDPOINTS
// =========================================

// Get public vault data by slug
app.get('/api/vault/:slug', (req, res) => {
  const slug = req.params.slug || 'our-story';
  const settings = db.getSettings(slug);
  const memories = db.getMemories(slug, true); // only visible memories

  // Strip passcode from public settings response
  const { passcode, ...publicSettings } = settings;
  const requiresPasscode = Boolean(passcode && passcode.trim() !== '');

  res.json({
    settings: publicSettings,
    memories,
    requiresPasscode,
  });
});

// Verify passcode
app.post('/api/vault/verify-passcode', (req, res) => {
  const { slug, passcode } = req.body;
  const settings = db.getSettings(slug || 'our-story');

  if (!settings.passcode || settings.passcode.trim() === '') {
    return res.json({ success: true });
  }

  if (settings.passcode === passcode) {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, error: 'Incorrect secret key passcode' });
});

// Submit reply from girlfriend
app.post('/api/vault/reply', (req, res) => {
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
});

// =========================================
// ADMIN API ENDPOINTS (CMS)
// =========================================

// Get all memories for admin
app.get('/api/admin/memories', (req, res) => {
  const memories = db.getMemories('our-story', false);
  res.json({ memories });
});

// Create new memory
app.post('/api/admin/memories', (req, res) => {
  const newMem = db.createMemory(req.body);
  res.json({ memory: newMem });
});

// Update memory
app.put('/api/admin/memories/:id', (req, res) => {
  const updated = db.updateMemory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Memory not found' });
  }
  res.json({ memory: updated });
});

// Delete memory
app.delete('/api/admin/memories/:id', (req, res) => {
  const success = db.deleteMemory(req.params.id);
  res.json({ success });
});

// Reorder memories
app.post('/api/admin/memories/reorder', (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds must be an array' });
  }
  const memories = db.reorderMemories(orderedIds);
  res.json({ memories });
});

// Get admin settings
app.get('/api/admin/settings', (req, res) => {
  const settings = db.getSettings('our-story');
  res.json({ settings });
});

// Update admin settings
app.put('/api/admin/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ settings: updated });
});

// Get replies for admin
app.get('/api/admin/replies', (req, res) => {
  const replies = db.getReplies('our-story');
  res.json({ replies });
});

// Mark reply as read
app.patch('/api/admin/replies/:id/read', (req, res) => {
  const reply = db.markReplyAsRead(req.params.id);
  res.json({ reply });
});

// Get all users for admin studio
app.get('/api/admin/users', (req, res) => {
  const users = db.getAllUsers();
  res.json({ users });
});

// Update user details (including occasion day) in admin studio
app.put('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
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

  const updatedUser = db.updateUser(id, {
    creatorName,
    recipientName,
    creatorGender,
    partnerGender,
    relationshipStartDate,
    passcode,
    occasionDay,
    occasionTitle,
  });

  // Sync settings with updated user info
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

  res.json({ success: true, user: updatedUser, settings: updatedSettings });
});

// Get System Admin credentials (email only)
app.get('/api/admin/credentials', (req, res) => {
  const creds = db.getAdminCredentials();
  res.json({ email: creds.email });
});

// Update System Admin credentials (email and password)
app.put('/api/admin/credentials', (req, res) => {
  const { email, password, currentPassword } = req.body;

  const currentCreds = db.getAdminCredentials();
  if (currentPassword && currentPassword !== currentCreds.password) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  if (email && (!email.includes('@') || email.trim().length < 4)) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  if (password && password.trim().length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const updated = db.updateAdminCredentials({
    email,
    password,
  });

  res.json({ success: true, email: updated.email });
});

// Helper to generate wax seal love letter using Gemini AI based on occasion
async function generateLoveLetterForOccasion(
  occasionTitle: string = "National Girlfriend's Day",
  occasionDay: string = '2026-08-01',
  recipientName: string = 'Elena',
  creatorName: string = 'Alex'
): Promise<{ title: string; body: string }> {
  const defaultTitle = `To My Forever Love, ${recipientName}`;
  const defaultBody = `My Dearest ${recipientName},

On this special ${occasionTitle} (${occasionDay}), I want to take a quiet moment to tell you how truly deeply I love you. From the day our story began, every single moment shared with you has felt like a divine blessing crafted just for us.

You are my sunshine on dark days, my favorite song, and my forever safe haven. My heartfelt prayer for you today and every single day is that your life is filled with unshakeable peace, overflowing joy, divine protection, and endless love. May every step you take be blessed with grace, and may that gorgeous smile of yours never fade.

If loving you were a crime, I'd willingly serve a lifetime sentence without parole. They say nobody is perfect, but then I looked into your eyes and realized they clearly haven't met you yet!

Thank you for choosing me to walk this beautiful path beside you. Today, tomorrow, and for all our years to come, my heart belongs completely to you.

Forever and always yours,
${creatorName}`;

  const ai = getGeminiClient();
  if (!ai) {
    return { title: defaultTitle, body: defaultBody };
  }

  try {
    const prompt = `Write a deeply moving, romantic love letter for a wax-sealed envelope in a digital memory vault.
Occasion: "${occasionTitle}" (Date/Day: ${occasionDay})
Recipient Name: "${recipientName}"
Sender Name: "${creatorName}"

Instructions:
1. Make it custom tailored to "${occasionTitle}" (${occasionDay}).
2. Combine sweet words of affection, heartfelt prayer & blessings ("prayer punching" for her joy, peace, health, & protection), and 1-2 witty, romantic pickup lines woven in naturally.
3. Write with warm emotional depth, charm, and authenticity.
4. Keep it to around 150-250 words formatted into 4 readable paragraphs suitable for a wax-sealed love letter.
5. Address it to "${recipientName}" and sign off from "${creatorName}".
6. Return a short romantic letter title and the message body.

Return JSON format:
{
  "title": "Short romantic title",
  "body": "Full love letter text"
}`;

    // Fast 1000ms timeout race to prevent delay bugs when Gemini API is slow
    const aiPromise = ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    }).then((response) => {
      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.body) {
          return {
            title: parsed.title || defaultTitle,
            body: parsed.body,
          };
        }
      }
      return { title: defaultTitle, body: defaultBody };
    });

    const timeoutPromise = new Promise<{ title: string; body: string }>((resolve) =>
      setTimeout(() => resolve({ title: defaultTitle, body: defaultBody }), 1000)
    );

    return await Promise.race([aiPromise, timeoutPromise]);
  } catch (err) {
    console.error('Failed to auto-generate AI love letter:', err);
  }

  return { title: defaultTitle, body: defaultBody };
}

// Update occasion day directly & auto-generate wax seal love letter
app.put('/api/admin/occasion', async (req, res) => {
  const { occasionDay, occasionTitle } = req.body;

  const currentSettings = db.getSettings();
  const recipientName = currentSettings.recipientName || 'Elena';
  const creatorName = currentSettings.creatorName || 'Alex';

  // Auto-generate love letter tailored to the new occasion
  const generatedLetter = await generateLoveLetterForOccasion(
    occasionTitle || "National Girlfriend's Day",
    occasionDay || '2026-08-01',
    recipientName,
    creatorName
  );

  const updatedSettings = db.updateSettings({
    occasionDay,
    occasionTitle,
    loveLetterTitle: generatedLetter.title,
    loveLetterBody: generatedLetter.body,
  });

  // Update occasionDay on all registered users as well
  const users = db.getAllUsers();
  users.forEach((u) => {
    db.updateUser(u.id, { occasionDay, occasionTitle });
  });

  res.json({ success: true, settings: updatedSettings, users: db.getAllUsers() });
});

// Endpoint to manually AI auto-generate love letter matching occasion
app.post('/api/admin/ai/loveletter', async (req, res) => {
  const { occasionTitle, occasionDay, recipientName, creatorName } = req.body;

  const currentSettings = db.getSettings();
  const rName = recipientName || currentSettings.recipientName || 'Elena';
  const cName = creatorName || currentSettings.creatorName || 'Alex';
  const oTitle = occasionTitle || currentSettings.occasionTitle || "National Girlfriend's Day";
  const oDay = occasionDay || currentSettings.occasionDay || '2026-08-01';

  const letter = await generateLoveLetterForOccasion(oTitle, oDay, rName, cName);
  res.json({ success: true, letter });
});

// AI Caption Studio generation endpoint using Gemini API
app.post('/api/admin/ai/caption', async (req, res) => {
  const { title, tone, details, mediaType } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured yet
      const fallbackCaptions: Record<string, string> = {
        romantic: `Every moment spent with you in ${title || 'this memory'} feels like a beautiful dream I never want to wake up from.`,
        cute: `Looking back at ${title || 'this day'}, my heart still does a little happy dance! 💖`,
        funny: `Remember when we tried to take a cute pic here and ended up laughing uncontrollably? Classic us!`,
        poetic: `Like stars illuminating the quiet night, ${title || 'this memory'} shines timelessly in the gallery of my heart.`,
        nostalgic: `If I could turn back time, I'd relive ${title || 'this exact moment'} a million times over.`,
        playful: `Exhibit A: Proof that you make literally everything 10x more fun! ✨`,
        elegant: `A golden frame in our journey—${title || 'this day'} captured the pure elegance of our bond.`,
      };

      const caption = fallbackCaptions[tone as string] || fallbackCaptions['romantic'];
      return res.json({ caption, note: 'Generated using romantic template engine (Set GEMINI_API_KEY for custom Gemini responses).' });
    }

    const systemInstruction = `You are a romantic creative writer and relationship memory archivist. Your goal is to write a deeply personal, emotionally evocative memory caption for a digital vault created for National Girlfriend's Day.
The tone should strictly match the requested style:
- 'romantic': Tender, warm, deeply affectionate, expressive of unconditional love.
- 'cute': Adorable, sweet, filled with hearts and soft joy.
- 'funny': Playful, humorous, affectionate ribbing, joyful memory of laughing together.
- 'poetic': Atmospheric, lyrical, beautiful imagery, timeless phrasing.
- 'nostalgic': Warmly reflective, cherished throwback, remembering feelings and details.
- 'playful': Cheerful, energetic, fun teasing, lively.
- 'elegant': Sophisticated, graceful, timeless, polished.

Keep the caption between 2 to 4 sentences. Do NOT include markdown title headers or quotation marks. Output plain text caption only.`;

    const promptText = `Write a caption for the memory titled "${title || 'Special Moment'}" with media type "${mediaType || 'image'}".
Tone: ${tone || 'romantic'}.
Additional context/details: ${details || 'None provided'}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.9,
      },
    });

    const caption = response.text?.trim() || `Every moment with you in ${title} is unforgettable.`;
    res.json({ caption });
  } catch (err: any) {
    console.error('Gemini caption generation error:', err);
    res.status(500).json({ error: 'Failed to generate caption with AI', message: err?.message });
  }
});

// =========================================
// VITE MIDDLEWARE / PRODUCTION STATIC SERVER
// =========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);
    });
  }
}

if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;
