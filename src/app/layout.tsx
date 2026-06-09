import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import HUDHeader from "@/components/HUDHeader";

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Rahul Singh Shekhawat | Software & Cloud Engineer",
  description: "Portfolio of Rahul Singh Shekhawat, Software & Cloud Engineer specializing in Next.js, Node.js, AWS infrastructure, and AI integrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#030303] text-zinc-900 dark:text-zinc-200 transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <CustomCursor />
          <HUDHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
