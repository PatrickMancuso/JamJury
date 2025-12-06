// =======================
// app/player/page.js (Player Join Screen)
// =======================
"use client";
import { useState } from "react";

export default function PlayerPage() {
  const [room, setRoom] = useState("");

  return (
    <main className="min-h-screen p-6 flex flex-col items-center text-center max-w-sm mx-auto">
      <h1 className="text-3xl font-bold mb-8">Join a Game</h1>

      <input
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Room Code"
        maxLength={4}
        className="input text-center tracking-widest text-2xl mb-6 w-40"
      />

      <a
        href={`/player/submit?room=${room}`}
        className="btn btn-primary text-lg w-full"
      >
        Join
      </a>
    </main>
  );
}
