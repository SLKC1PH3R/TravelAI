import React, { useState, useEffect, useRef, HTMLAttributes } from 'react'

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')

export interface GalleryItem {
  common: string
  binomial: string
  photo: {
    url: string
    text: string
    pos?: string
  }
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[]
  /** Controls how far the items are from the center. */
  radius?: number
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.15, ...props }, ref) => {
    const [rotation, setRotation] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const dragStateRef = useRef<{ pointerId: number; startX: number; startRotation: number } | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
      dragStateRef.current = { pointerId: e.pointerId, startX: e.clientX, startRotation: rotation }
      setIsDragging(true)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current
      if (!drag || drag.pointerId !== e.pointerId) return
      const deltaX = e.clientX - drag.startX
      setRotation(drag.startRotation - deltaX * 0.3)
    }

    const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragStateRef.current?.pointerId !== e.pointerId) return
      dragStateRef.current = null
      setIsDragging(false)
    }

    useEffect(() => {
      const autoRotate = () => {
        if (!isDragging) setRotation((prev) => prev + autoRotateSpeed)
        animationFrameRef.current = requestAnimationFrame(autoRotate)
      }
      animationFrameRef.current = requestAnimationFrame(autoRotate)
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      }
    }, [isDragging, autoRotateSpeed])

    const anglePerItem = 360 / items.length

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Galerie circulaire 3D"
        className={cn('relative w-full flex items-center justify-center', className)}
        style={{ perspective: '2000px', height: 440, cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{ transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem
            const totalRotation = rotation % 360
            const relativeAngle = (itemAngle + totalRotation + 360) % 360
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle)
            const opacity = Math.max(0.3, 1 - normalizedAngle / 180)

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="absolute w-[260px] h-[360px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: '-130px',
                  marginTop: '-180px',
                  opacity,
                  transition: 'opacity 0.3s linear',
                }}
              >
                <div
                  className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
                >
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-full p-4"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', color: '#f5f5f3' }}
                  >
                    <h3 className="text-lg font-bold">{item.common}</h3>
                    <em className="text-sm italic opacity-70">{item.binomial}</em>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

CircularGallery.displayName = 'CircularGallery'

export { CircularGallery }
