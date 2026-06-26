"use client";

import { QRCodeSVG } from "qrcode.react";
import { signIn } from "next-auth/react";
import { useState } from "react";

const SNAPCODE_PLACEHOLDER = "https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=travelai-lens-placeholder";

export default function LandingPage() {
  const [showSnapcode, setShowSnapcode] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center">
        <h1 className="text-4xl font-extrabold text-brand-900 sm:text-5xl">
          TravelAI - Ton guide de voyage IA
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Pointe ta camera Snapchat sur un monument, pose tes questions, et garde un carnet de
          voyage genere automatiquement par l'IA.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={() => setShowSnapcode((v) => !v)}
            className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-300"
          >
            Ouvrir la Lens Snapchat
          </button>
          {showSnapcode && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <QRCodeSVG value={SNAPCODE_PLACEHOLDER} size={180} />
              <p className="mt-2 text-xs text-slate-400">Snapcode (placeholder) - scanne avec Snapchat</p>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Se connecter avec Google
          </button>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              signIn("email", { email, callbackUrl: "/dashboard" });
            }}
          >
            <input
              type="email"
              required
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Continuer
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard
            title="Monuments"
            description="Identifie automatiquement les monuments que tu visites et garde leur historique."
          />
          <FeatureCard
            title="Conversations"
            description="Pose toutes tes questions a ton guide IA et retrouve les reponses plus tard."
          />
          <FeatureCard
            title="Carnet de voyage"
            description="Genere un PDF souvenir avec tes photos, descriptions et anecdotes."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
      <h3 className="text-lg font-semibold text-brand-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
