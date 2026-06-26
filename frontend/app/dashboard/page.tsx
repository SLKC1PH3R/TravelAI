"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fetchTrips, type Trip } from "@/lib/api";
import StatsCards from "@/components/StatsCards";
import TravelBooklet from "@/components/TravelBooklet";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const initialUuid = searchParams.get("uuid") || "";

  const [uuid, setUuid] = useState(initialUuid);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uuid) return;
    setLoading(true);
    fetchTrips(uuid)
      .then(setTrips)
      .finally(() => setLoading(false));
  }, [uuid]);

  const allMonuments = useMemo(() => trips.flatMap((t) => t.monuments), [trips]);
  const countriesCount = useMemo(() => new Set(trips.map((t) => t.country)).size, [trips]);
  const conversationsCount = useMemo(
    () => allMonuments.reduce((sum, m) => sum + m.conversations.length, 0),
    [allMonuments]
  );

  if (!uuid) {
    return (
      <main className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-2xl font-bold">Connecte ton compte Lens</h1>
        <p className="mt-2 text-sm text-slate-600">
          Entre l&apos;UUID anonyme genere par la Lens Snapchat pour retrouver tes voyages.
        </p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const value = new FormData(e.currentTarget).get("uuid") as string;
            setUuid(value);
          }}
        >
          <input name="uuid" required className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white">Valider</button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Mon tableau de bord</h1>

      {loading && <p className="mt-4 text-sm text-slate-500">Chargement...</p>}

      <div className="mt-6">
        <StatsCards
          monumentsCount={allMonuments.length}
          countriesCount={countriesCount}
          conversationsCount={conversationsCount}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Carte de mes monuments</h2>
        <div className="mt-3">
          <MapView monuments={allMonuments} />
        </div>
      </div>

      <div className="mt-10 space-y-8">
        <h2 className="text-xl font-semibold">Mes voyages</h2>
        {trips.map((trip) => (
          <div key={trip.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">
                  {trip.city}, {trip.country}
                </h3>
                <p className="text-sm text-slate-500">
                  {new Date(trip.started_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <Link href={`/carnet/${trip.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                Voir le carnet
              </Link>
            </div>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {trip.monuments.map((monument) => (
                <li key={monument.id}>
                  <Link
                    href={`/monuments/${monument.id}`}
                    className="block rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    {monument.name}
                    <span className="ml-2 text-xs text-slate-400">
                      {monument.photos.length} photo(s) - {monument.conversations.length} conversation(s)
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <TravelBooklet trip={trip} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
