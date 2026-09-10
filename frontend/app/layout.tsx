import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Missing Person Reporting System",
  description: "A centralized platform to report, track, and manage missing person cases effectively.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
