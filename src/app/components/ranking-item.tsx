import { motion } from 'motion/react'

interface RankingItemProps {
  position: number
  cargo: string
  municipio: string
  estado: string
  value: string
  /** Dourado para rankings de salário */
  valueEmphasis?: 'gold' | 'teal'
  index?: number
  onClick?: () => void
}

export function RankingItem({
  position,
  cargo,
  municipio,
  estado,
  value,
  valueEmphasis = 'teal',
  index = 0,
  onClick,
}: RankingItemProps) {
  const Comp = onClick ? motion.button : motion.div
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      className="radix-card radix-card-hover group flex w-full items-center gap-4 p-4 text-left"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-[14px] font-bold text-accent-gold-text">
        #{position}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-semibold text-text-primary">{cargo}</div>
        <div className="text-[12px] text-text-secondary">
          {municipio} · {estado}
        </div>
      </div>

      <div
        className={
          valueEmphasis === 'gold' ? 'text-[16px] font-bold text-radix-gold' : 'text-[16px] font-bold text-accent-gold-text'
        }
      >
        {value}
      </div>
    </Comp>
  )
}
