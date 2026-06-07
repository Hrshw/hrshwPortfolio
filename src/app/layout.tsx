import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import HUDHeader from "@/components/HUDHeader";

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
    <html lang="en">
      <body>
        <CustomCursor />
        <HUDHeader />
        {children}
      </body>
    </html>
  );
}
