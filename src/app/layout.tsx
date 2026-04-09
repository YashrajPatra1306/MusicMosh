import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Mosh MAX — Immersive Music Discovery",
  description:
    "Every song has a story. What's yours? Discover music through an immersive, storytelling-driven experience.",
  keywords: [
    "music",
    "discovery",
    "mood",
    "genre",
    "playlist",
    "YouTube",
    "immersive",
  ],
  authors: [{ name: "Music Mosh" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>",
  },
  openGraph: {
    title: "Music Mosh MAX",
    description: "Every song has a story. What's yours?",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "#050508", color: "#ffffff" }}
      >
        {children}
      </body>
    </html>
  );
}
