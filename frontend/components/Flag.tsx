import { isoFor } from '@/lib/geo'

/**
 * Drapeau pays affiche via flagcdn.com (image reelle).
 *
 * Les emojis drapeau (regional indicators) ne sont pas rendus comme des
 * drapeaux sur Windows (Segoe UI Emoji affiche les codes pays bruts) -
 * on utilise donc une vraie image pour un rendu identique sur toutes les
 * plateformes (PC, mobile, etc.).
 */
export default function Flag({ country, size = 16 }: { country: string | null | undefined; size?: number }) {
  const iso = isoFor(country)
  const height = size
  const width = Math.round(size * 1.33)

  if (!iso) {
    return (
      <span
        style={{
          display: 'inline-block',
          width,
          height,
          borderRadius: 2,
          background: '#E5E5E3',
          verticalAlign: 'middle',
        }}
      />
    )
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${iso}.png`}
      width={width}
      height={height}
      alt={country || ''}
      style={{ borderRadius: 2, objectFit: 'cover', display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    />
  )
}
