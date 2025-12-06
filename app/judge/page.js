// =======================
// app/judge/page.js (Judge Screen)
// =======================
"use client";
import { useState } from "react";


export default function JudgePage() {
const [roomCode, setRoomCode] = useState(null);
const [isLoggedIn, setIsLoggedIn] = useState(false);


const handleLogin = async () => {
// TODO: Redirect to Spotify OAuth
setIsLoggedIn(true);
setRoomCode(Math.floor(1000 + Math.random() * 9000));
};


return (
<main className="p-6 flex flex-col text-center items-center">
<h1 className="text-3xl font-bold mb-6">Judge Panel</h1>


{!isLoggedIn ? (
<button
onClick={handleLogin}
className="bg-green-500 py-3 px-6 rounded-xl text-lg font-semibold"
>
Login with Spotify
</button>
) : (
<div>
<p className="text-xl mb-3">Room Code:</p>
<div className="text-5xl font-bold tracking-widest mb-8">{roomCode}</div>


<a
href={`/judge/round?room=${roomCode}`}
className="bg-purple-600 py-3 px-10 rounded-xl text-lg font-semibold"
>
Start Round
</a>
</div>
)}
</main>
);
}