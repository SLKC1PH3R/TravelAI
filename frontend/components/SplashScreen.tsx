"use client";

const SPLASH_CSS = `
  @keyframes ta-splash-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ta-splash-spin { to { transform: rotate(360deg); } }
  @keyframes ta-splash-lock-swing {
    0%, 15% { transform: rotate(0deg); }
    40%, 60% { transform: rotate(-32deg); }
    85%, 100% { transform: rotate(0deg); }
  }
  @keyframes ta-splash-dot-pulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }

  .ta-splash-spinner {
    border-radius: 50%; border: 3px solid rgba(0,0,0,0.08); border-top-color: #0D0D0D;
    animation: ta-splash-spin 0.9s linear infinite;
  }
  .ta-splash-lock-shackle { transform-origin: 16px 10px; animation: ta-splash-lock-swing 2.6s ease-in-out infinite; }
  .ta-splash-dot { animation: ta-splash-dot-pulse 1.4s ease-in-out infinite; }
  .ta-splash-dot:nth-child(2) { animation-delay: 0.2s; }
  .ta-splash-dot:nth-child(3) { animation-delay: 0.4s; }
`;

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.8 14.1-5l-6.5-5.5C29.6 35.3 26.9 36 24 36c-5.3 0-9.6-3.4-11.3-8.1l-6.6 5.1C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.5l6.5 5.5C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

export default function SplashScreen() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
      <style>{SPLASH_CSS}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "ta-splash-fade 0.4s ease" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, overflow: "hidden", marginBottom: 26, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <img src="/voyageur.jpg" alt="TravelAI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        <div style={{ position: "relative", width: 52, height: 52, marginBottom: 20 }}>
          <div className="ta-splash-spinner" style={{ position: "absolute", inset: 0 }} />
          <div style={{ position: "absolute", inset: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GoogleIcon />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B8A4A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path className="ta-splash-lock-shackle" d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0D0D0D" }}>Connexion sécurisée avec Google</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span className="ta-splash-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D0D0D", display: "inline-block" }} />
          <span className="ta-splash-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D0D0D", display: "inline-block" }} />
          <span className="ta-splash-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D0D0D", display: "inline-block" }} />
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 28, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#B0B0B0", fontWeight: 500 }}>© TravelAI {new Date().getFullYear()}</span>
        <span style={{ color: "#D8D8D8" }}>·</span>
        <span style={{ fontSize: 12, color: "#0D0D0D", fontWeight: 700, letterSpacing: "-0.2px" }}>TravelAI</span>
      </div>
    </div>
  );
}
