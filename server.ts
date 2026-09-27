import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const DATA_DIR = path.resolve(process.cwd(), 'data');
  const DB_FILE = path.join(DATA_DIR, 'baalvarta_database.json');

  // Initialize Google GenAI on server
  const ai = new GoogleGenAI();

  // Ensure persistent data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Parse large JSON payloads for stories and illustrations
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API 1: Get full persistent database
  app.get('/api/database', (_req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return res.json(parsed);
      }
      return res.json(null);
    } catch (err) {
      console.error('Failed to read database file:', err);
      return res.status(500).json({ error: 'Database read error' });
    }
  });

  // API 2: Save full or partial collections to database
  app.post('/api/database', (req, res) => {
    try {
      const updates = req.body;
      let currentDb: Record<string, any> = {};

      if (fs.existsSync(DB_FILE)) {
        try {
          const raw = fs.readFileSync(DB_FILE, 'utf-8');
          currentDb = JSON.parse(raw);
        } catch {
          currentDb = {};
        }
      }

      const merged = {
        ...currentDb,
        ...updates,
        _lastSaved: new Date().toISOString(),
      };

      fs.writeFileSync(DB_FILE, JSON.stringify(merged, null, 2), 'utf-8');
      return res.json({
        success: true,
        message: 'डेटाबेस सफलतापूर्वक सुरक्षित हो गया (Saved to Database)',
        lastSaved: merged._lastSaved,
      });
    } catch (err) {
      console.error('Failed to save to database file:', err);
      return res.status(500).json({ error: 'Database save error' });
    }
  });

  // API 3: Gemini AI Baalmitra Chatbot (Server-Side)
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, language = 'hi' } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // Format conversation history for @google/genai
      const formattedContents = messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content || '' }]
      }));

      const systemInstruction = `You are "AI बालमित्र (Baalmitra)" - an affectionate, knowledgeable, and joyful AI companion for kids and students on the Baalvarta (बालवार्ता - baalvarta.com) platform.
Your mission:
1. Explain Indian geography, states, union territories, historical monuments, famous places, and general knowledge in an exciting, easy-to-understand way.
2. Narrate moral stories, Panchatantra tales, Akbar-Birbal wisdom, Vikram-Betal, Tenali Raman, and inspirational stories for kids.
3. Teach science, nature, animals, universe, and good moral values (सदाचार, माता-पिता का आदर, सच बोलना, स्वच्छता, मित्रता).
4. Language style: Use warm, encouraging, simple, and child-friendly Hindi (or English if user asks in English). Use fun emojis (🌟, 🇮🇳, 📖, 🏰, 🦁, 🎈, 💡, 🛕) to make learning joyous and attractive.
5. Safety: Keep all content 100% wholesome, family-friendly, polite, and positive. Never use violence, hate speech, or inappropriate themes. Keep answers relatively concise and engaging for children.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || (language === 'hi' 
        ? 'नमस्ते नन्हे दोस्त! मैं आपका बालमित्र हूँ। क्या आप कोई कहानी सुनना चाहते हैं या किसी राज्य के बारे में जानना चाहते हैं? 🌟'
        : 'Hello young friend! I am Baalmitra. Would you like to hear a story or learn about India? 🌟');

      return res.json({ reply });
    } catch (err: any) {
      console.error('Gemini API chat error:', err);
      return res.status(500).json({
        error: 'AI service unavailable',
        reply: req.body?.language === 'en'
          ? 'Sorry little friend! Baalmitra is resting for a moment. Please try again in a little while! 🌟'
          : 'माफ कीजिए नन्हे दोस्त, बालमित्र से संपर्क करने में कुछ समस्या आई। कृपया थोड़ी देर बाद पुनः प्रयास करें। 🌟'
      });
    }
  });

  // API 4: Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Baalvarta Database & Web Engine',
      dbReady: fs.existsSync(DB_FILE),
      time: new Date().toISOString(),
    });
  });

  // Frontend routing: Vite middlewares in dev, static dist in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Baalvarta Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
