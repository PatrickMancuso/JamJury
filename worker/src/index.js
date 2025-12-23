export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- CORS ---
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // --- SEARCH ENDPOINT ---
    if (url.pathname === "/search") {
      const query = url.searchParams.get("q");
      if (!query) {
        return new Response("Missing query", { status: 400 });
      }

      const token = await getSpotifyToken(env);

      const spotifyRes = await fetch(
        `https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await spotifyRes.json();

      return new Response(JSON.stringify(data.tracks.items), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // --- SUBMIT ENDPOINT (for later queueing) ---
    if (url.pathname === "/submit" && request.method === "POST") {
      const body = await request.json();

      // For now, just acknowledge receipt
      return new Response(JSON.stringify({ success: true, body }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};

async function getSpotifyToken(env) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

