import { motion } from 'motion/react'
import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  icon: LucideIcon
  value: number
  label: string
  index?: number
}

export function KpiCard({ icon: Icon, value, label, index = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="group relative"
    >
      <div className="radix-card radix-card-hover p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-lg bg-primary-light p-2">
            <Icon className="h-5 w-5 text-accent-gold-text" strokeWidth={1.5} />
          </div>
        </div>
        <div className="mb-2 text-[24px] font-bold leading-none text-radix-gold">{value}</div>
        <div className="radix-label-caps font-semibold">{label}</div>
      </div>
    </motion.div>
  )
}
