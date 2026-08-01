# Vercel serverless API

This branch adds serverless API handlers under `api/` so the frontend can call `/api/*` on the same domain when deployed to Vercel.

Notes:
- The project currently uses an in-memory database (src/server/db.ts). Serverless functions are ephemeral; memory is not a durable store. For production use, switch to an external database (Supabase, PostgreSQL, etc.).
- Set any required environment variables (GEMINI_API_KEY, etc.) in the Vercel project settings.
- Test locally with the Vercel CLI: `vercel dev`.
