# Splitly Backend - Deployment Notes

## Architecture

- Frontend: Vercel (https://vercel.com/bians-projects-ca3ac511/splitly)
- Backend: Render (https://dashboard.render.com/)
- Database: Supabase PostgreSQL (https://supabase.com/dashboard)
- Auth: Firebase

## Before a Demo / Interview

Render free tier server sleeps after 15 min idle. Wake it up 5 min before:

```
Open: https://splitly-api-eskz.onrender.com/
See: {"message": "Hello from Splitly backend"} → Ready
```

Supabase free tier pauses after 7 days of inactivity, but auto-resumes on the next request (may take a few seconds on first hit).

## Database (Supabase)

Connection string format (use **Transaction Pooler**, port 6543):

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

Find it in: Supabase Dashboard → Project Settings → Database → Connection string → URI (Transaction Pooler)

### If DB needs to be recreated

1. Create a new Supabase project (or reset the existing one)
2. Copy the Transaction Pooler connection string
3. Update `DATABASE_URL` in Render Dashboard → Environment
4. Redeploy (Alembic will run migrations automatically)
5. Seed demo data:

```bash
curl -X POST "https://splitly-api-eskz.onrender.com/api/demo/seed?secret=YOUR_SEED_SECRET"
```

## Environment Variables (Render)

| Key | Source | Description |
|-----|--------|-------------|
| ENV | `production` | Set directly in render.yaml |
| DATABASE_URL | Supabase | Transaction Pooler connection string (port 6543) |
| FIREBASE_CREDENTIALS_JSON | Firebase | Admin SDK JSON content |
| SEED_SECRET | Manual | Secret for `/api/demo/seed` endpoint |
| PYTHON_VERSION | `3.11` | Set directly in render.yaml |
