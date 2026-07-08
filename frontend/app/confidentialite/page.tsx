import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Politique de confidentialite — TravelAI",
};

export default function ConfidentialitePage() {
  return (
    <LegalPageLayout title="Politique de confidentialite" updated="7 juillet 2026">
      <p>
        Chez TravelAI, nous savons que notre service repose sur quelque chose de sensible : ta camera et tes photos.
        Cette page explique simplement et clairement quelles donnees nous traitons, pourquoi, et comment tu gardes le controle.
      </p>

      <h2>1. Donnees que nous collectons</h2>
      <ul>
        <li><strong>Photos prises via la Lens Snapchat</strong> : envoyees a notre IA (Google Gemini Vision) pour identifier le monument ou le lieu photographie.</li>
        <li><strong>Informations de compte</strong> : email, nom et photo de profil, recuperes via la connexion Google (OAuth) ou ton identifiant Snapchat.</li>
        <li><strong>Identifiant anonyme (UUID)</strong> : genere pour associer ton historique de decouvertes et ton carnet de voyage a ton compte, sans exposer de donnees personnelles a des tiers.</li>
        <li><strong>Donnees d'usage</strong> : pages visitees, monuments consultes, statistiques d'utilisation, a des fins d'amelioration du service.</li>
      </ul>

      <h2>2. Pourquoi nous traitons ces donnees (photos & camera)</h2>
      <p>
        Chaque photo prise dans la Lens est envoyee en temps reel a un service d'intelligence artificielle de vision
        (Google Gemini Vision) uniquement pour identifier le monument photographie et generer une reponse. Nous n'utilisons
        pas tes photos a des fins publicitaires et nous ne les revendons a aucun tiers.
      </p>
      <p>
        Les photos sont conservees le temps necessaire pour generer ton carnet de voyage PDF et ton historique de
        decouvertes. Tu peux a tout moment demander leur suppression (voir section 6).
      </p>

      <h2>3. Partage des donnees avec des tiers</h2>
      <p>Pour fonctionner, TravelAI s'appuie sur les prestataires suivants :</p>
      <ul>
        <li><strong>Snapchat / Snap Inc.</strong> : hebergement de la Lens et de la camera.</li>
        <li><strong>Google (Gemini Vision, Google OAuth)</strong> : analyse des photos et connexion via compte Google.</li>
        <li><strong>Notre hebergeur cloud</strong> : stockage securise des donnees de compte et des carnets de voyage generes.</li>
      </ul>
      <p>Chacun de ces prestataires est soumis a ses propres engagements de confidentialite et de securite.</p>

      <h2>4. Duree de conservation</h2>
      <p>
        Les donnees de compte et l'historique de decouvertes sont conserves tant que ton compte est actif. Les photos
        transmises pour l'analyse ne sont conservees que le temps necessaire a la generation du carnet de voyage,
        puis supprimees ou archivees de maniere securisee.
      </p>

      <h2>5. Tes droits (RGPD)</h2>
      <p>Conformement au Reglement General sur la Protection des Donnees, tu disposes des droits suivants :</p>
      <ul>
        <li>Droit d'acces a tes donnees personnelles ;</li>
        <li>Droit de rectification en cas d'information inexacte ;</li>
        <li>Droit a l'effacement ("droit a l'oubli"), y compris de tes photos ;</li>
        <li>Droit a la portabilite de tes donnees ;</li>
        <li>Droit d'opposition et de limitation du traitement.</li>
      </ul>

      <h2>6. Comment exercer tes droits</h2>
      <p>
        Pour toute demande relative a tes donnees personnelles (acces, suppression de tes photos, export, etc.),
        contacte-nous a <a href="mailto:hello@travelai.digitalstack.cloud">hello@travelai.digitalstack.cloud</a>.
        Nous repondons a toute demande dans un delai maximum d'un mois.
      </p>

      <h2>7. Securite</h2>
      <p>
        Nous mettons en oeuvre des mesures techniques et organisationnelles raisonnables (chiffrement des connexions,
        acces restreint aux donnees) pour proteger tes informations contre tout acces non autorise, perte ou alteration.
      </p>

      <h2>8. Mineurs</h2>
      <p>
        TravelAI n'est pas destine aux personnes de moins de 13 ans. Si tu penses qu'un mineur nous a transmis des
        donnees sans consentement parental, contacte-nous afin que nous procedions a leur suppression.
      </p>

      <h2>9. Modifications de cette politique</h2>
      <p>
        Cette politique peut evoluer pour refleter des changements legaux ou fonctionnels. La date de derniere mise
        a jour est indiquee en haut de cette page. En cas de changement significatif, nous t'en informerons via
        l'application.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question relative a cette politique de confidentialite : {" "}
        <a href="mailto:hello@travelai.digitalstack.cloud">hello@travelai.digitalstack.cloud</a>.
      </p>
    </LegalPageLayout>
  );
}
