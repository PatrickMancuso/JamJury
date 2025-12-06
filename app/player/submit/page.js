// =======================
// app/player/submit/page.js (Song Submission)
// =======================
"use client";
import { useState } from "react";

export default function SubmitPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    setResults([{ id: 1, title: "Sample Song", artist: "Example Artist" }]);
  };

  return (
    <main className="min-h-screen p-6 max-w-sm mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Submit a Song</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search song…"
        className="input mb-4"
      />

      <button className="btn btn-primary mb-6" onClick={handleSearch}>
        Search
      </button>

      <div className="flex flex-col gap-4">
        {results.map((track) => (
          <div key={track.id} className="card-selectable">
            <div className="text-lg font-semibold">{track.title}</div>
            <div className="text-sm text-gray-400">{track.artist}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
