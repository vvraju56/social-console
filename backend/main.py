from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
import os
from utils.config import settings
from routes.youtube import router as youtube_router
from routes.instagram import router as instagram_router
from utils.auth import get_google_auth_url, handle_google_callback, get_meta_auth_url, handle_meta_callback

app = FastAPI(title="Social Console API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(youtube_router, prefix="/api/youtube", tags=["youtube"])
app.include_router(instagram_router, prefix="/api/instagram", tags=["instagram"])

# OAuth endpoints
@app.get("/auth/google/url")
def google_auth_url():
    return {"url": get_google_auth_url()}

@app.get("/auth/google/callback")
def google_callback(code: str, state: str | None = None):
    redirect_to = handle_google_callback(code)
    return RedirectResponse(url=redirect_to)

@app.get("/auth/meta/url")
def meta_auth_url():
    return {"url": get_meta_auth_url()}

@app.get("/auth/meta/callback")
def meta_callback(code: str, state: str | None = None):
    redirect_to = handle_meta_callback(code)
    return RedirectResponse(url=redirect_to)
