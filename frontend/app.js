const songInput = document.getElementById("songInput");
const artistInput = document.getElementById("artistInput");
const submitButton = document.getElementById("submitButton");
const results = document.getElementById("results");

let selectedTrack = null;

// Enable submit button only when a song is entered
songInput.addEventListener("input", () => {
  submitButton.disabled = songInput.value.trim() === "";
});

// TEMP: Fake search results so we can design UX
songInput.addEventListener("blur", () => {
  results.innerHTML = "";

  if (!songInput.value.trim()) return;

  const mockResult = document.createElement("div");
  mockResult.className = "result-item";
  mockResult.textContent = `${songInput.value} – ${artistInput.value || "Unknown Artist"}`;

  mockResult.addEventListener("click", () => {
    selectedTrack = mockResult.textContent;
    submitButton.disabled = false;

    // Highlight selection
    document.querySelectorAll(".result-item").forEach(r => {
      r.style.outline = "none";
    });
    mockResult.style.outline = "2px solid #1db954";
  });

  results.appendChild(mockResult);
});

submitButton.addEventListener("click", () => {
  if (!selectedTrack) return;

  alert(`Submitted: ${selectedTrack}`);
  submitButton.disabled = true;
});

