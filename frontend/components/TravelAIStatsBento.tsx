/**
 * TravelAI — Statistiques de voyage · V2 "Bento" (Glass Voyager)
 *
 * Refonte : tout tient dans une grille bento — carte 2x2, tuiles pays / % monde /
 * continents / km / temps / photos+IA, drapeaux+villes, badges compacts,
 * "endroit le plus eloigne" en tuile sombre. Quiz conserve sous la grille.
 *
 * Reutilise la logique EXISTANTE a l'identique : useDashboard, computeBadges,
 * MapView (Leaflet, pins photo), Flag (flagcdn), helpers geo (haversineKm, PARIS,
 * continentFor, TOTAL_COUNTRIES_IN_WORLD). Aucune nouvelle dependance.
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { type Monument } from '@/lib/api'
import { ALL_CONTINENTS, continentFor, haversineKm, PARIS, TOTAL_COUNTRIES_IN_WORLD } from '@/lib/geo'
import { computeBadges } from '@/lib/badges'
import Flag from '@/components/Flag'
import { useDashboard } from '@/contexts/DashboardContext'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const CSS = `
  .tb-root { background: #F2F5F7; color: #0D1217; -webkit-font-smoothing: antialiased; }
  .tb-root *, .tb-root *::before, .tb-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .tb-tile { background: rgba(255,255,255,.78); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,.9); border-radius: 18px; box-shadow: 0 12px 34px rgba(15,40,70,.08); transition: box-shadow .2s ease; }
  .tb-tile:hover { box-shadow: 0 16px 44px rgba(15,40,70,.13); }
  .tb-quiz-btn { transition: background .15s, color .15s; cursor: pointer; }
  .tb-quiz-btn:hover { background: #0D1217 !important; color: #FFFC00 !important; }

  .tb-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: 118px; gap: 14px; }
  .tb-map { grid-column: span 2; grid-row: span 2; }
  .tb-span2 { grid-column: span 2; }
  @media (max-width: 980px) {
    .tb-grid { grid-template-columns: repeat(2,1fr); }
    .tb-map { grid-column: span 2; grid-row: span 2; }
  }
  @media (max-width: 600px) {
    .tb-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
    .tb-map, .tb-span2 { grid-column: span 1; }
    .tb-map { min-height: 260px; }
    .tb-tile, .tb-dark { min-height: 110px; }
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
  }, [target, durationMs])
  return value
}

function fmtMonthYear(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

function QuizCard({ monument }: { monument: Monument }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="tb-tile" style={{ padding: 18 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 8 }}>{monument.name}</div>
      <p style={{ fontSize: 13, color: '#4A555F', lineHeight: 1.55, marginBottom: 12, minHeight: 38 }}>{monument.trivia_question}</p>
      {revealed ? (
        <div style={{ background: '#FFFBE0', border: '0.5px solid rgba(255,220,0,0.45)', borderRadius: 10, padding: '10px 12px', fontSize: 13, lineHeight: 1.5 }}>
          {monument.trivia_answer}
        </div>
      ) : (
        <button className="tb-quiz-btn" onClick={() => setRevealed(true)} style={{ background: '#EDF1F4', border: '0.5px solid rgba(10,30,50,0.09)', borderRadius: 9, padding: '9px 14px', fontSize: 12.5, fontWeight: 600, color: '#0D1217' }}>
          Reveler la reponse ✨
        </button>
      )}
    </div>
  )
}

const BADGE_EMOJI: Record<string, string> = {
  'unesco-10': '🏛️',
  'asia-explorer': '🌏',
  'streak-5': '⚡',
  'first-carnet': '📖',
}

export default function TravelAIStatsBento() {
  const router = useRouter()
  const { data: session } = useSession()
  const { uuid, trips, loading, firstCarnetExportAt } = useDashboard()

  useEffect(() => {
    if (!uuid && session?.user?.anonymousUuid) {
      router.replace(`/dashboard/stats?uuid=${encodeURIComponent(session.user.anonymousUuid)}`)
    }
  }, [uuid, session, router])

  const allMonuments = useMemo(() => trips.flatMap((t) => t.monuments), [trips])

  /* ===== Calculs identiques a TravelAIStats.tsx ===== */
  const stats = useMemo(() => {
    const voyages = trips.length
    const photos = allMonuments.reduce((s, m) => s + m.photos.filter((p) => p.stored).length, 0)
    const discussions = allMonuments.reduce((s, m) => s + m.conversations.length, 0)

    const sorted = [...allMonuments].sort((a, b) => new Date(a.visited_at).getTime() - new Date(b.visited_at).getTime())
    let km = 0
    for (let i = 1; i < sorted.length; i++) {
      km += haversineKm(sorted[i - 1].latitude, sorted[i - 1].longitude, sorted[i].latitude, sorted[i].longitude)
    }

    const countries = new Map<string, Monument[]>()
    allMonuments.forEach((m) => {
      const trip = trips.find((t) => t.id === m.trip_id)
      const country = trip?.country
      if (!country) return
      countries.set(country, [...(countries.get(country) || []), m])
    })
    const continents = new Set(Array.from(countries.keys()).map(continentFor))

    const cities = new Map<string, { country: string | null; count: number }>()
    trips.forEach((t) => {
      if (!t.city) return
      const key = `${t.city}|${t.country || ''}`
      const existing = cities.get(key)
      cities.set(key, { country: t.country, count: (existing?.count || 0) + t.monuments.length })
    })

    const withDistance = allMonuments
      .map((m) => ({ monument: m, distance: haversineKm(PARIS.latitude, PARIS.longitude, m.latitude, m.longitude) }))
      .sort((a, b) => b.distance - a.distance)
    const farthest: Monument | null = withDistance[0]?.monument ?? null
    const farthestKm = withDistance[0]?.distance ?? 0
    const farthestTrip = farthest ? trips.find((t) => t.id === farthest!.trip_id) : null

    const totalMs = trips.reduce((sum, t) => {
      const start = new Date(t.started_at).getTime()
      const lastMonument = [...t.monuments].sort(
        (a, b) => new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime()
      )[0]
      const effectiveEnd = t.ended_at
        ? new Date(t.ended_at).getTime()
        : lastMonument
        ? new Date(lastMonument.visited_at).getTime()
        : start
      return sum + Math.max(0, effectiveEnd - start)
    }, 0)
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24))
    const totalHours = Math.floor((totalMs / (1000 * 60 * 60)) % 24)

    const firstTrip = [...trips].sort(
      (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
    )[0]

    return { voyages, photos, discussions, km: Math.round(km), countries, continents, cities, farthest, farthestKm: Math.round(farthestKm), farthestTrip, totalDays, totalHours, firstTrip }
  }, [trips, allMonuments])

  const animKm = useCountUp(stats.km)
  const animPhotos = useCountUp(stats.photos)
  const animDiscussions = useCountUp(stats.discussions)
  const animCountries = useCountUp(stats.countries.size)

  const worldPercent = stats.countries.size > 0 ? Math.round((stats.countries.size / TOTAL_COUNTRIES_IN_WORLD) * 1000) / 10 : 0
  const quizMonuments = allMonuments.filter((m) => m.trivia_question && m.trivia_answer)
  const badges = useMemo(() => computeBadges(trips, allMonuments, firstCarnetExportAt), [trips, allMonuments, firstCarnetExportAt])
  const unlockedCount = badges.filter((b) => b.unlocked).length

  if (!uuid || (loading && trips.length === 0)) {
    return (
      <div className="tb-root" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#8E99A3' }}>
        <style>{CSS}</style>
        Chargement...
      </div>
    )
  }

  return (
    <div className="tb-root">
      <style>{CSS}</style>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 28px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.8px' }}>Mes statistiques</h1>
            <span style={{ background: '#FFFC00', borderRadius: 100, padding: '3px 11px', fontSize: 12, fontWeight: 700, color: '#0D0D0D' }}>{new Date().getFullYear()}</span>
          </div>
          <span style={{ fontSize: 12.5, color: '#8E99A3' }}>
            {stats.firstTrip ? `Voyageur depuis ${fmtMonthYear(stats.firstTrip.started_at)}` : 'Aucun voyage encore'} · {stats.voyages} voyage(s)
          </span>
        </div>

        {/* ===== Grille bento ===== */}
        <div className="tb-grid">
          {/* Carte 2x2 — MapView Leaflet existant */}
          <div className="tb-tile tb-map" style={{ overflow: 'hidden', position: 'relative', padding: 0 }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <MapView monuments={allMonuments} />
            </div>
            <div style={{ position: 'absolute', top: 14, left: 16, zIndex: 500, background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '8px 13px', pointerEvents: 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Carte du monde</div>
              <div style={{ fontSize: 10.5, color: '#8E99A3' }}>{allMonuments.length} etape(s) · {stats.countries.size} pays</div>
            </div>
          </div>

          {/* Pays (sombre) */}
          <div className="tb-dark" style={{ background: '#0D1217', borderRadius: 18, padding: '18px 20px', color: '#F4F3EE', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-1.2px' }}>
              {animCountries} <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(244,243,238,.55)' }}>pays</span>
            </div>
            <div style={{ display: 'inline-flex', gap: 5, flexWrap: 'wrap' }}>
              {Array.from(stats.countries.keys()).map((c) => <Flag key={c} country={c} size={15} />)}
            </div>
          </div>

          {/* % du monde (jaune) */}
          <div style={{ position: 'relative', overflow: 'hidden', background: '#FFFC00', borderRadius: 18, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ position: 'absolute', top: -24, right: -24, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,.2)' }} />
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-1.2px', color: '#0D0D0D', position: 'relative' }}>{worldPercent}%</div>
            <div style={{ fontSize: 11.5, color: 'rgba(13,13,13,.7)', position: 'relative' }}>du monde visite · {stats.countries.size}/{TOTAL_COUNTRIES_IN_WORLD}</div>
          </div>

          {/* Continents */}
          <div className="tb-tile" style={{ padding: '16px 18px', overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
              Continents <span style={{ color: '#8E99A3', fontWeight: 500 }}>{stats.continents.size}/{ALL_CONTINENTS.length}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {ALL_CONTINENTS.map((continent) => {
                const visited = Array.from(stats.countries.keys()).some((c) => continentFor(c) === continent)
                return (
                  <span key={continent} style={{ fontSize: 10.5, fontWeight: visited ? 700 : 500, background: visited ? '#FFFC00' : '#EDF1F4', borderRadius: 100, padding: '4px 10px', color: visited ? '#0D0D0D' : '#B9C2CA' }}>
                    {continent}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Km */}
          <div className="tb-tile" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16 }}>✈️</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.8px' }}>{animKm.toLocaleString('fr-FR')} km</div>
              <div style={{ fontSize: 10.5, color: '#8E99A3' }}>parcourus</div>
            </div>
          </div>

          {/* Drapeaux + villes (span 2) */}
          <div className="tb-tile tb-span2" style={{ padding: '16px 20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Drapeaux collectes</span>
              <span style={{ fontSize: 10.5, color: '#8E99A3' }}>{stats.countries.size} pays · {stats.cities.size} ville(s)</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {Array.from(stats.countries.entries())
                .sort((a, b) => b[1].length - a[1].length)
                .map(([country, monuments]) => (
                  <span key={country} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F2F5F7', border: '1px solid rgba(10,30,50,.07)', borderRadius: 100, padding: '5px 12px', fontSize: 11.5, fontWeight: 600 }}>
                    <Flag country={country} size={12} />
                    {country} · {monuments.length}
                  </span>
                ))}
              {stats.cities.size > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F2F5F7', border: '1px solid rgba(10,30,50,.07)', borderRadius: 100, padding: '5px 12px', fontSize: 11.5, fontWeight: 500, color: '#5F6B75' }}>
                  {Array.from(stats.cities.keys()).map((k) => k.split('|')[0]).slice(0, 5).join(' · ')}{stats.cities.size > 5 ? '…' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Temps en voyage */}
          <div className="tb-tile" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16 }}>⏱</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.8px' }}>{stats.totalDays}j {stats.totalHours}h</div>
              <div style={{ fontSize: 10.5, color: '#8E99A3' }}>en voyage</div>
            </div>
          </div>

          {/* Photos + discussions */}
          <div className="tb-tile" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16 }}>💬</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.8px' }}>{animPhotos} · {animDiscussions}</div>
              <div style={{ fontSize: 10.5, color: '#8E99A3' }}>photos · discussions IA</div>
            </div>
          </div>

          {/* Badges (span 2) — computeBadges existant */}
          <div className="tb-tile tb-span2" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Defis et badges</span>
              <span style={{ background: '#FFFC00', borderRadius: 100, padding: '2px 10px', fontSize: 10.5, fontWeight: 700, color: '#0D0D0D' }}>{unlockedCount}/{badges.length}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {badges.map((badge) => (
                <span key={badge.code} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: badge.unlocked ? '#FFFC00' : '#EDF1F4', borderRadius: 12, padding: '10px 6px', opacity: badge.unlocked ? 1 : 0.7 }}>
                  <span style={{ fontSize: 15 }}>{BADGE_EMOJI[badge.code] ?? '🏅'}</span>
                  <span style={{ fontSize: 9.5, fontWeight: badge.unlocked ? 700 : 600, color: badge.unlocked ? '#0D0D0D' : '#5F6B75', textAlign: 'center', lineHeight: 1.3 }}>
                    {badge.name}{badge.unlocked ? ' ✓' : ` ${badge.progress}/${badge.target}`}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Endroit le plus eloigne (span 2, sombre) */}
          <div className="tb-span2 tb-dark" style={{ background: '#0D1217', borderRadius: 18, padding: '16px 20px', color: '#F4F3EE', display: 'flex', alignItems: 'center', gap: 14 }}>
            {stats.farthest ? (
              <>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🏠</span>
                <span style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg,rgba(255,252,0,.5) 0 6px,transparent 6px 12px)' }} />
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFC00' }}>{stats.farthestKm.toLocaleString('fr-FR')} km</div>
                  <div style={{ fontSize: 9.5, color: 'rgba(244,243,238,.55)' }}>le + loin de Paris</div>
                </div>
                <span style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg,rgba(255,252,0,.5) 0 6px,transparent 6px 12px)' }} />
                <Link href={`/monuments/${stats.farthest.id}`} style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: '#F4F3EE', flexShrink: 0 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 11, background: '#FFFC00', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{stats.farthest.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(244,243,238,.55)' }}>
                      {stats.farthestTrip ? [stats.farthestTrip.city, stats.farthestTrip.country].filter(Boolean).join(', ') : ''}
                    </div>
                  </div>
                </Link>
              </>
            ) : (
              <span style={{ fontSize: 12.5, color: 'rgba(244,243,238,.55)' }}>Aucun monument enregistre pour le moment.</span>
            )}
          </div>
        </div>

        {/* ===== Quiz (conserve) ===== */}
        {quizMonuments.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Quiz · Connais-tu tes monuments ?</h2>
            <p style={{ fontSize: 12, color: '#8E99A3', marginBottom: 16 }}>Genere automatiquement par TravelAI a partir de tes monuments</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
              {quizMonuments.map((m) => <QuizCard key={m.id} monument={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
