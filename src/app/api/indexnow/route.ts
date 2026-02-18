import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "shipsquad-indexnow-key";
const SITE_HOST = "shipsquad.ai";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INDEXNOW_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const urls: string[] = body.urls;

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json(
      { error: "urls array is required" },
      { status: 400 }
    );
  }

  // IndexNow accepts max 10,000 URLs per request
  const batches: string[][] = [];
  for (let i = 0; i < urls.length; i += 10000) {
    batches.push(urls.slice(i, i + 10000));
  }

  const results = [];

  for (const batch of batches) {
    const payload = {
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: batch.map((url) =>
        url.startsWith("http") ? url : `https://${SITE_HOST}${url}`
      ),
    };

    try {
      const res = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      results.push({
        status: res.status,
        urls: batch.length,
        ok: res.status === 200 || res.status === 202,
      });
    } catch (error) {
      results.push({
        status: 500,
        urls: batch.length,
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    submitted: urls.length,
    batches: results,
  });
}
