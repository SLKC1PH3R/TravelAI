"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchTrips, type Trip } from "@/lib/api";

export default function TripsPage() {
  return (
    <Suspense fallback={<main className="px-6 py-10 text-sm text-slate-500">Chargement...</main>}>
      <TripsContent />
    </Suspense>
  );
}

function TripsContent() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid") || "";
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (!uuid) return;
    fetchTrips(uuid).then(setTrips);
  }, [uuid]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">Mes voyages</h1>

      {!uuid && <p className="mt-4 text-sm text-slate-500">Ajoute ?uuid=... a l&apos;URL pour voir tes voyages.</p>}

      <div className="mt-6 space-y-4">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`/carnet/${trip.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50"
          >
            <h2 className="text-lg font-semibold">
              {trip.city}, {trip.country}
            </h2>
            <p className="text-sm text-slate-500">
              {new Date(trip.started_at).toLocaleDateString("fr-FR")} - {trip.monuments.length} monument(s)
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
