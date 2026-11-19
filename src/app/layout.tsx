import type { Metadata, Viewport } from "next";
import "@fontsource-variable/lexend";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adding fractions with different bottoms",
  description: "A short interactive tutorial on adding fractions with different denominators, made for phones.",
};

export const viewport: Viewport = {
  themeColor: "#2b3bd6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
