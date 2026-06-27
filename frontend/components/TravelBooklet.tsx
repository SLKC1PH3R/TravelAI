"use client";

import { useState } from "react";
import { downloadCarnet, type Trip } from "@/lib/api";

export default function TravelBooklet({ trip }: { trip: Trip }) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      await downloadCarnet(trip.id, `carnet-${trip.title || trip.city || trip.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold">
        Carnet de voyage - {trip.title || [trip.city, trip.country].filter(Boolean).join(", ") || "Voyage"}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {trip.monuments.length} monument(s) visite(s) - genere un PDF souvenir de ce voyage.
      </p>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
      >
        {loading ? "Generation en cours..." : "Generer mon carnet de voyage"}
      </button>
    </div>
  );
}
