const songInput = document.getElementById("songInput");
const artistInput = document.getElementById("artistInput");
const submitButton = document.getElementById("submitButton");
const results = document.getElementById("results");

let selectedTrack = null;

//  Replace with your deployed Worker URL
const API_BASE = "https://YOUR-WORKER-URL.workers.dev";

// Handle search as user types
songInput.addEventListener("input", handleSearch);
artistInput.addEventListener("input", handleSearch);

async function handleSearch() {
  results.innerHTML = "";
  selectedTrack = null;
  submitButton.disabled = true;

  if (!songInput.value.trim()) return;

  const query = `${songInput.value} ${artistInput.value}`.trim();

  try {
    const res = await fetch(
      `${API_BASE}/search?q=${encodeURIComponent(query)}`
    );

    if (!res.ok) throw new Error("Search failed");

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
    results.innerHTML = `<div class="result-item">Error searching Spotify</div>`;
    console.error(err);
  }
}

// Submit selected song
submitButton.addEventListener("click", async () => {
  if (!selectedTrack) return;

  await fetch(`${API_BASE}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trackId: selectedTrack.id,
      name: selectedTrack.name,
      artist: selectedTrack.artists[0].name,
      uri: selectedTrack.uri,
    }),
  });

  alert("Song submitted!");
  submitButton.disabled = true;
});
