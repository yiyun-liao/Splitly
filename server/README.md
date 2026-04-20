# Splitly Backend - Deployment Notes

## Architecture

- Frontend: Vercel (https://vercel.com/bians-projects-ca3ac511/splitly)
- Backend: Render (https://dashboard.render.com/)
- Database: Render Free PostgreSQL
- Auth: Firebase

## Before a Demo / Interview

Server sleeps after 15 min idle. Wake it up 5 min before:

```
Open: https://splitly-api-eskz.onrender.com/
See: {"message": "Hello from Splitly backend"} → Ready
```

## If DB Expires (every 90 days)

Render free PostgreSQL expires after 90 days. To recover:

1. Render Dashboard → New → PostgreSQL → Free plan
2. Update the `DATABASE_URL` env var in splitly-api service (point to new DB)
3. Redeploy (alembic will create tables automatically)
4. Seed demo data:

```bash
curl -X POST "https://splitly-api-eskz.onrender.com/api/demo/seed?secret=YOUR_SEED_SECRET"
```

(SEED_SECRET is stored in Render Environment Variables)

## Environment Variables (Render)

| Key | Description |
|-----|-------------|
| ENV | `production` |
| DATABASE_URL | Auto-linked from Render PostgreSQL |
| FIREBASE_CREDENTIALS_JSON | Firebase admin SDK JSON content |
| SEED_SECRET | Secret for /api/demo/seed endpoint |
| PYTHON_VERSION | `3.11` |
