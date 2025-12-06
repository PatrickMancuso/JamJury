// =======================
// app/page.js (Home Page)
// =======================
export default function Home() {
return (
<main className="p-6 flex flex-col items-center text-center">
<h1 className="text-4xl font-bold mb-6">Jam Jury</h1>
<p className="text-lg mb-10 text-gray-300">A party game where you judge your friends' music picks — anonymously.</p>


<div className="flex flex-col gap-4 w-full max-w-xs">
<a
href="/judge"
className="bg-purple-600 py-3 rounded-xl text-lg font-semibold text-center"
>
Start as Judge
</a>


<a
href="/player"
className="bg-gray-800 py-3 rounded-xl text-lg font-semibold text-center"
>
Join as Player
</a>
</div>
</main>
);
}