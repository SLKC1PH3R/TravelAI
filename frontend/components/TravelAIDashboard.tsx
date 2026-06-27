/**
 * TravelAI — Dashboard Mes Voyages (Timeline Polarsteps-style)
 *
 * Branche sur l'API reelle via @/lib/api (fetchTrips, mergeTrips, downloadCarnet).
 */

'use client'

import { useEffect, useMemo, useState, Fragment } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { downloadCarnet, fetchTrips, mergeTrips, photoUrl, type Monument, type Trip } from '@/lib/api'
import { flagFor } from '@/lib/geo'

/* ===== Embedded CSS ===== */
const CSS = `
  .ta-dash-root { background: #F4F3F1; color: #0D0D0D; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  .ta-dash-root *, .ta-dash-root *::before, .ta-dash-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }

  .ta-trip-item { transition: background 0.15s; cursor: pointer; }
  .ta-trip-item:hover { background: #FFFBDF !important; }
  .ta-monument-card { transition: box-shadow 0.2s ease; }
  .ta-monument-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.09) !important; }
  .ta-monument-card:hover .ta-view-btn { opacity: 1 !important; }
  .ta-action-btn { transition: background 0.2s, color 0.2s, border-color 0.2s; }
  .ta-action-btn:hover { background: #FFFC00 !important; color: #0D0D0D !important; border-color: transparent !important; }
  .ta-nav-pill { transition: color 0.15s, background 0.15s; }
  .ta-nav-pill:hover { color: #0D0D0D !important; background: rgba(0,0,0,0.04) !important; }
  .ta-sidebar-btn:hover { opacity: 0.85; }
  .ta-sidebar-btn:disabled { opacity: 0.5; cursor: default; }
  .ta-share-btn:hover { background: rgba(255,255,255,0.25) !important; }
  .ta-share-btn { transition: background 0.15s; }

  @media (max-width: 1024px) {
    .ta-sidebar { display: none !important; }
    .ta-main-pad { padding: 20px !important; }
  }
  @media (max-width: 720px) {
    .ta-hero { height: 220px !important; }
    .ta-hero-title { font-size: 24px !important; }
    .ta-route-strip { display: none !important; }
    .ta-stats-bar { flex-wrap: wrap !important; gap: 16px !important; }
    .ta-merge-grid { grid-template-columns: 1fr !important; }
  }
`

const GHOST_PATH =
  'M12 1.5C8.3 1.5 5.3 4.5 5.3 8.2v4.8l-1.6 1 .8 1.4.8-.5v1.3c-.6.2-1.5.8-1.9 2.1-.3 1-.1 2.2-.1 2.2s2.9-.4 4.2 1.4c.5.8 1.6 1.3 2.8 1.3 1.1 0 1.6-.2 1.6-.2s.6.2 1.6.2c1.2 0 2.3-.5 2.8-1.3 1.3-1.8 4.2-1.4 4.2-1.4s.2-1.2-.1-2.2c-.4-1.3-1.3-1.9-1.9-2.1v-1.3l.8.5.8-1.4-1.6-1V8.2C18.7 4.5 15.7 1.5 12 1.5z'

function GhostIcon({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={GHOST_PATH} />
    </svg>
  )
}

const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
const fmtShort = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

function tripLabel(t: Trip): string {
  return t.title || [t.city, t.country].filter(Boolean).join(', ') || 'Voyage'
}

function monumentCoverUrl(m: Monument): string | null {
  const stored = m.photos.find((p) => p.stored)
  return stored ? photoUrl(stored.id) : null
}

export default function TravelAIDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const uuid = searchParams.get('uuid') || ''

  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [showMerge, setShowMerge] = useState(false)
  const [mergeTitle, setMergeTitle] = useState('')
  const [mergeCountry, setMergeCountry] = useState('')
  const [mergeStart, setMergeStart] = useState('')
  const [mergeEnd, setMergeEnd] = useState('')
  const [merging, setMerging] = useState(false)
  const [downloading, setDownloading] = useState(false)

  function reload() {
    if (!uuid) return Promise.resolve()
    setLoading(true)
    return fetchTrips(uuid)
      .then((data) => {
        setTrips(data)
        setSelectedTripId((current) => current && data.some((t) => t.id === current) ? current : data[0]?.id ?? null)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    reload()
  }, [uuid])

  const selectedTrip = trips.find((t) => t.id === selectedTripId) ?? null
  const totalMonuments = useMemo(() => trips.reduce((s, t) => s + t.monuments.length, 0), [trips])
  const totalConversations = useMemo(
    () => trips.reduce((s, t) => s + t.monuments.reduce((ms, m) => ms + m.conversations.length, 0), 0),
    [trips]
  )
  const countriesCount = useMemo(() => new Set(trips.map((t) => t.country).filter(Boolean)).size, [trips])
  const tripFavorites = selectedTrip ? selectedTrip.monuments.filter((m) => m.is_favorite).length : 0
  const tripConvs = selectedTrip ? selectedTrip.monuments.reduce((s, m) => s + m.conversations.length, 0) : 0

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.unobserve(entry.target)
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    )
    document.querySelectorAll('[data-fade]').forEach((el) => {
      const h = el as HTMLElement
      h.style.opacity = '0'
      h.style.transform = 'translateY(18px)'
      h.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)'
      obs.observe(el)
    })
    return () => obs.disconnect()
  }, [selectedTripId])

  async function handleMerge() {
    if (!mergeTitle || !mergeStart || !mergeEnd) return
    setMerging(true)
    try {
      const merged = await mergeTrips({
        uuid,
        title: mergeTitle,
        startDate: new Date(`${mergeStart}T00:00:00`).toISOString(),
        endDate: new Date(`${mergeEnd}T23:59:59`).toISOString(),
        country: mergeCountry || undefined,
      })
      await reload()
      setSelectedTripId(merged.id)
      setShowMerge(false)
      setMergeTitle('')
      setMergeCountry('')
      setMergeStart('')
      setMergeEnd('')
    } finally {
      setMerging(false)
    }
  }

  async function handleDownload() {
    if (!selectedTrip) return
    setDownloading(true)
    try {
      await downloadCarnet(selectedTrip.id, `carnet-${tripLabel(selectedTrip)}`)
    } finally {
      setDownloading(false)
    }
  }

  if (!uuid) {
    return (
      <div className="ta-dash-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{CSS}</style>
        <form
          style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: 360 }}
          onSubmit={(e) => {
            e.preventDefault()
            const value = new FormData(e.currentTarget).get('uuid') as string
            router.push(`/dashboard?uuid=${encodeURIComponent(value)}`)
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Connecte ton compte Lens</h1>
          <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 16, lineHeight: 1.5 }}>
            Entre l&apos;UUID anonyme genere par la Lens Snapchat pour retrouver tes voyages.
          </p>
          <input name="uuid" required style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 10, fontSize: 14, marginBottom: 12 }} />
          <button type="submit" style={{ width: '100%', background: '#FFFC00', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Valider</button>
        </form>
      </div>
    )
  }

  if (loading && trips.length === 0) {
    return (
      <div className="ta-dash-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#6B6B6B' }}>
        <style>{CSS}</style>
        Chargement...
      </div>
    )
  }

  if (!loading && trips.length === 0) {
    return (
      <div className="ta-dash-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#6B6B6B' }}>
        <style>{CSS}</style>
        Aucun voyage trouve pour ce compte.
      </div>
    )
  }

  if (!selectedTrip) return null

  return (
    <div className="ta-dash-root">
      <style>{CSS}</style>

      {/* ===== NAV ===== */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: 'rgba(255,255,255,0.97)', borderBottom: '0.5px solid rgba(0,0,0,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#FFFC00', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="4" fill="#0D0D0D" /><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-0.4px' }}>TravelAI</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#F3F3F3', borderRadius: 9, padding: 3 }}>
          <Link href={`/dashboard/stats?uuid=${encodeURIComponent(uuid)}`} className="ta-nav-pill" style={{ fontSize: 13, fontWeight: 500, color: '#6B6B6B', textDecoration: 'none', padding: '6px 14px', borderRadius: 7 }}>Statistiques</Link>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', padding: '6px 14px', borderRadius: 7, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>Mes voyages</span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#F7F7F7', color: '#0D0D0D', padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700 }}>
          <GhostIcon size={13} />
          Compte demo
        </span>
      </nav>

      {/* ===== LAYOUT ===== */}
      <div style={{ display: 'flex', paddingTop: 60, minHeight: '100vh' }}>

        {/* ===== SIDEBAR ===== */}
        <aside className="ta-sidebar" style={{ width: 272, flexShrink: 0, background: '#fff', borderRight: '0.5px solid rgba(0,0,0,0.06)', position: 'sticky', top: 60, height: 'calc(100vh - 60px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 20px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#0D0D0D', flexShrink: 0, border: '2px solid #0D0D0D' }}>YA</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0D0D0D' }}>Voyageur Anonyme</div>
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
                <div key={t.id} className="ta-trip-item" onClick={() => setSelectedTripId(t.id)} style={{ borderRadius: 10, padding: '11px 12px', marginBottom: 4, background: selected ? '#FFFBE0' : 'transparent', border: selected ? '0.5px solid rgba(255,220,0,0.45)' : '0.5px solid transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                    <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{flagFor(t.country)}</span>
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
            <button className="ta-sidebar-btn" disabled={downloading} onClick={handleDownload} style={{ width: '100%', background: '#FFFC00', border: 'none', borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 700, color: '#0D0D0D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
              {downloading ? 'Generation...' : 'Telecharger le carnet PDF'}
            </button>
            <button onClick={() => setShowMerge(!showMerge)} style={{ width: '100%', background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.09)', borderRadius: 10, padding: 11, fontSize: 13, fontWeight: 600, color: '#0D0D0D', cursor: 'pointer' }}>
              {showMerge ? '✕ Fermer' : '+ Fusionner des voyages'}
            </button>
          </div>
        </aside>

        {/* ===== MAIN ===== */}
        <main className="ta-main-pad" style={{ flex: 1, minWidth: 0, overflowY: 'auto', background: '#F4F3F1' }}>

          {/* HERO */}
          <div className="ta-hero" style={{ position: 'relative', height: 340, overflow: 'hidden', background: '#111' }}>
            {(() => {
              const cover = selectedTrip.monuments.map(monumentCoverUrl).find(Boolean)
              return cover ? (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url('${cover}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.88 }} />
              ) : null
            })()}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.72) 100%)' }} />

            <div style={{ position: 'absolute', top: 20, right: 28, display: 'flex', gap: 8, zIndex: 10 }}>
              <button className="ta-share-btn" disabled={downloading} onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(255,255,255,0.35)', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                Voir le carnet
              </button>
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 36px', zIndex: 10 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(255,255,255,0.28)', borderRadius: 100, padding: '5px 14px', marginBottom: 12 }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>{flagFor(selectedTrip.country)}</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#fff', letterSpacing: '0.04em' }}>{selectedTrip.country || 'Voyage'}</span>
              </div>
              <h1 className="ta-hero-title" style={{ fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 8 }}>{tripLabel(selectedTrip)}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>
                  {fmt(selectedTrip.started_at)}{selectedTrip.ended_at ? ` - ${fmt(selectedTrip.ended_at)}` : ''}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>·</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>{selectedTrip.monuments.length} monuments decouverts</span>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="ta-stats-bar" style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.06)', padding: '18px 36px', display: 'flex', alignItems: 'center', gap: 32 }}>
            {[
              { value: selectedTrip.monuments.length, label: 'Monuments', icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>, bg: '#F7F7F7' },
              { value: tripConvs, label: 'Conversations IA', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />, bg: '#F7F7F7' },
              { value: tripFavorites, label: 'Favoris', icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#0D0D0D" stroke="none" />, bg: '#FFFC00' },
            ].map(({ value, label, icon, bg }, i) => (
              <Fragment key={label}>
                {i > 0 && <div style={{ width: 0.5, height: 36, background: 'rgba(0,0,0,0.08)' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#0D0D0D', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 10.5, color: '#8A8A8A', fontWeight: 500 }}>{label}</div>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>

          {/* ROUTE STRIP */}
          <div className="ta-route-strip" style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.06)', padding: '18px 36px', overflowX: 'auto' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#B0B0B0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Itineraire</div>
            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 2 }}>
              {selectedTrip.monuments.map((m, i) => (
                <Fragment key={m.id}>
                  <Link href={`/monuments/${m.id}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer', textDecoration: 'none' }}>
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFFC00', border: '2.5px solid #0D0D0D', flexShrink: 0 }} />
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: '#0D0D0D', whiteSpace: 'nowrap', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: '#8A8A8A', whiteSpace: 'nowrap' }}>{fmtShort(m.visited_at)}</div>
                  </Link>
                  {i < selectedTrip.monuments.length - 1 && (
                    <div style={{ width: 72, height: 0, borderTop: '1.5px dashed rgba(0,0,0,0.15)', marginBottom: 34, flexShrink: 0 }} />
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          {/* MONUMENT TIMELINE */}
          <div style={{ padding: '32px 36px 48px', maxWidth: 860 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>{selectedTrip.monuments.length} etapes decouvertes</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFC00', border: '2px solid #0D0D0D' }} />
                <span style={{ fontSize: 11, color: '#8A8A8A', fontWeight: 500 }}>Monument identifie par TravelAI</span>
              </div>
            </div>

            <div style={{ position: 'relative', paddingLeft: 32 }}>
              <div style={{ position: 'absolute', left: 9, top: 22, bottom: 60, width: 1, background: 'linear-gradient(180deg,rgba(0,0,0,0.14) 0%,transparent 100%)' }} />

              {selectedTrip.monuments.map((m) => {
                const firstConv = m.conversations[0]
                const moreConvs = m.conversations.length - 1
                const cover = monumentCoverUrl(m)
                const tags = [selectedTrip.country, m.is_favorite ? 'Favori' : null].filter(Boolean) as string[]
                return (
                  <div key={m.id} style={{ position: 'relative', marginBottom: 28 }} data-fade="">
                    <div style={{ position: 'absolute', left: -28, top: 20, width: 14, height: 14, borderRadius: '50%', background: '#FFFC00', border: '2.5px solid #0D0D0D', zIndex: 1 }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', borderRadius: 7, padding: '4px 11px', fontSize: 11.5, fontWeight: 600, color: '#0D0D0D' }}>{fmt(m.visited_at)}</span>
                      {m.is_favorite && <span style={{ background: '#FFFC00', borderRadius: 7, padding: '4px 11px', fontSize: 11, fontWeight: 700, color: '#0D0D0D' }}>★ Favori</span>}
                      {selectedTrip.city && <span style={{ fontSize: 11, color: '#B0B0B0' }}>{selectedTrip.city}, {selectedTrip.country}</span>}
                    </div>

                    <div className="ta-monument-card" style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

                      <Link href={`/monuments/${m.id}`} style={{ position: 'relative', height: 210, overflow: 'hidden', display: 'block', textDecoration: 'none' }}>
                        <div style={{ width: '100%', height: '100%', background: cover ? `url('${cover}')` : 'linear-gradient(135deg,#e8e6e1,#cfccc5)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.72) 100%)' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 22px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.15 }}>{m.name}</div>
                              {selectedTrip.city && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                                  <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{selectedTrip.city}, {selectedTrip.country}</span>
                                </div>
                              )}
                            </div>
                            <div className="ta-view-btn" style={{ opacity: 0, transition: 'opacity 0.2s', flexShrink: 0 }}>
                              <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '8px 14px', fontSize: 11.5, fontWeight: 600, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>Voir →</div>
                            </div>
                          </div>
                        </div>
                      </Link>

                      <div style={{ padding: '20px 22px 22px' }}>
                        {tags.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                            {tags.map((tag) => (
                              <span key={tag} style={{ background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '4px 12px', fontSize: 11.5, fontWeight: 500, color: '#0D0D0D' }}>{tag}</span>
                            ))}
                          </div>
                        )}

                        <div style={{ background: '#FAFAF8', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13, paddingBottom: 11, borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <GhostIcon size={9} color="#0D0D0D" />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#0D0D0D' }}>TravelAI</span>
                            <span style={{ fontSize: 11, color: '#8A8A8A' }}>Conversation IA</span>
                            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: '#FFFC00', background: '#0D0D0D', borderRadius: 100, padding: '2px 9px' }}>Gemini</span>
                          </div>
                          {firstConv ? (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                                <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', borderRadius: '12px 12px 3px 12px', padding: '9px 14px', maxWidth: '82%' }}>
                                  <p style={{ fontSize: 13, color: '#0D0D0D', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>&ldquo;{firstConv.question}&rdquo;</p>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FFFC00', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                                  <GhostIcon size={9} color="#0D0D0D" />
                                </div>
                                <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)', borderRadius: '3px 12px 12px 12px', padding: '10px 14px', flex: 1 }}>
                                  <p style={{ fontSize: 13, color: '#0D0D0D', lineHeight: 1.65, margin: 0 }}>{firstConv.answer}</p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p style={{ fontSize: 12.5, color: '#8A8A8A' }}>Aucune conversation pour ce monument.</p>
                          )}
                          {moreConvs > 0 && (
                            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
                              <span style={{ fontSize: 11.5, color: '#8A8A8A', fontWeight: 500 }}>+ {moreConvs} autre(s) conversation(s)</span>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            {[
                              [m.conversations.length, 'conv.', <path key="c" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />],
                              [m.photos.filter((p) => p.stored).length, 'photo(s)', <><path key="p1" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle key="p2" cx="12" cy="13" r="4" /></>],
                            ].map(([n, unit, icon]) => (
                              <div key={String(unit)} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon as React.ReactNode}</svg>
                                <span style={{ fontSize: 11.5, color: '#8A8A8A', fontWeight: 500 }}>{n} {unit}</span>
                              </div>
                            ))}
                          </div>
                          <Link href={`/monuments/${m.id}`} className="ta-action-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.09)', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, color: '#0D0D0D', cursor: 'pointer', textDecoration: 'none' }}>
                            Voir le monument
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* MERGE PANEL */}
          {showMerge && (
            <div style={{ margin: '0 36px 48px', background: '#fff', borderRadius: 20, border: '0.5px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
              <div style={{ padding: '24px 28px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-0.4px' }}>Fusionner des voyages</h2>
                  <p style={{ fontSize: 13, color: '#8A8A8A', marginTop: 4, lineHeight: 1.6 }}>Regroupe des monuments sur une plage de dates dans un seul carnet.</p>
                </div>
                <button onClick={() => setShowMerge(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F7F7F7', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6B6B6B', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>✕</button>
              </div>
              <div className="ta-merge-grid" style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Titre du voyage *', value: mergeTitle, onChange: setMergeTitle, placeholder: 'Ex: Road trip France ete 2026', span: true, type: 'text' },
                  { label: 'Pays (optionnel)', value: mergeCountry, onChange: setMergeCountry, placeholder: 'Ex: France', span: true, type: 'text' },
                  { label: 'Du', value: mergeStart, onChange: setMergeStart, placeholder: '', span: false, type: 'date' },
                  { label: 'Au', value: mergeEnd, onChange: setMergeEnd, placeholder: '', span: false, type: 'date' },
                ].map(({ label, value, onChange, placeholder, span, type }) => (
                  <div key={label} style={{ gridColumn: span ? '1 / -1' : undefined }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#8A8A8A', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={placeholder}
                      style={{ width: '100%', padding: '11px 14px', border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 10, fontSize: 14, color: '#0D0D0D', outline: 'none', background: '#FAFAFA' }}
                    />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <button
                    onClick={handleMerge}
                    disabled={merging || !mergeTitle || !mergeStart || !mergeEnd}
                    style={{ width: '100%', background: '#FFFC00', border: 'none', borderRadius: 10, padding: 14, fontSize: 14, fontWeight: 700, color: '#0D0D0D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: merging ? 0.6 : 1 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    {merging ? 'Regroupement...' : 'Regrouper en un carnet de voyage'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
