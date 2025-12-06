// =======================
// app/player/page.js (Player Join Screen)
// =======================
"use client";
import { useState } from "react";


export default function PlayerPage() {
const [room, setRoom] = useState("");


return (
<main className="p-6 flex flex-col items-center text-center">
<h1 className="text-3xl font-bold mb-6">Join a Game</h1>


<input
value={room}
onChange={(e) => setRoom(e.target.value)}
placeholder="Enter Room Code"
className="p-3 bg-gray-800 rounded-xl text-center text-xl tracking-wide mb-6 w-40"
maxLength={4}
/>


<a
href={`/player/submit?room=${room}`}
className="bg-purple-600 py-3 px-8 rounded-xl text-lg font-semibold"
>
Join
</a>
</main>
);
}