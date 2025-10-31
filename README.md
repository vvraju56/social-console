# Social Console

A production-ready, free-to-deploy social media dashboard connecting YouTube and Instagram for analytics.

Tech stack:
- Frontend: Next.js + Tailwind CSS + Chart.js
- Backend: FastAPI (Python) + httpx
- Database: Supabase (free tier)
- Hosting: Vercel (frontend), Render (backend)

## Project structure

social-console/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── next.config.js
│   └── .env.example
├── backend/
│   ├── main.py
│   ├── routes/
│   │   ├── youtube.py
│   │   └── instagram.py
│   ├── utils/
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── http.py
│   │   └── supabase_client.py
│   ├── requirements.txt
│   ├── Procfile
│   ├── render.yaml
│   └── .env.example
└── supabase.sql

## Prerequisites
- Node.js 18+
- Python 3.10+
- Supabase project (free tier)
- Google Cloud project (OAuth consent + YouTube Data API v3 enabled)
- Meta app (Facebook Login + Instagram Graph API enabled)

## Supabase schema
Apply the SQL in supabase.sql to create required tables.

## Local development

Frontend
1. cd frontend
2. Copy .env.example to .env.local and fill values
3. npm install
4. npm run dev

Backend
1. cd backend
2. Copy .env.example to .env and fill values
3. python -m venv .venv && source .venv/bin/activate (Windows: .venv\Scripts\Activate.ps1)
4. pip install -r requirements.txt
5. uvicorn main:app --host 0.0.0.0 --port 8000 --reload

## Environment variables
See backend/.env.example and frontend/.env.example.

## Deployment

Frontend (Vercel):
- Import frontend/ directory in Vercel, set NEXT_PUBLIC_API_BASE_URL to your Render backend URL.

Backend (Render):
- New Web Service from backend/ repo dir
- Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
- Environment: supply .env vars (use Render secrets)

## Test with curl
Replace placeholders as needed.

YouTube
- Get profile using token: 
  curl "https://YOUR_BACKEND/api/youtube/profile?token=YA29..."
- Get analytics for latest 5 videos:
  curl "https://YOUR_BACKEND/api/youtube/analytics?token=YA29..."

Instagram
- Get profile (business):
  curl "https://YOUR_BACKEND/api/instagram/profile?ig_user_id=1789...&token=EAA..."
- Get media:
  curl "https://YOUR_BACKEND/api/instagram/media?ig_user_id=1789...&token=EAA..."

## OAuth login flows
- Google: GET /auth/google/url → redirect user; callback at /auth/google/callback stores token and redirects to FRONTEND_ORIGIN
- Meta: GET /auth/meta/url → redirect user; callback at /auth/meta/callback stores token and IG user ID

## Notes
- For Instagram follower counts, an Instagram Business account connected to a Facebook Page is required.
- Secure storage is via Supabase; consider adding KMS or field-level encryption for tokens in production.
