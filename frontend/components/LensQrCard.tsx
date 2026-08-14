"use client";

import { QRCodeSVG } from "qrcode.react";

/**
 * A renseigner une fois la Lens validee par Snapchat (Snapcode / lien de deep-link officiel).
 * Tant que c'est null, la carte affiche un etat "bientot disponible".
 */
const LENS_SNAPCODE_URL: string | null = null;

export default function LensQrCard() {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 22,
        background: "#fff", border: "0.5px solid rgba(0,0,0,0.07)", borderRadius: 20,
        padding: "22px 26px", marginBottom: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          flexShrink: 0, width: 96, height: 96, borderRadius: 16,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
          background: LENS_SNAPCODE_URL ? "#FFFC00" : "#FAFAFA",
          border: LENS_SNAPCODE_URL ? "none" : "1.5px dashed rgba(0,0,0,0.15)",
        }}
      >
        {LENS_SNAPCODE_URL ? (
          <QRCodeSVG value={LENS_SNAPCODE_URL} size={72} />
        ) : (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B0B0B0" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <path d="M14 14h3v3h-3zM14 20h7M20 14v3M17 20v-3M20 20v-3" />
          </svg>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0D0D0D", color: "#FFFC00", borderRadius: 100, padding: "3px 11px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
          🚀 Beta
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0D0D0D", marginBottom: 4 }}>
          {LENS_SNAPCODE_URL ? "Scanne pour lancer la Lens TravelAI" : "QR code de la Lens — bientôt disponible"}
        </div>
        <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.55, margin: 0 }}>
          {LENS_SNAPCODE_URL
            ? "Ouvre l'appareil photo Snapchat et scanne ce code pour lancer TravelAI."
            : "Notre Lens est en cours de validation par Snapchat. Dès qu'elle sera approuvée, le QR code à scanner pour la lancer apparaîtra ici automatiquement."}
        </p>
      </div>
    </div>
  );
}
