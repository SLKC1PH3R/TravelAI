"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { fetchTrip, type Trip } from "@/lib/api";
import PhotoGallery from "@/components/PhotoGallery";
import ConversationHistory from "@/components/ConversationHistory";
import TravelBooklet from "@/components/TravelBooklet";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function CarnetPage() {
  const params = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    fetchTrip(params.tripId).then(setTrip);
  }, [params.tripId]);

  if (!trip) {
    return <main className="px-6 py-10 text-sm text-slate-500">Chargement...</main>;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">
        Carnet de voyage - {trip.city}, {trip.country}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {new Date(trip.started_at).toLocaleDateString("fr-FR")}
        {trip.ended_at ? ` - ${new Date(trip.ended_at).toLocaleDateString("fr-FR")}` : ""}
      </p>

      <div className="mt-6">
        <TravelBooklet trip={trip} />
      </div>

      <div className="mt-8">
        <MapView monuments={trip.monuments} />
      </div>

      <div className="mt-10 space-y-10">
        {trip.monuments.map((monument) => (
          <article key={monument.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">{monument.name}</h2>
            {monument.description && (
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{monument.description}</p>
            )}
            <div className="mt-4">
              <PhotoGallery photos={monument.photos} />
            </div>
            <div className="mt-4">
              <ConversationHistory conversations={monument.conversations} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
