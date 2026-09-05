import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "FIRECYCLE AI - Territorial Forest Intelligence & Bioeconomy Platform",
  description: "Integrated platform for wildfire prevention, forest management, and bioeconomy coordination",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
