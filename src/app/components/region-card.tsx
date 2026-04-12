import { motion } from 'motion/react'

interface RegionCardProps {
  name: string
  count: number
  trend?: number[]
  index?: number
  onClick?: () => void
}

const defaultTrend = [3, 4, 5, 6, 7, 8, 9, 8, 7, 8, 9, 10]

export function RegionCard({ name, count, trend = defaultTrend, index = 0, onClick }: RegionCardProps) {
  const maxValue = Math.max(...trend)
  const normalizedTrend = trend.map((v) => (v / maxValue) * 100)

  const Comp = onClick ? motion.button : motion.div

  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      className="radix-card radix-card-hover group rounded-xl p-5 text-left"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 text-[18px] font-semibold text-text-primary">{name}</div>
          <div className="radix-label-caps font-semibold">Região</div>
        </div>
        <div className="text-[24px] font-bold text-radix-gold">{count}</div>
      </div>

      <div className="flex h-12 items-end gap-[2px]">
        {normalizedTrend.map((value, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-[#0D7C66]/85 to-[#1A9E8F]/55 transition-all duration-300 group-hover:from-[#0D7C66] group-hover:to-[#1A9E8F]"
            style={{ height: `${value}%` }}
          />
        ))}
      </div>

      <div className="radix-label-caps mt-3 text-center font-semibold">Últimos 30 dias</div>
    </Comp>
  )
}
