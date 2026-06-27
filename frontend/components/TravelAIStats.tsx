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
import { ALL_CONTINENTS, continentFor, flagFor, haversineKm, PARIS, TOTAL_COUNTRIES_IN_WORLD } from '@/lib/geo'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const CSS = `
  .ta-stats-root { background: #F4F3F1; color: #0D0D0D; -webkit-font-smoothing: antialiased; }
  .ta-stats-root *, .ta-stats-root *::before, .ta-stats-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ta-nav-pill { transition: color 0.15s, background 0.15s; }
  .ta-nav-pill:hover { color: #0D0D0D !important; background: rgba(0,0,0,0.04) !important; }
  .ta-stat-card { transition: box-shadow 0.2s; }
  .ta-stat-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07) !important; }
  .ta-country-bar { transition: width 0.6s cubic-bezier(0.22,1,0.36,1); }
  .ta-quiz-btn { transition: background 0.15s, color 0.15s; cursor: pointer; }
  .ta-quiz-btn:hover { background: #0D0D0D !important; color: #FFFC00 !important; }

  @media (max-width: 900px) {
    .ta-grid-4 { grid-template-columns: repeat(2,1fr) !important; }
    .ta-grid-2 { grid-template-columns: 1fr !important; }
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

function fmtMonthYear(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

function QuizCard({ monument }: { monument: Monument }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.07)', padding: 18 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 8 }}>{monument.name}</div>
      <p style={{ fontSize: 13, color: '#444', lineHeight: 1.55, marginBottom: 12, minHeight: 38 }}>{monument.trivia_question}</p>
      {revealed ? (
        <div style={{ background: '#FFFBE0', border: '0.5px solid rgba(255,220,0,0.45)', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#0D0D0D', lineHeight: 1.5 }}>
          {monument.trivia_answer}
        </div>
      ) : (
        <button
          className="ta-quiz-btn"
          onClick={() => setRevealed(true)}
          style={{ background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.09)', borderRadius: 9, padding: '9px 14px', fontSize: 12.5, fontWeight: 600, color: '#0D0D0D' }}
        >
          Reveler la reponse ✨
        </button>
      )}
    </div>
  )
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
      const end = t.ended_at ? new Date(t.ended_at).getTime() : sum
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
    const totalMinutes = Math.floor((totalMs / (1000 * 60)) % 60)

    const firstTrip = [...trips].sort(
      (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
    )[0]

    return {
      voyages,
      photos,
      discussions,
      km: Math.round(km),
      countries,
      continents,
      cities,
      farthest,
      farthestKm: Math.round(farthestKm),
      farthestTrip,
      totalDays,
      totalHours,
      totalMinutes,
      firstTrip,
    }
  }, [trips, allMonuments])

  const animKm = useCountUp(stats.km)
  const animVoyages = useCountUp(stats.voyages)
  const animPhotos = useCountUp(stats.photos)
  const animDiscussions = useCountUp(stats.discussions)
  const animDays = useCountUp(stats.totalDays)

  const worldPercent = stats.countries.size > 0 ? Math.round((stats.countries.size / TOTAL_COUNTRIES_IN_WORLD) * 1000) / 10 : 0
  const quizMonuments = allMonuments.filter((m) => m.trivia_question && m.trivia_answer)

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
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 6 }}>Mes statistiques</h1>
        <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 32 }}>
          {stats.firstTrip ? `Voyageur depuis ${fmtMonthYear(stats.firstTrip.started_at)}` : 'Aucun voyage encore'}
          {' · '}
          {stats.voyages} voyage(s) complete(s)
        </p>

        {/* VOUS AVEZ VU */}
        <div className="ta-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div className="ta-stat-card" style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Vous avez vu</p>
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-1px' }}>{stats.countries.size}</div>
            <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 2, marginBottom: 12 }}>pays explores</div>
            <div style={{ display: 'flex', gap: 6, fontSize: 22 }}>
              {Array.from(stats.countries.keys()).map((c) => <span key={c}>{flagFor(c)}</span>)}
            </div>
          </div>

          <div className="ta-stat-card" style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>🌍 du monde visite</p>
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-1px' }}>{worldPercent}%</div>
            <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 2 }}>{stats.countries.size} / {TOTAL_COUNTRIES_IN_WORLD} pays</div>
          </div>
        </div>

        {/* CONTINENTS VISITES */}
        <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Continents visites</h2>
          <p style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 16 }}>{stats.continents.size} sur 6 continents habites</p>
          <div className="ta-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {ALL_CONTINENTS.map((continent) => {
              const countriesInContinent = Array.from(stats.countries.keys()).filter((c) => continentFor(c) === continent)
              const visited = countriesInContinent.length > 0
              return (
                <div
                  key={continent}
                  style={{
                    borderRadius: 12,
                    padding: '12px 14px',
                    background: visited ? '#FFFBE0' : '#FAFAFA',
                    border: visited ? '0.5px solid rgba(255,220,0,0.5)' : '0.5px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: visited ? '#0D0D0D' : '#B0B0B0', marginBottom: 6 }}>{continent}</div>
                  <div style={{ fontSize: 16 }}>
                    {visited ? countriesInContinent.map((c) => flagFor(c)).join(' ') : <span style={{ fontSize: 11, color: '#C0C0C0' }}>Non visite</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* MAP */}
        <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '18px 22px 0' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Carte du monde</h2>
            <p style={{ fontSize: 12, color: '#8A8A8A', marginTop: 2 }}>
              Monuments decouverts · {allMonuments.length} etape(s) dans {stats.countries.size} pays
            </p>
          </div>
          <div style={{ padding: 18 }}>
            <MapView monuments={allMonuments} />
          </div>
        </div>

        <div className="ta-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* DRAPEAUX */}
          <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Drapeaux collectes</h2>
            <p style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 16 }}>{stats.countries.size} drapeau(x) · {stats.continents.size} continent(s)</p>
            {stats.countries.size === 0 ? (
              <p style={{ fontSize: 13, color: '#8A8A8A' }}>Aucun pays renseigne pour le moment.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Array.from(stats.countries.entries())
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([country, monuments]) => (
                    <div key={country} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FAFAF8', borderRadius: 12, padding: '10px 14px' }}>
                      <span style={{ fontSize: 24 }}>{flagFor(country)}</span>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{country}</div>
                        <div style={{ fontSize: 11, color: '#8A8A8A' }}>{monuments.length} monument(s)</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* VILLES VISITEES (remplace la section "Etats americains") */}
          <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Villes decouvertes</h2>
            <p style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 16 }}>{stats.cities.size} ville(s) visitee(s)</p>
            {stats.cities.size === 0 ? (
              <p style={{ fontSize: 13, color: '#8A8A8A' }}>Aucune ville renseignee pour le moment.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Array.from(stats.cities.entries()).map(([key, info]) => {
                  const city = key.split('|')[0]
                  return (
                    <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '6px 13px', fontSize: 12.5, fontWeight: 500 }}>
                      <span>{flagFor(info.country)}</span>{city}
                      <span style={{ color: '#B0B0B0' }}>· {info.count}</span>
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* TOUTES LES STATS */}
        <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Toutes les stats</h2>
          <div className="ta-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px' }}>
                {animDays}<span style={{ fontSize: 13, color: '#B0B0B0', fontWeight: 500 }}>j</span>{' '}
                {stats.totalHours}<span style={{ fontSize: 13, color: '#B0B0B0', fontWeight: 500 }}>h</span>{' '}
                {stats.totalMinutes}<span style={{ fontSize: 13, color: '#B0B0B0', fontWeight: 500 }}>m</span>
              </div>
              <div style={{ fontSize: 11, color: '#8A8A8A', marginTop: 6 }}>Temps en voyage</div>
            </div>
            {[
              { value: animVoyages, label: 'Voyages' },
              { value: animKm, label: 'Km parcourus' },
              { value: animPhotos, label: 'Photos prises' },
              { value: animDiscussions, label: 'Discussions IA' },
            ].map((c) => (
              <div key={c.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px' }}>{c.value.toLocaleString('fr-FR')}</div>
                <div style={{ fontSize: 11, color: '#8A8A8A', marginTop: 6 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ENDROIT LE PLUS ELOIGNE */}
        <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.07)', padding: 22, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Endroit le plus eloigne de chez moi</h2>
          <p style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 18 }}>Calcule depuis Paris, France</p>
          {stats.farthest ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🏠</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Paris</div>
                  <div style={{ fontSize: 11.5, color: '#8A8A8A' }}>France</div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 140, textAlign: 'center' }}>
                <div style={{ height: 1, background: 'repeating-linear-gradient(90deg,rgba(0,0,0,0.18) 0,rgba(0,0,0,0.18) 6px,transparent 6px,transparent 12px)' }} />
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{stats.farthestKm.toLocaleString('fr-FR')} km</div>
                <div style={{ fontSize: 10.5, color: '#8A8A8A' }}>vol direct estime</div>
              </div>

              <Link href={`/monuments/${stats.farthest.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#0D0D0D' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📍</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{stats.farthest.name}</div>
                  <div style={{ fontSize: 11.5, color: '#8A8A8A' }}>
                    {stats.farthestTrip ? [stats.farthestTrip.city, stats.farthestTrip.country].filter(Boolean).join(', ') : ''}
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#8A8A8A' }}>Aucun monument enregistre pour le moment.</p>
          )}
        </div>

        {/* QUIZ */}
        {quizMonuments.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Quiz · Connais-tu tes monuments ?</h2>
            <p style={{ fontSize: 12, color: '#8A8A8A', marginBottom: 16 }}>Genere automatiquement par TravelAI a partir de tes monuments</p>
            <div className="ta-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {quizMonuments.map((m) => <QuizCard key={m.id} monument={m} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
