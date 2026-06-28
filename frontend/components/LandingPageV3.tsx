/**
 * TravelAI — Landing Page v3 (dark / noise texture / elastic hero)
 *
 * Design system :
 *  - Fond quasi noir (#080808) avec texture de bruit fixe en overlay
 *  - Jaune Snapchat (#FFFC00) comme unique accent, jamais dilue
 *  - Space Grotesk pour les titres, Inter pour le corps de texte
 *  - Nav transparente -> frosted glass au scroll
 *  - Reveal on scroll (IntersectionObserver, aucune lib externe)
 *
 * Placement : frontend/app/page.tsx -> <LandingPageV3 />
 * Images dans /public : /1.jpg /2.jpg /4.jpg /6.png /7.jpg /8.jpg /10.jpg
 */

'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const DEMO_URL = 'https://travelai.digitalstack.cloud/dashboard/stats?uuid=test-uuid-eiffel-001'

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

  .ta-v3-root { font-family: 'Inter', sans-serif; background: #080808; color: #F5F5F3; overflow-x: hidden; -webkit-font-smoothing: antialiased; position: relative; }
  .ta-v3-root *, .ta-v3-root *::before, .ta-v3-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ta-v3-root h1, .ta-v3-root h2, .ta-v3-root h3 { font-family: 'Space Grotesk', sans-serif; }
  html { scroll-behavior: smooth; }

  .ta-v3-noise { position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.045; background-image: url("${NOISE_SVG}"); mix-blend-mode: overlay; }

  @keyframes elasticIn {
    0%   { transform: translateY(70px) scale(0.85); opacity: 0; }
    55%  { transform: translateY(-10px) scale(1.04); opacity: 1; }
    75%  { transform: translateY(4px) scale(0.99); }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes glowPulse {
    0%,100% { opacity: 0.55; transform: scale(1); }
    50%      { opacity: 0.85; transform: scale(1.08); }
  }
  @keyframes scrollBounce {
    0%,100% { transform: translateX(-50%) translateY(0); }
    50%      { transform: translateX(-50%) translateY(8px); }
  }

  .ta-v3-line { display: block; animation: elasticIn 1s cubic-bezier(0.22,1.4,0.36,1) both; }
  .ta-v3-glow { animation: glowPulse 4s ease-in-out infinite; }
  .ta-v3-scroll-bounce { animation: scrollBounce 2s ease-in-out infinite; }

  .ta-v3-nav-cta:hover { box-shadow: 0 8px 24px rgba(255,252,0,0.35); transform: translateY(-1px); }
  .ta-v3-card { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s; }
  .ta-v3-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(0,0,0,0.5); }
  .ta-v3-card:hover .ta-v3-tag { opacity: 1 !important; transform: translateY(0) !important; }
  .ta-v3-tag { transition: opacity 0.3s, transform 0.3s; }

  .ta-v3-feat { position: relative; overflow: hidden; transition: border-color 0.3s; }
  .ta-v3-feat-bar { position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: #FFFC00; transform: scaleX(0); transform-origin: left; transition: transform 0.45s cubic-bezier(0.22,1,0.36,1); }
  .ta-v3-feat:hover .ta-v3-feat-bar { transform: scaleX(1); }
  .ta-v3-feat:hover { border-color: rgba(255,252,0,0.3) !important; }

  .ta-v3-cta-btn { transition: transform 0.2s, box-shadow 0.2s; }
  .ta-v3-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(255,252,0,0.4); }

  @media (max-width: 860px) {
    .ta-v3-hero-h1 { font-size: 58px !important; letter-spacing: -2px !important; }
    .ta-v3-trust { flex-wrap: wrap !important; gap: 20px !important; justify-content: center !important; }
    .ta-v3-cards { flex-wrap: wrap !important; }
    .ta-v3-feat-grid { flex-direction: column !important; }
  }
`

const TRUST_POINTS = [
  { icon: '🌍', label: '150+ pays couverts' },
  { icon: '⚡', label: '< 2s de reconnaissance' },
  { icon: '🤖', label: 'Propulse par Gemini' },
  { icon: '📄', label: 'Carnet PDF automatique' },
]

const MONUMENTS = [
  { src: '/6.png', name: 'Notre-Dame de Paris', city: 'Paris, France' },
  { src: '/4.jpg', name: 'Duomo di Milano', city: 'Milan, Italie' },
  { src: '/8.jpg', name: 'Statue de la Liberte', city: 'New York, USA' },
  { src: '/2.jpg', name: 'Mount Rushmore', city: 'Dakota du Sud, USA' },
  { src: '/1.jpg', name: 'Taj Mahal', city: 'Agra, Inde' },
  { src: '/7.jpg', name: 'Mont Saint-Michel', city: 'Normandie, France' },
  { src: '/10.jpg', name: 'Parthenon', city: 'Athenes, Grece' },
]

const FEATURES = [
  {
    icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    title: 'Reconnaissance instantanee',
    body: "Identifiez n'importe quel monument dans le monde en moins de 2 secondes grace a la vision par ordinateur et l'IA Gemini.",
  },
  {
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    title: 'Conversations IA',
    body: "Posez n'importe quelle question sur ce que vous voyez. Histoire, architecture, secrets — votre guide sait tout.",
  },
  {
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    title: 'Carnet de voyage PDF',
    body: 'Generez automatiquement un beau PDF avec vos photos, notes IA et decouvertes de chaque voyage.',
  },
]

function useCountUp(ref: React.RefObject<HTMLElement>, target: number, decimals = 0, suffix = '') {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      const dur = 1800
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1)
        const v = (1 - Math.pow(1 - p, 3)) * target
        el.textContent = (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('fr-FR')) + suffix
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      obs.unobserve(el)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, target, decimals, suffix])
}

function useRevealOnScroll() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        const delay = parseInt(el.dataset.delay ?? '0')
        setTimeout(() => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }, delay)
        obs.unobserve(el)
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll<HTMLElement>('[data-v3-fade]').forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)'
      obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
}

function useCardParallax() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-v3-parallax]'))
    const onScroll = () => {
      const vh = window.innerHeight
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const center = rect.top + rect.height / 2 - vh / 2
        const speed = parseFloat(card.dataset.v3Parallax || '0.06')
        card.style.transform = `translateY(${center * -speed}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

function NavBar() {
  const navRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const onScroll = () => {
      const scrolled = window.scrollY > 40
      nav.style.background = scrolled ? 'rgba(8,8,8,0.75)' : 'transparent'
      nav.style.backdropFilter = scrolled ? 'blur(14px)' : 'blur(0px)'
      nav.style.borderColor = scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav ref={navRef} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', borderBottom: '1px solid transparent', transition: 'background 0.35s, border-color 0.35s, backdrop-filter 0.35s' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
        <div style={{ width: 30, height: 30, background: '#FFFC00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="4" fill="#0D0D0D" /><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#F5F5F3', letterSpacing: '-0.4px', fontFamily: "'Space Grotesk', sans-serif" }}>TravelAI</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        <a href="#features" style={{ fontSize: 13.5, fontWeight: 500, color: 'rgba(245,245,243,0.6)', textDecoration: 'none' }}>Fonctionnalites</a>
        <a href="#monuments" style={{ fontSize: 13.5, fontWeight: 500, color: 'rgba(245,245,243,0.6)', textDecoration: 'none' }}>Monuments</a>
      </div>
      <Link href="/login" className="ta-v3-nav-cta" style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFC00', color: '#0D0D0D', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'transform 0.18s, box-shadow 0.18s' }}>
        Se connecter
      </Link>
    </nav>
  )
}

export default function LandingPageV3() {
  useRevealOnScroll()
  useCardParallax()

  const statMonuments = useRef<HTMLDivElement>(null)
  const statCountries = useRef<HTMLDivElement>(null)
  const statRating = useRef<HTMLDivElement>(null)
  useCountUp(statMonuments, 10000, 0, '+')
  useCountUp(statCountries, 150, 0, '+')
  useCountUp(statRating, 4.9, 1, '★')

  return (
    <div className="ta-v3-root">
      <style>{CSS}</style>
      <div className="ta-v3-noise" />

      <NavBar />

      {/* ===== HERO ===== */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '140px 48px 64px', zIndex: 2 }}>
        <div className="ta-v3-glow" style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: 720, height: 720, background: 'radial-gradient(circle, rgba(255,252,0,0.16) 0%, transparent 62%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,252,0,0.08)', border: '1px solid rgba(255,252,0,0.3)', borderRadius: 100, padding: '7px 16px', marginBottom: 36 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FFFC00', boxShadow: '0 0 8px rgba(255,252,0,0.9)' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#FFFC00', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Disponible sur Snapchat</span>
          </div>

          <h1 className="ta-v3-hero-h1" style={{ fontSize: 96, fontWeight: 700, lineHeight: 0.98, letterSpacing: '-4px', marginBottom: 32 }}>
            <span className="ta-v3-line" style={{ animationDelay: '0.05s' }}>Point.</span>
            <span className="ta-v3-line" style={{ animationDelay: '0.22s' }}>Ask.</span>
            <span className="ta-v3-line" style={{ animationDelay: '0.4s' }}>
              <span style={{ background: '#FFFC00', color: '#0D0D0D', padding: '3px 18px', borderRadius: 10 }}>Remember.</span>
            </span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.65, color: 'rgba(245,245,243,0.62)', maxWidth: 540, margin: '0 auto 44px' }}>
            Identifiez n&apos;importe quel monument en 2 secondes avec votre camera Snapchat. Votre guide de voyage IA, toujours dans votre poche.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a href={DEMO_URL} className="ta-v3-cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#FFFC00', color: '#0D0D0D', padding: '16px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              Voir le compte Demo
            </a>
            <a href="#monuments" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid rgba(245,245,243,0.22)', color: '#F5F5F3', padding: '15px 26px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
              Voir des exemples
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
            </a>
          </div>
        </div>

        {/* Trust bar */}
        <div className="ta-v3-trust" data-v3-fade="" data-delay="500" style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 48, marginTop: 80, flexWrap: 'wrap' }}>
          {TRUST_POINTS.map((p) => (
            <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 18 }}>{p.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(245,245,243,0.55)' }}>{p.label}</span>
            </div>
          ))}
        </div>

        <div className="ta-v3-scroll-bounce" style={{ position: 'absolute', bottom: 28, left: '50%' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(245,245,243,0.35)" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </div>
      </section>

      {/* ===== MONUMENTS (parallax cards) ===== */}
      <section id="monuments" style={{ position: 'relative', zIndex: 2, padding: '100px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div data-v3-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 14 }}>Deja identifies par TravelAI</h2>
          <p style={{ fontSize: 15, color: 'rgba(245,245,243,0.55)' }}>Un apercu des monuments reconnus en quelques secondes.</p>
        </div>

        <div className="ta-v3-cards" style={{ display: 'flex', gap: 20, maxWidth: 1280, margin: '0 auto', overflowX: 'auto', paddingBottom: 8 }}>
          {MONUMENTS.map((m, i) => (
            <div
              key={m.src}
              className="ta-v3-card"
              data-v3-fade=""
              data-delay={i * 70}
              data-v3-parallax={(0.03 + (i % 3) * 0.02).toFixed(2)}
              style={{ position: 'relative', flex: '0 0 220px', height: 300, borderRadius: 18, overflow: 'hidden', background: '#111' }}
            >
              <img src={m.src} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 45%,rgba(0,0,0,0.85) 100%)' }} />
              <div className="ta-v3-tag" style={{ position: 'absolute', top: 14, right: 14, opacity: 0, transform: 'translateY(-6px)', background: 'rgba(255,252,0,0.95)', color: '#0D0D0D', borderRadius: 100, padding: '4px 11px', fontSize: 10.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Identifie
              </div>
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{m.city}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ position: 'relative', zIndex: 2, padding: '100px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div data-v3-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-1.5px' }}>Tout ce qu&apos;il vous faut</h2>
        </div>
        <div className="ta-v3-feat-grid" style={{ display: 'flex', gap: 24, maxWidth: 1160, margin: '0 auto' }}>
          {FEATURES.map(({ icon, title, body }, i) => (
            <div key={title} className="ta-v3-feat" data-v3-fade="" data-delay={i * 100} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '36px 32px' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,252,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFC00" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.4px' }}>{title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'rgba(245,245,243,0.55)' }}>{body}</p>
              <div className="ta-v3-feat-bar" />
            </div>
          ))}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ position: 'relative', zIndex: 2, padding: '90px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div data-v3-fade="" style={{ display: 'flex', justifyContent: 'center', gap: 80, flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div ref={statMonuments} style={{ fontSize: 56, fontWeight: 700, color: '#FFFC00', letterSpacing: '-2.5px', fontFamily: "'Space Grotesk', sans-serif" }}>0</div>
            <div style={{ fontSize: 13.5, color: 'rgba(245,245,243,0.5)', marginTop: 8 }}>monuments identifies</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div ref={statCountries} style={{ fontSize: 56, fontWeight: 700, color: '#FFFC00', letterSpacing: '-2.5px', fontFamily: "'Space Grotesk', sans-serif" }}>0</div>
            <div style={{ fontSize: 13.5, color: 'rgba(245,245,243,0.5)', marginTop: 8 }}>pays couverts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div ref={statRating} style={{ fontSize: 56, fontWeight: 700, color: '#FFFC00', letterSpacing: '-2.5px', fontFamily: "'Space Grotesk', sans-serif" }}>0</div>
            <div style={{ fontSize: 13.5, color: 'rgba(245,245,243,0.5)', marginTop: 8 }}>note utilisateurs</div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ position: 'relative', zIndex: 2, padding: '140px 48px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', overflow: 'hidden' }}>
        <div className="ta-v3-glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 560, height: 560, background: 'radial-gradient(circle, rgba(255,252,0,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div data-v3-fade="" style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 50, fontWeight: 700, letterSpacing: '-2px', marginBottom: 18 }}>Commencez a explorer.</h2>
          <p style={{ fontSize: 16, color: 'rgba(245,245,243,0.55)', marginBottom: 40, lineHeight: 1.6 }}>
            Disponible via Snapchat Lens. Aucun telechargement. Juste ouvrir, pointer et decouvrir.
          </p>
          <Link href="/login" className="ta-v3-cta-btn" style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFC00', color: '#0D0D0D', padding: '18px 42px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            Se connecter
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ position: 'relative', zIndex: 2, padding: '32px 48px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <span style={{ fontSize: 12.5, color: 'rgba(245,245,243,0.3)' }}>© 2026 TravelAI — Cree avec passion a Paris ❤️</span>
      </footer>
    </div>
  )
}
