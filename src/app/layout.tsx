import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Music Mosh MAX — Discover Music Through 3D Visuals",
  description:
    "Every song has a story. What's yours? Discover music through an immersive, procedural 3D visual experience with real-time YouTube track discovery.",
  keywords: [
    "music",
    "discovery",
    "mood",
    "genre",
    "playlist",
    "YouTube",
    "immersive",
    "3D visuals",
    "procedural generation",
    "Three.js",
  ],
  authors: [{ name: "Music Mosh" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>",
  },
  openGraph: {
    title: "Music Mosh MAX",
    description: "Every song has a story. What's yours? Discover music through 3D visuals.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Music Mosh MAX — 3D Music Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music Mosh MAX",
    description: "Every song has a story. What's yours?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${spaceGrotesk.variable} antialiased noise-overlay`}
        style={{
          background: "#050508",
          color: "#ffffff",
          fontFamily: "var(--font-space-grotesk), sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
