'use client'

import { useEffect, useRef } from 'react'

export type GalleryItem = {
  name: string
  location: string
  image?: string
  gradient?: string
}

/**
 * Galerie circulaire 3D (CSS transforms, sans dependance externe type ogl/gsap).
 * Auto-rotation lente + glisser pour faire pivoter manuellement.
 */
export default function CircularGallery({ items }: { items: GalleryItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const rotation = useRef(0)
  const velocity = useRef(0.045)
  const dragging = useRef(false)
  const lastX = useRef(0)

  useEffect(() => {
    let raf: number
    const tick = () => {
      if (!dragging.current) rotation.current += velocity.current
      if (wrapRef.current) wrapRef.current.style.transform = `rotateY(${rotation.current}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true
    lastX.current = e.clientX
    velocity.current = 0
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return
    const dx = e.clientX - lastX.current
    lastX.current = e.clientX
    rotation.current += dx * 0.35
  }
  function onPointerUp() {
    dragging.current = false
    velocity.current = 0.045
  }

  const angleStep = 360 / items.length
  const radius = Math.round((items.length * 116) / (2 * Math.PI))

  return (
    <div
      style={{ position: 'relative', height: 360, perspective: 1500, touchAction: 'none', cursor: 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div ref={wrapRef} style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
        {items.map((item, i) => (
          <div
            key={item.name}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 190,
              height: 250,
              marginLeft: -95,
              marginTop: -125,
              transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
              borderRadius: 16,
              overflow: 'hidden',
              background: item.image ? `url('${item.image}') center/cover` : item.gradient || '#222',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 45%,rgba(0,0,0,0.85) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>{item.name}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{item.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
