# Social Console

🚀 **Advanced Social Media Analytics Dashboard** - A production-ready, comprehensive free alternative to console.linktodm.com for both YouTube and Instagram creators.

## ✨ Features

### 🎯 Core Analytics
- **Multi-Platform Support**: Connect both YouTube and Instagram accounts
- **Real-time Data**: Live data refresh with customizable intervals (15s to 5m)
- **Advanced Metrics**: Engagement rates, growth trends, performance insights
- **Date Range Filtering**: 24h, 7d, 30d, 90d, and all-time views

### 📊 Advanced Features
- **Competitor Analysis**: Track and compare against competitors
- **Multi-Account Management**: Manage multiple channels/accounts
- **Smart Notifications**: Customizable alerts for milestones and performance changes
- **Data Export**: CSV, JSON, and Excel downloads
- **Professional Charts**: Line, bar, and doughnut charts with Chart.js

### 🎨 User Experience
- **Modern UI**: Dark mode with responsive design
- **Two Dashboard Views**: Overview and Advanced Analytics
- **Mobile Friendly**: Works on all devices
- **Fast Performance**: Optimized with Next.js 14

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + Tailwind CSS + Chart.js + React 18
- **Backend**: FastAPI (Python) + httpx
- **Database**: Supabase (free tier)
- **Hosting**: Vercel (frontend), Render (backend)
- **Authentication**: OAuth 2.0 (Google & Meta)

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

## 🚀 Quick Deployment

### Option 1: One-Click Deploy (Recommended)
1. **Frontend**: Deploy to Vercel
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   - Import frontend/ directory to Vercel
   - Set NEXT_PUBLIC_API_BASE_URL environment variable

2. **Backend**: Deploy to Render
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
   - Create Web Service from backend/ directory
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option 2: Manual Setup
```bash
# Frontend
cd frontend
npm install
npm run dev  # http://localhost:3000

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000  # http://localhost:8000
```

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

## 🔧 API Endpoints

### YouTube
- `GET /api/youtube/profile` - Channel information
- `GET /api/youtube/analytics` - Video analytics with date_range support

### Instagram  
- `GET /api/instagram/profile` - Business profile data
- `GET /api/instagram/media` - Recent media posts

### Authentication
- `GET /auth/google/url` - YouTube OAuth URL
- `GET /auth/meta/url` - Instagram OAuth URL
- `GET /auth/{provider}/callback` - OAuth callback

## 📋 Requirements

### Platform Setup
- **Google Cloud**: YouTube Data API v3 + OAuth Consent Screen
- **Meta for Developers**: Instagram Graph API + Facebook Login
- **Supabase**: Free tier project (setup included in supabase.sql)

### Instagram Requirements
- Business account required for follower counts
- Connected to Facebook Page
- Instagram Graph API permissions

## 🆚 Comparison with console.linktodm.com

| Feature | Social Console (Free) | console.linktodm.com |
|---------|---------------------|---------------------|
| Multi-Platform | ✅ YouTube + Instagram | ❓ Limited |
| Real-time Refresh | ✅ Customizable intervals | ❓ Basic |
| Competitor Analysis | ✅ Full comparison | ❓ Premium |
| Data Export | ✅ CSV, JSON, Excel | ❓ Premium |
| Multi-Account | ✅ Unlimited | ❓ Limited |
| Cost | **100% Free** | 💰 Premium |

## 🔒 Security Notes
- OAuth tokens stored securely in Supabase
- Consider field-level encryption for production
- Regular token refresh implemented
- HTTPS required for production

## 🎯 Use Cases
- Content creators tracking performance
- Social media managers handling multiple accounts
- Digital marketing agencies
- Influencers analyzing growth
- Businesses managing brand presence
