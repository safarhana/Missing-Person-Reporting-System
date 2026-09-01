import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Missing Person Reporting System",
  description: "Advanced Programming in Web Technology - Missing Person Reporting System",
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
