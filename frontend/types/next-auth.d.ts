import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      anonymousUuid?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    anonymousUuid?: string;
  }
}
