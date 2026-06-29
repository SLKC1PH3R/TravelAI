/**
 * TravelAI — Chrome partage entre /dashboard et /dashboard/stats
 *
 * Top nav + sidebar identiques sur les deux pages : seul le contenu
 * a l'interieur de <main className="ta-main-pad"> change.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { type Trip } from '@/lib/api'
import Flag from '@/components/Flag'

export const DASHBOARD_CHROME_CSS = `
  .ta-nav-pill { transition: color 0.15s, background 0.15s; }
  .ta-nav-pill:hover { color: #0D0D0D !important; background: rgba(0,0,0,0.04) !important; }
  .ta-trip-item { transition: background 0.15s; cursor: pointer; }
  .ta-trip-item:hover { background: #FFFBDF !important; }
  .ta-sidebar-btn:hover { opacity: 0.85; }
  .ta-sidebar-btn:disabled { opacity: 0.5; cursor: default; }
  .ta-mobile-trips { display: none; }
  .ta-mobile-chip { transition: background 0.15s; }

  @media (max-width: 1024px) {
    .ta-sidebar { display: none !important; }
    .ta-main-pad { padding: 20px !important; }
    .ta-mobile-trips { display: flex !important; }
  }
`

const GHOST_PATH =
  'M12 1.5C8.3 1.5 5.3 4.5 5.3 8.2v4.8l-1.6 1 .8 1.4.8-.5v1.3c-.6.2-1.5.8-1.9 2.1-.3 1-.1 2.2-.1 2.2s2.9-.4 4.2 1.4c.5.8 1.6 1.3 2.8 1.3 1.1 0 1.6-.2 1.6-.2s.6.2 1.6.2c1.2 0 2.3-.5 2.8-1.3 1.3-1.8 4.2-1.4 4.2-1.4s.2-1.2-.1-2.2c-.4-1.3-1.3-1.9-1.9-2.1v-1.3l.8.5.8-1.4-1.6-1V8.2C18.7 4.5 15.7 1.5 12 1.5z'

export function GhostIcon({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={GHOST_PATH} />
    </svg>
  )
}

export const fmtShort = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

export function tripLabel(t: Trip): string {
  return t.title || [t.city, t.country].filter(Boolean).join(', ') || 'Voyage'
}

function AccountMenu({ uuid }: { uuid: string }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const user = session?.user
  const initials = (user?.name || user?.email || '?').slice(0, 2).toUpperCase()
  const profileHref = `/dashboard/profile?uuid=${encodeURIComponent(uuid)}`

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 9, padding: '5px 12px 5px 5px', cursor: 'pointer' }}
      >
        {user?.image ? (
          <img src={user.image} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#0D0D0D' }}>{initials}</div>
        )}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.name || user?.email || 'Mon compte'}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 240, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, boxShadow: '0 12px 36px rgba(0,0,0,0.14)', overflow: 'hidden', zIndex: 1100 }}>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
            {user?.image ? (
              <img src={user.image} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>{initials}</div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Mon compte'}</div>
              <div style={{ fontSize: 11.5, color: '#8A8A8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
          </div>
          <Link
            href={profileHref}
            onClick={() => setOpen(false)}
            className="ta-nav-pill"
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 16px', fontSize: 13, fontWeight: 500, color: '#0D0D0D', textDecoration: 'none' }}
          >
            Mon profil
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '11px 16px', fontSize: 13, fontWeight: 500, color: '#D02828', background: 'none', border: 'none', borderTop: '0.5px solid rgba(0,0,0,0.06)', cursor: 'pointer', textAlign: 'left' }}
          >
            Se deconnecter
          </button>
        </div>
      )}
    </div>
  )
}

type TopNavProps = {
  uuid: string
  active?: 'profil' | 'voyages'
  isAdmin?: boolean
}

export function DashboardTopNav({ uuid, active, isAdmin }: TopNavProps) {
  const q = encodeURIComponent(uuid)
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: 'rgba(255,255,255,0.97)', borderBottom: '0.5px solid rgba(0,0,0,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <Link href={`/dashboard?uuid=${q}`} style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
        <div style={{ width: 28, height: 28, background: '#FFFC00', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="4" fill="#0D0D0D" /><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-0.4px' }}>TravelAI</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#F3F3F3', borderRadius: 9, padding: 3 }}>
        {active === 'profil' ? (
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', padding: '6px 14px', borderRadius: 7, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>Mes statistiques</span>
        ) : (
          <Link href={`/dashboard/stats?uuid=${q}`} className="ta-nav-pill" style={{ fontSize: 13, fontWeight: 500, color: '#6B6B6B', textDecoration: 'none', padding: '6px 14px', borderRadius: 7 }}>Mes statistiques</Link>
        )}
        {active === 'voyages' ? (
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', padding: '6px 14px', borderRadius: 7, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>Mes voyages</span>
        ) : (
          <Link href={`/dashboard?uuid=${q}`} className="ta-nav-pill" style={{ fontSize: 13, fontWeight: 500, color: '#6B6B6B', textDecoration: 'none', padding: '6px 14px', borderRadius: 7 }}>Mes voyages</Link>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isAdmin && (
          <Link href="/dashboard/admin" className="ta-nav-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0D0D0D', color: '#FFFC00', padding: '9px 14px', borderRadius: 9, fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}>
            ⚙ Admin
          </Link>
        )}
        <AccountMenu uuid={uuid} />
      </div>
    </nav>
  )
}

type SidebarProps = {
  uuid: string
  email?: string | null
  avatarUrl?: string | null
  trips: Trip[]
  selectedTripId: string | null
  onSelectTrip: (id: string) => void
  downloading: boolean
  onDownload: () => void
  showMerge: boolean
  onToggleMerge: () => void
}

export function DashboardSidebar({ uuid, email, avatarUrl, trips, selectedTripId, onSelectTrip, downloading, onDownload, showMerge, onToggleMerge }: SidebarProps) {
  const totalMonuments = trips.reduce((s, t) => s + t.monuments.length, 0)
  const totalConversations = trips.reduce(
    (s, t) => s + t.monuments.reduce((ms, m) => ms + m.conversations.length, 0),
    0
  )
  const countriesCount = new Set(trips.map((t) => t.country).filter(Boolean)).size

  return (
    <aside className="ta-sidebar" style={{ width: 272, flexShrink: 0, background: '#fff', borderRight: '0.5px solid rgba(0,0,0,0.06)', position: 'sticky', top: 60, height: 'calc(100vh - 60px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0, border: '2px solid #0D0D0D', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#0D0D0D', flexShrink: 0, border: '2px solid #0D0D0D' }}>
              {(email || 'YA').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0D0D0D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email || 'Voyageur Anonyme'}</div>
            <div style={{ fontSize: 10.5, color: '#6B6B6B', fontFamily: 'monospace', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uuid}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#F7F7F7', borderRadius: 12, overflow: 'hidden' }}>
          {[[totalMonuments, 'Sites'], [countriesCount, 'Pays'], [totalConversations, 'Questions']].map(([n, label], i) => (
            <div key={String(label)} style={{ padding: '12px 8px', textAlign: 'center', borderRight: i < 2 ? '0.5px solid rgba(0,0,0,0.07)' : undefined }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0D0D0D', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 9.5, color: '#6B6B6B', marginTop: 3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#B0B0B0', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>Mes voyages</div>
        {trips.map((t) => {
          const selected = t.id === selectedTripId
          return (
            <div key={t.id} className="ta-trip-item" onClick={() => onSelectTrip(t.id)} style={{ borderRadius: 10, padding: '11px 12px', marginBottom: 4, background: selected ? '#FFFBE0' : 'transparent', border: selected ? '0.5px solid rgba(255,220,0,0.45)' : '0.5px solid transparent' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <Flag country={t.country} size={18} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: selected ? 700 : 500, color: '#0D0D0D', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tripLabel(t)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                    <span style={{ fontSize: 10.5, color: '#8A8A8A' }}>{fmtShort(t.started_at)}{t.ended_at ? ` - ${fmtShort(t.ended_at)}` : ''}</span>
                    <span style={{ color: '#ccc', fontSize: 10 }}>·</span>
                    <span style={{ fontSize: 10.5, color: '#8A8A8A' }}>{t.monuments.length} etapes</span>
                  </div>
                </div>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: selected ? '#FFFC00' : '#E0E0E0', flexShrink: 0, marginTop: 5 }} />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '14px 16px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <button className="ta-sidebar-btn" disabled={downloading} onClick={onDownload} style={{ width: '100%', background: '#FFFC00', border: 'none', borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 700, color: '#0D0D0D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          {downloading ? 'Generation...' : 'Telecharger le carnet PDF'}
        </button>
        <button className="ta-sidebar-btn" onClick={onToggleMerge} style={{ width: '100%', background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.09)', borderRadius: 10, padding: 11, fontSize: 13, fontWeight: 600, color: '#0D0D0D', cursor: 'pointer' }}>
          {showMerge ? '✕ Fermer' : '+ Fusionner des voyages'}
        </button>
      </div>
    </aside>
  )
}

/**
 * Barre de voyages pour mobile/tablette : remplace la sidebar (cachee sous
 * 1024px) par une rangee horizontale scrollable, pour pouvoir changer de
 * voyage sans la sidebar.
 */
export function MobileTripBar({ trips, selectedTripId, onSelectTrip, downloading, onDownload, onToggleMerge }: SidebarProps) {
  return (
    <div className="ta-mobile-trips" style={{ alignItems: 'center', gap: 8, background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.07)', padding: '10px 12px' }}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
        {trips.map((t) => {
          const selected = t.id === selectedTripId
          return (
            <button
              key={t.id}
              className="ta-mobile-chip"
              onClick={() => onSelectTrip(t.id)}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: selected ? '#FFFC00' : '#F7F7F7',
                border: selected ? '1px solid #0D0D0D' : '0.5px solid rgba(0,0,0,0.1)',
                borderRadius: 100,
                padding: '7px 13px',
                fontSize: 12.5,
                fontWeight: 600,
                color: '#0D0D0D',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              <Flag country={t.country} size={13} />
              {tripLabel(t)}
            </button>
          )
        })}
      </div>
      <button
        className="ta-sidebar-btn"
        disabled={downloading}
        onClick={onDownload}
        aria-label="Telecharger le carnet PDF"
        style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: '#FFFC00', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
      </button>
      <button
        onClick={onToggleMerge}
        aria-label="Fusionner des voyages"
        style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, lineHeight: 1, color: '#0D0D0D' }}
      >
        +
      </button>
    </div>
  )
}
