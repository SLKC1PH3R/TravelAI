"use client";

import Link from "next/link";

const CSS = `
  .ta-legal-root { background: #F4F3F1; min-height: 100vh; -webkit-font-smoothing: antialiased; }
  .ta-legal-header { display: flex; align-items: center; justify-content: space-between; padding: 24px 32px; max-width: 800px; margin: 0 auto; }
  .ta-legal-card { background: #fff; border-radius: 20px; border: 0.5px solid rgba(0,0,0,0.07); box-shadow: 0 20px 60px rgba(0,0,0,0.06); max-width: 800px; margin: 0 auto 80px; padding: 48px 56px; }
  .ta-legal-card h1 { font-size: 32px; font-weight: 700; color: #0D0D0D; letter-spacing: -0.8px; margin-bottom: 8px; }
  .ta-legal-card .ta-legal-updated { font-size: 13px; color: #8A8A8A; margin-bottom: 40px; }
  .ta-legal-card h2 { font-size: 18px; font-weight: 700; color: #0D0D0D; letter-spacing: -0.3px; margin: 36px 0 12px; }
  .ta-legal-card h2:first-of-type { margin-top: 0; }
  .ta-legal-card p { font-size: 14.5px; line-height: 1.75; color: #4A4A4A; margin-bottom: 14px; }
  .ta-legal-card ul { margin: 0 0 14px; padding-left: 20px; }
  .ta-legal-card li { font-size: 14.5px; line-height: 1.75; color: #4A4A4A; margin-bottom: 6px; }
  .ta-legal-card a { color: #0D0D0D; font-weight: 600; text-decoration: underline; }
  .ta-legal-back { font-size: 13.5px; font-weight: 600; color: #6B6B6B; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
  .ta-legal-back:hover { color: #0D0D0D; }

  @media (max-width: 640px) {
    .ta-legal-card { padding: 32px 24px; margin: 0 16px 60px; }
  }
`;

export default function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ta-legal-root">
      <style>{CSS}</style>
      <div className="ta-legal-header">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, overflow: "hidden" }}>
            <img src="/voyageur.jpg" alt="TravelAI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#0D0D0D", letterSpacing: "-0.4px" }}>TravelAI</span>
        </Link>
        <Link href="/" className="ta-legal-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>
      </div>

      <div className="ta-legal-card">
        <h1>{title}</h1>
        <p className="ta-legal-updated">Derniere mise a jour : {updated}</p>
        {children}
      </div>
    </div>
  );
}
