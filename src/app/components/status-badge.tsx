import { motion } from 'motion/react'

type Status = 'open' | 'closing' | 'closed' | 'soon' | 'last-day'

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusConfig = {
  open: {
    label: 'ABERTO',
    color: 'bg-status-open-bg text-status-open border-status-open/30',
  },
  closing: {
    label: 'ENCERRANDO',
    color: 'bg-status-closing-bg text-status-closing border-status-closing/30',
  },
  closed: {
    label: 'ENCERRADO',
    color: 'bg-status-closed-bg text-status-closed border-status-closed/30',
  },
  soon: {
    label: 'EM BREVE',
    color: 'bg-status-soon-bg text-status-soon border-status-soon/30',
  },
  'last-day': {
    label: 'ÚLTIMO DIA',
    color: 'bg-urgency-red text-white border-urgency-red font-semibold',
  },
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status]
  const isPulsing = status === 'last-day'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-lg border px-3 py-1 text-[11px] font-medium tracking-[1.2px] ${config.color} ${className}`}
      style={{
        animation: isPulsing ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
      }}
    >
      {config.label}
    </motion.div>
  )
}
