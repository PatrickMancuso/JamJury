const songInput = document.getElementById("songInput");
const artistInput = document.getElementById("artistInput");
const submitButton = document.getElementById("submitButton");
const results = document.getElementById("results");

let selectedTrack = null;

const API_BASE = "https://YOUR-WORKER-URL.workers.dev";

// Enable submit button only when a song is entered
songInput.addEventListener("input", () => {
  submitButton.disabled = true;
});

// Real Spotify search
songInput.addEventListener("input", async () => {
  results.innerHTML = "";
  selectedTrack = null;

  if (!songInput.value.trim()) return;

  const query = `${songInput.value} ${artistInput.value}`.trim();

  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  const tracks = await res.json();

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
});

submitButton.addEventListener("click", async () => {
  if (!selectedTrack) return;

  await fetch(`${API_BASE}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(selectedTrack),
  });

  alert("Song submitted!");
  submitButton.disabled = true;
});
