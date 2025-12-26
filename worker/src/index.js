
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
if (url.pathname === "/kv-test") {
  await env.HOST_KV.put("test", "working");
  const value = await env.HOST_KV.get("test");

 return new Response(JSON.stringify({ value }), {
  headers: {
    ...corsHeaders,
    "Content-Type": "application/json",
  },
});
}
// -------------------------------
// STATUS (is host logged in?)
// -------------------------------
if (url.pathname === "/status") {
  const token = await env.HOST_KV.get("host_access_token");

  return new Response(
    JSON.stringify({ loggedIn: Boolean(token) }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

// -------------------------------
// LOGOUT (clear host session)
// -------------------------------
if (url.pathname === "/logout") {
  await env.HOST_KV.delete("host_access_token");

  return new Response(
    JSON.stringify({ loggedOut: true }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
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

  if (!code) {
    return new Response(
      "Spotify login failed or was cancelled.",
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  const tokenRes = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          toBase64(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: env.SPOTIFY_REDIRECT_URI,
      }),
    }
  );

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    return new Response(
      `Spotify token exchange failed:\n${errorText}`,
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new Response(
      "Spotify response missing access_token",
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  await env.HOST_KV.put(
    "host_access_token",
    JSON.stringify({
      access_token: tokenData.access_token,
      expires_at: Date.now() + tokenData.expires_in * 1000,
    })
  );

  return Response.redirect(
    "https://patrickmancuso.github.io/JamJury/?host",
    302
  );
}



    // -------------------------------
    // SEARCH (client credentials)
    // -------------------------------
    if (url.pathname === "/search") {
      const query = url.searchParams.get("q");
      if (!query) {
       return new Response(
  "Missing query",
  {
    status: 400,
    headers: corsHeaders,
  }
);
      }

      const token = await getAppToken(env);

      const res = await fetch(
        `https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      return new Response(JSON.stringify(data.tracks.items), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // -------------------------------
    // QUEUE (host only)
    // -------------------------------
if (url.pathname === "/queue" && request.method === "POST") {
const stored = await env.HOST_KV.get("host_access_token");
if (!stored) {
  return new Response(
    JSON.stringify({ error: "No host logged in" }),
    {
      status: 401,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

const { access_token, expires_at } = JSON.parse(stored);

// Optional proactive expiry check
if (Date.now() > expires_at) {
  await env.HOST_KV.delete("host_access_token");
  return new Response(
    JSON.stringify({ error: "Host session expired" }),
    {
      status: 401,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

  

let body;
try {
  body = await request.json();
} catch {
  return new Response(
    JSON.stringify({ error: "Invalid JSON body" }),
    {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

if (!body?.uri) {
  return new Response(
    JSON.stringify({ error: "Missing track URI" }),
    {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

  const queueRes = await fetch(
    `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(
      body.uri
    )}`,
    {
      method: "POST",
      headers: {
Authorization: `Bearer ${access_token}`,
      },
    }
  );

 if (!queueRes.ok) {
  const text = await queueRes.text();

  // 🚨 TOKEN EXPIRED OR REVOKED
  if (queueRes.status === 401) {
    await env.HOST_KV.delete("host_access_token");

    return new Response(
      JSON.stringify({ error: "Host session expired" }),
      {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Other Spotify errors
  return new Response(
    JSON.stringify({ error: text }),
    {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}


  return new Response(JSON.stringify({ success: true }), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}



    return new Response(
  "Not found",
  {
    status: 404,
    headers: corsHeaders,
  }
);


async function getAppToken(env) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
  "Basic " +
  toBase64(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`),

      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("Failed to get Spotify app token");
  }
  const data = await res.json();
  return data.access_token;
}


function toBase64(str) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}
