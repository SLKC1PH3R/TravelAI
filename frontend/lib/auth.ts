import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { DEMO_AVATAR, DEMO_EMAIL, DEMO_NAME } from "@/lib/demo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Reserve au compte de demonstration : aucun mot de passe n'est verifie,
    // donc ce provider ne doit jamais accepter d'email autre que DEMO_EMAIL
    // (sinon n'importe qui pourrait s'authentifier en tapant n'importe quel email).
    Credentials({
      id: "email",
      name: "Demo",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      authorize: async (credentials) => {
        if (credentials?.email !== DEMO_EMAIL) return null;
        return {
          id: DEMO_EMAIL,
          email: DEMO_EMAIL,
          name: DEMO_NAME,
          image: DEMO_AVATAR,
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
      if (trigger === "update" && session) {
        if (session.anonymousUuid) token.anonymousUuid = session.anonymousUuid as string;
        if (typeof session.isAdmin === "boolean") token.isAdmin = session.isAdmin;
        if (typeof session.name === "string") token.name = session.name;
        if (typeof session.image === "string") token.picture = session.image;
        return token;
      }
      if (trigger === "signIn" && (user?.email || token.email)) {
        try {
          const res = await fetch(
            `${API_URL}/users/by-email?email=${encodeURIComponent((user?.email || token.email) as string)}`
          );
          if (res.ok) {
            const data = await res.json();
            token.anonymousUuid = data.anonymous_uuid;
            token.isAdmin = Boolean(data.is_admin);
          } else {
            token.anonymousUuid = undefined;
            token.isAdmin = false;
          }
        } catch {
          token.anonymousUuid = undefined;
          token.isAdmin = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.anonymousUuid = token.anonymousUuid as string | undefined;
      session.user.isAdmin = Boolean(token.isAdmin);
      return session;
    },
  },
});
