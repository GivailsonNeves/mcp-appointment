import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainFooter } from "@/components/app/main-footer";
import { MainMenu } from "@/components/app/main-menu";
import { ModalProvider } from "@/providers/modal-provider";
import { ChatProviderProvider } from "@/providers/chat-provider";
import { ApiKeyProvider } from "@/providers/api-key-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Appointment Scheduling System",
  description: "A simple appointment scheduling system built with Next.js, React, and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <MainMenu />
        <main className="p-5 ">
          <QueryProvider>
            <ModalProvider>
              <ApiKeyProvider>
                <ChatProviderProvider>
                  {children}
                  <MainFooter />
                </ChatProviderProvider>
              </ApiKeyProvider>
            </ModalProvider>
          </QueryProvider>
        </main>
      </body>
    </html>
  );
}
