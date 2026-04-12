import { motion } from 'motion/react'
import { useState } from 'react'
import type { EditalPSS } from '@/data/mockEditais'
import { cn } from '@/app/components/ui/utils'

type RegionKey = EditalPSS['regiao']

const PATHS: Record<RegionKey, string> = {
  Norte: 'M 95 45 L 210 40 L 255 115 L 200 155 L 115 130 Z',
  Nordeste: 'M 255 115 L 340 125 L 355 210 L 315 265 L 255 245 L 230 195 Z',
  'Centro-Oeste': 'M 115 130 L 230 195 L 255 245 L 215 305 L 125 285 L 95 200 Z',
  Sudeste: 'M 215 305 L 255 245 L 315 265 L 300 335 L 245 355 L 195 335 Z',
  Sul: 'M 125 345 L 195 335 L 245 355 L 235 430 L 150 455 L 105 400 Z',
  'Distrito Federal': 'M 218 258 L 238 258 L 238 278 L 218 278 Z',
}

const LABEL_POS: Record<RegionKey, { x: number; y: number }> = {
  Norte: { x: 168, y: 95 },
  Nordeste: { x: 298, y: 188 },
  'Centro-Oeste': { x: 178, y: 228 },
  Sudeste: { x: 258, y: 300 },
  Sul: { x: 178, y: 395 },
  'Distrito Federal': { x: 228, y: 268 },
}

export function BrazilMapRadix({
  counts,
  onSelect,
}: {
  counts: Record<RegionKey, number>
  onSelect: (r: RegionKey) => void
}) {
  const [hovered, setHovered] = useState<RegionKey | null>(null)

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <svg viewBox="0 0 400 500" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
        {(Object.keys(PATHS) as RegionKey[]).map((key) => (
          <motion.path
            key={key}
            d={PATHS[key]}
            role="button"
            tabIndex={0}
            fill="#F0F2F5"
            stroke={hovered === key ? '#0D7C66' : '#D1D9E0'}
            strokeWidth={hovered === key ? 2 : 1.5}
            className="cursor-pointer outline-none transition-colors"
            whileHover={{ stroke: '#0D7C66' }}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(key)
              }
            }}
          />
        ))}
        {(Object.keys(LABEL_POS) as RegionKey[]).map((key) => {
          const { x, y } = LABEL_POS[key]
          return (
            <g key={`b-${key}`}>
              <rect
                x={x - 18}
                y={y - 14}
                width={36}
                height={22}
                rx={6}
                fill="#0D7C66"
                className="pointer-events-none"
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                className={cn('fill-white text-[12px] font-bold')}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {counts[key]}
              </text>
            </g>
          )
        })}
      </svg>
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-lg border border-[#E8ECF0] bg-white px-4 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        >
          <p className="text-[13px] font-medium text-text-primary">
            {hovered}: {counts[hovered]} PSS ativos
          </p>
        </motion.div>
      )}
    </div>
  )
}
