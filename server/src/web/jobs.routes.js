import { Router } from 'express';
import { nanoid } from 'nanoid';
import multer from 'multer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, '../../uploads');
const upload = multer({ dest: uploadsDir, limits: { fileSize: +(process.env.MAX_UPLOAD_BYTES || 20 * 1024 * 1024) } });

const router = Router();

// Create job
// Create job (multipart/form-data supported)
router.post('/', upload.single('file'), (req, res) => {
  const db = req.db;
  const body = req.body || {};
  const userId = body.userId;
  const userName = body.userName;
  const documentName = body.documentName || (req.file?.originalname || 'Document');
  const pages = +(body.pages ?? 1);
  const copies = +(body.copies ?? 1);
  const color = body.color === 'true' || body.color === true;
  const duplex = body.duplex === 'true' || body.duplex === true;
  const stapling = body.stapling === 'true' || body.stapling === true;
  const priority = body.priority || 'normal';
  const notes = body.notes || '';

  if (!userId || !documentName) return res.status(400).json({ error: 'Missing fields' });

  const id = nanoid();
  const secureToken = nanoid(32);
  // Prefer explicit public base URL if provided (useful behind tunnels/proxies)
  const forwardedProto = req.headers['x-forwarded-proto'];
  const forwardedHost = req.headers['x-forwarded-host'];
  const host = forwardedHost || req.headers.host;
  const protocol = forwardedProto || (req.secure ? 'https' : 'http');
  const computedOrigin = `${protocol}://${host}`;
  const origin = process.env.PUBLIC_BASE_URL || req.headers.origin || computedOrigin || `http://localhost:${process.env.PORT || 4000}`;
  const releaseLink = `${origin.replace(/\/$/, '')}/release/${id}?token=${secureToken}`;

  const baseCost = 0.10;
  const colorMultiplier = color ? 2 : 1;
  const duplexMultiplier = duplex ? 0.8 : 1;
  const cost = +(baseCost * pages * copies * colorMultiplier * duplexMultiplier).toFixed(2);

  const stmt = db.prepare(`INSERT INTO jobs (
    id, userId, documentName, pages, copies, color, duplex, stapling, priority, notes,
    status, cost, submittedAt, secureToken, releaseLink
  ) VALUES (@id, @userId, @documentName, @pages, @copies, @color, @duplex, @stapling, @priority, @notes,
    'pending', @cost, @submittedAt, @secureToken, @releaseLink)`);

  stmt.run({
    id, userId, documentName, pages, copies,
    color: color ? 1 : 0, duplex: duplex ? 1 : 0, stapling: stapling ? 1 : 0,
    priority, notes, cost,
    submittedAt: new Date().toISOString(),
    secureToken, releaseLink
  });

  res.json({
    success: true,
    job: { id, userId, documentName, pages, copies, color, duplex, stapling, priority, notes, status: 'pending', cost, submittedAt: new Date().toISOString(), secureToken, releaseLink,
      file: req.file ? { filename: req.file.filename, originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size } : null }
  });
});

// Get job by id + token
router.get('/:id', (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const { token } = req.query;
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  if (token && token !== job.secureToken) return res.status(403).json({ error: 'Invalid token' });
  res.json({ job });
});

// Release job (requires token)
router.post('/:id/release', (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const { token, printerId, releasedBy } = req.body || {};
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  if (job.status !== 'pending') return res.status(400).json({ error: 'Not pending' });
  if (!token || token !== job.secureToken) return res.status(403).json({ error: 'Invalid token' });

  db.prepare('UPDATE jobs SET status = ?, releasedAt = ?, printerId = ?, releasedBy = ? WHERE id = ?')
    .run('printing', new Date().toISOString(), printerId || null, releasedBy || null, id);

  res.json({ success: true });
});

// Complete job (simulate)
router.post('/:id/complete', (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE jobs SET status = ?, completedAt = ? WHERE id = ?')
    .run('completed', new Date().toISOString(), id);
  res.json({ success: true });
});

export default router;


