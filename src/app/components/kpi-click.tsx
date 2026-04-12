import { motion } from 'motion/react'
import { cn } from '@/app/components/ui/utils'

export function KpiClick({
  value,
  label,
  index = 0,
  onClick,
}: {
  value: number
  label: string
  index?: number
  onClick?: () => void
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      onClick={onClick}
      className={cn('w-full shrink-0 text-left', onClick && 'cursor-pointer')}
    >
      <div className="radix-card radix-card-hover p-5">
        <div className="text-[24px] font-bold leading-none text-radix-gold">{value}</div>
        <div className="radix-label-caps mt-2 font-semibold">{label}</div>
      </div>
    </motion.button>
  )
}
