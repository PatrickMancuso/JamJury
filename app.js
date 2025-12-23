const songInput = document.getElementById("songInput");
const artistInput = document.getElementById("artistInput");
const submitButton = document.getElementById("submitButton");
const results = document.getElementById("results");
const hostControls = document.getElementById("hostControls");
const playNextButton = document.getElementById("playNext");
const skipButton = document.getElementById("skip");

// Detect host mode via URL
const params = new URLSearchParams(window.location.search);
const isHost = params.has("host");

if (isHost) {
  hostControls.classList.remove("hidden");
}


let selectedTrack = null;

// CHANGE THIS once the Worker is deployed
const API_BASE = "https://jamjury.pama1549.workers.dev";

const hostLoginButton = document.getElementById("hostLogin");

if (isHost && hostLoginButton) {
  hostLoginButton.addEventListener("click", () => {
    window.location.href = `${API_BASE}/login`;
  });
}


// Search Spotify as user types
songInput.addEventListener("input", async () => {
  results.innerHTML = "";
  selectedTrack = null;
  submitButton.disabled = true;

  const query = `${songInput.value} ${artistInput.value}`.trim();
  if (!query) return;

  try {
    const res = await fetch(`${API_BASE}/queue`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uri: selectedTrack.uri
  }),
});


    if (!res.ok) {
      throw new Error("Search failed");
    }

    const tracks = await res.json();

    if (tracks.length === 0) {
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

// Submit selected track
submitButton.addEventListener("click", async () => {
  if (!selectedTrack) return;

  try {
    await fetch(`${API_BASE}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedTrack),
    });

    alert("Song submitted!");
    submitButton.disabled = true;
    results.innerHTML = "";
    songInput.value = "";
    artistInput.value = "";
    selectedTrack = null;
  } catch (err) {
    alert("Failed to submit song");
    console.error(err);
  }
});
