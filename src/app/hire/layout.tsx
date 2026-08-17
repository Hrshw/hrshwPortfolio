import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Hire Rahul Singh Shekhawat | Project Brief",
  description:
    "Share your project brief — websites, features, integrations, and full builds. Rates and next steps inside.",
  path: "/hire",
  noIndex: true,
});

export default function HireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
