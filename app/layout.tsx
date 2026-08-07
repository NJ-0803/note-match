import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import NavLink from "@/components/NavLink";
import Footer from "@/components/Footer";
import WelcomeIntro from "@/components/WelcomeIntro";

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
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <WelcomeIntro />
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              🌸 Note Match
            </Link>
            <nav className="flex gap-6 text-sm font-medium">
              <NavLink href="/">Discover</NavLink>
              <NavLink href="/compare">Compare</NavLink>
              <NavLink href="/collection">My Collection</NavLink>
              <NavLink href="/about">About</NavLink>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
