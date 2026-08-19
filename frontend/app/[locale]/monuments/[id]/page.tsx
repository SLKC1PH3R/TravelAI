"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { askFollowup, fetchMonument, setFavorite, type Monument } from "@/lib/api";
import PhotoGallery from "@/components/PhotoGallery";
import ConversationHistory from "@/components/ConversationHistory";

export default function MonumentPage() {
  const params = useParams<{ id: string }>();
  const [monument, setMonument] = useState<Monument | null>(null);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetchMonument(params.id).then(setMonument);
  }, [params.id]);

  if (!monument) {
    return <main className="px-6 py-10 text-sm text-slate-500">Chargement...</main>;
  }

  async function handleFavorite() {
    if (!monument) return;
    const updated = await setFavorite(monument.id, !monument.is_favorite);
    setMonument(updated);
  }

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !monument) return;
    setAsking(true);
    try {
      const conv = await askFollowup(monument.id, question);
      setMonument({ ...monument, conversations: [...monument.conversations, conv] });
      setQuestion("");
    } finally {
      setAsking(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold">{monument.name}</h1>
        <button
          onClick={handleFavorite}
          className={`rounded-full px-3 py-1 text-sm ${
            monument.is_favorite ? "bg-yellow-400 text-slate-900" : "border border-slate-300"
          }`}
        >
          {monument.is_favorite ? "★ Favori" : "☆ Ajouter aux favoris"}
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-500">
        Visite le {new Date(monument.visited_at).toLocaleDateString("fr-FR")}
      </p>

      {monument.description && <p className="mt-4 whitespace-pre-line text-slate-700">{monument.description}</p>}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Photos</h2>
        <div className="mt-3">
          <PhotoGallery photos={monument.photos} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Conversations</h2>
        <div className="mt-3">
          <ConversationHistory conversations={monument.conversations} />
        </div>

        <form onSubmit={handleAsk} className="mt-4 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Pose une question sur ce monument..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={asking}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {asking ? "..." : "Envoyer"}
          </button>
        </form>
      </section>
    </main>
  );
}
