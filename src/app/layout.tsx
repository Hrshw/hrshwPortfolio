import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HUDHeader from "@/components/HUDHeader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { constructMetadata } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="bg-white dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <HUDHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
