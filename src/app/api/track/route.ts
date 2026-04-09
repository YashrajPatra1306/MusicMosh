import { NextRequest, NextResponse } from "next/server";

const INSTANCES = [
  "https://inv.nadeko.net",
  "https://invidious.jing.rocks",
  "https://yewtu.be",
  "https://inv.vern.cc",
  "https://invidious.slipfox.xyz",
  "https://iv.ggtyler.dev",
];

const FALLBACK_VIDEOS: Record<string, string> = {
  "Hip-Hop": "https://www.youtube.com/watch?v=H5v3kku4y6Q",
  "Lo-Fi": "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  Synthwave: "https://www.youtube.com/watch?v=4tVg7X2qFgk",
  "Drum & Bass": "https://www.youtube.com/watch?v=hHcyJPTTn6A",
  Ambient: "https://www.youtube.com/watch?v=O4ZQv9hJF3E",
  Rock: "https://www.youtube.com/watch?v=1w7OgIMMRc4",
  Jazz: "https://www.youtube.com/watch?v=vmDDOFXSgAs",
  Electronic: "https://www.youtube.com/watch?v=9UaJAnnipkY",
  Classical: "https://www.youtube.com/watch?v=4Tr0otuiQuU",
  Trap: "https://www.youtube.com/watch?v=0UJSXgCTmRk",
};

interface VideoResult {
  videoId: string;
  title: string;
  author: string;
  lengthSeconds: number;
  viewCount: number;
  videoThumbnails?: Array<{ url: string }>;
}

interface TrackData {
  id: string | null;
  title: string;
  artist: string;
  thumb: string;
  url: string;
  viewCount: number;
  duration: number;
  isFallback?: boolean;
}

async function findSongByMoodGenre(
  mood: string,
  genre: string
): Promise<TrackData> {
  const queries = [
    `${mood} ${genre} song official audio`,
    `${mood} ${genre} official music video`,
    `"${genre}" ${mood} track`,
    `${genre} ${mood} song -remix -cover`,
  ];

  const shuffledInstances = [...INSTANCES].sort(() => Math.random() - 0.5);

  for (const query of queries) {
    for (const instance of shuffledInstances) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&sort_by=relevance`,
          { signal: controller.signal, headers: { "User-Agent": "MusicMosh/1.0" } }
        );

        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const data: VideoResult[] = await response.json();

        if (data && data.length) {
          const valid = data.filter(
            (v) =>
              v.lengthSeconds > 90 &&
              v.lengthSeconds < 600 &&
              v.viewCount > 5000 &&
              v.title &&
              !v.title.toLowerCase().includes("remix") &&
              !v.title.toLowerCase().includes("cover")
          );

          if (valid.length) {
            const best = valid.sort(
              (a, b) => b.viewCount - a.viewCount
            )[0];

            // Clean the thumbnail URL to use HTTPS
            let thumbUrl = best.videoThumbnails?.[0]?.url || "";
            if (thumbUrl && thumbUrl.startsWith("//")) {
              thumbUrl = "https:" + thumbUrl;
            } else if (thumbUrl && !thumbUrl.startsWith("http")) {
              thumbUrl = instance + thumbUrl;
            }

            return {
              id: best.videoId,
              title: best.title,
              artist: best.author,
              thumb: thumbUrl,
              url: `https://www.youtube.com/watch?v=${best.videoId}`,
              viewCount: best.viewCount,
              duration: best.lengthSeconds,
            };
          }
        }
      } catch {
        continue;
      }
    }
  }

  // Ultimate fallback
  const fallbackUrl =
    FALLBACK_VIDEOS[genre] || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  return {
    id: null,
    title: `${mood} ${genre} — Recommended Track`,
    artist: "Music Mosh Selection",
    thumb: "",
    url: fallbackUrl,
    viewCount: 100000,
    duration: 240,
    isFallback: true,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mood = searchParams.get("mood");
  const genre = searchParams.get("genre");
  const theme = searchParams.get("theme");

  if (!mood || !genre) {
    return NextResponse.json(
      { error: "Mood and Genre are required" },
      { status: 400 }
    );
  }

  try {
    const track = await findSongByMoodGenre(mood, genre);
    return NextResponse.json(track);
  } catch (error) {
    console.error("Track search error:", error);
    return NextResponse.json(
      { error: "Failed to find track" },
      { status: 500 }
    );
  }
}
