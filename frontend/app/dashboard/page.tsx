"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { fetchTrips, mergeTrips, type Trip } from "@/lib/api";
import StatsCards from "@/components/StatsCards";
import TravelBooklet from "@/components/TravelBooklet";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="px-6 py-10 text-sm text-slate-500">Chargement...</main>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialUuid = searchParams.get("uuid") || "";

  const [uuid, setUuid] = useState(initialUuid);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [mergeError, setMergeError] = useState<string | null>(null);

  function reloadTrips() {
    if (!uuid) return;
    setLoading(true);
    return fetchTrips(uuid)
      .then(setTrips)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reloadTrips();
  }, [uuid]);

  async function handleMerge(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMergeError(null);
    const form = new FormData(e.currentTarget);
    const startDate = form.get("startDate") as string;
    const endDate = form.get("endDate") as string;
    const title = form.get("title") as string;
    const country = (form.get("country") as string) || undefined;

    setMerging(true);
    try {
      await mergeTrips({
        uuid,
        title,
        startDate: new Date(`${startDate}T00:00:00`).toISOString(),
        endDate: new Date(`${endDate}T23:59:59`).toISOString(),
        country,
      });
      await reloadTrips();
      e.currentTarget.reset();
    } catch (err) {
      setMergeError(err instanceof Error ? err.message : "Erreur lors du regroupement");
    } finally {
      setMerging(false);
    }
  }

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

      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Regrouper mes voyages</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choisis une plage de dates pour reunir tous les monuments visites pendant cette periode dans un seul
          carnet (ex : du 26 au 30 juin en France).
        </p>
        <form onSubmit={handleMerge} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            name="title"
            required
            placeholder="Titre du voyage (ex: Road trip France)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            name="country"
            placeholder="Pays (optionnel, ex: France)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
          />
          <label className="flex flex-col text-xs text-slate-500">
            Du
            <input name="startDate" type="date" required className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col text-xs text-slate-500">
            Au
            <input name="endDate" type="date" required className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <button
            type="submit"
            disabled={merging}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 sm:col-span-2"
          >
            {merging ? "Regroupement..." : "Regrouper en un carnet"}
          </button>
          {mergeError && <p className="text-sm text-red-600 sm:col-span-2">{mergeError}</p>}
        </form>
      </div>

      <div className="mt-10 space-y-8">
        <h2 className="text-xl font-semibold">Mes voyages</h2>
        {trips.map((trip) => (
          <div key={trip.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">
                  {trip.title || [trip.city, trip.country].filter(Boolean).join(", ") || "Voyage"}
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
