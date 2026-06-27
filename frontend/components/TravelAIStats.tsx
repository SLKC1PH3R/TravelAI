/**
 * TravelAI — Statistiques de voyage
 *
 * Stats calculees a partir des donnees reelles (fetchTrips), pas de mock.
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { fetchTrips, type Monument, type Trip } from '@/lib/api'
import { ALL_CONTINENTS, continentFor, flagFor, haversineKm, PARIS } from '@/lib/geo'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const CSS = `
  .ta-stats-root { background: #F4F3F1; color: #0D0D0D; -webkit-font-smoothing: antialiased; }
  .ta-stats-root *, .ta-stats-root *::before, .ta-stats-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ta-nav-pill { transition: color 0.15s, background 0.15s; }
  .ta-nav-pill:hover { color: #0D0D0D !important; background: rgba(0,0,0,0.04) !important; }
  .ta-stat-card { transition: box-shadow 0.2s; }
  .ta-stat-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07) !important; }
  .ta-country-bar { transition: width 0.6s cubic-bezier(0.22,1,0.36,1); }

  @media (max-width: 900px) {
    .ta-grid-4 { grid-template-columns: repeat(2,1fr) !important; }
  }
  @media (max-width: 600px) {
    .ta-grid-4 { grid-template-columns: 1fr !important; }
  }
`

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame: number
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return value
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function TravelAIStats() {
  const searchParams = useSearchParams()
  const uuid = searchParams.get('uuid') || ''

  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!uuid) return
    setLoading(true)
    fetchTrips(uuid)
      .then(setTrips)
      .finally(() => setLoading(false))
  }, [uuid])

  const allMonuments = useMemo(() => trips.flatMap((t) => t.monuments), [trips])

  const stats = useMemo(() => {
    const voyages = trips.length
    const photos = allMonuments.reduce((s, m) => s + m.photos.filter((p) => p.stored).length, 0)
    const discussions = allMonuments.reduce((s, m) => s + m.conversations.length, 0)

    const days = new Set(allMonuments.map((m) => new Date(m.visited_at).toDateString())).size

    const sorted = [...allMonuments].sort((a, b) => new Date(a.visited_at).getTime() - new Date(b.visited_at).getTime())
    let km = 0
    for (let i = 1; i < sorted.length; i++) {
      km += haversineKm(sorted[i - 1].latitude, sorted[i - 1].longitude, sorted[i].latitude, sorted[i].longitude)
    }

    const countries = new Map<string, number>()
    trips.forEach((t) => {
      if (!t.country) return
      countries.set(t.country, (countries.get(t.country) || 0) + t.monuments.length)
    })
    const continents = new Set(Array.from(countries.keys()).map(continentFor))

    const withDistance = allMonuments
      .map((m) => ({ monument: m, distance: haversineKm(PARIS.latitude, PARIS.longitude, m.latitude, m.longitude) }))
      .sort((a, b) => b.distance - a.distance)
    const farthest: Monument | null = withDistance[0]?.monument ?? null
    const farthestKm = withDistance[0]?.distance ?? 0

    return { voyages, photos, discussions, days, km: Math.round(km), countries, continents, farthest, farthestKm: Math.round(farthestKm) }
  }, [trips, allMonuments])

  const animDays = useCountUp(stats.days)
  const animKm = useCountUp(stats.km)
  const animVoyages = useCountUp(stats.voyages)
  const animPhotos = useCountUp(stats.photos)
  const animDiscussions = useCountUp(stats.discussions)

  const maxCountryCount = Math.max(1, ...Array.from(stats.countries.values()))

  if (!uuid) {
    return (
      <div className="ta-stats-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#6B6B6B' }}>
        <style>{CSS}</style>
        Connecte ton compte pour voir tes statistiques.
      </div>
    )
  }

  if (loading && trips.length === 0) {
    return (
      <div className="ta-stats-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#6B6B6B' }}>
        <style>{CSS}</style>
        Chargement...
      </div>
    )
  }

  return (
    <div className="ta-stats-root">
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: 'rgba(255,255,255,0.97)', borderBottom: '0.5px solid rgba(0,0,0,0.07)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#FFFC00', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="4" fill="#0D0D0D" /><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-0.4px' }}>TravelAI</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#F3F3F3', borderRadius: 9, padding: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0D0D0D', padding: '6px 14px', borderRadius: 7, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>Statistiques</span>
          <Link href={`/dashboard?uuid=${encodeURIComponent(uuid)}`} className="ta-nav-pill" style={{ fontSize: 13, fontWeight: 500, color: '#6B6B6B', textDecoration: 'none', padding: '6px 14px', borderRadius: 7 }}>Mes voyages</Link>
        </div>
        <div style={{ width: 110 }} />
      </nav>

      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '92px 28px 64px' }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 6 }}>Tes statistiques de voyage</h1>
        <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 32 }}>Calculees a partir de tes {stats.voyages} voyage(s) et {allMonuments.length} monument(s) identifies par TravelAI.</p>

        {/* COUNTERS */}
        <div className="ta-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { value: animDays, label: 'Jours de voyage' },
            { value: animKm, label: 'Km parcourus' },
            { value: animVoyages, label: 'Voyages' },
            { value: animPhotos, label: 'Photos' },
            { value: animDiscussions, label: 'Discussions IA' },
          ].map((c) => (
            <div key={c.label} className="ta-stat-card" style={{ background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.07)', padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.6px' }}>{c.value.toLocaleString('fr-FR')}</div>
              <div style={{ fontSize: 11, color: '#8A8A8A', marginTop: 6, fontWeight: 500 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* MAP */}
        <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '18px 22px 0' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Carte de tous tes monuments</h2>
          </div>
          <div style={{ padding: 18 }}>
            <MapView monuments={allMonuments} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }} className="ta-grid-4">
          {/* COUNTRIES */}
          <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Pays visites</h2>
            <p style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 16 }}>{stats.countries.size} pays - {stats.continents.size} continent(s)</p>
            {stats.countries.size === 0 ? (
              <p style={{ fontSize: 13, color: '#8A8A8A' }}>Aucun pays renseigne pour le moment.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array.from(stats.countries.entries())
                  .sort((a, b) => b[1] - a[1])
                  .map(([country, count]) => (
                    <div key={country}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 16 }}>{flagFor(country)}</span>{country}
                        </span>
                        <span style={{ fontSize: 12, color: '#8A8A8A' }}>{count} monument(s)</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 4, background: '#F0F0EE', overflow: 'hidden' }}>
                        <div className="ta-country-bar" style={{ height: '100%', width: `${(count / maxCountryCount) * 100}%`, background: '#FFFC00', borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {stats.continents.size > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16, paddingTop: 16, borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
                {ALL_CONTINENTS.filter((c) => stats.continents.has(c)).map((c) => (
                  <span key={c} style={{ background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '4px 12px', fontSize: 11.5, fontWeight: 500 }}>{c}</span>
                ))}
              </div>
            )}
          </div>

          {/* FARTHEST POINT */}
          <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Point le plus loin de Paris</h2>
            <p style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 16 }}>Distance a vol d&apos;oiseau depuis le point de depart</p>
            {stats.farthest ? (
              <Link
                href={`/monuments/${stats.farthest.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: '#0D0D0D' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stats.farthest.name}</div>
                  <div style={{ fontSize: 12, color: '#8A8A8A', marginTop: 3 }}>{fmtDate(stats.farthest.visited_at)}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>{stats.farthestKm.toLocaleString('fr-FR')} km de Paris</div>
                </div>
              </Link>
            ) : (
              <p style={{ fontSize: 13, color: '#8A8A8A' }}>Aucun monument enregistre pour le moment.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
