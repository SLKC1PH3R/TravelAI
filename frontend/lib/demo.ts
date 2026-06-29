// Doit correspondre a settings.demo_email dans backend/config.py.
// Isole dans son propre fichier (sans import de next-auth) pour pouvoir etre
// importe aussi bien cote client (bouton "Voir une demo") que dans lib/auth.ts.
export const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo.voyageur@travelai.app";
export const DEMO_NAME = "Voyageur TravelAI";
export const DEMO_AVATAR = "/voyageur.jpg";
