# TravelAI — Checklist de test avant publication (Lens Studio 5.22)

## Configuration de la scene
- [ ] Canvas -> Offset Unit = **Points**
- [ ] Tous les elements UI sont des **Screen Image** / **Screen Text**
      (pas `Image`/`Text` 3D classiques)
- [ ] `PanelResult` -> Enabled = **false** au depart
- [ ] `Spinner` -> Enabled = **false** au depart
- [ ] `BtnSend` -> Enabled = **false** au depart
- [ ] `BtnDashboard` -> Enabled = **false** au depart

## Composants
- [ ] `TouchComponent` ajoute sur `BtnCapture`, `BtnSend`, `BtnDashboard`
- [ ] Script `AnalyzeController` attache au `Canvas`
- [ ] Script `SpinnerRotation` attache a `Spinner`
- [ ] Tous les `@input` de `AnalyzeController` assignes dans l'Inspector,
      y compris **`cameraTexture`** (Device Camera Texture) — c'est le
      plus facile a oublier et le script ne peut rien analyser sans lui
- [ ] `panelResult` pointe bien vers le **SceneObject** `PanelResult`
      (pas vers un de ses enfants comme `BgPanel`)

## Reseau / Project Settings
- [ ] `InternetModule` active dans **Project Settings** (Capabilities)
- [ ] `travelai-api.digitalstack.cloud` ajoute a la liste blanche des
      domaines (Remote Service Module) — c'est le domaine de l'**API**,
      pas celui du site (`travelai.digitalstack.cloud`)
- [ ] Le backend repond bien sur `https://travelai-api.digitalstack.cloud/health`
      (teste depuis un navigateur si besoin)

## Logs
- [ ] Logger Lens Studio ne montre **aucune erreur rouge** au chargement
      de la scene ni a l'appui sur les boutons

## Test fonctionnel en Preview
- [ ] Preview avec une photo/poster de monument (ex : Tour Eiffel) dans
      le champ de la camera -> appuyer **BtnCapture**
- [ ] Le spinner s'affiche pendant l'appel reseau
- [ ] `PanelResult` apparait avec un nom de monument dans
      `TextMonumentName` et un texte dans `TextResult`
- [ ] `BtnSend` et `BtnDashboard` deviennent actifs apres la reponse
- [ ] Taper une question dans `TextQuestion` puis appuyer `BtnSend` ->
      le texte passe a "..." puis se met a jour avec la reponse de l'IA
- [ ] Appuyer `BtnDashboard` ouvre bien
      `https://travelai.digitalstack.cloud/dashboard?uuid=...` dans le
      navigateur

## Test reel sur telephone
- [ ] Pairer le projet avec l'app Snapchat (bouton **Send to Snapchat**
      ou QR code de pairage dans Lens Studio)
- [ ] Refaire le test complet (capture -> resultat -> question -> dashboard)
      en conditions reelles, camera arriere, sur un vrai monument ou une
      photo affichee sur un autre ecran
- [ ] Verifier la latence reseau ressentie (le backend + Gemini Vision
      peuvent prendre quelques secondes — le spinner doit rester visible
      tout ce temps, pas de plantage si la reponse met >5s)
