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
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-black opacity-60 pointer-events-none"></div>

        {/* Main wrapper */}
        <div id="app-container" className="relative flex flex-col min-h-screen overflow-hidden">
          {children}
        </div>

      </body>
    </html>
  );
}
