from urllib.parse import urlencode
from .config import settings
from .supabase_client import supabase
import requests

# Google OAuth (YouTube)

def get_google_auth_url() -> str:
    base = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": settings.YOUTUBE_CLIENT_ID,
        "redirect_uri": settings.YOUTUBE_REDIRECT_URI,
        "response_type": "code",
        "access_type": "offline",
        "prompt": "consent",
        "scope": "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.email openid",
    }
    return f"{base}?{urlencode(params)}"


def handle_google_callback(code: str) -> str:
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": settings.YOUTUBE_CLIENT_ID,
        "client_secret": settings.YOUTUBE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": settings.YOUTUBE_REDIRECT_URI,
    }
    tr = requests.post(token_url, data=data, timeout=20)
    tr.raise_for_status()
    token = tr.json()

    # fetch user info (email, sub)
    hr = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {token['access_token']}"},
        timeout=20,
    )
    hr.raise_for_status()
    userinfo = hr.json()

    # upsert user with YouTube token
    up = (
        supabase.table("users")
        .upsert(
            {
                "email": userinfo.get("email"),
                "google_sub": userinfo.get("sub"),
                "youtube_token": token,
            },
            on_conflict=["email"],
        )
        .execute()
    )
    user = up.data[0]
    # redirect to frontend with user_id
    return f"{settings.FRONTEND_ORIGIN}/?user_id={user['id']}"


# Meta (Facebook Login for IG Graph API)

def get_meta_auth_url() -> str:
    base = "https://www.facebook.com/v19.0/dialog/oauth"
    params = {
        "client_id": settings.INSTAGRAM_APP_ID,
        "redirect_uri": settings.META_REDIRECT_URI,
        "response_type": "code",
        "scope": "instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement",
    }
    return f"{base}?{urlencode(params)}"


def handle_meta_callback(code: str) -> str:
    # Exchange code for token
    token_url = "https://graph.facebook.com/v19.0/oauth/access_token"
    tr = requests.get(
        token_url,
        params={
            "client_id": settings.INSTAGRAM_APP_ID,
            "client_secret": settings.INSTAGRAM_APP_SECRET,
            "redirect_uri": settings.META_REDIRECT_URI,
            "code": code,
        },
        timeout=20,
    )
    tr.raise_for_status()
    token = tr.json()  # {access_token, token_type, expires_in}

    # Identify Meta user
    mr = requests.get(
        "https://graph.facebook.com/v19.0/me",
        params={"fields": "id,name", "access_token": token["access_token"]},
        timeout=20,
    )
    mr.raise_for_status()
    me = mr.json()
    meta_user_id = me.get("id")

    # Get pages
    pr = requests.get(
        "https://graph.facebook.com/v19.0/me/accounts",
        params={"access_token": token["access_token"]},
        timeout=20,
    )
    pr.raise_for_status()
    pages = pr.json().get("data", [])

    ig_user_id = None
    for p in pages:
        page_id = p.get("id")
        if not page_id:
            continue
        r = requests.get(
            f"https://graph.facebook.com/v19.0/{page_id}",
            params={"fields": "instagram_business_account", "access_token": token["access_token"]},
            timeout=20,
        )
        r.raise_for_status()
        ig = r.json().get("instagram_business_account")
        if ig and ig.get("id"):
            ig_user_id = ig["id"]
            break

    # Store token and ig_user_id
    up = (
        supabase.table("users")
        .upsert(
            {"meta_user_id": meta_user_id, "instagram_token": token, "ig_user_id": ig_user_id},
            on_conflict=["meta_user_id"],
            returning="representation",
        )
        .execute()
    )
    user = up.data[0]
    return f"{settings.FRONTEND_ORIGIN}/?user_id={user['id']}"
