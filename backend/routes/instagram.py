from fastapi import APIRouter, HTTPException
from typing import Optional
from utils.http import client
from utils.supabase_client import supabase

router = APIRouter()

FB_GRAPH = "https://graph.facebook.com/v19.0"
IG_GRAPH = FB_GRAPH  # same base

@router.get("/profile")
async def instagram_profile(ig_user_id: Optional[str] = None, token: Optional[str] = None, user_id: Optional[str] = None):
    access_token = token
    ig_uid = ig_user_id
    if (not access_token or not ig_uid) and user_id:
        user = supabase.table("users").select("instagram_token, ig_user_id").eq("id", user_id).single().execute().data
        if user:
            if not access_token and user.get("instagram_token"):
                access_token = user["instagram_token"].get("access_token")
            if not ig_uid:
                ig_uid = user.get("ig_user_id")
    if not access_token or not ig_uid:
        raise HTTPException(status_code=400, detail="Provide token+ig_user_id or user_id with stored values")
    fields = "id,username,followers_count,media_count,profile_picture_url"
    r = await client.get(f"{IG_GRAPH}/{ig_uid}", params={"fields": fields, "access_token": access_token})
    r.raise_for_status()
    return r.json()

@router.get("/media")
async def instagram_media(ig_user_id: Optional[str] = None, token: Optional[str] = None, user_id: Optional[str] = None):
    access_token = token
    ig_uid = ig_user_id
    if (not access_token or not ig_uid) and user_id:
        user = supabase.table("users").select("instagram_token, ig_user_id").eq("id", user_id).single().execute().data
        if user:
            if not access_token and user.get("instagram_token"):
                access_token = user["instagram_token"].get("access_token")
            if not ig_uid:
                ig_uid = user.get("ig_user_id")
    if not access_token or not ig_uid:
        raise HTTPException(status_code=400, detail="Provide token+ig_user_id or user_id with stored values")
    # Recent media fields
    fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count"
    r = await client.get(f"{IG_GRAPH}/{ig_uid}/media", params={"fields": fields, "access_token": access_token, "limit": 10})
    r.raise_for_status()
    return r.json()
