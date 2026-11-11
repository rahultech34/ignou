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
  title: "IGNOU - Distance Education & Online Programs | Admission 2026-27",
  description:
    "Official Guide & Student Portal for IGNOU Distance & Online Degrees, MBA, BCA, MCA, Hall Tickets, Assignment Status & eGyanKosh Study Material.",
  verification: {
    google: "BCVtyQQNBt10FiEMIidFjjkHFOyol5Sr3yVt56op8uA",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="google-site-verification"
          content="BCVtyQQNBt10FiEMIidFjjkHFOyol5Sr3yVt56op8uA"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
