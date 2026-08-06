import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Note Match — Find perfumes by scent notes",
  description: "Discover perfumes similar to the ones you love, matched by scent notes. India buy links included.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <header className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              🌸 Note Match
            </Link>
            <nav className="flex gap-5 text-sm font-medium text-neutral-600 dark:text-neutral-300">
              <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">
                Discover
              </Link>
              <Link href="/compare" className="hover:text-neutral-900 dark:hover:text-white">
                Compare
              </Link>
              <Link href="/collection" className="hover:text-neutral-900 dark:hover:text-white">
                My Collection
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 dark:border-neutral-800">
          Note Match · Perfume recommendations by scent notes · India buy links only, no live pricing
        </footer>
      </body>
    </html>
  );
}
