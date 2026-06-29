// Doit correspondre aux settings.demo_* dans backend/config.py.
// Isole dans son propre fichier (sans import de next-auth) pour pouvoir etre
// importe aussi bien cote client (boutons "Voir le compte demo") que dans lib/auth.ts.
export const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "John_the_traveler@gmail.com";
export const DEMO_NAME = "John";
export const DEMO_AVATAR = "/voyageur.jpg";
export const DEMO_LOGIN = "John_around_the_world";
export const DEMO_PSEUDO = "John";
