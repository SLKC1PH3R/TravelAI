"use client";

import { type Badge } from "@/lib/badges";

const BADGE_ICONS: Record<string, React.ReactNode> = {
  "unesco-10": (
    <>
      <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
      <path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" />
    </>
  ),
  "asia-explorer": <path d="M2 12h4l3-9 4 18 3-9h6" />,
  "streak-5": <path d="M13 2 3 14h7l-1 8 10-12h-7z" />,
  "first-carnet": (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
};

export default function BadgesSection({ badges }: { badges: Badge[] }) {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700 }}>Defis et badges</h2>
        <span style={{ background: '#FFFC00', borderRadius: 100, padding: '3px 11px', fontSize: 11.5, fontWeight: 700, color: '#0D0D0D' }}>
          {unlockedCount} / {badges.length}
        </span>
      </div>
      <p style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 16 }}>Chaque decouverte te rapproche d&apos;un nouveau badge</p>

      <div className="ta-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {badges.map((badge) => (
          <div
            key={badge.code}
            style={{
              background: badge.unlocked ? '#fff' : '#FAFAFA',
              border: '0.5px solid rgba(0,0,0,0.08)',
              borderRadius: 14, padding: '20px 16px', textAlign: 'center',
              opacity: badge.unlocked ? 1 : 0.6,
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: badge.unlocked ? '#FFFC00' : '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                {BADGE_ICONS[badge.code]}
              </svg>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D', marginBottom: 6 }}>{badge.name}</div>
            <p style={{ fontSize: 11.5, lineHeight: 1.5, color: '#6B6B6B', margin: '0 0 10px' }}>{badge.desc}</p>
            {badge.unlocked ? (
              <span style={{ fontSize: 10.5, fontWeight: 600, color: '#1B8A4A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Debloque</span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ flex: 1, height: 4, background: '#EFEFEF', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ width: `${(badge.progress / badge.target) * 100}%`, height: '100%', background: '#0D0D0D' }} />
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#8A8A8A', flexShrink: 0 }}>{badge.progress}/{badge.target}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
