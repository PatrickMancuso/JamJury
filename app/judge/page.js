// =======================
// app/judge/page.js (Judge Screen)
// =======================
"use client";
import { useState } from "react";

export default function JudgePage() {
  const [roomCode, setRoomCode] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setRoomCode(Math.floor(1000 + Math.random() * 9000));
  };

  return (
    <main className="min-h-screen p-6 max-w-sm mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">Judge Panel</h1>

      {!isLoggedIn ? (
        <button className="btn btn-green text-lg" onClick={handleLogin}>
          Login with Spotify
        </button>
      ) : (
        <>
          <p className="text-xl text-gray-300 mb-2">Room Code</p>

          <div className="text-6xl font-extrabold mb-8 tracking-widest">
            {roomCode}
          </div>

          <a
            href={`/judge/round?room=${roomCode}`}
            className="btn btn-primary text-lg"
          >
            Start Round
          </a>
        </>
      )}
    </main>
  );
}
