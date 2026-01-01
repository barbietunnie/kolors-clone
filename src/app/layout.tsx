import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kolors - Color Palette Generator",
  description: "Generate beautiful color palettes for your designs. A fast, intuitive color tool for designers and developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
