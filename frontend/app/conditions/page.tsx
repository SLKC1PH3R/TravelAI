import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Conditions d'utilisation — TravelAI",
};

export default function ConditionsPage() {
  return (
    <LegalPageLayout title="Conditions d'utilisation" updated="7 juillet 2026">
      <p>
        En utilisant TravelAI (la Lens Snapchat et le site web associe), tu acceptes les presentes conditions
        d'utilisation. Merci de les lire attentivement.
      </p>

      <h2>1. Description du service</h2>
      <p>
        TravelAI est un service qui identifie des monuments et lieux a partir de photos prises via une Lens Snapchat,
        genere des reponses grace a une intelligence artificielle, et permet de constituer un carnet de voyage PDF
        a partir de tes decouvertes.
      </p>

      <h2>2. Compte et eligibilite</h2>
      <p>
        L'utilisation du service necessite un compte Snapchat pour la Lens, et un compte Google pour acceder a ton
        historique et ton carnet de voyage sur le web. Tu dois avoir au moins 13 ans pour utiliser TravelAI.
      </p>

      <h2>3. Utilisation acceptable</h2>
      <p>Tu t'engages a ne pas :</p>
      <ul>
        <li>Utiliser le service a des fins illegales ou frauduleuses ;</li>
        <li>Tenter d'extraire, de perturber ou de contourner le fonctionnement technique du service ;</li>
        <li>Soumettre du contenu portant atteinte aux droits de tiers (image, propriete intellectuelle, vie privee).</li>
      </ul>

      <h2>4. Disponibilite du service</h2>
      <p>
        TravelAI est fourni en l'etat et peut evoluer, etre suspendu ou modifie a tout moment, notamment en
        raison de sa dependance a des services tiers (Snapchat, Google Gemini Vision). Nous ne garantissons pas
        une disponibilite continue ni l'absence totale d'erreurs d'identification par l'IA.
      </p>

      <h2>5. Propriete intellectuelle</h2>
      <p>
        Le contenu genere par l'IA (descriptions, reponses, carnets de voyage) t'est fourni pour un usage personnel
        et non commercial. La marque TravelAI, son interface et ses elements graphiques restent la propriete de
        leurs auteurs respectifs.
      </p>

      <h2>6. Services tiers</h2>
      <p>
        TravelAI s'appuie sur des services tiers (Snapchat, Google Gemini Vision, hebergement cloud) dont la
        disponibilite et le fonctionnement ne dependent pas uniquement de nous. Nous ne saurions etre tenus
        responsables d'une interruption ou d'une erreur provenant de ces services tiers.
      </p>

      <h2>7. Limitation de responsabilite</h2>
      <p>
        Les informations fournies par l'IA sont donnees a titre indicatif et peuvent contenir des inexactitudes.
        TravelAI ne saurait etre tenu responsable des decisions prises sur la base de ces informations, ni des
        dommages indirects lies a l'utilisation du service.
      </p>

      <h2>8. Suspension et resiliation</h2>
      <p>
        Nous nous reservons le droit de suspendre ou de supprimer un compte en cas de non-respect des presentes
        conditions. Tu peux a tout moment demander la suppression de ton compte et de tes donnees en nous
        contactant.
      </p>

      <h2>9. Droit applicable</h2>
      <p>
        Les presentes conditions sont regies par le droit francais. Tout litige relatif a leur interpretation ou
        execution sera soumis aux tribunaux competents.
      </p>

      <h2>10. Modifications</h2>
      <p>
        Ces conditions peuvent etre modifiees a tout moment. La date de derniere mise a jour figure en haut de
        cette page. En continuant a utiliser TravelAI apres une modification, tu acceptes les nouvelles conditions.
      </p>

      <h2>11. Contact</h2>
      <p>
        Pour toute question relative a ces conditions d'utilisation : {" "}
        <a href="mailto:hello@travelai.digitalstack.cloud">hello@travelai.digitalstack.cloud</a>.
      </p>
    </LegalPageLayout>
  );
}
