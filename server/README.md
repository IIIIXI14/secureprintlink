# Secure Print Link Backend

Node/Express + SQLite backend for cross-device release links.

## Run

1. Install dependencies
```
cd server
npm install
```

2. Start server
```
npm run dev
```

Server runs at http://localhost:4000

## Env

- PORT (default 4000)
- MAX_UPLOAD_BYTES (default 20MB)

## Endpoints

- POST /api/jobs (multipart/form-data)
  - fields: userId, userName, documentName, pages, copies, color, duplex, stapling, priority, notes
  - file: `file`
  - returns: { jobId, token, releaseLink }
- GET /api/jobs/:id?token=...
- POST /api/jobs/:id/release  { token, printerId, releasedBy }
- POST /api/jobs/:id/complete
- GET/POST/PATCH/DELETE /api/printers


