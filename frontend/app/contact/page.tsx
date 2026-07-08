import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Contact — TravelAI",
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="Contact" updated="7 juillet 2026">
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
        <a href="/confidentialite">politique de confidentialite</a>.
      </p>

      <h2>Assistance technique</h2>
      <p>
        Un souci avec la Lens Snapchat, la connexion, ou ton carnet de voyage PDF ? Decris le probleme le plus
        precisement possible (ce que tu faisais, l'appareil utilise) pour nous aider a le resoudre rapidement.
      </p>
    </LegalPageLayout>
  );
}
