import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const DATA_DIR = path.resolve(process.cwd(), 'data');
  const DB_FILE = path.join(DATA_DIR, 'baalvarta_database.json');

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

  // API 3: Health check
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
