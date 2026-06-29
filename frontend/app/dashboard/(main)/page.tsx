"use client";

import { Suspense } from "react";
import TravelAIDashboard from "@/components/TravelAIDashboard";

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="px-6 py-10 text-sm text-slate-500">Chargement...</main>}>
      <TravelAIDashboard />
    </Suspense>
  );
}
