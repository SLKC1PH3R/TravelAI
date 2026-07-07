"use client";

const SPLASH_CSS = `
  @keyframes ta-splash-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.9); opacity: 0.75; }
  }
`;

export default function SplashScreen() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
      <style>{SPLASH_CSS}</style>

      <div style={{ width: 64, height: 64, borderRadius: 16, overflow: "hidden", animation: "ta-splash-pulse 1.1s ease-in-out infinite" }}>
        <img src="/voyageur.jpg" alt="TravelAI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div style={{ position: "absolute", bottom: 28, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#B0B0B0", fontWeight: 500 }}>© TravelAI {new Date().getFullYear()}</span>
        <span style={{ color: "#D8D8D8" }}>·</span>
        <span style={{ fontSize: 12, color: "#0D0D0D", fontWeight: 700, letterSpacing: "-0.2px" }}>TravelAI</span>
      </div>
    </div>
  );
}
