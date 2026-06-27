"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const CSS = `
  .ta-login-root { background: #F4F3F1; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; -webkit-font-smoothing: antialiased; }
  .ta-login-card { background: #fff; border-radius: 20px; border: 0.5px solid rgba(0,0,0,0.07); box-shadow: 0 20px 60px rgba(0,0,0,0.06); padding: 40px 36px; width: 100%; max-width: 380px; }
  .ta-login-google { transition: transform .18s ease, box-shadow .18s ease; }
  .ta-login-google:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
`;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.8 14.1-5l-6.5-5.5C29.6 35.3 26.9 36 24 36c-5.3 0-9.6-3.4-11.3-8.1l-6.6 5.1C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.5l6.5 5.5C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/stats";

  return (
    <div className="ta-login-root">
      <style>{CSS}</style>
      <div className="ta-login-card">
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
          Connecte-toi
        </h1>
        <p style={{ fontSize: 13.5, color: "#6B6B6B", textAlign: "center", marginBottom: 28, lineHeight: 1.5 }}>
          Accede a tes voyages, tes monuments et tes carnets de voyage.
        </p>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="ta-login-google"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: 10,
            padding: "12px 18px",
            fontSize: 14,
            fontWeight: 600,
            color: "#0D0D0D",
            cursor: "pointer",
          }}
        >
          <GoogleIcon />
          Se connecter avec Google
        </button>

        <p style={{ fontSize: 11.5, color: "#B0B0B0", textAlign: "center", marginTop: 24, lineHeight: 1.5 }}>
          En te connectant, tu acceptes que TravelAI associe ton compte a l&apos;UUID anonyme genere par la Lens Snapchat.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginContent />
    </Suspense>
  );
}
