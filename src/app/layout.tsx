import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import HUDHeader from "@/components/HUDHeader";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { constructMetadata } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = constructMetadata();

// Matches the page background in each theme so mobile browser chrome blends in.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#030303" },
  ],
};

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
          <Footer />
        </ThemeProvider>
        {/* First-party, cookie-free page + event analytics. Served from
            /_vercel/* so it satisfies the Content-Security-Policy above. */}
        <Analytics />
      </body>
    </html>
  );
}
