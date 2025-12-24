let accessToken = null;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // -------------------------------
    // LOGIN (redirect to Spotify)
    // -------------------------------
    if (url.pathname === "/login") {
      const scopes = "user-modify-playback-state user-read-playback-state";

      const authUrl =
        "https://accounts.spotify.com/authorize?" +
        new URLSearchParams({
          response_type: "code",
          client_id: env.SPOTIFY_CLIENT_ID,
          scope: scopes,
          redirect_uri: env.SPOTIFY_REDIRECT_URI,
        });

      return Response.redirect(authUrl, 302);
    }

    // -------------------------------
    // CALLBACK (Spotify redirects here)
    // -------------------------------
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");

      const tokenRes = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            Authorization:
              "Basic " +
              btoa(
                `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
              ),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: env.SPOTIFY_REDIRECT_URI,
          }),
        }
      );

      const tokenData = await tokenRes.json();

      // TEMP: store token in memory (OK for testing)
      env.ACCESS_TOKEN = tokenData.access_token;

      return Response.redirect("https://jamjury.pages.dev/?host", 302);
    }

    // -------------------------------
    // SEARCH (client credentials)
    // -------------------------------
    if (url.pathname === "/search") {
      const query = url.searchParams.get("q");
      if (!query) return new Response("Missing query", { status: 400 });

      const token = await getAppToken(env);

      const res = await fetch(
        `https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      return new Response(JSON.stringify(data.tracks.items), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // -------------------------------
    // QUEUE (host only)
    // -------------------------------
    if (url.pathname === "/queue" && request.method === "POST") {
      const body = await request.json();

      await fetch(
        `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(
          body.uri
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.ACCESS_TOKEN}`,
          },
        }
      );

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};

async function getAppToken(env) {
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
