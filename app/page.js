export default function Home() {
  return (
    <main className="page-container flex flex-col justify-center min-h-screen">
      
      {/* Title */}
      <h1 className="page-title">Jam Jury</h1>

      {/* Subtitle */}
      <p className="subtitle">
        The music party game where you judge your friends’ song picks — anonymously.
      </p>

      {/* Buttons */}
      <div className="v-stack mt-4">
        <a href="/judge" className="btn btn-primary glow">
          Start as Judge
        </a>

        <a href="/player" className="btn btn-secondary">
          Join as Player
        </a>
      </div>

    </main>
  );
}
