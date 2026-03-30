import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import "./globals.css";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Plant World Map",
  description: "Share and discover plants around the world."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
        </div>
        <Header />
        <main className="pb-16 pt-8">
          <div className="shell">{children}</div>
        </main>
        <footer className="shell mb-8 mt-10 flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
          <Leaf className="h-4 w-4" />
          <span>Plant World Map</span>
        </footer>
      </body>
    </html>
  );
}
