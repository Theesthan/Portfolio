import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "S Theesthan — Data & AI Engineer",
  description:
    "Immersive WebGL portfolio of S Theesthan, Data & AI Engineer from PSG College of Technology, Coimbatore.",
  keywords: [
    "S Theesthan",
    "Data Engineer",
    "AI Engineer",
    "WebGL Portfolio",
    "PSG College of Technology",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
