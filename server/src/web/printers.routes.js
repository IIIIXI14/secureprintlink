import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();

router.get('/', (req, res) => {
  const db = req.db;
  const printers = db.prepare('SELECT * FROM printers').all().map(p => ({
    ...p,
    capabilities: p.capabilities ? JSON.parse(p.capabilities) : []
  }));
  res.json({ printers });
});

router.post('/', (req, res) => {
  const db = req.db;
  const { name, location, model, status = 'online', ip, capabilities = [], department = 'All' } = req.body || {};
  const id = nanoid();
  db.prepare(`INSERT INTO printers (id, name, location, model, status, ip, capabilities, department)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, name, location, model, status, ip, JSON.stringify(capabilities), department);
  res.json({ printer: { id, name, location, model, status, ip, capabilities, department } });
});

router.patch('/:id', (req, res) => {
  const db = req.db;
  const { id } = req.params;
  const { status } = req.body || {};
  db.prepare('UPDATE printers SET status = ? WHERE id = ?').run(status, id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  const db = req.db;
  const { id } = req.params;
  db.prepare('DELETE FROM printers WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;


