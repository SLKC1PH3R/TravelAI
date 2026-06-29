import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Connexion par email simplifiee (sans mot de passe, sans lien magique).
    // Pour une vraie auth par email (magic link), il faudra brancher un adapter
    // de base de donnees NextAuth (ex: @auth/pg-adapter) + un serveur SMTP.
    Credentials({
      id: "email",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email) return null;
        return {
          id: credentials.email as string,
          email: credentials.email as string,
          name: (credentials.email as string).split("@")[0],
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.anonymousUuid) {
        token.anonymousUuid = session.anonymousUuid as string;
        return token;
      }
      if (trigger === "signIn" && (user?.email || token.email)) {
        try {
          const res = await fetch(
            `${API_URL}/users/by-email?email=${encodeURIComponent((user?.email || token.email) as string)}`
          );
          token.anonymousUuid = res.ok ? (await res.json()).anonymous_uuid : undefined;
        } catch {
          token.anonymousUuid = undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.anonymousUuid = token.anonymousUuid as string | undefined;
      return session;
    },
  },
});
