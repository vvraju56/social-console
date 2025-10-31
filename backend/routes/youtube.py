from fastapi import APIRouter, HTTPException
from typing import Optional
from utils.http import client
from utils.supabase_client import supabase
from utils.config import settings

router = APIRouter()

YOUTUBE_API = "https://www.googleapis.com/youtube/v3"

@router.get("/profile")
async def youtube_profile(token: Optional[str] = None, user_id: Optional[str] = None, channel_id: Optional[str] = None):
    # OAuth path
    access_token = token
    if not access_token and user_id and supabase is not None:
        user = supabase.table("users").select("youtube_token").eq("id", user_id).single().execute().data
        if user and user.get("youtube_token"):
            access_token = user["youtube_token"].get("access_token")
    if access_token:
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {"part": "snippet,statistics", "mine": "true"}
        r = await client.get(f"{YOUTUBE_API}/channels", params=params, headers=headers)
        r.raise_for_status()
        return r.json()

    # API key public fallback
    if channel_id and settings.YOUTUBE_API_KEY:
        params = {"part": "snippet,statistics", "id": channel_id, "key": settings.YOUTUBE_API_KEY}
        r = await client.get(f"{YOUTUBE_API}/channels", params=params)
        r.raise_for_status()
        return r.json()

    raise HTTPException(status_code=400, detail="Provide token/user_id or channel_id with API key configured")

@router.get("/analytics")
async def youtube_analytics(token: Optional[str] = None, user_id: Optional[str] = None, channel_id: Optional[str] = None):
    # OAuth path
    access_token = token
    if not access_token and user_id and supabase is not None:
        user = supabase.table("users").select("youtube_token").eq("id", user_id).single().execute().data
        if user and user.get("youtube_token"):
            access_token = user["youtube_token"].get("access_token")
    if access_token:
        headers = {"Authorization": f"Bearer {access_token}"}
        search_params = {"part": "id", "forMine": True, "type": "video", "maxResults": 5, "order": "date"}
        sr = await client.get(f"{YOUTUBE_API}/search", params=search_params, headers=headers)
        sr.raise_for_status()
        items = sr.json().get("items", [])
        video_ids = ",".join([i["id"].get("videoId") for i in items if i.get("id") and i["id"].get("videoId")])
        if not video_ids:
            return {"items": []}
        vr = await client.get(f"{YOUTUBE_API}/videos", params={"part": "snippet,statistics", "id": video_ids}, headers=headers)
        vr.raise_for_status()
        return vr.json()

    # API key public fallback
    if channel_id and settings.YOUTUBE_API_KEY:
        # latest 5 videos from channel using search
        search_params = {
            "part": "id",
            "channelId": channel_id,
            "type": "video",
            "maxResults": 5,
            "order": "date",
            "key": settings.YOUTUBE_API_KEY,
        }
        sr = await client.get(f"{YOUTUBE_API}/search", params=search_params)
        sr.raise_for_status()
        items = sr.json().get("items", [])
        video_ids = ",".join([i["id"].get("videoId") for i in items if i.get("id") and i["id"].get("videoId")])
        if not video_ids:
            return {"items": []}
        vr = await client.get(
            f"{YOUTUBE_API}/videos",
            params={"part": "snippet,statistics", "id": video_ids, "key": settings.YOUTUBE_API_KEY},
        )
        vr.raise_for_status()
        return vr.json()

    raise HTTPException(status_code=400, detail="Provide token/user_id or channel_id with API key configured")
