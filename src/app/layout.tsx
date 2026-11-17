import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Living Room | Custom Apparel",
  description: "Create, customize and order apparel from The Living Room."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
