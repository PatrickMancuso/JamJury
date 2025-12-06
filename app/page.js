// =======================
// app/page.js (Home Page)
// =======================
export default function Home() {
  return (
    <main className="min-h-screen p-6 flex flex-col items-center text-center max-w-sm mx-auto">
      <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Jam Jury</h1>

      <p className="text-gray-400 mb-10 leading-relaxed max-w-xs">
        The music party game where you judge your friends’ song picks — anonymously.
      </p>

      <div className="flex flex-col gap-4 w-full">
        <a href="/judge" className="btn btn-primary text-lg">
          Start as Judge
        </a>

        <a href="/player" className="btn btn-secondary text-lg">
          Join as Player
        </a>
      </div>
    </main>
  );
}
