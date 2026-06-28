# TravelAI — Assets PNG a creer/importer dans Lens Studio

Tous les PNG doivent avoir un **fond transparent** (alpha) sauf indication
contraire. Exporte-les depuis Figma/Photoshop/Illustrator en PNG-24 avec
canal alpha.

| Fichier            | Dimensions | Description visuelle |
|---------------------|------------|------------------------|
| `btn_capture.png`   | 200x200 px | Cercle blanc plein, bords nets, centre sur fond transparent — le gros bouton "obturateur". |
| `btn_send.png`      | 100x100 px | Fleche pointant vers la droite (style "envoyer"), trait simple ou plein, centree sur fond transparent. Sera teintee en jaune `#FFFC00` via Color tint, donc dessine-la en blanc ou gris clair. |
| `btn_dashboard.png` | 100x100 px | Icone globe/planete (contour simple), centree sur fond transparent. Dessine-la en blanc — elle reste blanche (pas de teinte). |
| `spinner.png`       | 150x150 px | Anneau avec une ouverture (~270° de cercle, comme une jauge de chargement), trait epais, sur fond transparent. La rotation est animee par script, pas par l'image. |
| `bg_rounded.png`     | 10x10 px   | Carre blanc plein avec coins arrondis (rayon ~3-4 px a cette echelle). Utilise comme texture **9-slice** pour `BgPanel` afin d'avoir des coins arrondis quel que soit le redimensionnement du panel. |

## Comment importer dans Lens Studio

1. Ouvre l'**Asset Browser** (panneau en bas de l'ecran).
2. Glisse-depose le fichier PNG directement depuis l'explorateur de
   fichiers Windows dans la zone de l'Asset Browser.
3. Lens Studio cree automatiquement une **Texture** a partir de l'image
   (meme nom que le fichier, sans l'extension).

## Comment assigner une texture a un Screen Image

1. Selectionne l'objet (ex : `BtnCapture`) dans l'Objects panel.
2. Dans l'Inspector, repere le composant **Image**.
3. Glisse la **Texture** depuis l'Asset Browser directement dans le
   champ **Texture** du composant Image.
4. Pour `bg_rounded.png`, change en plus le **Stretch Mode** du composant
   Image sur **9-Slice**, puis ajuste les marges (Border) dans
   l'Inspector pour que les coins ne soient pas deformes en s'etirant.

## Teinte de couleur (Color tint)

Le champ **Color** du composant Image (RGBA) multiplie la texture — une
texture blanche teintee en `#FFFC00` (255, 252, 0, 255) ressort jaune
plein. C'est pour ca que `btn_send.png` peut etre dessine en blanc/gris :
la teinte fait le reste.
