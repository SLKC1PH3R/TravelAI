import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TravelAI - Ton guide de voyage IA",
  description: "Decouvre les monuments du monde avec ton guide IA via la Lens Snapchat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
