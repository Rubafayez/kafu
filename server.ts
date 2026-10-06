import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { app } from './api-app';

const PORT = Number(process.env.PORT) || 3000;

/**
 * Start Server with Vite Middleware
 */
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`كفء Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
