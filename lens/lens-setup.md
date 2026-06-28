# TravelAI — Guide de configuration de la scene (Lens Studio 5.22)

Lens World (camera arriere). Toutes les valeurs ci-dessous supposent que
le **Canvas** a son **Offset Unit = Points** (voir `test-checklist.md`).

---

## 1. Hierarchie complete a creer

```
Scene
├── Camera Object (existant)
├── Lighting (existant)
└── Canvas (existant)
    ├── PanelResult         ← Screen Transform, enabled=false au depart
    │   ├── BgPanel         ← Screen Image, fond noir semi-transparent
    │   ├── TextMonumentName← Screen Text, jaune #FFFC00, taille 40, gras, Top
    │   └── TextResult      ← Screen Text, blanc, taille 28, scrollable
    ├── PanelInput          ← Screen Transform, toujours visible
    │   ├── BgInput         ← Screen Image, fond gris fonce
    │   └── TextQuestion    ← Screen Text, editable=true, placeholder gris
    ├── BtnCapture          ← Screen Image, cercle blanc, centre bas
    ├── BtnSend             ← Screen Image, fleche jaune, bas droite
    ├── BtnDashboard        ← Screen Image, globe blanc, bas gauche
    └── Spinner             ← Screen Image, animation rotation, centre
```

Chaque objet ci-dessus est un **Scene Object** place sous Canvas (clic
droit sur Canvas dans l'Objects panel -> `Screen Image` / `Screen Text`
selon le type). Les enfants (`BgPanel`, `TextMonumentName`, etc.) sont
ajoutes de la meme facon mais sous leur parent (`PanelResult` ou
`PanelInput`).

> Rappel important (5.22) : un `Screen Image` / `Screen Text` cree depuis
> le menu contextuel a deja son `Screen Transform` ajoute automatiquement
> — pas besoin d'ajouter le composant a la main.

---

## 2. Ce qu'il faut documenter pour chaque objet

**Screen Transform :**
- Anchor Point (ex : Bottom Center)
- Offset X, Offset Y (en points)
- Width, Height (en points, ou % via Anchors si tu preferes du relatif)
- Pivot

**Screen Text :**
- Font Size
- Color (RGBA)
- Horizontal / Vertical Alignment
- Overflow behavior
- Editable (oui/non — uniquement pour `TextQuestion`)

**Screen Image :**
- Texture (quelle image importer, voir `assets-required.md`)
- Color tint
- Stretch mode

---

## 3. Valeurs exactes par element

### PanelResult
```
Anchor:      Center
Offset Y:    +80 pt
Width:       90% ecran
Height:      45% ecran
Enabled:     false (au depart — controle par le script)
```

### BgPanel (enfant de PanelResult)
```
Anchor:      Fill parent (Stretch tous les bords a 0)
Texture:     bg_rounded.png (9-slice, voir assets-required.md)
Color tint:  rgba(0, 0, 0, 0.75)
```
Schema (vue ecran, zone hachuree = BgPanel) :
```
┌──────────────────────────────┐
│                                │  ← Canvas (ecran)
│   ░░░░░░░░░░░░░░░░░░░░░░░░    │
│   ░  TextMonumentName     ░    │  ← PanelResult (90% large, 45% haut)
│   ░                       ░    │
│   ░     TextResult        ░    │
│   ░░░░░░░░░░░░░░░░░░░░░░░░    │
│                                │
│        [ PanelInput ]         │
│                                │
│            ( O )              │ ← BtnCapture
└──────────────────────────────┘
```

### TextMonumentName (enfant de PanelResult)
```
Anchor:                Top Center (relatif au panel)
Offset Y:               -20 pt
Font Size:               40
Color:                   #FFFC00 -> RGBA(255, 252, 0, 255)
Bold:                    oui
Horizontal Alignment:    Center
Vertical Alignment:      Top
Overflow:                Truncate
```

### TextResult (enfant de PanelResult)
```
Anchor:                Center (relatif au panel)
Offset Y:               -20 pt
Width:                   85% du panel
Font Size:               26
Color:                   blanc -> RGBA(255, 255, 255, 255)
Horizontal Alignment:    Center
Vertical Overflow:       Scroll (ou Truncate si tu veux un texte court fixe)
```

### PanelInput
```
Anchor:      Bottom Center
Offset Y:    +160 pt depuis le bas
Width:       85% ecran
Height:      70 pt
```

### BgInput (enfant de PanelInput)
```
Anchor:      Fill parent
Color tint:  rgba(30, 30, 30, 0.9)
```

### TextQuestion (enfant de PanelInput)
```
Anchor:                Fill parent
Font Size:               28
Color:                   gris -> RGBA(150, 150, 150, 255)
Editable:                true  -> cocher "Editable" dans l'Inspector
Placeholder text:        "Pose une question..."
Horizontal Alignment:    Left
```

### BtnCapture
```
Anchor:      Bottom Center
Offset Y:    +60 pt
Width:       120 pt
Height:      120 pt
Texture:     btn_capture.png (cercle blanc)
Component:   + TouchComponent
```

### BtnSend
```
Anchor:      Bottom Right
Offset X:    -40 pt
Offset Y:    +70 pt
Width:       80 pt
Height:      80 pt
Texture:     btn_send.png
Color tint:  #FFFC00
Component:   + TouchComponent
Enabled:     false au depart (active par le script apres une analyse reussie)
```

### BtnDashboard
```
Anchor:      Bottom Left
Offset X:    +40 pt
Offset Y:    +70 pt
Width:       80 pt
Height:      80 pt
Texture:     btn_dashboard.png
Color tint:  blanc
Component:   + TouchComponent
Enabled:     false au depart (active par le script apres une analyse reussie)
```

### Spinner
```
Anchor:      Center
Width:       100 pt
Height:      100 pt
Texture:     spinner.png
Enabled:     false au depart
```
Ajoute un **deuxieme** script (separe de `AnalyzeController`) directement
sur l'objet `Spinner` pour la rotation continue :
```ts
// SpinnerRotation.ts
@component
export class SpinnerRotation extends BaseScriptComponent {
  onAwake() {
    this.createEvent("UpdateEvent").bind(() => {
      const t = this.getSceneObject().getTransform();
      t.setLocalRotation(quat.fromEulerAngles(0, 0, getTime() * -2));
    });
  }
}
```

---

## 4. Texture camera (necessaire pour que l'analyse fonctionne)

Le script `AnalyzeController.ts` a besoin d'un `@input cameraTexture` pour
pouvoir encoder l'image vue par la camera arriere avant de l'envoyer au
backend. Sans ca, le bouton Analyser n'a rien a analyser.

1. Dans l'**Asset Browser**, clic droit -> `Camera` -> **Device Camera
   Texture**. Lens Studio cree une texture qui reflete le flux video de
   la camera active (arriere, puisque c'est une World Lens).
2. Glisse cette texture sur le champ **cameraTexture** du composant
   `AnalyzeController` dans l'Inspector (voir section 6).

> Si tu utilises deja un objet `Camera Object` avec un material qui
> affiche le flux video (cas standard d'une World Lens), tu peux
> reutiliser la meme `Device Camera Texture` ici — pas besoin d'en
> creer une deuxieme.

---

## 5. Attacher le script

1. Selectionne **Canvas** dans l'Objects panel.
2. Inspector -> **Add Component** -> **Script** -> glisse
   `Assets/AnalyzeController.ts`.
3. Fais de meme sur l'objet **Spinner** avec `SpinnerRotation.ts`.

## 6. Assigner les @input dans l'Inspector (sur Canvas)

```
cameraTexture     -> Device Camera Texture (cree a l'etape 4)
textMonumentName  -> TextMonumentName (sous PanelResult)
textResult        -> TextResult (sous PanelResult)
textQuestion      -> TextQuestion (sous PanelInput)
btnCapture        -> BtnCapture
btnSend           -> BtnSend
btnDashboard      -> BtnDashboard
spinner           -> Spinner
panelResult       -> PanelResult (le SceneObject, pas un de ses enfants)
```

Glisse-depose chaque objet depuis l'Objects panel directement dans le
champ correspondant de l'Inspector — ne tape jamais le nom a la main.

---

## 7. Project Settings a verifier

`Project Settings` (icone engrenage en haut) :
- **Capabilities** -> active **Internet Access** (ajoute `InternetModule`
  comme Resource si ce n'est pas deja fait).
- **Remote Service Module** / liste blanche des domaines -> ajoute
  `travelai-api.digitalstack.cloud` (c'est le domaine de l'**API**, pas
  celui du site web — `global.openUrl` n'a pas besoin d'etre whitelist).

Voir `test-checklist.md` pour la liste complete avant publication.
