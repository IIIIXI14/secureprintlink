import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

export function createDb(dbPath) {
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      name TEXT,
      email TEXT,
      department TEXT,
      role TEXT,
      pin TEXT
    );

    CREATE TABLE IF NOT EXISTS printers (
      id TEXT PRIMARY KEY,
      name TEXT,
      location TEXT,
      model TEXT,
      status TEXT,
      ip TEXT,
      capabilities TEXT,
      department TEXT
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      userId TEXT,
      documentName TEXT,
      pages INTEGER,
      copies INTEGER,
      color INTEGER,
      duplex INTEGER,
      stapling INTEGER,
      priority TEXT,
      notes TEXT,
      status TEXT,
      cost REAL,
      submittedAt TEXT,
      releasedAt TEXT,
      completedAt TEXT,
      cancelledAt TEXT,
      printerId TEXT,
      releasedBy TEXT,
      secureToken TEXT,
      releaseLink TEXT
    );
  `);

  return db;
}


