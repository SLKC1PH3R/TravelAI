/**
 * TravelAI — Landing Page v2 (Polarsteps-style)
 *
 * Placement : frontend/app/page.tsx -> <LandingPageV2 />
 * Images dans /public : /2.jpg /4.jpg /6.png /8.jpg
 *
 * Adapte par rapport au design original :
 *  - Les CTA "Ouvrir le Lens / Open on Snapchat" pointent vers /login
 *    (vraie connexion Google) ou vers le compte demo, au lieu de liens
 *    externes snapchat.com qui ne menent nulle part.
 *  - Textes traduits en francais pour rester coherent avec le reste du site.
 */

'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const DEMO_URL = 'https://travelai.digitalstack.cloud/dashboard/stats?uuid=test-uuid-eiffel-001'

/* ===== Embedded CSS ===== */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  .ta-v2-root { font-family: 'Space Grotesk', sans-serif; background: #fff; color: #0D0D0D; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  .ta-v2-root *, .ta-v2-root *::before, .ta-v2-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  @keyframes heroIn {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatA {
    0%,100% { transform: rotate(-6deg) translateY(0); }
    50%      { transform: rotate(-6deg) translateY(-13px); }
  }
  @keyframes floatB {
    0%,100% { transform: rotate(5deg) translateY(0); }
    50%      { transform: rotate(5deg) translateY(-10px); }
  }
  @keyframes floatC {
    0%,100% { transform: rotate(-2deg) translateY(0); }
    50%      { transform: rotate(-2deg) translateY(-16px); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes scanPulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.3; }
  }
  @keyframes scanLine {
    0%   { top: 14%; opacity: 0.9; }
    100% { top: 70%; opacity: 0; }
  }
  @keyframes typingDot {
    0%,60%,100% { transform: translateY(0); opacity: 0.35; }
    30%          { transform: translateY(-5px); opacity: 1; }
  }
  @keyframes checkIn {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    70%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes scrollBounce {
    0%,100% { transform: translateX(-50%) translateY(0); }
    50%      { transform: translateX(-50%) translateY(8px); }
  }

  /* Scan corners */
  .ta-scan-corner { animation: scanPulse 2s ease-in-out infinite; }
  .ta-scan-line   { animation: scanLine 2.2s ease-in-out infinite; position: absolute; left: 22px; right: 22px; height: 1.5px; background: linear-gradient(90deg, transparent, #FFFC00, transparent); z-index: 20; }

  /* Polaroids */
  .ta-float-a { animation: floatA 7.5s ease-in-out infinite; }
  .ta-float-b { animation: floatB 8s ease-in-out infinite; animation-delay: 1.5s; }
  .ta-float-c { animation: floatC 9s ease-in-out infinite; animation-delay: 0.8s; }

  /* Check */
  .ta-check-in { animation: checkIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }

  /* Typing dots */
  .ta-dot-1 { animation: typingDot 1.2s ease-in-out infinite; }
  .ta-dot-2 { animation: typingDot 1.2s ease-in-out infinite; animation-delay: 0.2s; }
  .ta-dot-3 { animation: typingDot 1.2s ease-in-out infinite; animation-delay: 0.4s; }

  /* Scroll bounce */
  .ta-scroll-bounce { animation: scrollBounce 2s ease-in-out infinite; }

  /* Hover states */
  .ta-btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(255,252,0,0.5); }
  .ta-btn-ghost:hover    { border-color: rgba(255,255,255,0.8) !important; background: rgba(255,255,255,0.08) !important; }
  .ta-btn-cta:hover      { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(255,252,0,0.52); }
  .ta-feat-card:hover    { box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important; border-color: rgba(0,0,0,0) !important; }
  .ta-feat-card:hover .ta-feat-icon { background: #FFFC00; }
  .ta-nav-cta:hover      { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,252,0,0.45); }
  .ta-social-icon:hover  { background: rgba(255,255,255,0.14) !important; }
  .ta-footer-link:hover  { color: rgba(255,255,255,0.9) !important; }
  .ta-footer-url:hover   { color: rgba(255,255,255,0.65) !important; }

  /* Transitions */
  .ta-btn-primary, .ta-btn-cta { transition: transform 0.2s, box-shadow 0.2s; }
  .ta-btn-ghost  { transition: border-color 0.2s, background 0.2s; }
  .ta-feat-card  { transition: box-shadow 0.25s ease, border-color 0.25s ease; }
  .ta-feat-icon  { transition: background 0.2s; }
  .ta-nav-cta    { transition: transform 0.18s, box-shadow 0.18s; }
  .ta-social-icon, .ta-footer-link, .ta-footer-url { transition: color 0.2s, background 0.2s; }

  /* Responsive */
  @media (max-width: 960px) {
    .ta-hero-h1        { font-size: 56px !important; letter-spacing: -2.5px !important; }
    .ta-hero-content   { padding: 0 28px 72px !important; }
    .ta-polaroids      { display: none !important; }
    .ta-phone-wrapper  { flex-direction: column !important; align-items: center !important; gap: 48px !important; }
    .ta-phone-text-col { max-width: 480px !important; text-align: center !important; }
    .ta-progress-track { display: none !important; }
    .ta-feat-grid      { flex-wrap: wrap !important; }
    .ta-footer-inner   { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 24px !important; }
  }
`

/* ===== Constants ===== */
const GHOST_PATH =
  'M12 1.5C8.3 1.5 5.3 4.5 5.3 8.2v4.8l-1.6 1 .8 1.4.8-.5v1.3c-.6.2-1.5.8-1.9 2.1-.3 1-.1 2.2-.1 2.2s2.9-.4 4.2 1.4c.5.8 1.6 1.3 2.8 1.3 1.1 0 1.6-.2 1.6-.2s.6.2 1.6.2c1.2 0 2.3-.5 2.8-1.3 1.3-1.8 4.2-1.4 4.2-1.4s.2-1.2-.1-2.2c-.4-1.3-1.3-1.9-1.9-2.1v-1.3l.8.5.8-1.4-1.6-1V8.2C18.7 4.5 15.7 1.5 12 1.5z'

const DEMO_BGS = ['#ffffff', '#FFFEF3', '#FFFCE0', '#FFFC00']

const MARQUEE_ITEMS = [
  'Notre-Dame de Paris', 'Duomo di Milano', 'Statue de la Liberte', 'Mount Rushmore',
  'Tour Eiffel', 'Colisee de Rome', 'Sagrada Familia', 'Big Ben', 'Louvre',
  "Acropole d'Athenes", 'Machu Picchu', 'Angkor Wat',
]

const PANELS = [
  { step: '01 / 04', title: 'Ouvre\nSnapchat',         body: "Lance TravelAI depuis le Lens Explorer d'un simple tap. Aucun telechargement, aucun compte requis." },
  { step: '02 / 04', title: "Pointe.\nL'IA identifie.", body: "En moins de 2 secondes, TravelAI reconnait le monument, son epoque, son style architectural — n'importe ou dans le monde." },
  { step: '03 / 04', title: 'Pose tes\nquestions.',    body: 'Histoire, secrets, anecdotes cachees — ton guide IA repond a tout en temps reel, propulse par Google Gemini.' },
  { step: '04 / 04', title: 'Garde le\nsouvenir.',     body: 'Chaque monument est sauvegarde. Un carnet de voyage PDF est genere automatiquement avec tes photos et notes IA.' },
]

const FEATURES = [
  {
    icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    title: 'Reconnaissance instantanee',
    body: "Identifiez n'importe quel monument dans le monde en moins de 2 secondes grace a la vision par ordinateur et l'IA Gemini.",
    delay: 0,
  },
  {
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    title: 'Conversations IA',
    body: "Posez n'importe quelle question sur ce que vous voyez. Histoire, architecture, secrets — votre guide sait tout.",
    delay: 150,
  },
  {
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    title: 'Carnet de voyage PDF',
    body: 'Generez automatiquement un beau PDF avec vos photos, notes IA et decouvertes de chaque voyage.',
    delay: 300,
  },
]

const TESTIMONIALS = [
  { quote: '"J\'ai pointe mon telephone vers une eglise a Rome et TravelAI m\'a tout raconte — l\'annee de construction, le commanditaire et un passage secret sous l\'autel."', name: 'Sophie M.', role: 'Lyon, France', avatar: 'linear-gradient(135deg,#ffd3a5,#fd9853)', delay: 0 },
  { quote: '"Le PDF de carnet de voyage m\'a bluffe. 3 semaines de monuments, de notes IA et de photos compilees automatiquement. Imprime et offert a mes parents — ils ont pleure."', name: 'James T.', role: 'London, UK', avatar: 'linear-gradient(135deg,#c8f7c5,#4caf50)', delay: 150 },
  { quote: '"Une semaine au Japon, chaque temple, chaque sanctuaire — TravelAI les connaissait tous. Sans Wi-Fi, sans taper de texte, juste pointer et decouvrir."', name: 'Yuki N.', role: 'Tokyo, JP', avatar: 'linear-gradient(135deg,#a8d8ea,#6fb3cf)', delay: 300 },
]

/* ===== Ghost SVG ===== */
function Ghost({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d={GHOST_PATH} /></svg>
}

/* ===== Main Component ===== */
export default function LandingPageV2() {
  const navRef         = useRef<HTMLElement>(null)
  const heroBgRef      = useRef<HTMLDivElement>(null)
  const phoneSectionRef = useRef<HTMLElement>(null)
  const phoneMockupRef  = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const demoBgRef       = useRef<HTMLDivElement>(null)
  const currentScreenRef = useRef(-1)

  useEffect(() => {
    const nav         = navRef.current
    const heroBg      = heroBgRef.current
    const phoneSection = phoneSectionRef.current
    const phoneMockup  = phoneMockupRef.current
    const progressFill = progressFillRef.current
    const demoBg       = demoBgRef.current
    const navLogo      = nav?.querySelector<HTMLElement>('[data-nav-logo]')
    const navLinks     = nav ? Array.from(nav.querySelectorAll<HTMLElement>('[data-nav-link]')) : []
    const phoneScreens = Array.from(document.querySelectorAll<HTMLElement>('[data-phone-screen]'))
    const phonePanels  = Array.from(document.querySelectorAll<HTMLElement>('[data-phone-panel]'))
    const stepDots     = Array.from(document.querySelectorAll<HTMLElement>('[data-step-dot]'))

    const entranceObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && phoneMockup) {
        phoneMockup.style.transform = 'translateY(0) scale(1)'
        entranceObs.disconnect()
      }
    }, { threshold: 0.2 })
    if (phoneSection) entranceObs.observe(phoneSection)

    const switchScreen = (idx: number) => {
      if (idx === currentScreenRef.current) return
      phoneScreens.forEach((s, i) => {
        s.style.opacity   = i === idx ? '1' : '0'
        s.style.transform = i === idx ? 'translateY(0)' : i < idx ? 'translateY(-22px)' : 'translateY(22px)'
      })
      phonePanels.forEach((p, i) => {
        p.style.opacity   = i === idx ? '1' : '0'
        p.style.transform = i === idx ? 'translateY(0)' : i < idx ? 'translateY(-24px)' : 'translateY(24px)'
      })
      stepDots.forEach((d, i) => {
        d.style.width      = i === idx ? '28px' : '8px'
        d.style.background = i === idx ? '#0D0D0D' : 'rgba(0,0,0,0.15)'
      })
      if (demoBg) demoBg.style.background = DEMO_BGS[idx] ?? '#fff'
      currentScreenRef.current = idx
    }

    const onScroll = () => {
      const sy = window.scrollY

      if (nav) {
        const scrolled = sy > 40
        nav.style.background      = scrolled ? 'rgba(255,255,255,0.97)' : 'transparent'
        nav.style.boxShadow       = scrolled ? '0 1px 20px rgba(0,0,0,0.07)' : 'none'
        nav.style.borderColor     = scrolled ? 'rgba(0,0,0,0.06)' : 'transparent'
        nav.style.backdropFilter  = scrolled ? 'blur(16px)' : 'blur(0px)'
        if (navLogo) navLogo.style.color = scrolled ? '#0D0D0D' : '#fff'
        navLinks.forEach(l => { l.style.color = scrolled ? '#6B6B6B' : 'rgba(255,255,255,0.75)' })
      }

      if (heroBg) heroBg.style.transform = `translateY(${sy * 0.32}px)`

      if (phoneSection && progressFill) {
        const rect     = phoneSection.getBoundingClientRect()
        const totalH   = phoneSection.offsetHeight - window.innerHeight
        const scrolled = -rect.top
        const progress = Math.max(0, Math.min(1, scrolled / totalH))
        progressFill.style.height = `${progress * 100}%`
        switchScreen(Math.min(3, Math.floor(progress * 4)))
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el    = entry.target as HTMLElement
        const delay = parseInt(el.dataset.delay ?? '0')
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }, delay)
        fadeObs.unobserve(el)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll<HTMLElement>('[data-fade]').forEach(el => {
      el.style.opacity   = '0'
      el.style.transform = 'translateY(24px)'
      el.style.transition = 'opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)'
      fadeObs.observe(el)
    })

    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el      = entry.target as HTMLElement
        const target  = parseFloat(el.dataset.count ?? '0')
        const suffix  = el.dataset.suffix ?? ''
        const decimal = el.dataset.decimal === 'true'
        const dur = 2000, t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1)
          const v = (1 - Math.pow(1 - p, 3)) * target
          el.textContent = (decimal ? v.toFixed(1) : Math.round(v).toLocaleString('fr-FR')) + suffix
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        countObs.unobserve(el)
      })
    }, { threshold: 0.5 })
    document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      fadeObs.disconnect()
      countObs.disconnect()
      entranceObs.disconnect()
    }
  }, [])

  return (
    <div className="ta-v2-root">
      <style>{CSS}</style>

      {/* ===== NAV ===== */}
      <nav ref={navRef} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', transition: 'background 0.35s,box-shadow 0.35s,border-color 0.35s', borderBottom: '1px solid transparent', backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, background: '#FFFC00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="4" fill="#0D0D0D" /><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <span data-nav-logo="" style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px', transition: 'color 0.3s' }}>TravelAI</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <a data-nav-link="" href="#phone-section" style={{ fontSize: 13.5, fontWeight: 500, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.2s' }}>Comment ca marche</a>
          <a data-nav-link="" href="#features" style={{ fontSize: 13.5, fontWeight: 500, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.2s' }}>Fonctionnalites</a>
        </div>
        <Link href="/login" className="ta-nav-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFC00', color: '#0D0D0D', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Se connecter
        </Link>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: '#0D0D0D' }}>
        <div ref={heroBgRef} style={{ position: 'absolute', inset: 0, backgroundImage: "url('/mountain.jpg')", backgroundSize: 'cover', backgroundPosition: 'center top', transformOrigin: 'center top', willChange: 'transform' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.28) 38%,rgba(0,0,0,0.88) 100%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '55%', height: '100%', background: 'linear-gradient(120deg,rgba(255,252,0,0.09) 0%,transparent 50%)', pointerEvents: 'none' }} />

        <div className="ta-polaroids" style={{ position: 'absolute', top: 80, right: 60, width: 400, height: 480, pointerEvents: 'none' }}>
          {[
            { src: '/4.jpg', label: 'Duomo · Milan',   cls: 'ta-float-a', s: { top: 20,   right: 0,   width: 150, h: 112 } },
            { src: '/8.jpg', label: 'Liberte · NYC',   cls: 'ta-float-b', s: { top: 160,  right: 170, width: 140, h: 105 } },
            { src: '/2.jpg', label: 'Rushmore · USA',  cls: 'ta-float-c', s: { bottom: 80, right: 20, width: 144, h: 108 } },
          ].map(({ src, label, cls, s: { h, ...pos } }) => (
            <div key={src} className={cls} style={{ position: 'absolute', ...pos, background: '#fff', padding: '9px 9px 36px', borderRadius: 3, boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}>
              <img src={src} alt={label} style={{ width: '100%', height: h, objectFit: 'cover', display: 'block', borderRadius: 1 }} />
              <div style={{ marginTop: 9, fontSize: 9, fontWeight: 600, color: '#6B6B6B', textAlign: 'center', letterSpacing: '0.03em' }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="ta-hero-content" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 80px 100px', maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,252,0,0.14)', border: '1px solid rgba(255,252,0,0.38)', borderRadius: 100, padding: '7px 16px', width: 'fit-content', marginBottom: 28, animation: 'heroIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FFFC00', boxShadow: '0 0 8px rgba(255,252,0,0.9)' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#FFFC00', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Disponible sur Snapchat</span>
          </div>

          <h1 className="ta-hero-h1" style={{ fontSize: 108, fontWeight: 700, lineHeight: 0.91, letterSpacing: '-5px', color: '#fff', marginBottom: 30 }}>
            <span style={{ display: 'block', animation: 'heroIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.28s both' }}>Vise.</span>
            <span style={{ display: 'block', animation: 'heroIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.44s both' }}>Demande.</span>
            <span style={{ display: 'block', animation: 'heroIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s both' }}>
              <mark style={{ background: '#FFFC00', color: '#0D0D0D', padding: '3px 18px', borderRadius: 10, fontStyle: 'normal' }}>Souviens-toi.</mark>
            </span>
          </h1>

          <p style={{ fontSize: 19, lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', marginBottom: 44, maxWidth: 500, fontWeight: 400, animation: 'heroIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.78s both' }}>
            Identifiez n&apos;importe quel monument en 2 secondes avec votre camera Snapchat. Votre guide de voyage IA, toujours dans votre poche.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', animation: 'heroIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.93s both' }}>
            <a href={DEMO_URL} className="ta-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#FFFC00', color: '#0D0D0D', padding: '16px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              <Ghost size={17} />&nbsp;Voir le compte Demo
            </a>
            <a href="#phone-section" className="ta-btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', padding: '15px 26px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
              Voir comment ca marche
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 44, animation: 'heroIn 0.9s cubic-bezier(0.22,1,0.36,1) 1.08s both' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {['linear-gradient(135deg,#a8d8ea,#6fb3cf)', 'linear-gradient(135deg,#ffd3a5,#fd9853)', 'linear-gradient(135deg,#c8f7c5,#4caf50)'].map((bg, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', border: '2.5px solid rgba(0,0,0,0.4)', background: bg, marginRight: i < 2 ? -9 : 0, zIndex: 3 - i, position: 'relative' }} />
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12.5, color: '#FFFC00', letterSpacing: 1.5, marginBottom: 2 }}>★★★★★</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Adore par <strong style={{ color: 'rgba(255,255,255,0.85)' }}>10 000+</strong> voyageurs</div>
            </div>
          </div>
        </div>

        <div className="ta-scroll-bounce" style={{ position: 'absolute', bottom: 36, left: '50%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div style={{ background: '#0D0D0D', padding: '15px 0', overflow: 'hidden', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 40s linear infinite', alignItems: 'center' }}>
          {[0, 1].map((pass) => (
            <span key={pass} style={{ display: 'inline-flex', alignItems: 'center', gap: 28, paddingRight: 28, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              {MARQUEE_ITEMS.map((name, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
                  <span>{name}</span>
                  <span style={{ color: '#FFFC00', fontSize: 6 }}>●</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ===== STICKY PHONE DEMO ===== */}
      <section id="phone-section" ref={phoneSectionRef} style={{ height: '400vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div ref={demoBgRef} style={{ position: 'absolute', inset: 0, background: '#ffffff', transition: 'background 1.2s cubic-bezier(0.22,1,0.36,1)' }} />

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1260, margin: '0 auto', padding: '0 72px' }}>
            <div className="ta-phone-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 64 }}>

              <div className="ta-phone-text-col" style={{ flex: 1, position: 'relative', paddingLeft: 28 }}>
                <div className="ta-progress-track" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 2 }}>
                  <div ref={progressFillRef} style={{ width: '100%', height: '0%', background: '#FFFC00', borderRadius: 2, transition: 'height 0.15s linear' }} />
                </div>

                <div style={{ position: 'relative', minHeight: 300 }}>
                  {PANELS.map(({ step, title, body }, i) => (
                    <div key={i} data-phone-panel={i} style={{ position: 'absolute', inset: 0, opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.55s cubic-bezier(0.22,1,0.36,1),transform 0.55s cubic-bezier(0.22,1,0.36,1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                        <div style={{ width: 28, height: 2, background: '#FFFC00', borderRadius: 2 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFC00', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{step}</span>
                      </div>
                      <h2 style={{ fontSize: 54, fontWeight: 700, letterSpacing: '-2.5px', color: '#0D0D0D', lineHeight: 1.02, marginBottom: 20, whiteSpace: 'pre-line' }}>{title}</h2>
                      <p style={{ fontSize: 17, lineHeight: 1.7, color: '#6B6B6B', maxWidth: 400 }}>{body}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 44 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} data-step-dot={i} style={{ height: 4, borderRadius: 2, background: i === 0 ? '#0D0D0D' : 'rgba(0,0,0,0.15)', width: i === 0 ? 28 : 8, transition: 'width 0.35s cubic-bezier(0.22,1,0.36,1),background 0.35s' }} />
                  ))}
                </div>
              </div>

              <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div ref={phoneMockupRef} style={{ width: 292, height: 596, background: '#111', borderRadius: 44, boxShadow: '0 48px 96px rgba(0,0,0,0.22),0 0 0 1.5px rgba(255,255,255,0.07) inset,0 0 0 9px #1c1c1c', overflow: 'hidden', position: 'relative', transform: 'translateY(28px) scale(0.93)', transition: 'transform 1s cubic-bezier(0.22,1,0.36,1)' }}>
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 104, height: 31, background: '#111', borderRadius: '0 0 22px 22px', zIndex: 50 }} />

                  {/* Screen 0: Scan */}
                  <div data-phone-screen={0} style={{ position: 'absolute', inset: 0, opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1),transform 0.65s cubic-bezier(0.22,1,0.36,1)' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/6.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.82 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.4) 0%,transparent 35%,transparent 50%,rgba(0,0,0,0.75) 100%)' }} />
                    <div style={{ position: 'absolute', top: 36, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 20 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>9:41</span>
                      <Ghost size={28} color="white" />
                      <div style={{ display: 'flex', gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.75)' }} />)}</div>
                    </div>
                    {[
                      { top: 84,  left: 22,  borderLeft: '2.5px solid #FFFC00', borderTop: '2.5px solid #FFFC00',    borderRadius: '3px 0 0 0', delay: '0s' },
                      { top: 84,  right: 22, borderRight: '2.5px solid #FFFC00', borderTop: '2.5px solid #FFFC00',   borderRadius: '0 3px 0 0', delay: '0.3s' },
                      { top: 270, left: 22,  borderLeft: '2.5px solid #FFFC00', borderBottom: '2.5px solid #FFFC00', borderRadius: '0 0 0 3px', delay: '0.6s' },
                      { top: 270, right: 22, borderRight: '2.5px solid #FFFC00',borderBottom: '2.5px solid #FFFC00', borderRadius: '0 0 3px 0', delay: '0.9s' },
                    ].map((s, i) => {
                      const { delay, ...rest } = s
                      return <div key={i} className="ta-scan-corner" style={{ position: 'absolute', width: 34, height: 34, zIndex: 20, animationDelay: delay, ...rest }} />
                    })}
                    <div className="ta-scan-line" />
                    <div style={{ position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,252,0,0.5)', borderRadius: 100, padding: '6px 14px', whiteSpace: 'nowrap', zIndex: 21 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#FFFC00', letterSpacing: '0.06em' }}>◎ TravelAI</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}> — Analyse en cours...</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, textAlign: 'center', zIndex: 20 }}>
                      <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Pointe vers un monument</span>
                    </div>
                  </div>

                  {/* Screen 1: Detection */}
                  <div data-phone-screen={1} style={{ position: 'absolute', inset: 0, opacity: 0, transform: 'translateY(22px)', transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1),transform 0.65s cubic-bezier(0.22,1,0.36,1)' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/6.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.75 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.3) 0%,transparent 40%,rgba(0,0,0,0.9) 100%)' }} />
                    <div style={{ position: 'absolute', top: 36, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 20 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>9:41</span>
                      <Ghost size={28} color="white" />
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>●●●</span>
                    </div>
                    <div style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div className="ta-check-in" style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 8px rgba(255,252,0,0.2),0 0 0 16px rgba(255,252,0,0.08)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 100, padding: '5px 14px' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: '#FFFC00' }}>Identifie !</span>
                      </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderRadius: '22px 22px 0 0', padding: '20px 20px 32px', zIndex: 25, borderTop: '2.5px solid #FFFC00' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#0D0D0D', marginBottom: 8, letterSpacing: '-0.4px' }}>Notre-Dame de Paris</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {['Gothique', 'Paris, FR'].map(t => <span key={t} style={{ background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 100, padding: '3px 10px', fontSize: 9.5, fontWeight: 500, color: '#0D0D0D' }}>{t}</span>)}
                        <span style={{ background: '#FFFC00', borderRadius: 100, padding: '3px 10px', fontSize: 9.5, fontWeight: 700, color: '#0D0D0D' }}>UNESCO</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#8A8A8A', lineHeight: 1.55 }}>Chef-d&apos;oeuvre du gothique francais, commence en 1163...</div>
                    </div>
                  </div>

                  {/* Screen 2: AI Chat */}
                  <div data-phone-screen={2} style={{ position: 'absolute', inset: 0, opacity: 0, transform: 'translateY(22px)', transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1),transform 0.65s cubic-bezier(0.22,1,0.36,1)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '36px 16px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.07)', background: '#fff', textAlign: 'center' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0D0D0D' }}>Notre-Dame de Paris</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 3 }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ghost size={7} color="#0D0D0D" /></div>
                        <span style={{ fontSize: 9.5, color: '#8A8A8A' }}>TravelAI · Gemini</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ background: '#F3F3F3', borderRadius: '12px 12px 3px 12px', padding: '9px 12px', maxWidth: '80%' }}>
                          <p style={{ fontSize: 11.5, color: '#0D0D0D', margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>&ldquo;En quelle annee a-t-elle ete construite ?&rdquo;</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FFFC00', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}><Ghost size={9} color="#0D0D0D" /></div>
                        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '3px 12px 12px 12px', padding: '9px 12px', flex: 1 }}>
                          <p style={{ fontSize: 11, color: '#0D0D0D', lineHeight: 1.6, margin: 0 }}>La construction a debute en <strong>1163</strong> sous l&apos;eveque Maurice de Sully, et s&apos;est achevee pour l&apos;essentiel au <strong>14e siecle</strong>.</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ background: '#F3F3F3', borderRadius: '12px 12px 3px 12px', padding: '9px 12px', maxWidth: '80%' }}>
                          <p style={{ fontSize: 11.5, color: '#0D0D0D', margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>&ldquo;Et sa hauteur ?&rdquo;</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FFFC00', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ghost size={9} color="#0D0D0D" /></div>
                        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', borderRadius: '3px 12px 12px 12px', padding: '11px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                          <div className="ta-dot-1" style={{ width: 6, height: 6, borderRadius: '50%', background: '#B0B0B0' }} />
                          <div className="ta-dot-2" style={{ width: 6, height: 6, borderRadius: '50%', background: '#B0B0B0' }} />
                          <div className="ta-dot-3" style={{ width: 6, height: 6, borderRadius: '50%', background: '#B0B0B0' }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '10px 12px', borderTop: '0.5px solid rgba(0,0,0,0.07)', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ flex: 1, background: '#F5F5F5', borderRadius: 20, padding: '9px 13px', fontSize: 11, color: '#B0B0B0' }}>Posez une question...</div>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2.5} strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Screen 3: Journal */}
                  <div data-phone-screen={3} style={{ position: 'absolute', inset: 0, opacity: 0, transform: 'translateY(22px)', transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1),transform 0.65s cubic-bezier(0.22,1,0.36,1)', background: '#F4F3F1', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '40px 16px 14px', background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.07)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0D0D0D' }}>Mon carnet de voyage</div>
                      <div style={{ fontSize: 10, color: '#8A8A8A', marginTop: 2 }}>3 monuments · Europe 2026</div>
                    </div>
                    <div style={{ margin: '14px 12px', background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', height: 72, overflow: 'hidden' }}>
                        {['/6.png', '/4.jpg', '/8.jpg'].map((src, i) => (
                          <div key={src} style={{ flex: 1, backgroundImage: `url('${src}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderLeft: i > 0 ? '0.5px solid #fff' : undefined }} />
                        ))}
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0D0D0D', marginBottom: 4 }}>Notre-Dame · Duomo · Liberte</div>
                        <div style={{ fontSize: 10, color: '#8A8A8A', marginBottom: 12 }}>28 mai - 7 juin 2026 · 3 etapes</div>
                        <div style={{ background: '#FFFC00', borderRadius: 9, padding: 9, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#0D0D0D' }}>Telecharger le carnet PDF</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ margin: '0 12px', background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.07)', padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0D0D0D' }}>Sauvegarde dans ton carnet</div>
                        <div style={{ fontSize: 10, color: '#8A8A8A', marginTop: 1 }}>Notre-Dame · il y a quelques secondes</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ background: '#fff', padding: '110px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 16px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Fonctionnalites</span>
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-2px', lineHeight: 1.05 }}>
              Tout ce qu&apos;il vous faut<br />pour explorer plus intelligemment
            </h2>
          </div>
          <div className="ta-feat-grid" style={{ display: 'flex', gap: 24 }}>
            {FEATURES.map(({ icon, title, body, delay }) => (
              <div key={title} className="ta-feat-card" data-fade="" data-delay={delay} style={{ flex: 1, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)', padding: '36px 32px' }}>
                <div className="ta-feat-icon" style={{ width: 48, height: 48, borderRadius: 12, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <div style={{ width: 32, height: 2, background: '#FFFC00', borderRadius: 2, marginBottom: 20 }} />
                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#0D0D0D', marginBottom: 12, letterSpacing: '-0.5px' }}>{title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: '#6B6B6B' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section style={{ background: '#FFFC00', padding: '90px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div data-fade="" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 72, flexWrap: 'wrap', gap: 48 }}>
            {[
              { count: '10000', suffix: '+',  label: 'monuments identifies' },
              { count: '150',   suffix: '+',  label: 'pays couverts' },
              { count: '4.9',   suffix: '★',  label: 'note utilisateurs', decimal: 'true' },
            ].map(({ count, suffix, label, decimal }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-3px', lineHeight: 1 }} data-count={count} data-suffix={suffix} data-decimal={decimal}>{count}{suffix}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'rgba(13,13,13,0.6)', marginTop: 10 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {TESTIMONIALS.map(({ quote, name, role, avatar, delay }) => (
              <div key={name} data-fade="" data-delay={delay} style={{ flex: 1, minWidth: 260, background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 22, color: '#FFFC00', marginBottom: 12 }}>★★★★★</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#0D0D0D', marginBottom: 20, fontStyle: 'italic' }}>{quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: avatar }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0D0D0D' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#6B6B6B' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ background: '#fff', padding: '120px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div data-fade="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 16px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFFC00', boxShadow: '0 0 6px rgba(255,252,0,0.7)' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0D0D0D', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Gratuit</span>
          </div>
          <h2 data-fade="" data-delay="80" style={{ fontSize: 58, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: 18 }}>
            Commencez<br />a explorer.
          </h2>
          <p data-fade="" data-delay="160" style={{ fontSize: 17, color: '#6B6B6B', lineHeight: 1.6, marginBottom: 44 }}>
            Disponible via Snapchat Lens. Aucun telechargement. Juste ouvrir, pointer et decouvrir.
          </p>
          <Link href="/login" data-fade="" data-delay="240" className="ta-btn-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#FFFC00', color: '#0D0D0D', padding: '18px 42px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', marginBottom: 28 }}>
            Se connecter
          </Link>
          <div data-fade="" data-delay="320" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: 0.4 }}>
            <Ghost size={15} color="#0D0D0D" />
            <span style={{ fontSize: 12.5, color: '#0D0D0D', fontWeight: 500 }}>Propulse par Google Gemini</span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: '#0D0D0D', padding: '52px 80px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className="ta-footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, background: '#FFFC00', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="4" fill="#0D0D0D" /><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px' }}>TravelAI</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
              {[['Confidentialite', '#'], ['CGU', '#'], ['Contact', 'mailto:hello@travelai.digitalstack.cloud']].map(([label, href]) => (
                <a key={label} href={href} className="ta-footer-link" style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{label}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)', paddingTop: 24, textAlign: 'center' }}>
            <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.28)' }}>© 2026 TravelAI — Cree avec passion a Paris ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
