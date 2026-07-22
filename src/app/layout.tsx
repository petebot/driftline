import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppShell } from "@/components/driftline/app-shell";
import { DriftlineProvider } from "@/components/driftline/driftline-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Driftline — Ocean research portfolio flow",
  description: "A fictional decision workspace for making research pipeline bottlenecks visible and actionable.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <DriftlineProvider>
          <AppShell>{children}</AppShell>
        </DriftlineProvider>
      </body>
    </html>
  );
}
