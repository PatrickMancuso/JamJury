// =======================
// app/player/submit/page.js (Song Submission)
// =======================
"use client";
import { useState } from "react";


export default function SubmitPage() {
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);


const handleSearch = async () => {
// TODO: Make backend request to Spotify search
setResults([
{ id: 1, title: "Sample Song", artist: "Example Artist" },
]);
};


return (
<main className="p-6">
<h1 className="text-3xl font-bold text-center mb-6">Submit a Song</h1>


<input
value={query}
onChange={(e) => setQuery(e.target.value)}
placeholder="Search song..."
className="p-3 bg-gray-800 rounded-xl w-full mb-4"
/>


<button
onClick={handleSearch}
className="bg-purple-600 w-full py-3 rounded-xl font-semibold mb-6"
>
Search
</button>


<div className="flex flex-col gap-4">
{results.map((track) => (
<button
key={track.id}
className="bg-gray-900 p-4 rounded-xl text-left"
>
<div className="text-lg font-semibold">{track.title}</div>
<div className="text-sm text-gray-400">{track.artist}</div>
</button>
))}
</div>
</main>
);
}