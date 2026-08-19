"use client";

import { Suspense } from "react";
import ProfileSettings from "@/components/ProfileSettings";

export default function ProfilePage() {
  return (
    <Suspense fallback={<main className="px-6 py-10 text-sm text-slate-500">Chargement...</main>}>
      <ProfileSettings />
    </Suspense>
  );
}
