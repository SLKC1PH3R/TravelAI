"use client";

import LegalPageLayout from "@/components/LegalPageLayout";
import { useLocale } from "@/contexts/LocaleContext";

function ContentFr({ locale }: { locale: string }) {
  return (
    <>
      <p>
        Une question sur TravelAI, un bug a signaler, ou une demande liee a tes donnees personnelles
        (acces, suppression de tes photos, export) ? Ecris-nous, on te repond au plus vite.
      </p>

      <h2>Par email</h2>
      <p>
        <a href="mailto:hello@travelai.digitalstack.cloud">hello@travelai.digitalstack.cloud</a>
      </p>

      <h2>Demandes liees a tes donnees (RGPD)</h2>
      <p>
        Pour toute demande d'acces, de rectification ou de suppression de tes donnees personnelles ou de tes
        photos, precise "Demande RGPD" dans l'objet de ton email a l'adresse ci-dessus. Nous repondons sous un
        delai maximum d'un mois, conformement a notre {" "}
        <a href={`/${locale}/confidentialite`}>politique de confidentialite</a>.
      </p>

      <h2>Assistance technique</h2>
      <p>
        Un souci avec la Lens Snapchat, la connexion, ou ton carnet de voyage PDF ? Decris le probleme le plus
        precisement possible (ce que tu faisais, l'appareil utilise) pour nous aider a le resoudre rapidement.
      </p>
    </>
  );
}

function ContentEn({ locale }: { locale: string }) {
  return (
    <>
      <p>
        Got a question about TravelAI, a bug to report, or a request related to your personal data (access,
        deletion of your photos, export)? Write to us, we'll get back to you as soon as possible.
      </p>

      <h2>By email</h2>
      <p>
        <a href="mailto:hello@travelai.digitalstack.cloud">hello@travelai.digitalstack.cloud</a>
      </p>

      <h2>Data-related requests (GDPR)</h2>
      <p>
        For any request to access, rectify, or delete your personal data or your photos, mention "GDPR Request" in
        the subject line of your email to the address above. We respond within a maximum of one month, in
        accordance with our {" "}
        <a href={`/${locale}/confidentialite`}>privacy policy</a>.
      </p>

      <h2>Technical support</h2>
      <p>
        Having trouble with the Snapchat Lens, signing in, or your PDF travel journal? Describe the issue as
        precisely as possible (what you were doing, the device used) so we can help resolve it quickly.
      </p>
    </>
  );
}

export default function ContactPage() {
  const { locale, dict } = useLocale();
  return (
    <LegalPageLayout title={dict.legal.contact.title} updated={dict.legal.contact.updated}>
      {locale === "en" ? <ContentEn locale={locale} /> : <ContentFr locale={locale} />}
    </LegalPageLayout>
  );
}
