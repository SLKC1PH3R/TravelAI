import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "TravelAI - Ton guide de voyage IA",
  description: "Decouvre les monuments du monde avec ton guide IA via la Lens Snapchat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={spaceGrotesk.className}>
      <body>{children}</body>
    </html>
  );
}
