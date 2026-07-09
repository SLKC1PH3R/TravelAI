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

const DEMO_ITEMS: DemoItem[] = [
  { src: '/6.png', title: 'Notre-Dame de Paris', city: 'Paris, France', tag: 'Architecture gothique', badge: 'UNESCO', question: 'Quand a-t-elle été construite ?', answer: "La construction a commencé en 1163 sous l'évêque Maurice de Sully et s'est largement achevée au XIVe siècle. Elle reste l'un des plus beaux exemples d'architecture gothique française, reconnue pour ses arcs-boutants, ses rosaces et ses tours jumelles." },
  { src: '/4.jpg', title: 'Duomo de Milan', city: 'Milan, Italie', tag: 'Gothique', badge: '1386', question: 'Pourquoi a-t-elle pris autant de temps à construire ?', answer: "Le chantier a débuté en 1386 et s'est étalé sur près de six siècles. Avec ses 135 flèches et plus de 3 400 statues, c'est l'une des plus grandes cathédrales gothiques au monde, couronnée par la statue dorée de la Madonnina." },
  { src: '/8.jpg', title: 'Statue de la Liberté', city: 'New York, USA', tag: 'Monument', badge: 'UNESCO', question: "Qui l'a offerte aux États-Unis ?", answer: "C'est un cadeau de la France pour le centenaire de l'indépendance américaine, inauguré en 1886. Sculptée par Frédéric Auguste Bartholdi, sa structure interne en fer a été conçue par Gustave Eiffel." },
  { src: '/2.jpg', title: 'Mont Rushmore', city: 'Dakota du Sud, USA', tag: 'Mémorial national', badge: '1927', question: 'Qui sont les quatre présidents sculptés ?', answer: "George Washington, Thomas Jefferson, Theodore Roosevelt et Abraham Lincoln. Le sculpteur Gutzon Borglum a dirigé les travaux de 1927 à 1941, taillant chaque visage directement dans le granit de la montagne." },
  { src: '/1.jpg', title: 'Taj Mahal', city: 'Agra, Inde', tag: 'Mausolée moghol', badge: 'UNESCO', question: 'Quelle histoire se cache derrière sa construction ?', answer: "L'empereur moghol Shah Jahan l'a fait construire en mémoire de son épouse Mumtaz Mahal. Une légende populaire raconte que les mains des artisans auraient été coupées pour qu'ils ne puissent jamais recréer un tel chef-d'œuvre." },
  { src: '/7.jpg', title: 'Mont Saint-Michel', city: 'Normandie, France', tag: 'Abbaye', badge: 'UNESCO', question: 'Pourquoi cet îlot est-il si particulier ?', answer: "Cette abbaye bénédictine se dresse sur un îlot rocheux soumis à des marées parmi les plus fortes d'Europe. Lieu de pèlerinage depuis le Moyen Âge, elle a aussi servi de prison avant de redevenir un haut lieu spirituel." },
  { src: '/10.jpg', title: 'Parthénon', city: 'Athènes, Grèce', tag: 'Temple dorique', badge: '447 av. J.-C.', question: 'À quelle divinité est-il dédié ?', answer: "Le Parthénon est dédié à Athéna, déesse protectrice d'Athènes. Construit entre 447 et 432 av. J.-C. sur l'Acropole, il est considéré comme l'un des sommets de l'architecture dorique antique." },
]

const FAQ_ITEMS = [
  { q: "Mes photos sont-elles privées ou visibles par d'autres ?", a: "Tes photos et ton carnet de voyage sont privés par défaut. Seul ce que tu choisis explicitement de partager (en snap ou en story) est envoyé à tes amis — voir notre Politique de confidentialité pour le détail complet." },
  { q: 'Est-ce que je peux retrouver mes voyages même sans Snapchat ouvert ?', a: 'Oui. Connecte-toi avec ton compte Google sur travelai.digitalstack.cloud pour retrouver ton carnet de voyage, ton historique et tes quiz, même sans avoir Snapchat ouvert.' },
  { q: 'Le PDF est-il vraiment gratuit ?', a: 'Oui. La génération et le téléchargement de ton carnet de voyage PDF sont entièrement gratuits, sans limite de temps ni carte bancaire requise.' },
  { q: 'Ça fonctionne dans quelles langues / quels pays ?', a: "TravelAI est disponible en français et en anglais pour le moment, et identifie des monuments dans plus de 150 pays. D'autres langues arriveront prochainement selon la demande." },
]

const STEPS = [
  { n: '1', tag: 'Zéro friction', title: 'Ouvre la Lens', desc: "Retrouve TravelAI dans l'explorateur de Lens Snapchat et lance-la en un tap. Pas d'inscription, pas de téléchargement." },
  { n: '2', tag: '< 2 secondes', title: 'Vise un monument', desc: "Pointe ta caméra sur un monument. L'IA Vision de TravelAI l'identifie en moins de 2 secondes." },
  { n: '3', tag: 'Automatique', title: 'Reçois ton guide + carnet', desc: 'Réponses IA instantanées, histoire riche, et un carnet de voyage PDF magnifique — tout est généré automatiquement.' },
]

const POLAROIDS = [
  { src: '/6.png', label: 'Notre-Dame · Paris', cls: 'ta-float-a', pos: { top: 16, left: 26 } as React.CSSProperties, w: 158, h: 116 },
  { src: '/4.jpg', label: 'Duomo · Milan', cls: 'ta-float-b', pos: { bottom: 56, left: 8 } as React.CSSProperties, w: 144, h: 106 },
  { src: '/8.jpg', label: 'Statue of Liberty · NY', cls: 'ta-float-c', pos: { top: 38, right: 18 } as React.CSSProperties, w: 150, h: 112 },
  { src: '/1.jpg', label: 'Taj Mahal · Agra', cls: 'ta-float-d', pos: { bottom: 44, right: 8 } as React.CSSProperties, w: 148, h: 106 },
]

const JOURNAL_POINTS = [
  { title: 'Sauvegarde automatique', desc: "Chaque photo et chaque question posée à l'IA est rangée par voyage, sans action de ta part.", icon: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></> },
  { title: 'Quiz de fin de visite', desc: 'Un mini-quiz généré après chaque découverte, pour retenir ce qui compte vraiment.', icon: <><circle cx="12" cy="12" r="10" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" /><line x1="12" y1="16.5" x2="12.01" y2="16.5" /></> },
  { title: 'Anecdotes en évidence', desc: 'Dates clés, chiffres marquants et anecdotes surprenantes remontées automatiquement.', icon: <path d="M12 2l2.4 6.9L22 9l-5.6 4.9L18 22l-6-4-6 4 1.6-8.1L2 9l7.6-.1z" /> },
  { title: 'Export PDF en un tap', desc: "Transforme n'importe quel voyage en carnet illustré à imprimer ou à partager.", icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></> },
]

const AUDIENCES = [
  { title: 'Voyageur solo', desc: "Explore à ton rythme sans chercher un guide ou une brochure — ton IA répond à chaque question, même à 2h du matin.", icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
  { title: 'Famille', desc: 'Transforme la visite en jeu : les enfants scannent, découvrent et répondent au quiz — sans écran qui les enferme.', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
  { title: 'Créateur de contenu', desc: 'Repars avec des anecdotes vérifiées, des faits précis et un carnet illustré prêt à nourrir tes prochains posts.', icon: <><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M22 8.5v7l-6-3.5z" /></> },
]

const FEATURES = [
  { title: 'Reconnaissance instantanée', desc: "N'importe quel monument dans le monde, identifié en moins de 2 secondes grâce à Google Gemini Vision.", icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></> },
  { title: 'Conversations IA illimitées', desc: 'Histoire, architecture, anecdotes — pose toutes tes questions sur ce que tu vois, ton guide sait tout.', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> },
  { title: 'Carnet de voyage PDF', desc: "Un souvenir PDF illustré généré automatiquement avec tes photos et les notes de l'IA, à vie.", icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></> },
]

const BADGES = [
  { name: '10 monuments UNESCO', desc: 'Découvre 10 sites classés au patrimoine mondial.', locked: false, icon: <><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" /><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" /></> },
  { name: "Explorateur de l'Asie", desc: 'Scanne un monument dans 5 pays asiatiques différents.', locked: false, icon: <path d="M2 12h4l3-9 4 18 3-9h6" /> },
  { name: 'Série de 5 jours', desc: '5 jours consécutifs avec au moins une découverte.', locked: true, icon: <path d="M13 2 3 14h7l-1 8 10-12h-7z" /> },
  { name: 'Premier carnet complété', desc: 'Exporte ton tout premier carnet de voyage en PDF.', locked: true, icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></> },
]

const ROADMAP = [
  { title: 'Traduction en temps réel', desc: "Pose tes questions dans ta langue, l'IA te répond directement traduit.", eta: 'Prochainement', hot: true },
  { title: 'Réalité augmentée historique', desc: 'Superpose une reconstitution du monument à différentes époques, directement dans la caméra.', eta: "À l'étude", hot: false },
  { title: 'Mode multi-lens', desc: 'Compare plusieurs monuments similaires vus pendant ton voyage en un seul récap.', eta: "À l'étude", hot: false },
]

const TRUST = [
  { q: 'Où sont stockées tes photos ?', a: 'Sur des serveurs sécurisés, uniquement le temps nécessaire pour générer ton carnet de voyage.' },
  { q: 'Servent-elles à autre chose ?', a: "Non. Uniquement l'identification du monument et ton carnet — jamais revendues, jamais utilisées à des fins publicitaires." },
  { q: 'Comment les supprimer ?', a: 'À tout moment, en nous écrivant : suppression de tes photos et de tes données sous un mois maximum.' },
]

const TESTIMONIALS = [
  { quote: "« J'ai pointé ma caméra sur une église au hasard à Rome et TravelAI m'a tout raconté — l'année de construction, qui l'a commandée, et un passage secret sous l'autel. Mon guide touristique était sans voix. »", name: 'Sophie M.', role: 'Voyageuse · Lyon, France', avatar: 'linear-gradient(135deg,#ffd3a5,#fd9853)' },
  { quote: "« Le carnet de voyage PDF m'a bluffé. 3 semaines de monuments, notes IA et photos compilés automatiquement. Je l'ai imprimé et donné à mes parents — ils ont pleuré. »", name: 'James T.', role: 'Photographe · Londres, UK', avatar: 'linear-gradient(135deg,#c8f7c5,#4caf50)' },
  { quote: '« Une semaine au Japon. Chaque temple, chaque sanctuaire — TravelAI les connaissait tous. Pas de saisie, juste viser et découvrir. Un vrai changement de jeu. »', name: 'Yuki N.', role: 'Nomade digitale · Tokyo, JP', avatar: 'linear-gradient(135deg,#a8d8ea,#6fb3cf)' },
]

const GALLERY = [
  { src: '/salar-de-uyuni.jpg', name: 'Salar de Uyuni', place: 'Bolivie' },
  { src: null, name: "Porte de l'Enfer", place: 'Darvaza, Turkménistan' },
  { src: '/cappadoce.jpg', name: 'Cappadoce', place: 'Turquie' },
  { src: '/zhangjiajie.jpg', name: 'Zhangjiajie', place: 'Chine' },
  { src: '/trolltunga.jpg', name: 'Trolltunga', place: 'Norvège' },
]

const TRIPS = [
  { flag: '🇮🇹', city: 'Rome, Italie', sub: 'Juin 2026 · 5 jours', quiz: 'Quiz 92%', main: true },
  { flag: '🇯🇵', city: 'Kyoto, Japon', sub: '9 monuments · 21 photos', quiz: 'Quiz 87%', main: false },
  { flag: '🇫🇷', city: 'Paris, France', sub: '6 monuments · 15 photos', quiz: 'Quiz 95%', main: false },
]

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

export default function LandingPageGlass() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeDemo, setActiveDemo] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeStep, setActiveStep] = useState(0)

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
      <nav className="tg-card" style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: 22, borderRadius: 999, padding: '8px 8px 8px 16px', maxWidth: 'calc(100vw - 32px)', boxShadow: '0 8px 32px rgba(10,10,5,.10)' }}>
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/voyageur.jpg" alt="TravelAI" style={{ width: 26, height: 26, borderRadius: 7, objectFit: 'cover', display: 'block' }} />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--ink)' }}>TravelAI</span>
        </a>
        <div className="rnavlinks" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <a href="#how" className="tg-nav-link">Comment ça marche</a>
          <a href="#demo" className="tg-nav-link">Démo</a>
          <a href="#carnet" className="tg-nav-link">Carnet</a>
          <a href="#badges" className="tg-nav-link">Badges</a>
          <a href="#faq" className="tg-nav-link">FAQ</a>
        </div>
        <a href="#demo" className="tg-btn-y" style={{ padding: '9px 18px', borderRadius: 999, fontSize: 13 }}>
          <Ghost size={14} color="#0D0D0D" />
          Voir la démo
        </a>
      </nav>

      {/* ===== 1. HERO ===== */}
      <section id="hero" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div data-parallax="0.12" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(242,245,247,.55), rgba(242,245,247,.92)), url(/cappadoce.jpg) center/cover no-repeat', pointerEvents: 'none' }} />
        <div className="rr rsec" style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 48, padding: '150px 64px 90px', position: 'relative', minHeight: '100vh' }}>
          <div style={{ flex: 1.1, maxWidth: 600 }}>
            <div data-fade="" className="tg-eyebrow" style={{ marginBottom: 30 }}>
              <span className="tg-livedot" />
              <Ghost size={13} color="#0D0D0D" />
              <span>Disponible sur Snapchat · Gratuit</span>
            </div>
            <h1 className="rh1" data-fade="" data-delay="80" style={{ fontSize: 88, fontWeight: 700, lineHeight: 0.98, letterSpacing: '-3.5px', margin: '0 0 28px' }}>
              Point.<br />Ask.<br />
              <span style={{ background: 'var(--y)', color: '#0D0D0D', padding: '2px 14px 4px', borderRadius: 10, display: 'inline-block', marginTop: 6 }}>Remember.</span>
            </h1>
            <p data-fade="" data-delay="160" style={{ fontSize: 18, lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 40px', maxWidth: 460 }}>
              Pointe ta caméra Snapchat sur n&apos;importe quel monument : ton guide IA l&apos;identifie en moins de 2 secondes, répond à toutes tes questions et garde le souvenir dans ton carnet de voyage.
            </p>
            <div data-fade="" data-delay="240" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <a href="#demo" className="tg-btn-y" style={{ padding: '16px 30px' }}>
                <Ghost size={16} color="#0D0D0D" />
                Voir la démo
              </a>
              <a href="#how" className="tg-btn-ghost">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
                Comment ça marche
              </a>
            </div>
            <div data-fade="" data-delay="320" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 44 }}>
              <div style={{ display: 'flex' }}>
                {['linear-gradient(135deg,#ffd3a5,#fd9853)', 'linear-gradient(135deg,#a8d8ea,#6fb3cf)', 'linear-gradient(135deg,#c8f7c5,#4caf50)'].map((bg, i) => (
                  <span key={i} style={{ width: 34, height: 34, borderRadius: '50%', border: '2.5px solid var(--bg)', background: bg, marginRight: i < 2 ? -10 : 0, position: 'relative', zIndex: 3 - i, display: 'inline-block' }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#E8C400', letterSpacing: 1.5 }}>★★★★★ <span style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 12.5, letterSpacing: 0 }}>4.9</span></div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Adopté par <strong style={{ color: 'var(--ink)' }}>10 000+</strong> voyageurs</div>
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
              <img src="/6.png" alt="Caméra Snapchat" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
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
                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#FFFC00', letterSpacing: '.05em' }}>✦ TravelAI</span>
                <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,.65)' }}> — Scan en cours…</span>
              </div>
              <div style={{ position: 'absolute', bottom: 64, left: 10, right: 10, background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(16px)', borderRadius: 18, padding: 14, zIndex: 25, boxShadow: '0 10px 30px rgba(0,0,0,.25)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0D0D0D', marginBottom: 6 }}>Notre-Dame de Paris</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 9 }}>
                  <span style={{ background: '#F4F4F0', border: '.5px solid rgba(0,0,0,.1)', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 500, color: '#0D0D0D' }}>Gothique</span>
                  <span style={{ background: '#F4F4F0', border: '.5px solid rgba(0,0,0,.1)', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 500, color: '#0D0D0D' }}>Paris, FR</span>
                  <span style={{ background: '#FFFC00', borderRadius: 100, padding: '3px 9px', fontSize: 9, fontWeight: 700, color: '#0D0D0D' }}>UNESCO</span>
                </div>
                <div style={{ fontSize: 9.5, color: '#6B6B6B', lineHeight: 1.55, marginBottom: 10 }}>« La construction a commencé en 1163 — l&apos;un des plus beaux exemples d&apos;architecture gothique française… »</div>
                <div style={{ background: '#FFFC00', borderRadius: 8, padding: 8, textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: '#0D0D0D' }}>Sauvegarder dans le carnet →</div>
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
          <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase' }}>Scroll</span>
          <span style={{ width: 1, height: 38, background: 'linear-gradient(180deg,var(--ink),transparent)', display: 'inline-block' }} />
        </div>
      </section>

      {/* ===== 2. POUR QUI ===== */}
      <section id="pour-qui" className="rsec" style={{ background: 'var(--bg2)', padding: '110px 64px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>Pour qui ?</span></div>
            <h2 className="tg-h2">Fait pour chaque façon<br />de voyager</h2>
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
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>C&apos;est tout simple</span></div>
            <h2 className="tg-h2" style={{ fontSize: 52, letterSpacing: '-2px' }}>Comment ça marche</h2>
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
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, textAlign: 'center', lineHeight: 1.5 }}>Tu as déjà Snapchat ouvert pour immortaliser ton voyage. Autant qu&apos;il t&apos;en apprenne plus.</p>
          </div>
        </div>
      </section>

      {/* ===== 4. DÉMO ===== */}
      <section id="demo" className="rsec" style={{ background: 'var(--bg2)', padding: '120px 64px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>Résultats en direct</span></div>
            <h2 className="tg-h2" style={{ fontSize: 52, letterSpacing: '-2px' }}>Ce que TravelAI te renvoie</h2>
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
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Conversation IA</div>
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
                <div className="tg-btn-y" style={{ width: '100%', justifyContent: 'center', padding: 14, borderRadius: 12, fontSize: 14 }}>Sauvegarder dans le carnet</div>
              </div>
            </div>
            <div data-fade="" data-delay="150" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Choisis un monument</div>
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
            <div data-fade="" className="tg-eyebrow" style={{ marginBottom: 18 }}><span>Carnet de voyage</span></div>
            <h2 className="tg-h2" data-fade="" style={{ marginBottom: 40 }}>Chaque découverte,<br />gardée pour toujours</h2>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 26 }}>🇮🇹</span><div><div style={{ fontSize: 16, fontWeight: 700 }}>Rome, Italie</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Juin 2026 · 5 jours</div></div></div>
                <span className="tg-badge-y" style={{ fontSize: 11 }}>Quiz 92%</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <img src="/9.jpg" alt="Rome" style={{ flex: 1, height: 64, objectFit: 'cover', borderRadius: 8, minWidth: 0 }} />
                <img src="/3.jpg" alt="Rome" style={{ flex: 1, height: 64, objectFit: 'cover', borderRadius: 8, minWidth: 0 }} />
                <img src="/5.jpg" alt="Rome" style={{ flex: 1, height: 64, objectFit: 'cover', borderRadius: 8, minWidth: 0 }} />
              </div>
              <div style={{ display: 'flex', gap: 18, fontSize: 12.5, color: 'var(--muted)' }}>
                <span><strong style={{ color: 'var(--ink)' }}>14</strong> monuments</span>
                <span><strong style={{ color: 'var(--ink)' }}>32</strong> photos</span>
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
            <div data-fade="" className="tg-eyebrow" style={{ marginBottom: 18 }}><span>Partage natif</span></div>
            <h2 className="tg-h2" data-fade="" style={{ marginBottom: 20 }}>Partage ta découverte<br />en un swipe</h2>
            <p data-fade="" data-delay="100" style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 28px', maxWidth: 440 }}>
              Envoie la fiche du monument en Snap à tes amis ou publie-la en Story — directement depuis la Lens, sans jamais quitter Snapchat.
            </p>
            <div data-fade="" data-delay="180" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Snap direct', 'Story', 'Fiche exportable'].map((label) => (
                <span key={label} className="tg-card" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, borderRadius: 100, padding: '9px 16px', fontSize: 13, fontWeight: 600 }}>{label}</span>
              ))}
            </div>
          </div>
          <div data-fade="" data-delay="120" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 280, background: '#141414', borderRadius: 36, boxShadow: '0 32px 70px rgba(0,0,0,.25), 0 0 0 6px #1a1a1a', padding: '20px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 14 }}>Envoyer à…</div>
              <div style={{ background: '#1E1E1E', borderRadius: 16, padding: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img src="/4.jpg" alt="Duomo" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Duomo de Milan</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)' }}>Fiche TravelAI · Gothique · 1386</div>
                  </div>
                  <span style={{ background: '#FFFC00', borderRadius: 100, padding: '3px 8px', fontSize: 8.5, fontWeight: 700, color: '#0D0D0D' }}>TravelAI</span>
                </div>
              </div>
              {[
                { initial: 'M', name: 'Ma Story', bg: 'linear-gradient(135deg,#a78bfa,#7c3aed)', checked: true },
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
                Envoyer
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
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>Gamification</span></div>
            <h2 className="tg-h2" style={{ marginBottom: 14 }}>Voyage. Scanne. Débloque.</h2>
            <p style={{ fontSize: 16, color: 'var(--muted)', margin: 0 }}>Des défis qui donnent envie de faire un détour de plus.</p>
          </div>
          <div className="rgrid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {BADGES.map(({ name, desc, locked, icon }, i) => (
              <div key={name} data-fade="" data-delay={i * 100} className={locked ? '' : 'tg-card'} style={locked ? { background: 'transparent', border: '1.5px dashed var(--line)', borderRadius: 'var(--r)', padding: '28px 24px', opacity: 0.75 } : { padding: '28px 24px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: locked ? 'var(--bg2)' : 'var(--y)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={locked ? 'var(--muted)' : '#0D0D0D'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                {locked ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> À débloquer
                  </div>
                ) : (
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0D9F5B', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>✓ Débloqué</div>
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
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>Bientôt</span></div>
            <h2 className="tg-h2" style={{ fontSize: 44, letterSpacing: '-1.6px' }}>La suite du voyage</h2>
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
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>Pourquoi TravelAI</span></div>
            <h2 className="tg-h2">Un guide qui sait tout,<br />toujours dans ta poche</h2>
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
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(244,243,238,.7)', letterSpacing: '.07em', textTransform: 'uppercase' }}>Même les lieux insolites</span>
            </div>
            <h2 className="tg-h2" style={{ color: '#F4F3EE', marginBottom: 12 }}>
              Bien au-delà des<br />
              <span style={{ background: 'var(--y)', color: '#0D0D0D', padding: '0 12px 3px', borderRadius: 8, display: 'inline-block' }}>grands classiques</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(244,243,238,.55)', margin: 0 }}>Fais glisser pour explorer →</p>
          </div>
        </div>
        <div className="tg-noscroll" style={{ display: 'flex', gap: 20, overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '8px 64px 28px', cursor: 'grab', WebkitOverflowScrolling: 'touch' }}>
          {GALLERY.map(({ src, name, place }) => (
            <div key={name} style={{ flex: '0 0 300px', scrollSnapAlign: 'center', borderRadius: 'var(--r)', overflow: 'hidden', position: 'relative', height: 400, background: src ? undefined : 'repeating-linear-gradient(45deg,#26221C 0 14px,#211D18 14px 28px)' }}>
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
          <div data-fade=""><div data-count="10000" data-suffix="+" style={{ fontSize: 54, fontWeight: 700, letterSpacing: '-2px' }}>10 000+</div><div style={{ fontSize: 13, color: 'rgba(244,243,238,.55)', letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 4 }}>Monuments identifiés</div></div>
          <div data-fade="" data-delay="120"><div data-count="150" data-suffix="+" style={{ fontSize: 54, fontWeight: 700, letterSpacing: '-2px' }}>150+</div><div style={{ fontSize: 13, color: 'rgba(244,243,238,.55)', letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 4 }}>Pays couverts</div></div>
          <div data-fade="" data-delay="240"><div data-count="4.9" data-decimal="true" data-suffix="★" style={{ fontSize: 54, fontWeight: 700, letterSpacing: '-2px', color: 'var(--y)' }}>4.9★</div><div style={{ fontSize: 13, color: 'rgba(244,243,238,.55)', letterSpacing: '.05em', textTransform: 'uppercase', marginTop: 4 }}>Note moyenne</div></div>
        </div>
      </section>

      {/* ===== 11. TÉMOIGNAGES (dark) ===== */}
      <section id="temoignages" className="rsec" style={{ background: 'var(--dark)', color: '#F4F3EE', padding: '30px 64px 120px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 52, paddingTop: 60, borderTop: '1px solid rgba(255,255,255,.08)' }}>
            <h2 className="tg-h2" style={{ fontSize: 44, letterSpacing: '-1.6px', color: '#F4F3EE' }}>Ils ont voyagé avec TravelAI</h2>
          </div>
          <div className="rgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {TESTIMONIALS.map(({ quote, name, role, avatar }, i) => (
              <div key={name} data-fade="" data-delay={i * 120} style={{ background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 'var(--r)', padding: '30px 28px' }}>
                <div style={{ fontSize: 13, color: 'var(--y)', letterSpacing: 2, marginBottom: 16 }}>★★★★★</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(244,243,238,.85)', margin: '0 0 22px' }}>{quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <span style={{ width: 38, height: 38, borderRadius: '50%', background: avatar, display: 'inline-block' }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#F4F3EE' }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(244,243,238,.5)' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 12. CONFIANCE ===== */}
      <section id="confiance" className="rsec" style={{ background: 'var(--bg)', padding: '120px 64px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div data-fade="" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth={2.2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>Confiance</span>
            </div>
            <h2 className="tg-h2">Tes photos t&apos;appartiennent</h2>
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
            <div className="tg-eyebrow" style={{ marginBottom: 18 }}><span>FAQ</span></div>
            <h2 className="tg-h2" style={{ fontSize: 44, letterSpacing: '-1.6px' }}>Questions fréquentes</h2>
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
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(244,243,238,.7)', letterSpacing: '.07em', textTransform: 'uppercase' }}>Le match</span>
            </div>
            <h2 className="tg-h2" style={{ fontSize: 44, letterSpacing: '-1.6px', color: '#F4F3EE' }}>TravelAI vs audioguide classique</h2>
          </div>
          <div className="rr" style={{ display: 'flex', gap: 22, alignItems: 'stretch' }}>
            <div data-fade="" style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 'var(--r)', padding: '34px 32px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(244,243,238,.55)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>Audioguide classique</div>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-1px', marginBottom: 26 }}>~8€ <span style={{ fontSize: 15, fontWeight: 500, color: 'rgba(244,243,238,.5)' }}>/ site</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Un seul monument à la fois', 'À rendre en fin de visite', 'Contenu figé, pas de questions'].map((p) => (
                  <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'rgba(244,243,238,.7)', lineHeight: 1.5 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244,243,238,.4)" strokeWidth={2.4} strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div data-fade="" data-delay="140" style={{ flex: 1, background: 'rgba(255,252,0,.05)', border: '2px solid var(--y)', borderRadius: 'var(--r)', padding: '34px 32px', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -13, left: 28, background: 'var(--y)', color: '#0D0D0D', borderRadius: 100, padding: '4px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '.04em' }}>RECOMMANDÉ</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Ghost size={16} color="#FFFC00" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--y)', letterSpacing: '.06em', textTransform: 'uppercase' }}>TravelAI</span>
              </div>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-1px', marginBottom: 26 }}>Gratuit <span style={{ fontSize: 15, fontWeight: 500, color: 'rgba(244,243,238,.5)' }}>— inclus</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Tous les monuments, partout', 'Reste dans ton carnet à vie', 'Répond à toutes tes questions'].map((p) => (
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
          <h2 className="tg-h2" data-fade="" data-delay="80" style={{ fontSize: 56, letterSpacing: '-2.2px', lineHeight: 1.05, marginBottom: 18 }}>Commence à explorer,<br />c&apos;est gratuit</h2>
          <p data-fade="" data-delay="160" style={{ fontSize: 17, lineHeight: 1.65, opacity: 0.65, margin: '0 0 38px' }}>
            Pas d&apos;app à télécharger, pas d&apos;inscription. Ouvre Snapchat, lance la Lens TravelAI, et ton prochain monument te racontera son histoire.
          </p>
          <div data-fade="" data-delay="240" style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a href="#hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#0D0D0D', color: '#FFFC00', padding: '18px 38px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', transition: 'all .2s ease' }}>
              <Ghost size={17} color="#FFFC00" />
              Ouvrir la Lens TravelAI
            </a>
          </div>
          <div data-fade="" data-delay="320" style={{ marginTop: 22, fontSize: 12.5, opacity: 0.5 }}>Gratuit · Sans inscription · Fonctionne dans Snapchat</div>
        </div>
      </section>

      {/* ===== 16. FOOTER ===== */}
      <footer className="rsec" style={{ background: '#0C0C0D', color: 'rgba(255,255,255,.45)', padding: 64 }}>
        <div className="rrc" style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <img src="/voyageur.jpg" alt="TravelAI" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover' }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-.4px' }}>TravelAI</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, maxWidth: 260 }}>Ton guide de voyage IA, dans ta caméra Snapchat. Point. Ask. Remember.</p>
          </div>
          <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>Produit</span>
              <a href="#how" className="tg-footer-link">Comment ça marche</a>
              <a href="#demo" className="tg-footer-link">Démo</a>
              <a href="#roadmap" className="tg-footer-link">Roadmap</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>Légal</span>
              <a href="/confidentialite" className="tg-footer-link">Confidentialité</a>
              <a href="/conditions" className="tg-footer-link">Conditions</a>
              <a href="/contact" className="tg-footer-link">Contact</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1140, margin: '40px auto 0', paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
          <span>© 2026 TravelAI — travelai.digitalstack.cloud</span>
          <span>Fait pour les voyageurs curieux ✦</span>
        </div>
      </footer>
    </div>
  )
}
