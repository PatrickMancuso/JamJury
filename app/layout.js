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
<body className="bg-black text-white min-h-screen flex flex-col font-sans">{children}</body>
</html>
);
}