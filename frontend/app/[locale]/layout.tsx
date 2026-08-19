import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import Providers from "@/components/Providers";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "TravelAI - Ton guide de voyage IA",
  description: "Decouvre les monuments du monde avec ton guide IA via la Lens Snapchat.",
};

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={spaceGrotesk.className}>
      <body>
        <Providers>
          <LocaleProvider locale={locale} dict={dict}>
            {children}
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
