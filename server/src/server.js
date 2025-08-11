import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createDb } from './storage/db.js';
import jobsRouter from './web/jobs.routes.js';
import printersRouter from './web/printers.routes.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// initialize DB
const db = createDb(join(__dirname, '../data/secureprint.db'));
app.set('db', db);

// routes
app.use('/api/jobs', (req, res, next) => { req.db = db; next(); }, jobsRouter);
app.use('/api/printers', (req, res, next) => { req.db = db; next(); }, printersRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

// Serve React build in production for internet-facing single URL
const buildDir = join(__dirname, '../../build');
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(join(buildDir, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SecurePrint backend running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});


