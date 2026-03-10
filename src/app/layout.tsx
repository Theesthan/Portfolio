import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://theesthan.dev"),
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
  openGraph: {
    title: "S Theesthan — Data & AI Engineer",
    description:
      "Immersive WebGL portfolio of S Theesthan, Data & AI Engineer from PSG College of Technology, Coimbatore.",
    type: "website",
    locale: "en_US",
    siteName: "S Theesthan Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "S Theesthan — Data & AI Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "S Theesthan — Data & AI Engineer",
    description:
      "Immersive WebGL portfolio of S Theesthan, Data & AI Engineer from PSG College of Technology, Coimbatore.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Skip navigation link for keyboard accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
