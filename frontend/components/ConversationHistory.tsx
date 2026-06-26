"use client";

import type { Conversation } from "@/lib/api";

export default function ConversationHistory({ conversations }: { conversations: Conversation[] }) {
  if (conversations.length === 0) {
    return <p className="text-sm text-slate-500">Aucune conversation pour ce monument.</p>;
  }

  return (
    <div className="space-y-3">
      {conversations.map((conv) => (
        <div key={conv.id} className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-sm font-medium text-slate-800">Q : {conv.question}</p>
          <p className="mt-1 text-sm text-slate-600">R : {conv.answer}</p>
          <p className="mt-2 text-xs text-slate-400">{new Date(conv.created_at).toLocaleString("fr-FR")}</p>
        </div>
      ))}
    </div>
  );
}
