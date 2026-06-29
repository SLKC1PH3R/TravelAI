"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { submitOnboarding } from "@/lib/api";
import SplashScreen from "@/components/SplashScreen";

const CSS = `
  .ta-onb-root { background: #F4F3F1; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; -webkit-font-smoothing: antialiased; }
  .ta-onb-card { background: #fff; border-radius: 20px; border: 0.5px solid rgba(0,0,0,0.07); box-shadow: 0 20px 60px rgba(0,0,0,0.06); padding: 40px 36px; width: 100%; max-width: 380px; }
  .ta-onb-input { width: 100%; padding: 12px 14px; border: 1px solid rgba(0,0,0,0.15); border-radius: 10px; font-size: 14px; color: #0D0D0D; outline: none; background: #FAFAFA; }
  .ta-onb-input:focus { border-color: #0D0D0D; }
  .ta-onb-submit { transition: transform .18s ease, box-shadow .18s ease; }
  .ta-onb-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
  .ta-onb-submit:disabled { opacity: 0.5; cursor: default; transform: none; box-shadow: none; }
`;

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [login, setLogin] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (session?.user?.anonymousUuid) {
      router.replace(`/dashboard/stats?uuid=${encodeURIComponent(session.user.anonymousUuid)}`);
    }
  }, [session, router]);

  if (showSplash) {
    return <SplashScreen />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.email || !login.trim() || !pseudo.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const user = await submitOnboarding({
        email: session.user.email,
        name: session.user.name,
        avatarUrl: session.user.image,
        login: login.trim(),
        pseudo: pseudo.trim(),
      });
      await update({ anonymousUuid: user.anonymous_uuid });
      router.push(`/dashboard/stats?uuid=${encodeURIComponent(user.anonymous_uuid)}`);
    } catch {
      setError("Impossible d'enregistrer ton profil. Verifie ton identifiant Snapchat et reessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ta-onb-root">
      <style>{CSS}</style>
      <div className="ta-onb-card">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 28, justifyContent: "center" }}>
          <div style={{ width: 30, height: 30, background: "#FFFC00", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="4" fill="#0D0D0D" />
              <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0D0D0D", letterSpacing: "-0.4px" }}>TravelAI</span>
        </Link>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0D0D0D", textAlign: "center", marginBottom: 8, letterSpacing: "-0.4px" }}>
          Connecte ta Lens
        </h1>
        <p style={{ fontSize: 13.5, color: "#6B6B6B", textAlign: "center", marginBottom: 28, lineHeight: 1.5 }}>
          Indique l&apos;identifiant Snapchat affiche dans la Lens, et choisis un pseudo. On ne te redemandera plus.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Identifiant Snapchat (login)
          </label>
          <input
            className="ta-onb-input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="ex: test-uuid-eiffel-001"
            required
            style={{ marginBottom: 16 }}
          />

          <label style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Pseudo
          </label>
          <input
            className="ta-onb-input"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="ex: Jeremy"
            required
            style={{ marginBottom: 20 }}
          />

          {error && <p style={{ fontSize: 12.5, color: "#D02828", marginBottom: 14, lineHeight: 1.5 }}>{error}</p>}

          <button
            type="submit"
            disabled={submitting || !login.trim() || !pseudo.trim()}
            className="ta-onb-submit"
            style={{
              width: "100%",
              background: "#FFFC00",
              border: "none",
              borderRadius: 10,
              padding: 13,
              fontSize: 14,
              fontWeight: 700,
              color: "#0D0D0D",
              cursor: "pointer",
            }}
          >
            {submitting ? "Enregistrement..." : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
}
