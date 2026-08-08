import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import AtmosphericBackground from "@/components/experience/AtmosphericBackground";
import { AtmosphereColorProvider } from "@/lib/atmosphereColor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Full variable weight axis, kept separate from geistMono above so the
// site-wide static weight is untouched — only VariableProximity uses this.
const geistMonoVariable = Geist_Mono({
  variable: "--font-geist-mono-variable",
  subsets: ["latin"],
  weight: "variable",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Note Match — Find perfumes by scent notes",
  description: "Discover perfumes similar to the ones you love, matched by scent notes. India buy links included.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${geistMonoVariable.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AtmosphereColorProvider>
          <AtmosphericBackground />
          <CustomCursor />
          <Navigation />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </AtmosphereColorProvider>
      </body>
    </html>
  );
}
