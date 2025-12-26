const songInput = document.getElementById("songInput");
const submitButton = document.getElementById("submitButton");
const results = document.getElementById("results");
const hostLoginButton = document.getElementById("hostLogin");

let selectedTrack = null;

// Cloudflare Worker URL
const API_BASE = "https://jamjury.pama1549.workers.dev";

const logoutButton = document.getElementById("logoutHost");

async function checkHostStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    const data = await res.json();

    if (data.loggedIn) {
      hostLoginButton.classList.add("hidden");
      logoutButton.classList.remove("hidden");
    } else {
      hostLoginButton.classList.remove("hidden");
      logoutButton.classList.add("hidden");
    }
  } catch (err) {
    console.error("Failed to check host status");
  }
}


// Login as host (Spotify OAuthh)
hostLoginButton.addEventListener("click", () => {
  window.location.href = `${API_BASE}/login`;
});

logoutButton.addEventListener("click", async () => {
  await fetch(`${API_BASE}/logout`);
  checkHostStatus();
});


// 🔍 Search Spotify as user types
songInput.addEventListener("input", async () => {
  results.innerHTML = "";
  selectedTrack = null;
  submitButton.disabled = true;

const query = songInput.value.trim();
  if (!query) return;

  try {
    const res = await fetch(
      `${API_BASE}/search?q=${encodeURIComponent(query)}`
    );

    if (!res.ok) throw new Error("Search failed");

    const tracks = await res.json();

    if (!tracks.length) {
      results.innerHTML = `<div class="result-item">No results found</div>`;
      return;
    }

    tracks.forEach(track => {
      const div = document.createElement("div");
      div.className = "result-item";
      div.textContent = `${track.name} – ${track.artists[0].name}`;

      div.addEventListener("click", () => {
        selectedTrack = track;
        submitButton.disabled = false;

        document.querySelectorAll(".result-item").forEach(r => {
          r.style.outline = "none";
        });
        div.style.outline = "2px solid #1db954";
      });

      results.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    results.innerHTML = `<div class="result-item">Error searching Spotify</div>`;
  }
});

// ➕ Add selected track to Spotify queue
submitButton.addEventListener("click", async () => {
  if (!selectedTrack) return;

  try {
    const res = await fetch(`${API_BASE}/queue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uri: selectedTrack.uri
      }),
    });

    if (!res.ok) throw new Error("Queue failed");

    alert("Added to Spotify queue!");

    submitButton.disabled = true;
    results.innerHTML = "";
    songInput.value = "";
    selectedTrack = null;
  } catch (err) {
    console.error(err);
    alert("Failed to add to queue");
  }
});


checkHostStatus();
