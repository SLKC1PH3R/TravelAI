"use client";

import LegalPageLayout from "@/components/LegalPageLayout";
import { useLocale } from "@/contexts/LocaleContext";

function ContentFr() {
  return (
    <>
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

      <h2>2. Pourquoi nous traitons ces donnees (photos &amp; camera)</h2>
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
    </>
  );
}

function ContentEn() {
  return (
    <>
      <p>
        At TravelAI, we know our service relies on something sensitive: your camera and your photos.
        This page explains, simply and clearly, what data we process, why, and how you stay in control.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li><strong>Photos taken via the Snapchat Lens</strong>: sent to our AI (Google Gemini Vision) to identify the monument or place photographed.</li>
        <li><strong>Account information</strong>: email, name and profile picture, retrieved via Google sign-in (OAuth) or your Snapchat username.</li>
        <li><strong>Anonymous identifier (UUID)</strong>: generated to link your discovery history and travel journal to your account, without exposing personal data to third parties.</li>
        <li><strong>Usage data</strong>: pages visited, monuments viewed, usage statistics, for the purpose of improving the service.</li>
      </ul>

      <h2>2. Why we process this data (photos &amp; camera)</h2>
      <p>
        Every photo taken in the Lens is sent in real time to an AI vision service (Google Gemini Vision) solely to
        identify the photographed monument and generate a response. We do not use your photos for advertising
        purposes and we do not resell them to any third party.
      </p>
      <p>
        Photos are kept for as long as necessary to generate your PDF travel journal and discovery history. You can
        request their deletion at any time (see section 6).
      </p>

      <h2>3. Sharing data with third parties</h2>
      <p>To operate, TravelAI relies on the following providers:</p>
      <ul>
        <li><strong>Snapchat / Snap Inc.</strong>: hosting of the Lens and camera.</li>
        <li><strong>Google (Gemini Vision, Google OAuth)</strong>: photo analysis and sign-in via Google account.</li>
        <li><strong>Our cloud host</strong>: secure storage of account data and generated travel journals.</li>
      </ul>
      <p>Each of these providers is bound by its own confidentiality and security commitments.</p>

      <h2>4. Retention period</h2>
      <p>
        Account data and discovery history are kept for as long as your account is active. Photos submitted for
        analysis are kept only for as long as necessary to generate the travel journal, then deleted or securely
        archived.
      </p>

      <h2>5. Your rights (GDPR)</h2>
      <p>In accordance with the General Data Protection Regulation, you have the following rights:</p>
      <ul>
        <li>Right to access your personal data;</li>
        <li>Right to rectification in case of inaccurate information;</li>
        <li>Right to erasure ("right to be forgotten"), including your photos;</li>
        <li>Right to data portability;</li>
        <li>Right to object to and restrict processing.</li>
      </ul>

      <h2>6. How to exercise your rights</h2>
      <p>
        For any request relating to your personal data (access, deletion of your photos, export, etc.), contact us
        at <a href="mailto:hello@travelai.digitalstack.cloud">hello@travelai.digitalstack.cloud</a>.
        We respond to every request within a maximum of one month.
      </p>

      <h2>7. Security</h2>
      <p>
        We implement reasonable technical and organizational measures (encrypted connections, restricted data
        access) to protect your information against unauthorized access, loss or alteration.
      </p>

      <h2>8. Minors</h2>
      <p>
        TravelAI is not intended for people under 13 years old. If you believe a minor has provided us with data
        without parental consent, please contact us so we can delete it.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        This policy may evolve to reflect legal or functional changes. The last-updated date is shown at the top of
        this page. In case of a significant change, we will inform you via the app.
      </p>

      <h2>10. Contact</h2>
      <p>
        For any question relating to this privacy policy: {" "}
        <a href="mailto:hello@travelai.digitalstack.cloud">hello@travelai.digitalstack.cloud</a>.
      </p>
    </>
  );
}

export default function ConfidentialitePage() {
  const { locale, dict } = useLocale();
  return (
    <LegalPageLayout title={dict.legal.confidentialite.title} updated={dict.legal.confidentialite.updated}>
      {locale === "en" ? <ContentEn /> : <ContentFr />}
    </LegalPageLayout>
  );
}
