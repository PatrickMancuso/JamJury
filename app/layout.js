// =======================
// app/layout.js
// =======================
// =======================
// app/layout.js
// =======================
import "./globals.css";

export const metadata = {
  title: "Jam Jury",
  description: "A music party game where players anonymously submit songs for judgment.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans min-h-screen">
        {/* Main wrapper for animations & shared layout */}
        <div id="app-container" className="relative flex flex-col min-h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
