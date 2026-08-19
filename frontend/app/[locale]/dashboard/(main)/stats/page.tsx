"use client";

import { Suspense } from "react";
import TravelAIStatsBento from "@/components/TravelAIStatsBento";

export default function StatsPage() {
  return (
    <Suspense fallback={<main className="px-6 py-10 text-sm text-slate-500">Chargement...</main>}>
      <TravelAIStatsBento />
    </Suspense>
  );
}
