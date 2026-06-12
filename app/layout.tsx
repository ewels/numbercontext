import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "numbercontext.com",
  description: "Convert bare numbers into sourced, physical, memorable scales.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
