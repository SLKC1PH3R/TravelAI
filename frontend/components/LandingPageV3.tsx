/**
 * TravelAI — Landing Page v3 (dark / noise texture / elastic hero)
 *
 * Design system :
 *  - Fond quasi noir (#121314) avec texture de bruit fixe en overlay
 *  - Jaune Snapchat (#FFFC00) comme unique accent, jamais dilue
 *  - Space Grotesk pour les titres, Inter pour le corps de texte
 *  - Nav transparente -> frosted glass au scroll
 *  - Reveal on scroll (IntersectionObserver, aucune lib externe)
 *
 * Hero (mise en page V1) + section demo interactive (cartes cliquables) +
 * section "Comment ca marche", repris du design original mais habilles
 * dans le theme sombre de la v3.
 *
 * Placement : frontend/app/page.tsx -> <LandingPageV3 />
 * Images dans /public : /1.jpg /2.jpg /4.jpg /6.png /7.jpg /8.jpg /10.jpg
 */

'use client'

import { useEffect, useRef, useState, Fragment } from 'react'
import Link from 'next/link'
import { CircularGallery, type GalleryItem as CircularGalleryItem } from '@/components/ui/circular-gallery'
import { type GalleryItem } from '@/components/CircularGallery'

const DEMO_URL = 'https://travelai.digitalstack.cloud/dashboard/stats?uuid=test-uuid-eiffel-001'

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

  .ta-v3-root { font-family: 'Inter', sans-serif; background: #121314; color: #F5F5F3; overflow-x: hidden; -webkit-font-smoothing: antialiased; position: relative; }
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
  @keyframes v3FloatA { 0%,100% { transform: rotate(-7deg) translateY(0); } 50% { transform: rotate(-7deg) translateY(-13px); } }
  @keyframes v3FloatB { 0%,100% { transform: rotate(5deg) translateY(0); } 50% { transform: rotate(5deg) translateY(-10px); } }
  @keyframes v3FloatC { 0%,100% { transform: rotate(-3deg) translateY(0); } 50% { transform: rotate(-3deg) translateY(-15px); } }
  @keyframes v3FloatD { 0%,100% { transform: rotate(9deg) translateY(0); } 50% { transform: rotate(9deg) translateY(-8px); } }
  @keyframes v3ScanPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes v3LineSlide { 0% { top: 8%; opacity: 0.8; } 100% { top: 68%; opacity: 0; } }

  .ta-v3-line { display: block; animation: elasticIn 1s cubic-bezier(0.22,1.4,0.36,1) both; }
  .ta-v3-glow { animation: glowPulse 4s ease-in-out infinite; }
  .ta-v3-scroll-bounce { animation: scrollBounce 2s ease-in-out infinite; }
  .ta-v3-float-a { animation: v3FloatA 7s ease-in-out infinite; }
  .ta-v3-float-b { animation: v3FloatB 8.5s ease-in-out infinite; animation-delay: 1.2s; }
  .ta-v3-float-c { animation: v3FloatC 6.5s ease-in-out infinite; animation-delay: 0.7s; }
  .ta-v3-float-d { animation: v3FloatD 9s ease-in-out infinite; animation-delay: 2s; }
  .ta-v3-scan-corner { animation: v3ScanPulse 2s ease-in-out infinite; }
  .ta-v3-scan-line { animation: v3LineSlide 2s ease-in-out infinite; position: absolute; left: 18px; right: 18px; height: 1.5px; background: linear-gradient(90deg, transparent, #FFFC00, transparent); z-index: 20; }

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

  .ta-v3-thumb { transition: box-shadow 0.2s ease, border-color 0.2s ease; }
  .ta-v3-thumb:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.4) !important; border-color: rgba(255,252,0,0.25) !important; }
  .ta-v3-save-btn { transition: box-shadow 0.2s, transform 0.2s; }
  .ta-v3-save-btn:hover { box-shadow: 0 8px 24px rgba(255,252,0,0.4); transform: translateY(-1px); }

  @media (max-width: 960px) {
    .ta-v3-hero-inner { flex-direction: column !important; padding: 96px 28px 48px !important; gap: 56px !important; }
    .ta-v3-hero-visual { display: none !important; }
    .ta-v3-steps-row { flex-direction: column !important; align-items: center !important; }
    .ta-v3-step-connector { display: none !important; }
    .ta-v3-demo-inner { flex-direction: column !important; }
  }
  @media (max-width: 860px) {
    .ta-v3-hero-h1 { font-size: 58px !important; letter-spacing: -2px !important; }
    .ta-v3-trust { flex-wrap: wrap !important; gap: 20px !important; justify-content: center !important; }
    .ta-v3-feat-grid { flex-direction: column !important; }
  }
`

const GHOST_PATH =
  'M12 1.5C8.3 1.5 5.3 4.5 5.3 8.2v4.8l-1.6 1 .8 1.4.8-.5v1.3c-.6.2-1.5.8-1.9 2.1-.3 1-.1 2.2-.1 2.2s2.9-.4 4.2 1.4c.5.8 1.6 1.3 2.8 1.3 1.1 0 1.6-.2 1.6-.2s.6.2 1.6.2c1.2 0 2.3-.5 2.8-1.3 1.3-1.8 4.2-1.4 4.2-1.4s.2-1.2-.1-2.2c-.4-1.3-1.3-1.9-1.9-2.1v-1.3l.8.5.8-1.4-1.6-1V8.2C18.7 4.5 15.7 1.5 12 1.5z'

function GhostIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d={GHOST_PATH} /></svg>
}

const TRUST_POINTS = [
  { icon: '🌍', label: '150+ pays couverts' },
  { icon: '⚡', label: '< 2s de reconnaissance' },
  { icon: '🤖', label: 'Propulse par Gemini' },
  { icon: '📄', label: 'Carnet PDF automatique' },
]

const POLAROIDS = [
  { src: '/6.png', label: 'Notre-Dame · Paris', cls: 'ta-v3-float-a', w: 158, h: 118, pos: { top: 10, left: 30 } },
  { src: '/4.jpg', label: 'Milan Duomo · Italy', cls: 'ta-v3-float-b', w: 144, h: 108, pos: { bottom: 50, left: 15 } },
  { src: '/8.jpg', label: 'Statue of Liberty · NY', cls: 'ta-v3-float-c', w: 150, h: 113, pos: { top: 30, right: 25 } },
  { src: '/2.jpg', label: 'Mount Rushmore · USA', cls: 'ta-v3-float-d', w: 148, h: 108, pos: { bottom: 40, right: 15 } },
]

const STEPS = [
  {
    n: 1,
    bg: '#FFFC00',
    filled: true,
    icon: <path d={GHOST_PATH} fill="#0D0D0D" />,
    title: 'Ouvre la Lens',
    desc: "Retrouve TravelAI dans l'explorateur de Lens Snapchat et lance-la en un tap. Pas d'inscription, pas de telechargement.",
  },
  {
    n: 2,
    bg: 'rgba(255,255,255,0.08)',
    filled: false,
    icon: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>,
    title: 'Vise un monument',
    desc: "Pointe ta camera sur un monument. L'IA Vision de TravelAI l'identifie en moins de 2 secondes.",
  },
  {
    n: 3,
    bg: '#FFFC00',
    filled: false,
    icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><line x1="10" y1="8" x2="16" y2="8" /><line x1="10" y1="12" x2="14" y2="12" /></>,
    title: 'Recois ton guide + carnet',
    desc: 'Reponses IA instantanees, histoire riche, et un carnet de voyage PDF magnifique — tout est genere automatiquement.',
  },
]

const DEMO_ITEMS = [
  {
    src: '/6.png', title: 'Notre-Dame de Paris', city: 'Paris, France',
    tags: ['Architecture gothique', 'Paris, France'], badge: 'UNESCO',
    question: 'Quand a-t-elle ete construite ?',
    answer: "La construction a commence en 1163 sous l'eveque Maurice de Sully et s'est largement achevee au XIVe siecle. Elle reste l'un des plus beaux exemples d'architecture gothique francaise, reconnue pour ses arcs-boutants, ses rosaces et ses tours jumelles.",
  },
  {
    src: '/4.jpg', title: 'Duomo de Milan', city: 'Milan, Italie',
    tags: ['Gothique', 'Milan, Italie'], badge: '1386',
    question: 'Pourquoi a-t-elle pris autant de temps a construire ?',
    answer: "Le chantier a debute en 1386 et s'est etale sur pres de six siecles. Avec ses 135 fleches et plus de 3 400 statues, c'est l'une des plus grandes cathedrales gothiques au monde, couronnee par la statue doree de la Madonnina.",
  },
  {
    src: '/8.jpg', title: 'Statue de la Liberte', city: 'New York, USA',
    tags: ['Monument', 'New York, USA'], badge: 'UNESCO',
    question: "Qui l'a offerte aux Etats-Unis ?",
    answer: "C'est un cadeau de la France pour le centenaire de l'independance americaine, inaugure en 1886. Sculptee par Frederic Auguste Bartholdi, sa structure interne en fer a ete concue par Gustave Eiffel.",
  },
  {
    src: '/2.jpg', title: 'Mont Rushmore', city: 'Dakota du Sud, USA',
    tags: ['Memorial national', 'Dakota du Sud, USA'], badge: '1927',
    question: 'Qui sont les quatre presidents sculptes ?',
    answer: "George Washington, Thomas Jefferson, Theodore Roosevelt et Abraham Lincoln. Le sculpteur Gutzon Borglum a dirige les travaux de 1927 a 1941, taillant chaque visage directement dans le granit de la montagne.",
  },
  {
    src: '/1.jpg', title: 'Taj Mahal', city: 'Agra, Inde',
    tags: ['Mausolee moghol', 'Agra, Inde'], badge: 'UNESCO',
    question: 'Quelle histoire se cache derriere sa construction ?',
    answer: "L'empereur moghol Shah Jahan l'a fait construire en memoire de son epouse Mumtaz Mahal. Une legende populaire (non confirmee historiquement) raconte que les mains des artisans auraient ete coupees pour qu'ils ne puissent jamais recreer un tel chef-d'oeuvre.",
  },
  {
    src: '/7.jpg', title: 'Mont Saint-Michel', city: 'Normandie, France',
    tags: ['Abbaye', 'Normandie, France'], badge: 'UNESCO',
    question: "Pourquoi cet ilot est-il si particulier ?",
    answer: "Cette abbaye benedictine se dresse sur un ilot rocheux soumis a des marees parmi les plus fortes d'Europe. Lieu de pelerinage depuis le Moyen Age, elle a aussi servi de prison avant de redevenir un haut lieu spirituel et touristique.",
  },
  {
    src: '/10.jpg', title: 'Parthenon', city: 'Athenes, Grece',
    tags: ['Temple dorique', 'Athenes, Grece'], badge: '447 av. J.-C.',
    question: 'A quelle divinite est-il dedie ?',
    answer: "Le Parthenon est dedie a Athena, deesse protectrice d'Athenes. Construit entre 447 et 432 av. J.-C. sur l'Acropole, il est considere comme l'un des sommets de l'architecture dorique antique.",
  },
]

// Monuments insolites — en attente des photos reelles (placeholders en degrade).
// Remplacer `gradient` par `image: '/xxx.jpg'` une fois les photos ajoutees dans /public.
const INSOLITE_MONUMENTS: GalleryItem[] = [
  { name: 'Salar de Uyuni', location: 'Bolivie', image: '/salar-de-uyuni.jpg' },
  { name: "Porte de l'Enfer", location: 'Darvaza, Turkmenistan', image: '/porte-de-lenfer.jpg' },
  { name: 'Cappadoce', location: 'Turquie', image: '/cappadoce.jpg' },
  { name: 'Zhangjiajie', location: 'Chine', image: '/zhangjiajie.jpg' },
  { name: 'Hang Son Doong', location: 'Vietnam', gradient: 'linear-gradient(135deg,#2c3e50,#4ca1af)' },
  { name: 'Eglises de Lalibela', location: 'Ethiopie', gradient: 'linear-gradient(135deg,#8e2de2,#4a00e0)' },
  { name: 'Lignes de Nazca', location: 'Perou', gradient: 'linear-gradient(135deg,#d4a373,#774936)' },
  { name: 'Wave Rock', location: 'Australie', gradient: 'linear-gradient(135deg,#3a6073,#16222a)' },
  { name: 'Trolltunga', location: 'Norvege', image: '/trolltunga.jpg' },
  { name: 'Grottes de Marbre', location: 'Patagonie, Chili', gradient: 'linear-gradient(135deg,#48c6ef,#6f86d6)' },
  { name: 'La Maison qui Penche', location: 'Sopot, Pologne', gradient: 'linear-gradient(135deg,#ee9ca7,#ffdde1)' },
  { name: 'Maison Dansante', location: 'Prague, Tchequie', gradient: 'linear-gradient(135deg,#bdc3c7,#2c3e50)' },
  { name: "Trulli d'Alberobello", location: 'Italie', gradient: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)' },
  { name: 'Henderson Waves', location: 'Singapour', gradient: 'linear-gradient(135deg,#0f2027,#2c5364)' },
  { name: 'Spomeniks', location: 'Ex-Yougoslavie', gradient: 'linear-gradient(135deg,#636363,#a2ab58)' },
  { name: 'Antelope Canyon', location: 'Arizona, USA', gradient: 'linear-gradient(135deg,#ff9966,#ff5e62)' },
  { name: 'Bouddha couche du Wat Pho', location: 'Bangkok, Thailande', gradient: 'linear-gradient(135deg,#f7971e,#ffd200)' },
  { name: 'Hobbiton', location: 'Nouvelle-Zelande', gradient: 'linear-gradient(135deg,#56ab2f,#a8e063)' },
  { name: 'Cabazon Dinosaurs', location: 'Californie, USA', gradient: 'linear-gradient(135deg,#cb356b,#bd3f32)' },
  { name: 'Bagan', location: 'Myanmar', gradient: 'linear-gradient(135deg,#fbc2eb,#a6c1ee)' },
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

function NavBar() {
  const navRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const onScroll = () => {
      const scrolled = window.scrollY > 40
      nav.style.background = scrolled ? 'rgba(18,19,20,0.75)' : 'transparent'
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
        <a href="#how" style={{ fontSize: 13.5, fontWeight: 500, color: 'rgba(245,245,243,0.6)', textDecoration: 'none' }}>Comment ca marche</a>
        <a href="#demo" style={{ fontSize: 13.5, fontWeight: 500, color: 'rgba(245,245,243,0.6)', textDecoration: 'none' }}>Demo</a>
        <a href="#features" style={{ fontSize: 13.5, fontWeight: 500, color: 'rgba(245,245,243,0.6)', textDecoration: 'none' }}>Fonctionnalites</a>
      </div>
      <Link href="/login" className="ta-v3-nav-cta" style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFC00', color: '#0D0D0D', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'transform 0.18s, box-shadow 0.18s' }}>
        Se connecter
      </Link>
    </nav>
  )
}

export default function LandingPageV3() {
  useRevealOnScroll()
  const [activeDemoIndex, setActiveDemoIndex] = useState(0)

  const statMonuments = useRef<HTMLDivElement>(null)
  const statCountries = useRef<HTMLDivElement>(null)
  const statRating = useRef<HTMLDivElement>(null)
  useCountUp(statMonuments, 10000, 0, '+')
  useCountUp(statCountries, 150, 0, '+')
  useCountUp(statRating, 4.9, 1, '★')

  const activeDemo = DEMO_ITEMS[activeDemoIndex]

  return (
    <div className="ta-v3-root">
      <style>{CSS}</style>
      <div className="ta-v3-noise" />

      <NavBar />

      {/* ===== HERO ===== */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', zIndex: 2 }}>
        <div className="ta-v3-glow" style={{ position: 'absolute', top: '32%', left: '38%', transform: 'translate(-50%,-50%)', width: 900, height: 900, background: 'radial-gradient(circle, rgba(255,252,0,0.14) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div className="ta-v3-hero-inner" style={{ maxWidth: 1340, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40, padding: '140px 48px 64px', position: 'relative', width: '100%' }}>
          {/* Left: text */}
          <div style={{ flex: 1, maxWidth: 560 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,252,0,0.08)', border: '1px solid rgba(255,252,0,0.3)', borderRadius: 100, padding: '7px 16px', marginBottom: 32 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FFFC00', boxShadow: '0 0 8px rgba(255,252,0,0.9)' }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#FFFC00', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Disponible sur Snapchat</span>
            </div>

            <h1 className="ta-v3-hero-h1" style={{ fontSize: 88, fontWeight: 700, lineHeight: 0.98, letterSpacing: '-4px', marginBottom: 28 }}>
              <span className="ta-v3-line" style={{ animationDelay: '0.05s' }}>Point.</span>
              <span className="ta-v3-line" style={{ animationDelay: '0.22s' }}>Ask.</span>
              <span className="ta-v3-line" style={{ animationDelay: '0.4s' }}>
                <span style={{ background: '#FFFC00', color: '#0D0D0D', padding: '3px 18px', borderRadius: 10, display: 'inline-block', marginTop: 4 }}>Remember.</span>
              </span>
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.65, color: 'rgba(245,245,243,0.62)', marginBottom: 44, maxWidth: 460 }}>
              Identifie n&apos;importe quel monument en quelques secondes avec ta camera Snapchat. Ton guide de voyage IA, toujours dans ta poche.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <a href={DEMO_URL} className="ta-v3-cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#FFFC00', color: '#0D0D0D', padding: '16px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                Voir le compte Demo
              </a>
              <a href="#how" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid rgba(245,245,243,0.22)', color: '#F5F5F3', padding: '15px 26px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
                Voir comment ca marche
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 44 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {['linear-gradient(135deg,#a8d8ea,#6fb3cf)', 'linear-gradient(135deg,#ffd3a5,#fd9853)', 'linear-gradient(135deg,#c8f7c5,#4caf50)'].map((bg, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid #121314', background: bg, marginRight: i < 2 ? -9 : 0, zIndex: 3 - i, position: 'relative' }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#FFFC00', letterSpacing: 1, marginBottom: 2 }}>★★★★★</div>
                <div style={{ fontSize: 12.5, color: 'rgba(245,245,243,0.55)' }}>Adopte par <strong style={{ color: '#F5F5F3' }}>10 000+</strong> voyageurs</div>
              </div>
            </div>
          </div>

          {/* Right: phone + polaroids */}
          <div className="ta-v3-hero-visual" style={{ flex: 1, position: 'relative', height: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 480 }}>
            {POLAROIDS.map(({ src, label, cls, w, h, pos }) => (
              <div key={src} className={cls} style={{ position: 'absolute', ...pos, width: w, background: '#16151080', backgroundColor: '#161510', boxShadow: '0 8px 32px rgba(0,0,0,0.5),0 2px 8px rgba(0,0,0,0.3)', borderRadius: 3, padding: '9px 9px 38px', zIndex: 3 }}>
                <img src={src} alt={label} style={{ width: '100%', height: h, objectFit: 'cover', display: 'block', borderRadius: 2 }} />
                <div style={{ marginTop: 10, fontSize: 9.5, fontWeight: 600, color: 'rgba(245,245,243,0.55)', textAlign: 'center', letterSpacing: '0.02em' }}>{label}</div>
              </div>
            ))}

            <div style={{ position: 'relative', zIndex: 10, width: 256, height: 524, background: '#111', borderRadius: 42, boxShadow: '0 40px 80px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.08) inset,0 0 0 7px #1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 90, height: 29, background: '#111', borderRadius: '0 0 20px 20px', zIndex: 30 }} />
              <img src="/6.png" alt="camera view" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.82 }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.35) 0%,transparent 35%,transparent 55%,rgba(0,0,0,0.7) 100%)' }} />
              <div style={{ position: 'absolute', top: 36, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', zIndex: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>9:41</span>
                <GhostIcon size={26} color="white" />
                <div style={{ display: 'flex', gap: 3 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />)}</div>
              </div>
              {[
                { top: 80, left: 18, borderLeft: '2.5px solid #FFFC00', borderTop: '2.5px solid #FFFC00', borderRadius: '3px 0 0 0' },
                { top: 80, right: 18, borderRight: '2.5px solid #FFFC00', borderTop: '2.5px solid #FFFC00', borderRadius: '0 3px 0 0' },
                { top: 255, left: 18, borderLeft: '2.5px solid #FFFC00', borderBottom: '2.5px solid #FFFC00', borderRadius: '0 0 0 3px' },
                { top: 255, right: 18, borderRight: '2.5px solid #FFFC00', borderBottom: '2.5px solid #FFFC00', borderRadius: '0 0 3px 0' },
              ].map((s, i) => (
                <div key={i} className="ta-v3-scan-corner" style={{ position: 'absolute', width: 32, height: 32, zIndex: 20, ...s }} />
              ))}
              <div className="ta-v3-scan-line" />
              <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,252,0,0.45)', borderRadius: 100, padding: '5px 13px', whiteSpace: 'nowrap', zIndex: 21 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#FFFC00', letterSpacing: '0.05em' }}>✨ TravelAI</span>
                <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.65)' }}> — Scanning...</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(20,20,18,0.94)', backdropFilter: 'blur(16px)', borderRadius: '18px 18px 0 0', padding: '16px 16px 20px', zIndex: 25, borderTop: '1.5px solid rgba(255,252,0,0.4)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Notre-Dame de Paris</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                  {['Gothique', 'Paris, FR'].map((t) => (
                    <span key={t} style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 500, color: '#F5F5F3' }}>{t}</span>
                  ))}
                  <span style={{ background: '#FFFC00', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 700, color: '#0D0D0D' }}>UNESCO</span>
                </div>
                <div style={{ fontSize: 9.5, color: 'rgba(245,245,243,0.55)', lineHeight: 1.55, marginBottom: 12 }}>&quot;La construction a commence en 1163 et reste l&apos;un des plus beaux exemples d&apos;architecture gothique francaise...&quot;</div>
                <div style={{ background: '#FFFC00', borderRadius: 8, padding: 9, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#0D0D0D' }}>Sauvegarder dans le carnet →</div>
              </div>
            </div>
          </div>
        </div>

        <div className="ta-v3-scroll-bounce" style={{ position: 'absolute', bottom: 28, left: '50%' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(245,245,243,0.35)" strokeWidth={2} strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" style={{ position: 'relative', zIndex: 2, padding: '110px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div data-v3-fade="" style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(245,245,243,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>C&apos;est tout simple</span>
          </div>
          <h2 style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-1.8px', lineHeight: 1.05 }}>Comment ca marche</h2>
        </div>

        <div className="ta-v3-steps-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', position: 'relative', maxWidth: 1160, margin: '0 auto' }}>
          {STEPS.map(({ n, bg, icon, filled, title, desc }, i) => (
            <Fragment key={n}>
              <div data-v3-fade="" data-delay={i * 150} style={{ flex: 1, maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 32px' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, position: 'relative' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, position: 'absolute', top: -2, right: -2, background: '#121314', color: '#fff', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>{n}</span>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : '#0D0D0D'} strokeWidth={filled ? undefined : 2} strokeLinecap={filled ? undefined : 'round'} strokeLinejoin={filled ? undefined : 'round'}>
                    {icon}
                  </svg>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.5px' }}>{title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(245,245,243,0.55)' }}>{desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="ta-v3-step-connector" style={{ flexShrink: 0, width: 120, height: 1, background: 'linear-gradient(90deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))', marginTop: 36, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 7, height: 7, borderRadius: '50%', background: '#FFFC00', border: '1.5px solid #121314' }} />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </section>

      {/* ===== DEMO (cartes interactives) ===== */}
      <section id="demo" style={{ position: 'relative', zIndex: 2, padding: '110px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div data-v3-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(245,245,243,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Resultats en direct</span>
          </div>
          <h2 style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-1.8px', lineHeight: 1.05 }}>Ce que TravelAI te renvoie</h2>
        </div>

        <div className="ta-v3-demo-inner" style={{ display: 'flex', gap: 28, alignItems: 'flex-start', maxWidth: 1180, margin: '0 auto' }}>
          {/* Main card */}
          <div data-v3-fade="" style={{ flex: '1.3 1 0%', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <img src={activeDemo.src} alt={activeDemo.title} style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>{activeDemo.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '5px 10px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(245,245,243,0.6)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span style={{ fontSize: 11, color: 'rgba(245,245,243,0.6)', fontWeight: 500 }}>{activeDemo.city}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 7, marginBottom: 22, flexWrap: 'wrap' }}>
                {activeDemo.tags.map((t) => (
                  <span key={t} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '5px 13px', fontSize: 12, fontWeight: 500, color: '#F5F5F3' }}>{t}</span>
                ))}
                <span style={{ background: '#FFFC00', borderRadius: 100, padding: '5px 13px', fontSize: 12, fontWeight: 700, color: '#0D0D0D' }}>{activeDemo.badge}</span>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(245,245,243,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Conversation IA</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px 14px 4px 14px', padding: '11px 16px', maxWidth: '75%' }}>
                    <p style={{ fontSize: 13.5, color: '#F5F5F3', margin: 0 }}>&quot;{activeDemo.question}&quot;</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFC00', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <GhostIcon size={13} color="#0D0D0D" />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', flex: 1 }}>
                    <p style={{ fontSize: 13.5, color: 'rgba(245,245,243,0.85)', lineHeight: 1.6, margin: 0 }}>{activeDemo.answer}</p>
                  </div>
                </div>
              </div>

              <button type="button" className="ta-v3-save-btn" style={{ width: '100%', background: '#FFFC00', border: 'none', borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, color: '#0D0D0D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                Sauvegarder dans le carnet
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 640, overflowY: 'auto', paddingRight: 4 }}>
            {DEMO_ITEMS.map((item, i) =>
              i === activeDemoIndex ? null : (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setActiveDemoIndex(i)}
                  className="ta-v3-thumb"
                  style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex', textAlign: 'left', cursor: 'pointer', width: '100%' }}
                >
                  <img src={item.src} alt={item.title} style={{ width: 100, height: 86, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F3', marginBottom: 4, letterSpacing: '-0.3px' }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(245,245,243,0.5)', marginBottom: 7 }}>{item.tags[0]} · {item.city}</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {[item.tags[1] || item.city, item.badge].map((t) => <span key={t} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 100, padding: '2px 9px', fontSize: 9.5, fontWeight: 500, color: 'rgba(245,245,243,0.55)' }}>{t}</span>)}
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
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

        <div data-v3-fade="" data-delay="150" style={{ marginTop: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.8px' }}>Monuments insolites a decouvrir</h3>
            <p style={{ fontSize: 13.5, color: 'rgba(245,245,243,0.5)', marginTop: 8 }}>Fais glisser pour faire pivoter la galerie</p>
          </div>
          <CircularGallery
            items={INSOLITE_MONUMENTS.filter((m) => m.image).map(
              (m): CircularGalleryItem => ({
                common: m.name,
                binomial: m.location,
                photo: { url: m.image as string, text: m.name },
              })
            )}
          />
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
