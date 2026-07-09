/**
 * TravelAI — Landing Page
 *
 * Placement :
 *   -> frontend/app/page.tsx (rendu via ce composant)
 *   -> frontend/components/LandingPage.tsx (ce fichier)
 *   -> Images dans frontend/public/ (ex: /6.png, /4.jpg ...)
 *
 * Dependances : qrcode.react (deja dans package.json), next-auth/react
 */

'use client'

import { useEffect, useRef, useState, Fragment } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { CircularGallery, type GalleryItem as CircularGalleryItem } from '@/components/ui/circular-gallery'

const SNAPCODE_PLACEHOLDER = 'https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=travelai-lens-placeholder'

const INSOLITE_MONUMENTS: CircularGalleryItem[] = [
  { common: 'Salar de Uyuni', binomial: 'Bolivie', photo: { url: '/salar-de-uyuni.jpg', text: 'Salar de Uyuni' } },
  { common: "Porte de l'Enfer", binomial: 'Darvaza, Turkmenistan', photo: { url: '/porte-de-lenfer.jpg', text: "Porte de l'Enfer" } },
  { common: 'Cappadoce', binomial: 'Turquie', photo: { url: '/cappadoce.jpg', text: 'Cappadoce' } },
  { common: 'Zhangjiajie', binomial: 'Chine', photo: { url: '/zhangjiajie.jpg', text: 'Zhangjiajie' } },
  { common: 'Trolltunga', binomial: 'Norvege', photo: { url: '/trolltunga.jpg', text: 'Trolltunga' } },
]

/* ===== Embedded CSS (keyframes, hover states, responsive) ===== */
const CSS = `
  .ta-root { background: #fff; color: #0D0D0D; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  .ta-root *, .ta-root *::before, .ta-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  @keyframes floatA {
    0%, 100% { transform: rotate(-7deg) translateY(0px); }
    50%       { transform: rotate(-7deg) translateY(-13px); }
  }
  @keyframes floatB {
    0%, 100% { transform: rotate(5deg) translateY(0px); }
    50%       { transform: rotate(5deg) translateY(-10px); }
  }
  @keyframes floatC {
    0%, 100% { transform: rotate(-3deg) translateY(0px); }
    50%       { transform: rotate(-3deg) translateY(-15px); }
  }
  @keyframes floatD {
    0%, 100% { transform: rotate(9deg) translateY(0px); }
    50%       { transform: rotate(9deg) translateY(-8px); }
  }
  @keyframes scanPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes lineSlide {
    0%   { top: 8%;  opacity: 0.8; }
    100% { top: 68%; opacity: 0; }
  }

  /* Polaroid float */
  .ta-float-a { animation: floatA 7s   ease-in-out infinite; }
  .ta-float-b { animation: floatB 8.5s ease-in-out infinite; animation-delay: 1.2s; }
  .ta-float-c { animation: floatC 6.5s ease-in-out infinite; animation-delay: 0.7s; }
  .ta-float-d { animation: floatD 9s   ease-in-out infinite; animation-delay: 2s; }

  /* Camera scan */
  .ta-scan-corner { animation: scanPulse 2s ease-in-out infinite; }
  .ta-scan-line {
    animation: lineSlide 2s ease-in-out infinite;
    position: absolute; left: 18px; right: 18px; height: 1.5px;
    background: linear-gradient(90deg, transparent, #FFFC00, transparent);
    z-index: 20;
  }

  /* Nav */
  .ta-nav-link { color: #6B6B6B; text-decoration: none; transition: color .2s; font-size: 14px; font-weight: 500; }
  .ta-nav-link:hover { color: #0D0D0D; }
  .ta-nav-cta {
    display: inline-flex; align-items: center; gap: 7px;
    background: #FFFC00; color: #0D0D0D; padding: 10px 20px;
    border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none;
    transition: transform .18s ease, box-shadow .18s ease; border: none; cursor: pointer;
   
  }
  .ta-nav-cta:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,252,0,.45); }

  /* Buttons */
  .ta-btn-primary {
    display: inline-flex; align-items: center; gap: 9px;
    background: #FFFC00; color: #0D0D0D; padding: 16px 30px;
    border-radius: 12px; font-size: 15px; font-weight: 700;
    text-decoration: none; transition: all .2s ease; white-space: nowrap;
    border: none; cursor: pointer;
  }
  .ta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255,252,0,.5); }

  .ta-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1.5px solid rgba(0,0,0,.15); color: #0D0D0D; padding: 15px 26px;
    border-radius: 12px; font-size: 15px; font-weight: 600;
    text-decoration: none; transition: all .2s ease; white-space: nowrap;
    background: #fff; cursor: pointer;
  }
  .ta-btn-ghost:hover { border-color: #0D0D0D; background: #F7F7F7; }

  .ta-btn-cta {
    display: inline-flex; align-items: center; gap: 10px;
    background: #FFFC00; color: #0D0D0D; padding: 18px 40px;
    border-radius: 14px; font-size: 16px; font-weight: 700;
    text-decoration: none; transition: all .2s ease; margin-bottom: 28px;
    border: none; cursor: pointer;
  }
  .ta-btn-cta:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(255,252,0,.5); }

  .ta-btn-save {
    width: 100%; background: #FFFC00; border: none; border-radius: 12px;
    padding: 14px; font-size: 14px; font-weight: 700; color: #0D0D0D;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .2s ease;
  }
  .ta-btn-save:hover { box-shadow: 0 6px 20px rgba(255,252,0,.5); transform: translateY(-1px); }

  .ta-input-email {
    border: 1.5px solid rgba(0,0,0,.15); border-radius: 12px; padding: 13px 16px;
    font-size: 14px; outline: none;
    transition: border-color .2s ease; min-width: 220px;
  }
  .ta-input-email:focus { border-color: #0D0D0D; }

  /* Cards */
  .ta-feature-card { transition: box-shadow .25s ease, border-color .25s ease; }
  .ta-feature-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.08) !important; border-color: transparent !important; }
  .ta-feature-card:hover .ta-icon-box { background: #FFFC00; }
  .ta-icon-box { transition: background .2s; }
  .ta-thumb-card { transition: box-shadow .2s ease; }
  .ta-thumb-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.1) !important; }

  /* Footer */
  .ta-footer-link { color: rgba(255,255,255,.45); text-decoration: none; transition: color .2s; }
  .ta-footer-link:hover { color: rgba(255,255,255,.9); }
  .ta-footer-url { color: rgba(255,255,255,.3); text-decoration: none; transition: color .2s; }
  .ta-footer-url:hover { color: rgba(255,255,255,.7); }
  .ta-social-btn {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(255,255,255,.07); display: flex;
    align-items: center; justify-content: center;
    transition: background .2s; text-decoration: none;
  }
  .ta-social-btn:hover { background: rgba(255,255,255,.14); }

  /* Responsive */
  @media (max-width: 960px) {
    .ta-hero-inner      { flex-direction: column !important; padding: 80px 28px 48px !important; gap: 60px !important; }
    .ta-hero-visual     { display: none !important; }
    .ta-nav-links       { display: none !important; }
    .ta-steps-row       { flex-direction: column !important; align-items: center !important; }
    .ta-step-connector  { display: none !important; }
    .ta-features-grid   { flex-wrap: wrap !important; }
    .ta-demo-inner      { flex-direction: column !important; align-items: center !important; }
    .ta-stats-cols      { flex-wrap: wrap !important; gap: 48px !important; }
    .ta-testimonials    { flex-direction: column !important; }
    .ta-footer-inner    { flex-direction: column !important; align-items: center !important; gap: 24px !important; text-align: center !important; }
  }
`

/* ===== Ghost SVG path (Snapchat-inspired) ===== */
const GHOST_PATH =
  'M12 1.5C8.3 1.5 5.3 4.5 5.3 8.2v4.8l-1.6 1 .8 1.4.8-.5v1.3c-.6.2-1.5.8-1.9 2.1-.3 1-.1 2.2-.1 2.2s2.9-.4 4.2 1.4c.5.8 1.6 1.3 2.8 1.3 1.1 0 1.6-.2 1.6-.2s.6.2 1.6.2c1.2 0 2.3-.5 2.8-1.3 1.3-1.8 4.2-1.4 4.2-1.4s.2-1.2-.1-2.2c-.4-1.3-1.3-1.9-1.9-2.1v-1.3l.8.5.8-1.4-1.6-1V8.2C18.7 4.5 15.7 1.5 12 1.5z'

function GhostIcon({ size = 17, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={GHOST_PATH} />
    </svg>
  )
}

/* ===== Types ===== */
interface Polaroid {
  src: string
  label: string
  cls: string
  w: number
  h: number
  pos: React.CSSProperties
}

/* ===== Landing Page ===== */
export default function LandingPage() {
  const navRef = useRef<HTMLElement>(null)
  const [showSnapcode, setShowSnapcode] = useState(false)
  const [activeDemoIndex, setActiveDemoIndex] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    /* Nav on scroll */
    const onScroll = () => {
      if (window.scrollY > 30) {
        nav.style.background = 'rgba(255,255,255,0.96)'
        nav.style.boxShadow = '0 1px 20px rgba(0,0,0,0.07)'
        nav.style.borderBottom = '1px solid rgba(0,0,0,0.06)'
      } else {
        nav.style.background = 'rgba(255,255,255,0)'
        nav.style.boxShadow = 'none'
        nav.style.borderBottom = '1px solid transparent'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    /* Fade-in on scroll */
    const fadeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const delay = parseInt(el.dataset.delay ?? '0')
          setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0px)'
          }, delay)
          fadeObs.unobserve(entry.target)
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('[data-fade]').forEach((el) => {
      const h = el as HTMLElement
      h.style.opacity = '0'
      h.style.transform = 'translateY(28px)'
      h.style.transition =
        'opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)'
      fadeObs.observe(el)
    })

    /* Count-up for stats */
    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const target = parseFloat(el.dataset.count ?? '0')
          const suffix = el.dataset.suffix ?? ''
          const isDecimal = el.dataset.decimal === 'true'
          const duration = 2000
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const val = eased * target
            el.textContent =
              (isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          countObs.unobserve(el)
        })
      },
      { threshold: 0.5 }
    )
    document.querySelectorAll('[data-count]').forEach((el) => countObs.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      fadeObs.disconnect()
      countObs.disconnect()
    }
  }, [])

  /* -- Polaroid data -- */
  const polaroids: Polaroid[] = [
    { src: '/6.png', label: 'Notre-Dame · Paris',     cls: 'ta-float-a', w: 158, h: 118, pos: { top: 10,   left: 30  } },
    { src: '/4.jpg', label: 'Milan Duomo · Italy',    cls: 'ta-float-b', w: 144, h: 108, pos: { bottom: 50, left: 15  } },
    { src: '/8.jpg', label: 'Statue of Liberty · NY', cls: 'ta-float-c', w: 150, h: 113, pos: { top: 30,   right: 25 } },
    { src: '/2.jpg', label: 'Mount Rushmore · USA',   cls: 'ta-float-d', w: 148, h: 108, pos: { bottom: 40, right: 15 } },
  ]

  /* -- Step data -- */
  const steps = [
    {
      n: 1, bg: '#FFFC00',
      icon: <path d={GHOST_PATH} fill="#0D0D0D" />,
      filled: true,
      title: 'Ouvre la Lens',
      desc: "Retrouve TravelAI dans l'explorateur de Lens Snapchat et lance-la en un tap. Pas d'inscription, pas de telechargement.",
    },
    {
      n: 2, bg: '#F0F0F0',
      icon: (
        <>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </>
      ),
      filled: false,
      title: 'Vise un monument',
      desc: "Pointe ta camera sur un monument. L'IA Vision de TravelAI l'identifie en moins de 2 secondes.",
    },
    {
      n: 3, bg: '#FFFC00',
      icon: (
        <>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="10" y1="8" x2="16" y2="8" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </>
      ),
      filled: false,
      title: 'Recois ton guide + carnet',
      desc: 'Reponses IA instantanees, histoire riche, et un carnet de voyage PDF magnifique — tout est genere automatiquement.',
    },
  ]

  /* -- Feature data -- */
  const features = [
    {
      delay: 0,
      icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
      title: 'Reconnaissance instantanee',
      desc: "Identifie n'importe quel monument dans le monde en moins de 2 secondes grace a la vision par ordinateur Google Gemini.",
    },
    {
      delay: 150,
      icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
      title: 'Conversations IA',
      desc: "Pose toutes tes questions sur ce que tu vois. Histoire, architecture, anecdotes — ton guide personnel sait tout.",
    },
    {
      delay: 300,
      icon: (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </>
      ),
      title: 'Carnet de voyage PDF',
      desc: 'Genere automatiquement un souvenir PDF avec tes photos, les notes de l\'IA et tes decouvertes de chaque voyage.',
    },
  ]

  /* -- Carnet de voyage : points clefs -- */
  const journalPoints = [
    {
      icon: (
        <>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </>
      ),
      title: 'Sauvegarde automatique',
      desc: "Chaque photo et chaque question posee a l'IA est rangee par voyage, sans action de ta part.",
    },
    {
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
          <line x1="12" y1="16.5" x2="12.01" y2="16.5" />
        </>
      ),
      title: 'Quiz de fin de visite',
      desc: 'Un mini-quiz genere apres chaque decouverte, pour retenir ce qui compte vraiment.',
    },
    {
      icon: (
        <>
          <path d="M12 2l2.4 6.9L22 9l-5.6 4.9L18 22l-6-4-6 4 1.6-8.1L2 9l7.6-.1z" />
        </>
      ),
      title: 'Infos et anecdotes en evidence',
      desc: 'Dates cles, chiffres marquants et anecdotes surprenantes remontees automatiquement.',
    },
    {
      icon: (
        <>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </>
      ),
      title: 'Export PDF en un tap',
      desc: "Transforme n'importe quel voyage en carnet illustre a imprimer ou a partager.",
    },
  ]

  /* -- Carnet de voyage : apercu dashboard -- */
  const tripsMockup = [
    { city: 'Rome, Italie', flag: '🇮🇹', monuments: 14, photos: 32, quiz: 92, color: '#FFE8D6' },
    { city: 'Kyoto, Japon', flag: '🇯🇵', monuments: 9, photos: 21, quiz: 87, color: '#DCEEFF' },
    { city: 'Paris, France', flag: '🇫🇷', monuments: 6, photos: 15, quiz: 95, color: '#FFF3B0' },
  ]

  /* -- Testimonial data -- */
  const testimonials = [
    {
      quote: '"J\'ai pointe ma camera sur une eglise au hasard a Rome et TravelAI m\'a tout raconte — l\'annee de construction, qui l\'a commandee, et un passage secret sous l\'autel. Mon guide touristique etait sans voix."',
      name: 'Sophie M.', role: 'Voyageuse · Lyon, France',
      avatar: 'linear-gradient(135deg,#ffd3a5,#fd9853)', delay: 0,
    },
    {
      quote: '"Le carnet de voyage PDF m\'a bluffe. J\'avais 3 semaines de monuments, notes IA et photos compiles automatiquement. Je l\'ai imprime et donne a mes parents — ils ont pleure."',
      name: 'James T.', role: 'Photographe · Londres, UK',
      avatar: 'linear-gradient(135deg,#c8f7c5,#4caf50)', delay: 150,
    },
    {
      quote: '"Utilise pendant une semaine au Japon. Chaque temple, chaque sanctuaire — TravelAI les connaissait tous. Pas besoin de wifi, pas de saisie, juste viser et decouvrir. Un vrai changement de jeu."',
      name: 'Yuki N.', role: 'Nomade digitale · Tokyo, JP',
      avatar: 'linear-gradient(135deg,#a8d8ea,#6fb3cf)', delay: 300,
    },
  ]

  /* -- FAQ data -- */
  const faqItems = [
    {
      q: 'Mes photos sont-elles privees ou visibles par d\'autres ?',
      a: "Tes photos et ton carnet de voyage sont prives par defaut. Seul ce que tu choisis explicitement de partager (en snap ou en story) est envoye a tes amis — voir notre Politique de confidentialite pour le detail complet.",
    },
    {
      q: 'Est-ce que je peux retrouver mes voyages meme sans Snapchat ouvert ?',
      a: "Oui. Connecte-toi avec ton compte Google sur travelai.digitalstack.cloud pour retrouver ton carnet de voyage, ton historique et tes quiz, meme sans avoir Snapchat ouvert.",
    },
    {
      q: 'Le PDF est-il vraiment gratuit ?',
      a: "Oui. La generation et le telechargement de ton carnet de voyage PDF sont entierement gratuits, sans limite de temps ni carte bancaire requise.",
    },
    {
      q: 'Ca fonctionne dans quelles langues / quels pays ?',
      a: "TravelAI est disponible en francais et en anglais pour le moment, et identifie des monuments dans plus de 150 pays. D'autres langues arriveront prochainement selon la demande.",
    },
  ]

  /* -- Pour qui ? -- */
  const audienceProfiles = [
    {
      icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
      title: 'Voyageur solo',
      desc: "Explore a ton rythme sans avoir a chercher un guide ou une brochure — ton IA repond a chaque question, meme a 2h du matin.",
    },
    {
      icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
      title: 'Famille',
      desc: "Transforme la visite en jeu : les enfants scannent, decouvrent et repondent au quiz — sans ecran qui les enferme.",
    },
    {
      icon: <><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M22 8.5v7l-6-3.5z" /></>,
      title: 'Createur de contenu voyage',
      desc: "Repars avec des anecdotes verifiees, des faits precis et un carnet illustre pret a nourrir tes prochains posts.",
    },
  ]

  /* -- Defis et badges -- */
  const badgesMockup = [
    {
      icon: <><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" /><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" /></>,
      name: '10 monuments UNESCO',
      desc: 'Decouvre 10 sites classes au patrimoine mondial.',
      locked: false,
    },
    {
      icon: <><path d="M2 12h4l3-9 4 18 3-9h6" /></>,
      name: "Explorateur de l'Asie",
      desc: 'Scanne un monument dans 5 pays asiatiques differents.',
      locked: false,
    },
    {
      icon: <><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></>,
      name: 'Serie de 5 jours',
      desc: '5 jours consecutifs avec au moins une decouverte.',
      locked: true,
    },
    {
      icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
      name: 'Premier carnet complete',
      desc: 'Exporte ton tout premier carnet de voyage en PDF.',
      locked: true,
    },
  ]

  /* -- Roadmap -- */
  const roadmapItems = [
    { title: 'Traduction en temps reel', desc: "Pose tes questions dans ta langue, ou l'IA te repond directement traduit.", eta: 'Prochainement' },
    { title: 'Realite augmentee historique', desc: "Superpose une reconstitution du monument a differentes epoques, directement dans la camera.", eta: 'A l\'etude' },
    { title: 'Mode multi-lens', desc: 'Compare plusieurs monuments similaires vus pendant ton voyage en un seul recap.', eta: 'A l\'etude' },
  ]

  /* -- Comparatif audioguide -- */
  const audioguideComparison = [
    {
      label: 'Audioguide classique',
      price: '~8€ / site',
      points: ['Un seul monument a la fois', 'A rendre en fin de visite', 'Contenu fige, pas de questions'],
      highlight: false,
    },
    {
      label: 'TravelAI',
      price: 'Inclus, gratuit',
      points: ['Tous les monuments, partout', 'Reste dans ton carnet a vie', 'Reponds a toutes tes questions'],
      highlight: true,
    },
  ]

  /* -- Confiance : tes photos t'appartiennent -- */
  const trustPoints = [
    {
      q: 'Ou sont stockees tes photos ?',
      a: 'Sur des serveurs securises, uniquement le temps necessaire pour generer ton carnet de voyage.',
    },
    {
      q: 'Servent-elles a autre chose ?',
      a: "Non. Elles ne sont utilisees que pour l'identification du monument et ton carnet — jamais revendues ni utilisees a des fins publicitaires.",
    },
    {
      q: 'Comment les supprimer ?',
      a: 'A tout moment, en nous ecrivant : suppression de tes photos et de tes donnees sous un mois maximum.',
    },
  ]

  /* -- Demo items (carte principale + miniatures cliquables) -- */
  const demoItems = [
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

  /* -- Avatar colors -- */
  const avatars = [
    'linear-gradient(135deg,#a8d8ea,#6fb3cf)',
    'linear-gradient(135deg,#ffd3a5,#fd9853)',
    'linear-gradient(135deg,#c8f7c5,#4caf50)',
  ]

  return (
    <div className="ta-root">
      <style>{CSS}</style>

      {/* ===== NAV ===== */}
      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: 64, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 64px',
          background: 'transparent',
          transition: 'background .35s ease, box-shadow .35s ease, border-color .35s ease',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid transparent',
        }}
      >
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, overflow: 'hidden' }}>
            <img src="/voyageur.jpg" alt="TravelAI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-0.4px' }}>TravelAI</span>
        </a>

        <div className="ta-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#how" className="ta-nav-link">Comment ca marche</a>
          <a href="#demo" className="ta-nav-link">Demo</a>
          <a href="#carnet" className="ta-nav-link">Carnet</a>
          <a href="#partage" className="ta-nav-link">Partage</a>
          <a href="#badges" className="ta-nav-link">Badges</a>
          <a href="#features" className="ta-nav-link">Fonctionnalites</a>
          <a href="#faq" className="ta-nav-link">FAQ</a>
        </div>

        <Link href="/login" className="ta-nav-cta">
          Se connecter
        </Link>
      </nav>

      {/* ===== HERO ===== */}
      <section id="hero" style={{ minHeight: '100vh', background: '#fff', overflow: 'hidden', position: 'relative' }}>
        {/* Radial gradient bg */}
        <div style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%,-50%)', width: 1000, height: 1000, background: 'radial-gradient(circle,rgba(255,252,0,0.15) 0%,transparent 58%)', pointerEvents: 'none', zIndex: 0 }} />

        <div
          className="ta-hero-inner"
          style={{ maxWidth: 1340, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40, padding: '120px 80px 80px', position: 'relative', zIndex: 1, minHeight: '100vh' }}
        >
          {/* -- Left: Text -- */}
          <div style={{ flex: 1, maxWidth: 580 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 100, padding: '6px 16px', marginBottom: 32 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FFFC00', boxShadow: '0 0 6px rgba(255,252,0,0.7)' }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0D0D0D', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Disponible sur Snapchat</span>
            </div>

            <h1 style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.0, letterSpacing: '-3px', color: '#0D0D0D', marginBottom: 28 }}>
              Point.<br />Ask.<br />
              <span style={{ background: '#FFFC00', padding: '2px 10px', borderRadius: 8, display: 'inline-block', marginTop: 4 }}>
                Remember.
              </span>
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.65, color: '#6B6B6B', marginBottom: 44, maxWidth: 460, fontWeight: 400 }}>
              Identifie n&apos;importe quel monument en quelques secondes avec ta camera Snapchat. Ton guide de voyage IA, toujours dans ta poche.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <a href="/onboarding?demo=1" className="ta-btn-primary">
                <GhostIcon size={17} />
                Voir le compte Demo
              </a>
              <a href="#how" className="ta-btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                </svg>
                Voir comment ca marche
              </a>
            </div>

            {showSnapcode && (
              <div style={{ marginTop: 24, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 16, padding: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <QRCodeSVG value={SNAPCODE_PLACEHOLDER} size={160} />
                <span style={{ fontSize: 11, color: '#6B6B6B' }}>Snapcode (placeholder) — scanne avec Snapchat</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 44 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {avatars.map((bg, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid #fff', background: bg, marginRight: i < 2 ? -9 : 0, position: 'relative', zIndex: 3 - i }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#FFFC00', letterSpacing: 1, marginBottom: 2 }}>★★★★★</div>
                <div style={{ fontSize: 12.5, color: '#6B6B6B' }}>
                  Adopte par <strong style={{ color: '#0D0D0D' }}>10 000+</strong> voyageurs
                </div>
              </div>
            </div>
          </div>

          {/* -- Right: Phone + Polaroids -- */}
          <div
            className="ta-hero-visual"
            style={{ flex: 1, position: 'relative', height: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 480 }}
          >
            {/* Polaroids */}
            {polaroids.map(({ src, label, cls, w, h, pos }) => (
              <div key={src} className={cls} style={{ position: 'absolute', ...pos, width: w, background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.13),0 2px 8px rgba(0,0,0,0.08)', borderRadius: 3, padding: '9px 9px 38px', zIndex: 3 }}>
                <img src={src} alt={label} style={{ width: '100%', height: h, objectFit: 'cover', display: 'block', borderRadius: 2 }} />
                <div style={{ marginTop: 10, fontSize: 9.5, fontWeight: 600, color: '#6B6B6B', textAlign: 'center', letterSpacing: '0.02em' }}>{label}</div>
              </div>
            ))}

            {/* Phone mockup */}
            <div style={{ position: 'relative', zIndex: 10, width: 256, height: 524, background: '#111', borderRadius: 42, boxShadow: '0 40px 80px rgba(0,0,0,0.25),0 0 0 1px rgba(255,255,255,0.08) inset,0 0 0 7px #1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
              {/* Notch */}
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 90, height: 29, background: '#111', borderRadius: '0 0 20px 20px', zIndex: 30 }} />
              {/* Camera image */}
              <img src="/6.png" alt="camera view" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.82 }} />
              {/* Vignette */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.35) 0%,transparent 35%,transparent 55%,rgba(0,0,0,0.7) 100%)' }} />
              {/* Top bar */}
              <div style={{ position: 'absolute', top: 36, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', zIndex: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>9:41</span>
                <GhostIcon size={26} color="white" />
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2].map((i) => <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />)}
                </div>
              </div>
              {/* Scan corners */}
              {[
                { top: 80,  left: 18,  borderLeft: '2.5px solid #FFFC00', borderTop: '2.5px solid #FFFC00',    borderRadius: '3px 0 0 0' },
                { top: 80,  right: 18, borderRight: '2.5px solid #FFFC00', borderTop: '2.5px solid #FFFC00',   borderRadius: '0 3px 0 0' },
                { top: 255, left: 18,  borderLeft: '2.5px solid #FFFC00', borderBottom: '2.5px solid #FFFC00', borderRadius: '0 0 0 3px' },
                { top: 255, right: 18, borderRight: '2.5px solid #FFFC00',borderBottom: '2.5px solid #FFFC00', borderRadius: '0 0 3px 0' },
              ].map((s, i) => (
                <div key={i} className="ta-scan-corner" style={{ position: 'absolute', width: 32, height: 32, zIndex: 20, ...s }} />
              ))}
              {/* Scan line */}
              <div className="ta-scan-line" />
              {/* Badge */}
              <div style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,252,0,0.45)', borderRadius: 100, padding: '5px 13px', whiteSpace: 'nowrap', zIndex: 21 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#FFFC00', letterSpacing: '0.05em' }}>✨ TravelAI</span>
                <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.65)' }}> — Scanning...</span>
              </div>
              {/* Result card */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', borderRadius: '18px 18px 0 0', padding: '16px 16px 20px', zIndex: 25 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D', marginBottom: 6 }}>Notre-Dame de Paris</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                  {['Gothique', 'Paris, FR'].map((t) => (
                    <span key={t} style={{ background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 500, color: '#0D0D0D' }}>{t}</span>
                  ))}
                  <span style={{ background: '#FFFC00', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 700, color: '#0D0D0D' }}>UNESCO</span>
                </div>
                <div style={{ fontSize: 9.5, color: '#6B6B6B', lineHeight: 1.55, marginBottom: 12 }}>&quot;La construction a commence en 1163 et reste l&apos;un des plus beaux exemples d&apos;architecture gothique francaise...&quot;</div>
                <div style={{ background: '#FFFC00', borderRadius: 8, padding: 9, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#0D0D0D', cursor: 'pointer' }}>Sauvegarder dans le carnet →</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#0D0D0D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Scroll</div>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg,#0D0D0D,transparent)' }} />
        </div>
      </section>

      {/* ===== POUR QUI ? ===== */}
      <section id="pour-qui" style={{ background: '#FAFAFA', padding: '100px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pour qui ?</span>
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
              Fait pour chaque facon de voyager
            </h2>
          </div>

          <div className="ta-features-grid" style={{ display: 'flex', gap: 24 }}>
            {audienceProfiles.map(({ icon, title, desc }, i) => (
              <div key={title} data-fade="" data-delay={i * 100} className="ta-feature-card" style={{ flex: 1, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)', padding: '36px 32px' }}>
                <div className="ta-icon-box" style={{ width: 48, height: 48, borderRadius: 12, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <div style={{ width: 32, height: 2, background: '#FFFC00', borderRadius: 2, marginBottom: 20 }} />
                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#0D0D0D', marginBottom: 12, letterSpacing: '-0.5px' }}>{title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: '#6B6B6B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" style={{ background: '#fff', padding: '110px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>C&apos;est tout simple</span>
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-2px', lineHeight: 1.05 }}>Comment ca marche</h2>
          </div>

          <div className="ta-steps-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', position: 'relative' }}>
            {steps.map(({ n, bg, icon, filled, title, desc }, i) => (
              <Fragment key={n}>
                <div data-fade="" data-delay={i * 150} style={{ flex: 1, maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 32px' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, position: 'relative' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, position: 'absolute', top: -2, right: -2, background: '#0D0D0D', color: '#fff', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : '#0D0D0D'} strokeWidth={filled ? undefined : 2} strokeLinecap={filled ? undefined : 'round'} strokeLinejoin={filled ? undefined : 'round'}>
                      {icon}
                    </svg>
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: '#0D0D0D', marginBottom: 10, letterSpacing: '-0.5px' }}>{title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: '#6B6B6B' }}>{desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="ta-step-connector" style={{ flexShrink: 0, width: 120, height: 1, background: 'linear-gradient(90deg,rgba(0,0,0,0.12),rgba(0,0,0,0.06))', marginTop: 36, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 7, height: 7, borderRadius: '50%', background: '#FFFC00', border: '1.5px solid #0D0D0D' }} />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          <div
            data-fade=""
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              marginTop: 56, background: '#FAFAFA', border: '0.5px solid rgba(0,0,0,0.08)',
              borderRadius: 100, padding: '14px 28px', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto',
            }}
          >
            <GhostIcon size={18} />
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0D0D0D', textAlign: 'center', lineHeight: 1.5 }}>
              Tu as deja Snapchat ouvert pour immortaliser ton voyage. Autant qu&apos;il t&apos;en apprenne plus.
            </p>
          </div>
        </div>
      </section>

      {/* ===== DEMO ===== */}
      <section id="demo" style={{ background: '#FAFAFA', padding: '110px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Resultats en direct</span>
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-2px', lineHeight: 1.05 }}>Ce que TravelAI te renvoie</h2>
          </div>

          <div className="ta-demo-inner" style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
            {/* Main card */}
            {(() => {
              const active = demoItems[activeDemoIndex]
              return (
                <div data-fade="" style={{ flex: '1.3 1 0%', background: '#fff', borderRadius: 20, border: '0.5px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  <img src={active.src} alt={active.title} style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-0.5px' }}>{active.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F7F7F7', borderRadius: 8, padding: '5px 10px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        <span style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500 }}>{active.city}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 7, marginBottom: 22, flexWrap: 'wrap' }}>
                      {active.tags.map((t) => (
                        <span key={t} style={{ background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 13px', fontSize: 12, fontWeight: 500, color: '#0D0D0D' }}>{t}</span>
                      ))}
                      <span style={{ background: '#FFFC00', borderRadius: 100, padding: '5px 13px', fontSize: 12, fontWeight: 700, color: '#0D0D0D' }}>{active.badge}</span>
                    </div>

                    {/* Chat */}
                    <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.07)', paddingTop: 20, marginBottom: 20 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Conversation IA</div>
                      {/* User */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                        <div style={{ background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: '14px 14px 4px 14px', padding: '11px 16px', maxWidth: '75%' }}>
                          <p style={{ fontSize: 13.5, color: '#0D0D0D', margin: 0 }}>&quot;{active.question}&quot;</p>
                        </div>
                      </div>
                      {/* AI */}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFFC00', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                          <GhostIcon size={13} color="#0D0D0D" />
                        </div>
                        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', flex: 1 }}>
                          <p style={{ fontSize: 13.5, color: '#0D0D0D', lineHeight: 1.6, margin: 0 }}>{active.answer}</p>
                        </div>
                      </div>
                    </div>

                    <button className="ta-btn-save" type="button">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Sauvegarder dans le carnet
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* Thumbnails */}
            <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: 20, maxHeight: 640, overflowY: 'auto', paddingRight: 4 }}>
              {demoItems.map((item, i) =>
                i === activeDemoIndex ? null : (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => setActiveDemoIndex(i)}
                    className="ta-thumb-card"
                    style={{ background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', textAlign: 'left', cursor: 'pointer', width: '100%' }}
                  >
                    <img src={item.src} alt={item.title} style={{ width: 110, height: 90, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0D0D0D', marginBottom: 5, letterSpacing: '-0.3px' }}>{item.title}</div>
                      <div style={{ fontSize: 11.5, color: '#6B6B6B', marginBottom: 8 }}>{item.tags[0]} · {item.city}</div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {[item.tags[1] || item.city, item.badge].map((t) => <span key={t} style={{ background: '#F7F7F7', borderRadius: 100, padding: '2px 9px', fontSize: 10, fontWeight: 500, color: '#6B6B6B' }}>{t}</span>)}
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARNET DE VOYAGE ===== */}
      <section id="carnet" style={{ background: '#fff', padding: '110px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ton journal de voyage</span>
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 18 }}>
              Chaque voyage devient<br />un souvenir organise
            </h2>
            <p style={{ fontSize: 17, color: '#6B6B6B', lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>
              TravelAI ne s&apos;arrete pas au scan. Tout ce que tu decouvres pendant ton voyage est range et
              organise automatiquement, pret a etre revisite ou partage.
            </p>
          </div>

          <div className="ta-demo-inner" style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
            {/* Points clefs */}
            <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', gap: 28 }}>
              {journalPoints.map(({ icon, title, desc }, i) => (
                <div key={title} data-fade="" data-delay={i * 100} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16.5, fontWeight: 700, color: '#0D0D0D', marginBottom: 5, letterSpacing: '-0.3px' }}>{title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: '#6B6B6B', margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Apercu dashboard */}
            <div data-fade="" style={{ flex: '1.1 1 0%', background: '#FAFAFA', borderRadius: 20, border: '0.5px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-0.3px' }}>Mes voyages</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '4px 10px' }}>3 carnets</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tripsMockup.map(({ city, flag, monuments, photos, quiz, color }) => (
                  <div key={city} style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.07)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {flag}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0D0D0D', marginBottom: 4 }}>{city}</div>
                      <div style={{ fontSize: 12, color: '#6B6B6B' }}>{monuments} monuments · {photos} photos</div>
                    </div>
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D' }}>{quiz}%</div>
                      <div style={{ fontSize: 10, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quiz</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARTAGE ===== */}
      <section id="partage" style={{ background: '#FAFAFA', padding: '110px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="ta-demo-inner" style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
            {/* Texte */}
            <div style={{ flex: '1 1 0%' }}>
              <div data-fade="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sans quitter Snapchat</span>
              </div>
              <h2 data-fade="" data-delay="100" style={{ fontSize: 46, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-1.8px', lineHeight: 1.1, marginBottom: 18 }}>
                Decouvre, puis partage<br />en un swipe
              </h2>
              <p data-fade="" data-delay="200" style={{ fontSize: 16, color: '#6B6B6B', lineHeight: 1.65, maxWidth: 460 }}>
                Envoie directement la fiche du monument — photo et anecdote de l&apos;IA incluses — a tes amis en
                snap ou en story, sans sortir de l&apos;application. Ton voyage devient une histoire a partager,
                en temps reel.
              </p>
            </div>

            {/* Mockup envoi Snap */}
            <div data-fade="" data-delay="300" style={{ flex: '1 1 0%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 320, background: '#fff', borderRadius: 20, border: '0.5px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img src="/6.png" alt="Notre-Dame de Paris" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: 'rgba(13,13,13,0.75)', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '10px 14px' }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#fff', lineHeight: 1.5 }}>
                      &quot;Construite des 1163, ses tours jumelles dominent l&apos;ile de la Cite depuis plus de 800 ans.&quot;
                    </p>
                  </div>
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Envoyer a</div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                    {['#ffd3a5,#fd9853', '#c8f7c5,#4caf50', '#a8d8ea,#6fb3cf', '#e0c3fc,#8ec5fc'].map((g, i) => (
                      <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${g})`, border: '2px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }} />
                    ))}
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#6B6B6B' }}>+8</div>
                  </div>
                  <button type="button" style={{ width: '100%', background: '#FFFC00', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, color: '#0D0D0D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <GhostIcon size={16} />
                    Envoyer en Snap
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DEFIS ET BADGES ===== */}
      <section id="badges" style={{ background: '#fff', padding: '110px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Defis</span>
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 14 }}>
              Debloque des badges a chaque decouverte
            </h2>
            <p style={{ fontSize: 16, color: '#6B6B6B', lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>
              Chaque monument scanne te rapproche d&apos;un nouvel objectif. Un but au-dela du simple scan.
            </p>
          </div>

          <div className="ta-features-grid" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {badgesMockup.map(({ icon, name, desc, locked }, i) => (
              <div
                key={name}
                data-fade="" data-delay={i * 100}
                style={{
                  flex: '1 1 240px', background: locked ? '#FAFAFA' : '#fff', borderRadius: 16,
                  border: '0.5px solid rgba(0,0,0,0.08)', padding: '28px 24px', textAlign: 'center',
                  opacity: locked ? 0.55 : 1,
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: locked ? '#EFEFEF' : '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 8, letterSpacing: '-0.3px' }}>{name}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: '#6B6B6B', margin: 0 }}>{desc}</p>
                {locked && (
                  <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8A8A8A" strokeWidth={2}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                    A debloquer
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <section id="roadmap" style={{ background: '#0D0D0D', padding: '110px 80px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Bientot</span>
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 700, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
              Ce qu&apos;on prepare pour toi
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {roadmapItems.map(({ title, desc, eta }, i) => (
              <div
                key={title}
                data-fade="" data-delay={i * 100}
                style={{
                  display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '22px 26px',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFC00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 700, color: '#0D0D0D' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '-0.3px' }}>{title}</h3>
                  <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>{desc}</p>
                </div>
                <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, color: '#FFFC00', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{eta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ background: '#fff', padding: '110px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pourquoi TravelAI</span>
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-2px', lineHeight: 1.05 }}>
              Tout ce qu&apos;il faut<br />pour explorer plus intelligemment
            </h2>
          </div>

          <div className="ta-features-grid" style={{ display: 'flex', gap: 24 }}>
            {features.map(({ delay, icon, title, desc }) => (
              <div key={title} className="ta-feature-card" data-fade="" data-delay={delay} style={{ flex: 1, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)', padding: '36px 32px' }}>
                <div className="ta-icon-box" style={{ width: 48, height: 48, borderRadius: 12, background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <div style={{ width: 32, height: 2, background: '#FFFC00', borderRadius: 2, marginBottom: 20 }} />
                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#0D0D0D', marginBottom: 12, letterSpacing: '-0.5px' }}>{title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: '#6B6B6B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALERIE MONUMENTS INSOLITES ===== */}
      <section style={{ background: '#FAFAFA', padding: '110px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 42, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-1.5px' }}>
              Monuments insolites a decouvrir
            </h2>
            <p style={{ fontSize: 15, color: '#6B6B6B', marginTop: 10 }}>Fais glisser pour faire pivoter la galerie</p>
          </div>
          <CircularGallery items={INSOLITE_MONUMENTS} />
        </div>
      </section>

      {/* ===== STATS (Yellow Band) ===== */}
      <section style={{ background: '#FFFC00', padding: '90px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="ta-stats-cols" data-fade="" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 72, gap: 48 }}>
            {[
              { count: '10000', suffix: '+', label: 'monuments identifies' },
              { count: '150',   suffix: '+', label: 'pays couverts' },
              { count: '4.9',   suffix: '★', label: 'note des utilisateurs', decimal: 'true' },
            ].map(({ count, suffix, label, decimal }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div
                  style={{ fontSize: 64, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-3px', lineHeight: 1 }}
                  data-count={count} data-suffix={suffix} data-decimal={decimal}
                >
                  {count}{suffix}
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'rgba(13,13,13,0.6)', marginTop: 10 }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="ta-testimonials" style={{ display: 'flex', gap: 24 }}>
            {testimonials.map(({ quote, name, role, avatar, delay }) => (
              <div key={name} data-fade="" data-delay={delay} style={{ flex: 1, background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 24, color: '#FFFC00', marginBottom: 12 }}>★★★★★</div>
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

      {/* ===== CONFIANCE / TES PHOTOS T'APPARTIENNENT ===== */}
      <section style={{ background: '#fff', padding: '90px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth={2}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Confiance</span>
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-1.3px', lineHeight: 1.1 }}>
              Tes photos t&apos;appartiennent
            </h2>
          </div>

          <div className="ta-features-grid" style={{ display: 'flex', gap: 20 }}>
            {trustPoints.map(({ q, a }, i) => (
              <div key={q} data-fade="" data-delay={i * 100} style={{ flex: 1, background: '#FAFAFA', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.07)', padding: '28px 26px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0D0D0D', marginBottom: 10, letterSpacing: '-0.3px' }}>{q}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#6B6B6B', margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>

          <div data-fade="" style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/confidentialite" style={{ fontSize: 13.5, fontWeight: 600, color: '#0D0D0D', textDecoration: 'underline' }}>
              Lire notre politique de confidentialite complete
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" style={{ background: '#FAFAFA', padding: '110px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 14px', marginBottom: 18 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Questions frequentes</span>
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-1.5px', lineHeight: 1.05 }}>
              Tout ce que tu te demandes
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqItems.map(({ q, a }, i) => {
              const isOpen = openFaqIndex === i
              return (
                <div
                  key={q}
                  data-fade=""
                  style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 16, padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontSize: 16, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-0.3px',
                    }}
                  >
                    {q}
                    <svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
                      style={{ flexShrink: 0, transition: 'transform .25s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {isOpen && (
                    <p style={{ margin: 0, padding: '0 24px 22px', fontSize: 14.5, lineHeight: 1.65, color: '#6B6B6B' }}>
                      {a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== COMPARATIF AUDIOGUIDE ===== */}
      <section style={{ background: '#FAFAFA', padding: '100px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-1.3px', lineHeight: 1.1 }}>
              Pourquoi payer un audioguide ?
            </h2>
          </div>

          <div className="ta-demo-inner" style={{ display: 'flex', gap: 20 }}>
            {audioguideComparison.map(({ label, price, points, highlight }) => (
              <div
                key={label}
                data-fade=""
                style={{
                  flex: 1, borderRadius: 18, padding: '32px 28px',
                  background: highlight ? '#0D0D0D' : '#fff',
                  border: highlight ? 'none' : '0.5px solid rgba(0,0,0,0.08)',
                  boxShadow: highlight ? '0 8px 32px rgba(0,0,0,0.18)' : 'none',
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 600, color: highlight ? 'rgba(255,255,255,0.6)' : '#6B6B6B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: highlight ? '#FFFC00' : '#0D0D0D', letterSpacing: '-1px', marginBottom: 22 }}>{price}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {points.map((pt) => (
                    <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={highlight ? '#FFFC00' : '#0D0D0D'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span style={{ fontSize: 14, color: highlight ? 'rgba(255,255,255,0.9)' : '#0D0D0D' }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ background: '#fff', padding: '120px 80px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div data-fade="" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F7F7F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 100, padding: '5px 16px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFFC00', boxShadow: '0 0 6px rgba(255,252,0,0.7)' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0D0D0D', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Gratuit</span>
          </div>
          <h2 data-fade="" data-delay="100" style={{ fontSize: 58, fontWeight: 700, color: '#0D0D0D', letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: 18 }}>
            Commence a explorer —<br />c&apos;est gratuit
          </h2>
          <p data-fade="" data-delay="200" style={{ fontSize: 17, color: '#6B6B6B', lineHeight: 1.6, marginBottom: 44 }}>
            Disponible via la Lens Snapchat. Pas d&apos;application a telecharger. Ouvre, vise, decouvre.
          </p>
          <a data-fade="" data-delay="300" href="https://travelai.digitalstack.cloud/login" className="ta-btn-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <GhostIcon size={20} />
            Ouvrir TravelAI sur Snapchat
          </a>
          <div data-fade="" data-delay="400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: 0.45 }}>
            <GhostIcon size={16} color="#0D0D0D" />
            <span style={{ fontSize: 12.5, color: '#0D0D0D', fontWeight: 500 }}>Propulse par la technologie Lens de Snapchat</span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: '#0D0D0D', padding: '52px 80px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className="ta-footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, overflow: 'hidden' }}>
                <img src="/voyageur.jpg" alt="TravelAI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px' }}>TravelAI</span>
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
              {[
                { label: 'Confidentialite', href: '/confidentialite' },
                { label: 'Conditions', href: '/conditions' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="ta-footer-link" style={{ fontSize: 13.5 }}>{label}</Link>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button type="button" onClick={() => setShowSnapcode((v) => !v)} className="ta-social-btn" aria-label="Snapchat" style={{ border: 'none', cursor: 'pointer' }}>
                <GhostIcon size={17} color="rgba(255,255,255,0.7)" />
              </button>
            </div>
          </div>

          <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.3)' }}>© 2026 TravelAI — Cree avec passion a Paris ❤️</span>
            <a href="https://travelai.digitalstack.cloud" target="_blank" rel="noreferrer" className="ta-footer-url" style={{ fontSize: 12.5 }}>
              travelai.digitalstack.cloud
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
