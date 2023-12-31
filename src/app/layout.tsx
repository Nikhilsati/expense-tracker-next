"use client";
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: any) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <SessionProvider>
        <body
          className={cn(
            // "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
