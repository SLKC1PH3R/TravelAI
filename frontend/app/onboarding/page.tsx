"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { submitOnboarding } from "@/lib/api";
import { DEMO_AVATAR, DEMO_EMAIL, DEMO_LOGIN, DEMO_NAME, DEMO_PSEUDO } from "@/lib/demo";
import SplashScreen from "@/components/SplashScreen";

const CSS = `
  .ta-onb-root { background: #F4F3F1; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; -webkit-font-smoothing: antialiased; }
  .ta-onb-card { background: #fff; border-radius: 20px; border: 0.5px solid rgba(0,0,0,0.07); box-shadow: 0 20px 60px rgba(0,0,0,0.06); padding: 36px 32px; width: 340px; flex-shrink: 0; }
  .ta-onb-input { width: 100%; padding: 12px 14px; border: 1px solid rgba(0,0,0,0.15); border-radius: 10px; font-size: 14px; color: #0D0D0D; outline: none; background: #FAFAFA; }
  .ta-onb-input:focus { border-color: #0D0D0D; }
  .ta-onb-submit { transition: transform .18s ease, box-shadow .18s ease; }
  .ta-onb-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
  .ta-onb-submit:disabled { opacity: 0.5; cursor: default; transform: none; box-shadow: none; }
  .ta-onb-input:disabled { background: #F0F0EE; color: #6B6B6B; cursor: not-allowed; }
  .ta-onb-input[readonly] { background: #F5F5F3; color: #0D0D0D; cursor: default; }

  @keyframes ta-onb-hint-fade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
  .ta-onb-hint-popup { animation: ta-onb-hint-fade 0.35s ease forwards; }

  .ta-onb-flex { display: flex; align-items: center; justify-content: center; gap: 0; width: 100%; max-width: 900px; }

  .ta-onb-connector { width: 70px; height: 26px; position: relative; flex-shrink: 0; }
  .ta-onb-connector::before {
    content: ''; position: absolute; top: 50%; left: 2px; right: 2px; height: 2px;
    background: repeating-linear-gradient(to right, rgba(13,13,13,0.18) 0 6px, transparent 6px 12px);
    transform: translateY(-50%);
  }
  .ta-onb-dot {
    position: absolute; top: 50%; width: 8px; height: 8px; border-radius: 50%;
    background: #FFFC00; border: 1.5px solid #0D0D0D; transform: translateY(-50%);
    animation: ta-onb-flow 1.8s linear infinite; opacity: 0;
  }
  .ta-onb-dot:nth-child(2) { animation-delay: 0.45s; }
  .ta-onb-dot:nth-child(3) { animation-delay: 0.9s; }
  @keyframes ta-onb-flow {
    0% { left: -4px; opacity: 0; }
    12% { opacity: 1; }
    88% { opacity: 1; }
    100% { left: 100%; opacity: 0; }
  }

  @media (max-width: 860px) {
    .ta-onb-flex { flex-direction: column; }
    .ta-onb-card { width: 100%; max-width: 380px; }
    .ta-onb-connector { transform: rotate(90deg); margin: -2px 0; }
  }
`;

function CheckBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B8A4A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function LockBadge() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1B8A4A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function GoogleBadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.8 14.1-5l-6.5-5.5C29.6 35.3 26.9 36 24 36c-5.3 0-9.6-3.4-11.3-8.1l-6.6 5.1C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.5l6.5 5.5C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function GoogleProfileCard({ demoMode = false }: { demoMode?: boolean }) {
  const { data: session } = useSession();
  const user = session?.user;

  const name  = demoMode ? DEMO_NAME  : (user?.name  || "Compte Google");
  const email = demoMode ? DEMO_EMAIL : (user?.email || "");
  const image = demoMode ? DEMO_AVATAR : user?.image;
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="ta-onb-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div style={{ position: "relative", marginBottom: 16 }}>
        {image ? (
          <img src={image} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid #fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }} />
        ) : (
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#FFFC00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#0D0D0D" }}>
            {initials}
          </div>
        )}
        <div style={{ position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: "50%", background: "#fff", border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <GoogleBadgeIcon />
        </div>
      </div>

      <div style={{ fontSize: 16.5, fontWeight: 700, color: "#0D0D0D", letterSpacing: "-0.3px" }}>{name}</div>
      <div style={{ fontSize: 12.5, color: "#8A8A8A", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{email}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 22, background: "#EAF7EE", border: "1px solid #BFE6CC", borderRadius: 10, padding: "10px 14px", width: "100%" }}>
        <CheckBadge />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1B8A4A" }}>Connexion reussie Google</span>
        <LockBadge />
      </div>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="ta-onb-connector">
      <span className="ta-onb-dot" />
      <span className="ta-onb-dot" />
      <span className="ta-onb-dot" />
    </div>
  );
}

function OnboardingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  const [login, setLogin] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const isDemoMode = searchParams.get("demo") === "1";
  const isDemo = session?.user?.email === DEMO_EMAIL || isDemoMode;

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (session?.user?.anonymousUuid && !isDemo) {
      router.replace(`/dashboard/stats?uuid=${encodeURIComponent(session.user.anonymousUuid)}`);
    }
  }, [session, isDemo, router]);

  useEffect(() => {
    if (showSplash || !isDemo) return;
    const timer = setTimeout(() => {
      setLogin(DEMO_LOGIN);
      setPseudo(DEMO_PSEUDO);
      setShowHint(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showSplash, isDemo]);

  if (showSplash) {
    return <SplashScreen />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isDemoMode) {
      setSubmitting(true);
      router.push(`/dashboard/stats?uuid=${encodeURIComponent(DEMO_LOGIN)}`);
      return;
    }

    if (isDemo) {
      setSubmitting(true);
      try {
        await update({ anonymousUuid: DEMO_LOGIN, isAdmin: false });
        router.push(`/dashboard/stats?uuid=${encodeURIComponent(DEMO_LOGIN)}`);
      } finally {
        setSubmitting(false);
      }
      return;
    }

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
      await update({ anonymousUuid: user.anonymous_uuid, isAdmin: user.is_admin });
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
      <div style={{ width: "100%", maxWidth: 900, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 32 }}>
          <div style={{ width: 30, height: 30, background: "#FFFC00", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="4" fill="#0D0D0D" />
              <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0D0D0D", letterSpacing: "-0.4px" }}>TravelAI</span>
        </Link>

        <div className="ta-onb-flex">
          <GoogleProfileCard demoMode={isDemoMode} />

          <FlowConnector />

          <div className="ta-onb-card">
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0D0D0D", textAlign: "center", marginBottom: 8, letterSpacing: "-0.4px" }}>
              Connecte ta Lens
            </h1>
            <p style={{ fontSize: 13, color: "#6B6B6B", textAlign: "center", marginBottom: 24, lineHeight: 1.5 }}>
              Indique l&apos;identifiant Snapchat affiche dans la Lens, et choisis un pseudo. On ne te redemandera plus.
            </p>

            <form onSubmit={handleSubmit}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Identifiant Snapchat (login)
              </label>
              <input
                className="ta-onb-input"
                value={login}
                onChange={isDemo ? undefined : (e) => setLogin(e.target.value)}
                readOnly={isDemo}
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
                onChange={isDemo ? undefined : (e) => setPseudo(e.target.value)}
                readOnly={isDemo}
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

              {showHint && (
                <div
                  className="ta-onb-hint-popup"
                  style={{
                    marginTop: 10,
                    position: "relative",
                    background: "#0D0D0D",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "11px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: -7,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "7px solid transparent",
                    borderRight: "7px solid transparent",
                    borderBottom: "7px solid #0D0D0D",
                  }} />
                  Appuie sur Valider pour continuer !
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <OnboardingPageInner />
    </Suspense>
  );
}
