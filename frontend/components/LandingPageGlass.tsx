/**
 * TravelAI — Landing Page « Glass » (refonte 2026)
 *
 * Placement :
 *   -> frontend/components/LandingPageGlass.tsx (ce fichier)
 *   -> frontend/app/page.tsx : import LandingPageGlass from "@/components/LandingPageGlass"
 *   -> Images : frontend/public/ (6.png, 4.jpg, 8.jpg, 2.jpg, 1.jpg, 7.jpg, 10.jpg,
 *      9.jpg, 3.jpg, 5.jpg, cappadoce.jpg, salar-de-uyuni.jpg, zhangjiajie.jpg,
 *      trolltunga.jpg, voyageur.jpg, snapchat.png — déjà présentes dans le repo)
 *
 * Style figé : thème glass · hero polaroids · animations fortes ·
 * jaune affirmé · sections sombres anthracite.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

/* ============================== Données ============================== */

const GHOST_PATH =
  'M12 1.5C8.3 1.5 5.3 4.5 5.3 8.2v4.8l-1.6 1 .8 1.4.8-.5v1.3c-.6.2-1.5.8-1.9 2.1-.3 1-.1 2.2-.1 2.2s2.9-.4 4.2 1.4c.5.8 1.6 1.3 2.8 1.3 1.1 0 1.6-.2 1.6-.2s.6.2 1.6.2c1.2 0 2.3-.5 2.8-1.3 1.3-1.8 4.2-1.4 4.2-1.4s.2-1.2-.1-2.2c-.4-1.3-1.3-1.9-1.9-2.1v-1.3l.8.5.8-1.4-1.6-1V8.2C18.7 4.5 15.7 1.5 12 1.5z'

function Ghost({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={GHOST_PATH} />
    </svg>
  )
}

interface DemoItem {
  src: string
  title: string
  city: string
  tag: string
  badge: string
  question: string
  answer: string
}

/* Images uniquement — le texte (titre, ville, tag, badge, question, réponse) vient de dict.demoSection.items */
const DEMO_SRCS = ['/6.png', '/4.jpg', '/8.jpg', '/2.jpg', '/1.jpg', '/7.jpg', '/10.jpg']

const POLAROIDS = [
  { src: '/6.png', label: 'Notre-Dame · Paris', cls: 'ta-float-a', pos: { top: 16, left: 26 } as React.CSSProperties, w: 158, h: 116 },
  { src: '/4.jpg', label: 'Duomo · Milan', cls: 'ta-float-b', pos: { bottom: 56, left: 8 } as React.CSSProperties, w: 144, h: 106 },
  { src: '/8.jpg', label: 'Statue of Liberty · NY', cls: 'ta-float-c', pos: { top: 38, right: 18 } as React.CSSProperties, w: 150, h: 112 },
  { src: '/1.jpg', label: 'Taj Mahal · Agra', cls: 'ta-float-d', pos: { bottom: 44, right: 8 } as React.CSSProperties, w: 148, h: 106 },
]

/* Icônes uniquement — le texte (title/desc) vient de dict.carnet.points */
const JOURNAL_ICONS = [
  <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
  <><circle cx="12" cy="12" r="10" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" /><line x1="12" y1="16.5" x2="12.01" y2="16.5" /></>,
  <path d="M12 2l2.4 6.9L22 9l-5.6 4.9L18 22l-6-4-6 4 1.6-8.1L2 9l7.6-.1z" />,
  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
]

/* Icônes uniquement — le texte (title/desc) vient de dict.pourQui.profiles */
const AUDIENCE_ICONS = [
  <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  <><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M22 8.5v7l-6-3.5z" /></>,
]

/* Icônes uniquement — le texte (title/desc) vient de dict.features.items */
const FEATURE_ICONS = [
  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
]

/* Icônes uniquement — le texte (name/desc/locked) vient de dict.badges.items */
const BADGE_ICONS = [
  <><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" /><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" /></>,
  <path d="M2 12h4l3-9 4 18 3-9h6" />,
  <path d="M13 2 3 14h7l-1 8 10-12h-7z" />,
  <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
]

/* "hot" uniquement — le texte (title/desc/eta) vient de dict.roadmap.items */
const ROADMAP_HOT = [true, false, false]

const RATING_BARS = [
  { label: '5★', width: '88%', pct: '88%', color: '#FFFC00' },
  { label: '4★', width: '9%', pct: '9%', color: 'rgba(255,252,0,.55)' },
  { label: '3★', width: '3%', pct: '3%', color: 'rgba(255,252,0,.3)' },
]

/* Visuels uniquement — le texte (handle/meta/quote) vient de dict.temoignages.stories */
const STORY_VISUALS = [
  { src: '/6.png', alt: 'Notre-Dame de Paris', avatar: 'linear-gradient(135deg,#ffd3a5,#fd9853)', segments: 3, rot: '-1.2deg', delay: 150 },
  { src: '/1.jpg', alt: 'Taj Mahal', avatar: 'linear-gradient(135deg,#c8f7c5,#4caf50)', segments: 2, rot: '0.8deg', delay: 250 },
  { src: '/10.jpg', alt: 'Parthénon', avatar: 'linear-gradient(135deg,#a8d8ea,#6fb3cf)', segments: 4, rot: '-0.6deg', delay: 350 },
]

/* Images uniquement — le texte (name/place) vient de dict.galerie.items */
const GALLERY_SRCS = [
  '/salar-de-uyuni.jpg',
  '/porte-de-lenfer.jpg',
  '/cappadoce.jpg',
  '/zhangjiajie.jpg',
  '/trolltunga.jpg',
  '/chandps.jpg',
  '/Krzywy_Domek_w_Sopocie.jpg',
  '/monastere.jpg',
  '/landman.jpg',
]

/* Drapeaux uniquement — le texte (city/sub/quiz) vient de dict.carnet.trips */
const TRIP_FLAGS = ['🇮🇹', '🇯🇵', '🇫🇷']

/* ============================== CSS ============================== */

const CSS = `
  .tg-root{--bg:#F2F5F7;--bg2:#E9EEF2;--ink:#0D1217;--muted:#5F6B75;--line:rgba(10,30,50,.10);--card:rgba(255,255,255,.66);--cardBorder:rgba(255,255,255,.85);--r:24px;--shadow:0 12px 44px rgba(15,40,70,.12);--blur:16px;--dark:#1A1B1E;--y:#FFFC00;background:var(--bg);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased}
  .tg-root *,.tg-root *::before,.tg-root *::after{box-sizing:border-box}
  html{scroll-behavior:smooth}
  ::selection{background:#FFFC00;color:#0D0D0D}

  @keyframes tgFloatA{0%,100%{transform:rotate(-6deg) translateY(0)}50%{transform:rotate(-6deg) translateY(-14px)}}
  @keyframes tgFloatB{0%,100%{transform:rotate(5deg) translateY(0)}50%{transform:rotate(5deg) translateY(-10px)}}
  @keyframes tgFloatC{0%,100%{transform:rotate(-3deg) translateY(0)}50%{transform:rotate(-3deg) translateY(-16px)}}
  @keyframes tgFloatD{0%,100%{transform:rotate(8deg) translateY(0)}50%{transform:rotate(8deg) translateY(-8px)}}
  @keyframes tgScan{0%{top:9%;opacity:.85}100%{top:64%;opacity:0}}
  @keyframes tgPulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes tgDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.5}}
  .ta-float-a{animation:tgFloatA 7s ease-in-out infinite}
  .ta-float-b{animation:tgFloatB 8.5s ease-in-out infinite;animation-delay:1.2s}
  .ta-float-c{animation:tgFloatC 6.5s ease-in-out infinite;animation-delay:.7s}
  .ta-float-d{animation:tgFloatD 9s ease-in-out infinite;animation-delay:2s}
  .tg-scanline{position:absolute;left:18px;right:18px;height:1.5px;background:linear-gradient(90deg,transparent,#FFFC00,transparent);z-index:20;animation:tgScan 2s ease-in-out infinite}
  .tg-corner{position:absolute;width:32px;height:32px;z-index:20;animation:tgPulse 2s ease-in-out infinite}
  .tg-livedot{width:7px;height:7px;border-radius:50%;background:var(--y);box-shadow:0 0 8px rgba(255,252,0,.8);animation:tgDot 2s ease-in-out infinite;display:inline-block}

  .tg-card{background:var(--card);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));border:1px solid var(--cardBorder);border-radius:var(--r);box-shadow:var(--shadow)}
  .tg-eyebrow{display:inline-flex;align-items:center;gap:7px;background:var(--y);border:1px solid var(--line);border-radius:100px;padding:6px 14px}
  .tg-eyebrow span{font-size:11.5px;font-weight:600;color:#0D0D0D;letter-spacing:.07em;text-transform:uppercase}
  .tg-h2{font-weight:700;letter-spacing:-1.8px;line-height:1.08;margin:0;font-size:48px}
  .tg-pill-tag{background:var(--bg2);border:1px solid var(--line);border-radius:100px;padding:5px 13px;font-size:12px;font-weight:500}
  .tg-badge-y{background:var(--y);border-radius:100px;padding:5px 13px;font-size:12px;font-weight:700;color:#0D0D0D}

  .tg-nav-link{font-size:13px;font-weight:500;color:var(--muted);text-decoration:none;transition:color .2s}
  .tg-nav-link:hover{color:var(--ink)}
  .tg-nav-dd a.tg-nav-link:hover{background:var(--bg2)}
  .tg-nav-dd{background:rgba(255,255,255,.94) !important}
  .tg-btn-y{display:inline-flex;align-items:center;gap:9px;background:var(--y);color:#0D0D0D;border-radius:14px;font-size:15px;font-weight:700;text-decoration:none;transition:all .2s ease;border:none;cursor:pointer}
  .tg-btn-y:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(255,252,0,.5)}
  .tg-btn-ghost{display:inline-flex;align-items:center;gap:8px;border:1.5px solid var(--line);color:var(--ink);background:var(--card);padding:15px 26px;border-radius:14px;font-size:15px;font-weight:600;text-decoration:none;transition:all .2s ease}
  .tg-btn-ghost:hover{border-color:var(--ink)}
  .tg-hovercard{transition:transform .3s ease,box-shadow .3s ease}
  .tg-hovercard:hover{transform:translateY(-4px);box-shadow:0 18px 54px rgba(15,40,70,.16)}
  .tg-thumb{transition:border-color .2s ease,transform .2s ease;cursor:pointer}
  .tg-thumb:hover{transform:translateX(4px)}
  .tg-footer-link{font-size:13px;color:rgba(255,255,255,.45);text-decoration:none;transition:color .2s}
  .tg-footer-link:hover{color:rgba(255,255,255,.9)}
  .tg-noscroll::-webkit-scrollbar{display:none}
  .tg-noscroll{scrollbar-width:none;-ms-overflow-style:none}

  [data-fade]{opacity:0;transform:translateY(40px);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
  [data-fade].tg-in{opacity:1;transform:translateY(0)}
  @media (prefers-reduced-motion:reduce){[data-fade]{opacity:1;transform:none;transition:none}.ta-float-a,.ta-float-b,.ta-float-c,.ta-float-d,.tg-scanline,.tg-corner,.tg-livedot{animation:none}}

  @media (max-width:960px){
    .rr{flex-direction:column !important}
    .rrc{flex-direction:column !important;align-items:center !important}
    .rhide{display:none !important}
    .rsec{padding:72px 22px !important}
    .rh1{font-size:56px !important;letter-spacing:-2.2px !important}
    .tg-h2{font-size:34px !important;letter-spacing:-1px !important}
    .rgrid{grid-template-columns:1fr !important}
    .rgrid2{grid-template-columns:1fr !important}
    .rnavlinks{display:none !important}
  }
`

/* ============================== Composant ============================== */

function NavDropdown({
  group,
  isOpen,
  onOpen,
  onToggle,
  onClose,
}: {
  group: { label: string; href?: string; items?: { name: string; href: string }[] }
  isOpen: boolean
  onOpen: () => void
  onToggle: () => void
  onClose: () => void
}) {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (!group.items) {
    return (
      <a href={group.href} className="tg-nav-link" style={{ flexShrink: 0 }}>
        {group.label}
      </a>
    )
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(onClose, 150)
  }

  return (
    <div
      style={{ position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => { cancelClose(); onOpen() }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={onToggle}
        className="tg-nav-link"
        style={{
          display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none',
          cursor: 'pointer', padding: 0, font: 'inherit', color: isOpen ? 'var(--ink)' : undefined,
        }}
      >
        {group.label}
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'transform .2s ease', transform: isOpen ? 'rotate(180deg)' : 'none' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div
          className="tg-card tg-nav-dd"
          style={{
            position: 'absolute', top: 'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', gap: 2, padding: 8, minWidth: 190, zIndex: 1001,
          }}
        >
          {group.items.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="tg-nav-link"
              style={{ padding: '9px 12px', borderRadius: 10, whiteSpace: 'nowrap' }}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function LandingPageGlass() {
  const { locale, dict } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const [activeDemo, setActiveDemo] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeStep, setActiveStep] = useState(0)
  const [openNavGroup, setOpenNavGroup] = useState<number | null>(null)

  const NAV_GROUPS: { label: string; href?: string; items?: { name: string; href: string }[] }[] = [
    {
      label: dict.nav.groups.produit,
      items: [
        { name: dict.nav.items.how, href: '#how' },
        { name: dict.nav.items.demo, href: '#demo' },
        { name: dict.nav.items.features, href: '#features' },
        { name: dict.nav.items.comparatif, href: '#comparatif' },
      ],
    },
    {
      label: dict.nav.groups.carnetBadges,
      items: [
        { name: dict.nav.items.carnet, href: '#carnet' },
        { name: dict.nav.items.badges, href: '#badges' },
        { name: dict.nav.items.galerie, href: '#galerie' },
      ],
    },
    {
      label: dict.nav.groups.communaute,
      items: [
        { name: dict.nav.items.pourQui, href: '#pour-qui' },
        { name: dict.nav.items.temoignages, href: '#temoignages' },
        { name: dict.nav.items.confiance, href: '#confiance' },
      ],
    },
    { label: dict.nav.items.faq, href: '#faq' },
  ]

  const DEMO_ITEMS: DemoItem[] = DEMO_SRCS.map((src, i) => ({ src, ...dict.demoSection.items[i] }))
  const FAQ_ITEMS = dict.faq.items
  const STEPS = dict.how.steps.map((s, i) => ({ n: String(i + 1), ...s }))
  const JOURNAL_POINTS = dict.carnet.points.map((p, i) => ({ ...p, icon: JOURNAL_ICONS[i] }))
  const AUDIENCES = dict.pourQui.profiles.map((p, i) => ({ ...p, icon: AUDIENCE_ICONS[i] }))
  const FEATURES = dict.features.items.map((f, i) => ({ ...f, icon: FEATURE_ICONS[i] }))
  const BADGES = dict.badges.items.map((b, i) => ({ ...b, icon: BADGE_ICONS[i] }))
  const ROADMAP = dict.roadmap.items.map((r, i) => ({ ...r, hot: ROADMAP_HOT[i] }))
  const TRUST = dict.confiance.points
  const STORIES = dict.temoignages.stories.map((s, i) => ({ ...s, ...STORY_VISUALS[i] }))
  const GALLERY = dict.galerie.items.map((g, i) => ({ ...g, src: GALLERY_SRCS[i] }))
  const TRIPS = dict.carnet.trips.map((t, i) => ({ ...t, flag: TRIP_FLAGS[i], main: i === 0 }))

  /* Convertit les retours à la ligne "\n" des titres du dictionnaire en <br /> */
  const nl2br = (text: string) =>
    text.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ))

  useEffect(() => {
    if (openNavGroup === null) return
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenNavGroup(null)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [openNavGroup])

  useEffect(() => {
    const el = galleryRef.current
    if (!el) return

    let isDown = false
    let paused = false
    let startX = 0
    let startScroll = 0
    let moved = false

    const onDown = (e: PointerEvent) => {
      isDown = true
      paused = true
      moved = false
      startX = e.clientX
      startScroll = el.scrollLeft
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!isDown) return
      const delta = e.clientX - startX
      if (Math.abs(delta) > 5) moved = true
      el.scrollLeft = startScroll - delta
    }
    const stop = () => {
      isDown = false
      paused = false
      el.style.cursor = 'grab'
    }
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', stop)
    el.addEventListener('pointercancel', stop)
    el.addEventListener('click', onClickCapture, true)

    /* Defilement automatique en boucle (contenu duplique x2 pour un loop sans coupure) */
    let frame: number
    const SPEED = 0.5
    const tick = () => {
      if (!paused) {
        const half = el.scrollWidth / 2
        el.scrollLeft += SPEED
        if (el.scrollLeft >= half) el.scrollLeft -= half
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', stop)
      el.removeEventListener('pointercancel', stop)
      el.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    /* Fade-in au scroll */
    const fadeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const delay = parseInt(el.dataset.delay ?? '0', 10)
          setTimeout(() => el.classList.add('tg-in'), delay)
          fadeObs.unobserve(entry.target)
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    root.querySelectorAll('[data-fade]').forEach((el) => fadeObs.observe(el))

    /* Compteurs stats */
    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          countObs.unobserve(el)
          const target = parseFloat(el.dataset.count ?? '0')
          const suffix = el.dataset.suffix ?? ''
          const isDec = el.dataset.decimal === 'true'
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / 1800, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            const val = eased * target
            el.textContent = (isDec ? val.toFixed(1) : Math.round(val).toLocaleString('fr-FR')) + suffix
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.5 }
    )
    root.querySelectorAll('[data-count]').forEach((el) => countObs.observe(el))

    /* Parallaxe */
    const pll = root.querySelectorAll<HTMLElement>('[data-parallax]')
    const onScroll = () => {
      const y = window.scrollY
      pll.forEach((el) => {
        const f = parseFloat(el.dataset.parallax ?? '0.1')
        el.style.translate = `0 ${Math.round(y * f)}px`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      fadeObs.disconnect()
      countObs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const demo = DEMO_ITEMS[activeDemo]

  return (
    <div ref={rootRef} className="tg-root">
      <style>{CSS}</style>

      {/* ===== NAV PILL ===== */}
      <nav ref={navRef} className="tg-card" style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: 22, borderRadius: 999, padding: '8px 8px 8px 16px', maxWidth: 'calc(100vw - 32px)', boxShadow: '0 8px 32px rgba(10,10,5,.10)' }}>
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <img src="/voyageur.jpg" alt={dict.common.brand} style={{ width: 26, height: 26, borderRadius: 7, objectFit: 'cover', display: 'block' }} />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--ink)' }}>{dict.common.brand}</span>
        </a>
        <div className="rnavlinks" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          {NAV_GROUPS.map((group, i) => (
            <NavDropdown
              key={group.label}
              group={group}
              isOpen={openNavGroup === i}
              onOpen={() => setOpenNavGroup(i)}
              onToggle={() => setOpenNavGroup((v) => (v === i ? null : i))}
              onClose={() => setOpenNavGroup(null)}
            />
          ))}
        </div>
        <a href={`/${locale}/login`} className="tg-btn-y" style={{ padding: '9px 18px', borderRadius: 999, fontSize: 13, flexShrink: 0, whiteSpace: 'nowrap' }}>
          <Ghost size={14} color="#0D0D0D" />
          {dict.nav.login}
        </a>
        <LanguageSwitcher />
      </nav>

      {/* ===== 1. HERO ===== */}
      <section id="hero" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div data-parallax="0.12" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(242,245,247,.55), rgba(242,245,247,.92)), url(/cappadoce.jpg) center/cover no-repeat', pointerEvents: 'none' }} />
        <div className="rr rsec" style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48, padding: '150px 64px 90px', position: 'relative', minHeight: '100vh' }}>
          <div style={{ flex: 1.1, maxWidth: 600 }}>
            <div data-fade="" className="tg-eyebrow" style={{ marginBottom: 30 }}>
              <span className="tg-livedot" />
              <Ghost size={13} color="#0D0D0D" />
              <span>{dict.hero.badge}</span>
            </div>
            <h1 className="rh1" data-fade="" data-delay="80" style={{ fontSize: 88, fontWeight: 700, lineHeight: 0.98, letterSpacing: '-3.5px', margin: '0 0 28px' }}>
              {dict.hero.title1}<br />{dict.hero.title2}<br />
              <span style={{ background: 'var(--y)', color: '#0D0D0D', padding: '2px 14px 4px', borderRadius: 10, display: 'inline-block', marginTop: 6 }}>{dict.hero.title3}</span>
            </h1>
            <p data-fade="" data-delay="160" style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 40px', maxWidth: 460 }}>
              {dict.hero.subtitle}
            </p>
            <div data-fade="" data-delay="240" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <a href={`/${locale}/onboarding?demo=1`} className="tg-btn-y" style={{ padding: '16px 30px' }}>
                <Ghost size={16} color="#0D0D0D" />
                {dict.hero.ctaDemo}
              </a>
              <a href="#how" className="tg-btn-ghost">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
                {dict.hero.ctaHow}
              </a>
            </div>
            <div data-fade="" data-delay="320" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 44 }}>
              <div style={{ display: 'flex' }}>
                {['linear-gradient(135deg,#ffd3a5,#fd9853)', 'linear-gradient(135deg,#a8d8ea,#6fb3cf)', 'linear-gradient(135deg,#c8f7c5,#4caf50)'].map((bg, i) => (
                  <span key={i} style={{ width: 34, height: 34, borderRadius: '50%', border: '2.5px solid var(--bg)', background: bg, marginRight: i < 2 ? -10 : 0, position: 'relative', zIndex: 3 - i, display: 'inline-block' }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#E8C400', letterSpacing: 1.5 }}>★★★★★ <span style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 12.5, letterSpacing: 0 }}>{dict.hero.rating}</span></div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{dict.hero.ratingSuffix} <strong style={{ color: 'var(--ink)' }}>{dict.hero.ratingUsers}</strong></div>
              </div>
            </div>
          </div>

          {/* Hero visual : polaroids + téléphone */}
          <div className="rhide" style={{ flex: 1, position: 'relative', height: 660, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 460 }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {POLAROIDS.map(({ src, label, cls, pos, w, h }) => (
                <div key={src} className={cls} style={{ position: 'absolute', ...pos, width: w, background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,.14)', borderRadius: 3, padding: '9px 9px 34px', zIndex: 3 }}>
                  <img src={src} alt={label} style={{ width: '100%', height: h, objectFit: 'cover', display: 'block', borderRadius: 2 }} />
                  <div style={{ marginTop: 9, fontSize: 9.5, fontWeight: 600, color: '#6B6B6B', textAlign: 'center' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Téléphone : caméra Snapchat en scan */}
            <div style={{ position: 'relative', zIndex: 10, width: 268, height: 548, background: '#111', borderRadius: 44, boxShadow: '0 40px 90px rgba(0,0,0,.28), 0 0 0 1px rgba(255,255,255,.08) inset, 0 0 0 7px #1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 92, height: 29, background: '#111', borderRadius: '0 0 20px 20px', zIndex: 30 }} />
              <img src="/6.png" alt="Snapchat camera" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.38) 0%,transparent 32%,transparent 52%,rgba(0,0,0,.72) 100%)' }} />
              <div style={{ position: 'absolute', top: 38, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', zIndex: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.4)' }}>9:41</span>
                <Ghost size={26} color="#fff" />
                <div style={{ display: 'flex', gap: 3 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,.8)', display: 'inline-block' }} />)}</div>
              </div>
              <div className="tg-corner" style={{ top: 84, left: 18, borderLeft: '2.5px solid #FFFC00', borderTop: '2.5px solid #FFFC00', borderRadius: '3px 0 0 0' }} />
              <div className="tg-corner" style={{ top: 84, right: 18, borderRight: '2.5px solid #FFFC00', borderTop: '2.5px solid #FFFC00', borderRadius: '0 3px 0 0' }} />
              <div className="tg-corner" style={{ top: 262, left: 18, borderLeft: '2.5px solid #FFFC00', borderBottom: '2.5px solid #FFFC00', borderRadius: '0 0 0 3px' }} />
              <div className="tg-corner" style={{ top: 262, right: 18, borderRight: '2.5px solid #FFFC00', borderBottom: '2.5px solid #FFFC00', borderRadius: '0 0 3px 0' }} />
              <div className="tg-scanline" />
              <div style={{ position: 'absolute', top: 88, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,252,0,.45)', borderRadius: 100, padding: '5px 13px', whiteSpace: 'nowrap', zIndex: 21 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#FFFC00', letterSpacing: '.05em' }}>✦ {dict.common.brand}</span>
                <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,.65)' }}> {dict.hero.phone.scanning}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 64, left: 10, right: 10, background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(16px)', borderRadius: 18, padding: 14, zIndex: 25, boxShadow: '0 10px 30px rgba(0,0,0,.25)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D', marginBottom: 6 }}>{dict.hero.phone.title}</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 9 }}>
                  <span style={{ background: '#F4F4F0', border: '.5px solid rgba(0,0,0,.1)', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 500, color: '#0D0D0D' }}>{dict.hero.phone.tag}</span>
                  <span style={{ background: '#F4F4F0', border: '.5px solid rgba(0,0,0,.1)', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 500, color: '#0D0D0D' }}>{dict.hero.phone.city}</span>
                  <span style={{ background: '#FFFC00', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 700, color: '#0D0D0D' }}>UNESCO</span>
                </div>
                <div style={{ fontSize: 9.5, color: '#6B6B6B', lineHeight: 1.55, marginBottom: 10 }}>{dict.hero.phone.quote}</div>
                <div style={{ background: '#FFFC00', borderRadius: 8, padding: 8, textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: '#0D0D0D' }}>{dict.hero.phone.save}</div>
              </div>
              <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, zIndex: 26 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} style={{ opacity: 0.85 }}><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
                <span style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #fff', display: 'inline-block', boxShadow: '0 2px 12px rgba(0,0,0,.3)' }} />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} style={{ opacity: 0.85 }}><circle cx="12" cy="12" r="9" /><path d="M8.5 14s1.2 1.8 3.5 1.8 3.5-1.8 3.5-1.8" /><circle cx="9" cy="10" r=".8" fill="#fff" /><circle cx="15" cy="10" r=".8" fill="#fff" /></svg>
              </div>
            </div>
          </div>
        </div>
        <div className="rhide" style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4 }}>
          <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase' }}>{dict.hero.scroll}</span>
          <span style={{ width: 1, height: 38, background: 'linear-gradient(180deg,var(--ink),transparent)', display: 'inline-block' }} />
        </div>
      </section>

      {/* ===== 2. POUR QUI ===== */}
      <section id="pour-qui" className="rsec" style={{ background: 'var(--bg2)', padding: '110px 64px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>{dict.pourQui.eyebrow}</span></div>
            <h2 className="tg-h2">{nl2br(dict.pourQui.title)}</h2>
          </div>
          <div className="rgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {AUDIENCES.map(({ title, desc, icon }, i) => (
              <div key={title} data-fade="" data-delay={i * 120} className="tg-card tg-hovercard" style={{ padding: '36px 32px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: 'var(--y)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.5px', margin: '0 0 10px' }}>{title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--muted)', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. COMMENT ÇA MARCHE ===== */}
      <section id="how" className="rsec" style={{ background: 'var(--bg)', padding: '120px 64px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>{dict.how.eyebrow}</span></div>
            <h2 className="tg-h2" style={{ fontSize: 52, letterSpacing: '-2px' }}>{dict.how.title}</h2>
          </div>
          <div className="rgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {STEPS.map((s, i) => {
              const active = activeStep === i
              return (
                <div key={s.n} data-fade="" onClick={() => setActiveStep(i)} className="tg-card" style={{ padding: '34px 30px', cursor: 'pointer', border: `1.5px solid ${active ? '#FFFC00' : 'var(--cardBorder)'}`, transition: 'border-color .25s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                    <span style={{ width: 54, height: 54, borderRadius: '50%', background: active ? 'var(--y)' : 'var(--bg2)', border: '1.5px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, transition: 'background .25s ease' }}>{s.n}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: active ? 'var(--ink)' : 'var(--muted)' }}>{s.tag}</span>
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.5px', margin: '0 0 10px' }}>{s.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--muted)', margin: 0 }}>{s.desc}</p>
                </div>
              )
            })}
          </div>
          <div data-fade="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '52px auto 0', background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 100, padding: '14px 28px', maxWidth: 640 }}>
            <Ghost size={18} />
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, textAlign: 'center', lineHeight: 1.5 }}>{dict.how.banner}</p>
          </div>
        </div>
      </section>

      {/* ===== 4. DÉMO ===== */}
      <section id="demo" className="rsec" style={{ background: 'var(--bg2)', padding: '120px 64px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>{dict.demoSection.eyebrow}</span></div>
            <h2 className="tg-h2" style={{ fontSize: 52, letterSpacing: '-2px' }}>{dict.demoSection.title}</h2>
          </div>
          <div className="rr" style={{ display: 'flex', gap: 26, alignItems: 'flex-start' }}>
            <div data-fade="" className="tg-card" style={{ flex: 1.35, overflow: 'hidden' }}>
              <img src={demo.src} alt={demo.title} style={{ width: '100%', height: 250, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-.5px', margin: 0 }}>{demo.title}</h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--bg2)', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {demo.city}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 7, marginBottom: 22, flexWrap: 'wrap' }}>
                  <span className="tg-pill-tag">{demo.tag}</span>
                  <span className="tg-badge-y">{demo.badge}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>{dict.demoSection.conversationLabel}</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                    <div style={{ background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: '14px 14px 4px 14px', padding: '11px 16px', maxWidth: '75%' }}>
                      <p style={{ fontSize: 13.5, margin: 0 }}>« {demo.question} »</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--y)', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}><Ghost size={13} color="#0D0D0D" /></span>
                    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', flex: 1 }}>
                      <p style={{ fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{demo.answer}</p>
                    </div>
                  </div>
                </div>
                <div className="tg-btn-y" style={{ width: '100%', justifyContent: 'center', padding: 14, borderRadius: 12, fontSize: 14 }}>{dict.demoSection.saveButton}</div>
              </div>
            </div>
            <div data-fade="" data-delay="150" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{dict.demoSection.chooseLabel}</div>
              {DEMO_ITEMS.map((d, i) => (
                <div key={d.title} onClick={() => setActiveDemo(i)} className="tg-card tg-thumb" style={{ display: 'flex', gap: 14, alignItems: 'center', border: `1.5px solid ${i === activeDemo ? '#FFFC00' : 'var(--cardBorder)'}`, borderRadius: 14, padding: '10px 14px 10px 10px' }}>
                  <img src={d.src} alt={d.title} style={{ width: 66, height: 50, objectFit: 'cover', borderRadius: 9, display: 'block', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{d.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{d.city}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--bg2)', borderRadius: 100, padding: '4px 9px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{d.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. CARNET DE VOYAGE ===== */}
      <section id="carnet" className="rsec" style={{ background: 'var(--bg)', padding: '120px 64px', borderTop: '1px solid var(--line)' }}>
        <div className="rr" style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div data-fade="" className="tg-eyebrow" style={{ marginBottom: 18 }}><span>{dict.carnet.eyebrow}</span></div>
            <h2 className="tg-h2" data-fade="" style={{ marginBottom: 40 }}>{nl2br(dict.carnet.title)}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              {JOURNAL_POINTS.map(({ title, desc, icon }, i) => (
                <div key={title} data-fade="" data-delay={i * 100} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--y)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                  </span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-fade="" data-delay="150" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="tg-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 26 }}>{TRIPS[0].flag}</span><div><div style={{ fontSize: 16, fontWeight: 700 }}>{TRIPS[0].city}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{TRIPS[0].sub}</div></div></div>
                <span className="tg-badge-y" style={{ fontSize: 11 }}>{TRIPS[0].quiz}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <img src="/9.jpg" alt="Rome" style={{ flex: 1, height: 64, objectFit: 'cover', borderRadius: 8, minWidth: 0 }} />
                <img src="/3.jpg" alt="Rome" style={{ flex: 1, height: 64, objectFit: 'cover', borderRadius: 8, minWidth: 0 }} />
                <img src="/5.jpg" alt="Rome" style={{ flex: 1, height: 64, objectFit: 'cover', borderRadius: 8, minWidth: 0 }} />
              </div>
              <div style={{ display: 'flex', gap: 18, fontSize: 12.5, color: 'var(--muted)' }}>
                <span><strong style={{ color: 'var(--ink)' }}>{TRIPS[0].monumentsCount}</strong> {dict.carnet.monuments}</span>
                <span><strong style={{ color: 'var(--ink)' }}>{TRIPS[0].photosCount}</strong> {dict.carnet.photos}</span>
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, color: 'var(--ink)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>PDF
                </span>
              </div>
            </div>
            {TRIPS.filter((t) => !t.main).map((t) => (
              <div key={t.city} className="tg-card" style={{ padding: '22px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 26 }}>{t.flag}</span><div><div style={{ fontSize: 16, fontWeight: 700 }}>{t.city}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.sub}</div></div></div>
                  <span style={{ background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 100, padding: '5px 12px', fontSize: 11, fontWeight: 700 }}>{t.quiz}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. PARTAGE SOCIAL ===== */}
      <section id="partage" className="rsec" style={{ background: 'var(--bg2)', padding: '120px 64px', borderTop: '1px solid var(--line)' }}>
        <div className="rrc" style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexDirection: 'row-reverse' }}>
          <div style={{ flex: 1 }}>
            <div data-fade="" className="tg-eyebrow" style={{ marginBottom: 18 }}><span>{dict.partage.eyebrow}</span></div>
            <h2 className="tg-h2" data-fade="" style={{ marginBottom: 20 }}>{nl2br(dict.partage.title)}</h2>
            <p data-fade="" data-delay="100" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 28px', maxWidth: 440 }}>
              {dict.partage.desc}
            </p>
            <div data-fade="" data-delay="180" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {dict.partage.tags.map((label) => (
                <span key={label} className="tg-card" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, borderRadius: 100, padding: '9px 16px', fontSize: 13, fontWeight: 600 }}>{label}</span>
              ))}
            </div>
          </div>
          <div data-fade="" data-delay="120" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 280, background: '#141414', borderRadius: 36, boxShadow: '0 32px 70px rgba(0,0,0,.25), 0 0 0 6px #1a1a1a', padding: '20px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 14 }}>{dict.partage.sendTo}</div>
              <div style={{ background: '#1E1E1E', borderRadius: 16, padding: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img src="/4.jpg" alt={DEMO_ITEMS[1].title} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{DEMO_ITEMS[1].title}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)' }}>{dict.common.brand} · {DEMO_ITEMS[1].tag} · {DEMO_ITEMS[1].badge}</div>
                  </div>
                  <span style={{ background: '#FFFC00', borderRadius: 100, padding: '3px 8px', fontSize: 8.5, fontWeight: 700, color: '#0D0D0D' }}>{dict.common.brand}</span>
                </div>
              </div>
              {[
                { initial: 'M', name: locale === 'fr' ? 'Ma Story' : 'My Story', bg: 'linear-gradient(135deg,#a78bfa,#7c3aed)', checked: true },
                { initial: 'L', name: 'Léa', bg: 'linear-gradient(135deg,#ffd3a5,#fd9853)', checked: true },
                { initial: 'T', name: 'Thomas', bg: 'linear-gradient(135deg,#a8d8ea,#6fb3cf)', checked: false },
              ].map((f, i) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 6px', borderBottom: i < 2 ? '1px solid rgba(255,255,255,.07)' : 'none', marginBottom: i === 2 ? 16 : 0 }}>
                  <span style={{ width: 34, height: 34, borderRadius: '50%', background: f.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>{f.initial}</span>
                  <span style={{ flex: 1, fontSize: 12.5, color: '#fff', fontWeight: 600 }}>{f.name}</span>
                  {f.checked ? (
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#FFFC00', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={3} strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                  ) : (
                    <span style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.3)', display: 'inline-block' }} />
                  )}
                </div>
              ))}
              <div style={{ background: '#FFFC00', borderRadius: 100, padding: 13, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {dict.partage.send}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2.5} strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. BADGES ===== */}
      <section id="badges" className="rsec" style={{ background: 'var(--bg)', padding: '120px 64px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>{dict.badges.eyebrow}</span></div>
            <h2 className="tg-h2" style={{ marginBottom: 14 }}>{dict.badges.title}</h2>
            <p style={{ fontSize: 16, color: 'var(--muted)', margin: '0 0 16px' }}>{dict.badges.subtitle}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 100, padding: '6px 14px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>{dict.badges.exampleNotice}</span>
            </div>
          </div>
          <div className="rgrid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {BADGES.map(({ name, desc, locked, icon }, i) => (
              <div key={name} data-fade="" data-delay={i * 100} className={locked ? '' : 'tg-card'} style={locked ? { background: 'transparent', border: '1.5px dashed var(--line)', borderRadius: 'var(--r)', padding: '28px 24px', opacity: 0.75 } : { padding: '28px 24px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: locked ? 'var(--bg2)' : 'var(--y)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={locked ? 'var(--muted)' : '#0D0D0D'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                {locked ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> {dict.badges.locked}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0D9F5B', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>✓ {dict.badges.unlocked}</div>
                )}
                <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 6 }}>{name}</div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--muted)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. ROADMAP ===== */}
      <section id="roadmap" className="rsec" style={{ background: 'var(--bg2)', padding: '110px 64px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>{dict.roadmap.eyebrow}</span></div>
            <h2 className="tg-h2" style={{ fontSize: 44, letterSpacing: '-1.6px' }}>{dict.roadmap.title}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ROADMAP.map(({ title, desc, eta, hot }, i) => (
              <div key={title} data-fade="" data-delay={i * 100} className="tg-card" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px 28px' }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: hot ? 'var(--y)' : 'var(--bg2)', border: hot ? 'none' : '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>{i === 0 ? '🌍' : i === 1 ? '🏛️' : '🔀'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55 }}>{desc}</div>
                </div>
                <span style={hot ? { background: 'var(--y)', borderRadius: 100, padding: '5px 13px', fontSize: 11, fontWeight: 700, color: '#0D0D0D', whiteSpace: 'nowrap' } : { background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 100, padding: '5px 13px', fontSize: 11, fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{eta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. POURQUOI TRAVELAI ===== */}
      <section id="features" className="rsec" style={{ background: 'var(--bg)', padding: '120px 64px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>{dict.features.eyebrow}</span></div>
            <h2 className="tg-h2">{nl2br(dict.features.title)}</h2>
          </div>
          <div className="rgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {FEATURES.map(({ title, desc, icon }, i) => (
              <div key={title} data-fade="" data-delay={i * 120} className="tg-card" style={{ padding: '36px 32px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: 'var(--bg2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <div style={{ width: 32, height: 3, background: 'var(--y)', borderRadius: 2, marginBottom: 18 }} />
                <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.5px', margin: '0 0 10px' }}>{title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--muted)', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10. GALERIE INSOLITE + STATS (dark) ===== */}
      <section id="galerie" style={{ background: 'var(--dark)', color: '#F4F3EE', padding: '120px 0 110px', overflow: 'hidden' }}>
        <div className="rsec" style={{ maxWidth: 1140, margin: '0 auto', padding: '0 64px' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 100, padding: '6px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(244,243,238,.7)', letterSpacing: '.07em', textTransform: 'uppercase' }}>{dict.galerie.badge}</span>
            </div>
            <h2 className="tg-h2" style={{ color: '#F4F3EE', marginBottom: 12 }}>
              {dict.galerie.title1}<br />
              <span style={{ background: 'var(--y)', color: '#0D0D0D', padding: '0 12px 3px', borderRadius: 8, display: 'inline-block' }}>{dict.galerie.title2}</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(244,243,238,.55)', margin: 0 }}>{dict.galerie.scrollHint}</p>
          </div>
        </div>
        <div ref={galleryRef} className="tg-noscroll" style={{ display: 'flex', gap: 20, overflowX: 'auto', padding: '8px 64px 28px', cursor: 'grab', WebkitOverflowScrolling: 'touch', userSelect: 'none' }}>
          {[...GALLERY, ...GALLERY].map(({ src, name, place }, i) => (
            <div key={`${name}-${i}`} style={{ flex: '0 0 300px', borderRadius: 'var(--r)', overflow: 'hidden', position: 'relative', height: 400, background: src ? undefined : 'repeating-linear-gradient(45deg,#26221C 0 14px,#211D18 14px 28px)' }}>
              {src ? (
                <>
                  <img src={src} alt={name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 45%,rgba(0,0,0,.75))' }} />
                </>
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 11.5, color: 'rgba(255,255,255,.55)', lineHeight: 1.7 }}>[ photo — {name}<br />{place} ]</span>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{name}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)' }}>{place}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="rrc" style={{ maxWidth: 900, margin: '56px auto 0', display: 'flex', justifyContent: 'space-around', gap: 40, padding: '0 40px', textAlign: 'center' }}>
          <div data-fade=""><div data-count="10000" data-suffix="+" style={{ fontSize: 54, fontWeight: 700, letterSpacing: '-2px' }}>{dict.galerie.stats[0].value}</div><div style={{ fontSize: 13, color: 'rgba(244,243,238,.55)', letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 4 }}>{dict.galerie.stats[0].label}</div></div>
          <div data-fade="" data-delay="120"><div data-count="150" data-suffix="+" style={{ fontSize: 54, fontWeight: 700, letterSpacing: '-2px' }}>{dict.galerie.stats[1].value}</div><div style={{ fontSize: 13, color: 'rgba(244,243,238,.55)', letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 4 }}>{dict.galerie.stats[1].label}</div></div>
          <div data-fade="" data-delay="240"><div data-count="4.9" data-decimal="true" data-suffix="★" style={{ fontSize: 54, fontWeight: 700, letterSpacing: '-2px', color: 'var(--y)' }}>{dict.galerie.stats[2].value}</div><div style={{ fontSize: 13, color: 'rgba(244,243,238,.55)', letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 4 }}>{dict.galerie.stats[2].label}</div></div>
        </div>
      </section>

      {/* ===== 11. TÉMOIGNAGES (dark) : preuve + stories ===== */}
      <section id="temoignages" className="rsec" style={{ background: 'var(--dark)', color: '#F4F3EE', padding: '30px 64px 120px' }}>
        <div className="rr" style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', gap: 48, alignItems: 'flex-start', paddingTop: 60, borderTop: '1px solid rgba(255,255,255,.08)' }}>
          {/* Gauche : panneau de preuve */}
          <div data-fade="" style={{ flex: '0 0 320px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--y)', borderRadius: 100, padding: '6px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0D0D0D', letterSpacing: '.07em', textTransform: 'uppercase' }}>{dict.temoignages.badge}</span>
            </div>
            <h2 className="tg-h2" style={{ fontSize: 42, letterSpacing: '-1.6px', color: '#F4F3EE', marginBottom: 26 }}>{nl2br(dict.temoignages.title)}</h2>
            <div style={{ background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 18, padding: '26px 28px', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-2px', color: 'var(--y)' }}>{dict.hero.rating}</span>
                <span style={{ fontSize: 16, color: 'var(--y)', letterSpacing: 2 }}>★★★★★</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(244,243,238,.55)', marginBottom: 18 }}>{dict.temoignages.ratingLabel}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {RATING_BARS.map(({ label, width, pct, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, width: 16, color: 'rgba(244,243,238,.55)' }}>{label}</span>
                    <span style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.08)', borderRadius: 3, overflow: 'hidden', display: 'inline-block' }}>
                      <span style={{ display: 'block', width, height: '100%', background: color, borderRadius: 3 }} />
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(244,243,238,.55)' }}>{pct}</span>
                  </div>
                ))}
              </div>
            </div>
            <a href="#cta" className="tg-btn-y" style={{ display: 'flex', justifyContent: 'center', padding: 16, width: '100%', marginBottom: 10, boxSizing: 'border-box' }}>
              <Ghost size={15} color="#0D0D0D" />
              {dict.temoignages.ctaFree}
            </a>
            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'rgba(244,243,238,.4)' }}>{dict.temoignages.ctaSub}</div>
          </div>

          {/* Droite : stories */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div data-fade="" data-delay="100" style={{ marginBottom: 26 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 100, padding: '6px 14px', marginBottom: 12 }}>
                <Ghost size={12} color="#FFFC00" />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(244,243,238,.7)', letterSpacing: '.07em', textTransform: 'uppercase' }}>{dict.temoignages.storiesBadge}</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(244,243,238,.55)', margin: 0 }}>{dict.temoignages.storiesSub}</p>
            </div>
            <div className="rgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {STORIES.map(({ src, alt, handle, meta, quote, avatar, segments, rot, delay }) => (
                <div key={handle} data-fade="" data-delay={delay} style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', height: 400, transform: `rotate(${rot})` }}>
                  <img src={src} alt={alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.45) 0%,transparent 30%,transparent 45%,rgba(0,0,0,.82) 100%)' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', gap: 4 }}>
                    {Array.from({ length: segments }).map((_, s) => (
                      <span key={s} style={{ flex: 1, height: 2.5, background: s === 0 ? 'var(--y)' : 'rgba(255,255,255,.35)', borderRadius: 2, display: 'inline-block' }} />
                    ))}
                  </div>
                  <div style={{ position: 'absolute', top: 26, left: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: avatar, border: '2px solid var(--y)', display: 'inline-block' }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{handle}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}>{meta}</div>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: 16, left: 12, right: 12 }}>
                    <div style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 13, padding: '12px 14px', marginBottom: 9 }}>
                      <div style={{ fontSize: 10.5, color: 'var(--y)', letterSpacing: 1.5, marginBottom: 6 }}>★★★★★</div>
                      <p style={{ fontSize: 12, lineHeight: 1.55, color: '#fff', margin: 0 }}>{quote}</p>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--y)', borderRadius: 100, padding: '5px 11px', fontSize: 10, fontWeight: 700, color: '#0D0D0D' }}>👻 {dict.temoignages.scannedWith}</span>
                  </div>
                </div>
              ))}
            </div>
            <div data-fade="" data-delay="400" style={{ textAlign: 'center', marginTop: 28 }}>
              <a href="#cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--y)', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>{dict.temoignages.ctaStory}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 12. CONFIANCE ===== */}
      <section id="confiance" className="rsec" style={{ background: 'var(--bg)', padding: '120px 64px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2.2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>{dict.confiance.eyebrow}</span>
            </div>
            <h2 className="tg-h2">{dict.confiance.title}</h2>
          </div>
          <div className="rgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {TRUST.map(({ q, a }, i) => (
              <div key={q} data-fade="" data-delay={i * 120} className="tg-card" style={{ padding: '32px 30px' }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{q}</div>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--muted)', margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 13. FAQ ===== */}
      <section id="faq" className="rsec" style={{ background: 'var(--bg2)', padding: '110px 64px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>{dict.faq.eyebrow}</span></div>
            <h2 className="tg-h2" style={{ fontSize: 44, letterSpacing: '-1.6px' }}>{dict.faq.title}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ_ITEMS.map(({ q, a }, i) => {
              const open = openFaq === i
              return (
                <div key={q} className="tg-card" style={{ overflow: 'hidden' }}>
                  <div onClick={() => setOpenFaq(open ? null : i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '20px 24px', cursor: 'pointer' }}>
                    <span style={{ fontSize: 15.5, fontWeight: 600 }}>{q}</span>
                    <span style={{ fontSize: 22, color: 'var(--muted)', flexShrink: 0, lineHeight: 1 }}>{open ? '−' : '+'}</span>
                  </div>
                  {open && (
                    <div style={{ padding: '0 24px 22px' }}>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>{a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== 14. COMPARATIF (dark) ===== */}
      <section id="comparatif" className="rsec" style={{ background: 'var(--dark)', color: '#F4F3EE', padding: '120px 64px' }}>
        <div style={{ maxWidth: 940, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 100, padding: '6px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(244,243,238,.7)', letterSpacing: '.07em', textTransform: 'uppercase' }}>{dict.comparatif.eyebrow}</span>
            </div>
            <h2 className="tg-h2" style={{ fontSize: 44, letterSpacing: '-1.6px', color: '#F4F3EE' }}>{dict.comparatif.title}</h2>
          </div>
          <div className="rr" style={{ display: 'flex', gap: 22, alignItems: 'stretch' }}>
            <div data-fade="" style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 'var(--r)', padding: '34px 32px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(244,243,238,.55)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>{dict.comparatif.audioguide.label}</div>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-1px', marginBottom: 26 }}>{dict.comparatif.audioguide.price} <span style={{ fontSize: 15, fontWeight: 500, color: 'rgba(244,243,238,.5)' }}>{dict.comparatif.audioguide.priceUnit}</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {dict.comparatif.audioguide.points.map((p) => (
                  <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'rgba(244,243,238,.7)', lineHeight: 1.5 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244,243,238,.4)" strokeWidth={2.4} strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div data-fade="" data-delay="140" style={{ flex: 1, background: 'rgba(255,252,0,.05)', border: '2px solid var(--y)', borderRadius: 'var(--r)', padding: '34px 32px', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -13, left: 28, background: 'var(--y)', color: '#0D0D0D', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '.04em' }}>{dict.comparatif.travelai.recommended}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Ghost size={16} color="#FFFC00" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--y)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{dict.common.brand}</span>
              </div>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-1px', marginBottom: 26 }}>{dict.comparatif.travelai.price} <span style={{ fontSize: 15, fontWeight: 500, color: 'rgba(244,243,238,.5)' }}>{dict.comparatif.travelai.priceUnit}</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {dict.comparatif.travelai.points.map((p) => (
                  <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFC00" strokeWidth={2.6} strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12" /></svg>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 15. CTA FINAL (jaune affirmé) ===== */}
      <section id="cta" className="rsec" style={{ background: 'var(--y)', color: '#0D0D0D', padding: '130px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          <div data-fade="" style={{ marginBottom: 26, display: 'flex', justifyContent: 'center' }}>
            <img src="/snapchat.png" alt="Snapchat" style={{ width: 58, height: 58, borderRadius: 14, objectFit: 'contain', background: '#FFFC00', padding: 8 }} />
          </div>
          <h2 className="tg-h2" data-fade="" data-delay="80" style={{ fontSize: 56, letterSpacing: '-2.2px', lineHeight: 1.05, marginBottom: 18 }}>{nl2br(dict.cta.title)}</h2>
          <p data-fade="" data-delay="160" style={{ fontSize: 17, lineHeight: 1.65, opacity: 0.65, margin: '0 0 38px' }}>
            {dict.cta.subtitle}
          </p>
          <div data-fade="" data-delay="240" style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a href={`/${locale}/login`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#0D0D0D', color: '#FFFC00', padding: '18px 38px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', transition: 'all .2s ease' }}>
              <Ghost size={17} color="#FFFC00" />
              {dict.cta.button}
            </a>
          </div>
          <div data-fade="" data-delay="320" style={{ marginTop: 22, fontSize: 12.5, opacity: 0.5 }}>{dict.cta.footer}</div>
        </div>
      </section>

      {/* ===== 16. FOOTER ===== */}
      <footer className="rsec" style={{ background: '#0C0C0D', color: 'rgba(255,255,255,.45)', padding: 64 }}>
        <div className="rrc" style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <img src="/voyageur.jpg" alt={dict.common.brand} style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover' }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-.4px' }}>{dict.common.brand}</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, maxWidth: 260 }}>{dict.footer.tagline}</p>
          </div>
          <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>{dict.footer.produit}</span>
              <a href="#how" className="tg-footer-link">{dict.nav.items.how}</a>
              <a href="#demo" className="tg-footer-link">{dict.nav.items.demo}</a>
              <a href="#roadmap" className="tg-footer-link">{dict.footer.roadmap}</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>{dict.footer.legal}</span>
              <a href={`/${locale}/confidentialite`} className="tg-footer-link">{dict.footer.confidentialite}</a>
              <a href={`/${locale}/conditions`} className="tg-footer-link">{dict.footer.conditions}</a>
              <a href={`/${locale}/contact`} className="tg-footer-link">{dict.footer.contact}</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1140, margin: '40px auto 0', paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
          <span>{dict.footer.copyright}</span>
          <span>{dict.footer.signature}</span>
        </div>
      </footer>
    </div>
  )
}
