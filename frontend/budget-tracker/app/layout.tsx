import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P, JetBrains_Mono } from "next/font/google";
import PxlKitProvider from "@/components/PxlKitProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Track and manage your personal budget, expenses, and financial goals",
};

// Applies the .dark/.light class before paint so pxlkit's class-based theme
// tokens match the OS preference immediately, avoiding a flash of the wrong
// theme (pxlkit reads document.documentElement, not prefers-color-scheme).
const themeInitScript = `
(function () {
  try {
    var isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.add(isDark ? "dark" : "light");
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      document.documentElement.classList.toggle("dark", e.matches);
      document.documentElement.classList.toggle("light", !e.matches);
    });
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <PxlKitProvider>{children}</PxlKitProvider>
      </body>
    </html>
  );
}
