import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        r = await client.put(
            "http://127.0.0.1:8000/generate-all-premade-outfits",
            timeout=300.0
            )

asyncio.run(test())