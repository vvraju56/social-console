import httpx

client = httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=10.0))
