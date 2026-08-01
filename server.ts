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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
