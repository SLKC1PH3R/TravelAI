"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "ta-beta-lens-popup-seen";

export default function BetaLensPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    sessionStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 3000, background: "rgba(13,13,13,0.55)",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        animation: "ta-beta-fade 0.25s ease",
      }}
    >
      <style>{`
        @keyframes ta-beta-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ta-beta-pop { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", width: 420, maxWidth: "100%", background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.7)", borderRadius: 24,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)", overflow: "hidden",
          animation: "ta-beta-pop 0.3s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div style={{ height: 5, background: "linear-gradient(90deg,#FFFC00,#FFD600,#FFFC00)" }} />

        <button
          onClick={close}
          aria-label="Fermer"
          style={{
            position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: "50%",
            background: "rgba(13,13,13,0.06)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6B6B", fontSize: 16,
          }}
        >
          ✕
        </button>

        <div style={{ padding: "38px 36px 32px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0D0D0D", color: "#FFFC00", borderRadius: 100, padding: "5px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>
            🚀 Beta
          </div>

          <img
            src="/Snapchat-Offical-Lens-Creator-Badge.png"
            alt="Official Snapchat Lens Creator"
            style={{ width: 132, height: 132, objectFit: "contain", margin: "0 auto 22px", display: "block" }}
          />

          <h2 style={{ fontSize: 21, fontWeight: 700, color: "#0D0D0D", letterSpacing: "-0.4px", marginBottom: 10 }}>
            Notre Lens est en cours d&apos;approbation
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "#6B6B6B", margin: "0 0 16px" }}>
            TravelAI est actuellement en <strong style={{ color: "#0D0D0D" }}>bêta</strong>. Notre Lens Snapchat est
            en cours de validation officielle par Snapchat.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: "#6B6B6B", margin: "0 0 26px" }}>
            Dès qu&apos;elle sera disponible, une information s&apos;affichera ici et tu pourras scanner le Snapcode
            de la Lens directement pour commencer à interagir avec TravelAI.
          </p>

          <button
            onClick={close}
            style={{
              width: "100%", background: "#FFFC00", border: "none", borderRadius: 12, padding: 14,
              fontSize: 14, fontWeight: 700, color: "#0D0D0D", cursor: "pointer",
            }}
          >
            J&apos;ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
