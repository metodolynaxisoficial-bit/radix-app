"use client"

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Briefcase, Clock, DollarSign, Heart, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { EditalPSS } from '@/data/mockEditais'
import { diasRestantesInscricao, formatarPopulacao, parseDataBR } from '@/data/mockEditais'
import { useFavorites } from '@/context/FavoritesContext'
import { useTick } from '@/hooks/useTick'
import { cn } from '@/app/components/ui/utils'

function salarioCompacto(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}

function badgeClasses(edital: EditalPSS, dias: number) {
  if (edital.status === 'Suspenso') return 'bg-[#FFF0F0] text-[#DC3545] border-[#DC3545]/25'
  if (edital.status === 'Em breve') return 'bg-status-soon-bg text-status-soon border-status-soon/25'
  if (edital.status === 'Encerrado') return 'bg-status-closed-bg text-status-closed border-status-closed/30'
  if (edital.status === 'Aberto' && dias > 0 && dias <= 1)
    return 'bg-urgency-red text-white border-urgency-red font-semibold'
  if (edital.status === 'Aberto' && dias > 0 && dias <= 7)
    return 'bg-status-closing-bg text-status-closing border-status-closing/30'
  if (edital.status === 'Aberto') return 'bg-status-open-bg text-status-open border-status-open/30'
  return 'bg-status-closed-bg text-status-closed border-status-closed/30'
}

function badgeLabel(edital: EditalPSS, dias: number) {
  if (edital.status === 'Suspenso') return 'SUSPENSO'
  if (edital.status === 'Em breve') return 'EM BREVE'
  if (edital.status === 'Encerrado') return 'ENCERRADO'
  if (edital.status === 'Aberto' && dias > 0 && dias <= 1) return 'ÚLTIMO DIA'
  if (edital.status === 'Aberto' && dias > 0 && dias <= 7) return 'ENCERRANDO'
  if (edital.status === 'Aberto') return 'ABERTO'
  return String(edital.status).toUpperCase()
}

export function CardPSS({
  edital,
  index = 0,
  className,
  showNovoBadge,
}: {
  edital: EditalPSS
  index?: number
  className?: string
  /** Badge “Novo” (lista Novos PSS) */
  showNovoBadge?: boolean
}) {
  useTick()
  const router = useRouter()
  const { toggle, isFavorite } = useFavorites()
  const dias = diasRestantesInscricao(edital)
  const saved = isFavorite(edital.id)
  const label = badgeLabel(edital, dias)
  const pulse = edital.status === 'Aberto' && dias <= 1 && dias >= 0

  let contagemLinha: ReactNode
  if (edital.status === 'Encerrado' || (edital.status === 'Aberto' && dias < 0)) {
    contagemLinha = <span className="text-status-closed">Encerrado</span>
  } else if (edital.status === 'Em breve') {
    contagemLinha = <span className="text-status-soon">Inscrições em breve</span>
  } else if (edital.status === 'Suspenso') {
    contagemLinha = <span className="text-urgency-red">Processo suspenso</span>
  } else if (dias <= 1 && dias >= 0) {
    contagemLinha = (
      <span
        className="font-semibold text-urgency-red"
        style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
      >
        ÚLTIMO DIA
      </span>
    )
  } else {
    contagemLinha = (
      <span className={dias <= 7 ? 'font-medium text-urgency-red' : 'font-medium text-accent-gold-text'}>
        Faltam {dias} dias
      </span>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: 'easeOut' }}
      className={cn('relative min-w-[min(100%,340px)] shrink-0 snap-center', className)}
    >
      <div className="radix-card radix-card-hover border-[#E8ECF0] p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {showNovoBadge ? (
            <span className="rounded-md bg-badge-novo-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-radix-gold">
              Novo
            </span>
          ) : null}
          <div
            className={cn(
              'inline-flex items-center rounded-lg border px-3 py-1 text-[11px] font-medium tracking-[1.2px]',
              badgeClasses(edital, dias),
            )}
            style={{ animation: pulse ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : undefined }}
          >
            {label}
          </div>
        </div>

        <div className="mb-5 space-y-2">
          <h3 className="text-[16px] font-semibold leading-tight text-text-primary">{edital.cargo}</h3>
          <p className="text-[13px] text-text-secondary">
            {edital.orgao} — {edital.municipio} — {edital.sigla_estado}
          </p>
          <p className="text-[12px] text-text-tertiary">
            {edital.regiao} · {formatarPopulacao(edital.habitantes_municipio).replace(' hab.', '')} hab.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-4 gap-3">
          <div className="rounded-lg bg-[#F8F9FA] p-3 text-center">
            <div className="mb-1 flex justify-center">
              <DollarSign className="h-4 w-4 text-accent-gold-text" strokeWidth={2} />
            </div>
            <div className="mb-1 text-[14px] font-bold leading-tight text-radix-gold">
              {salarioCompacto(edital.salario).replace('R$', '').trim()}
            </div>
            <div className="radix-label-caps text-[10px] tracking-wide">Salário</div>
          </div>
          <div className="rounded-lg bg-[#F8F9FA] p-3 text-center">
            <div className="mb-1 flex justify-center">
              <Clock className="h-4 w-4 text-accent-gold-text" strokeWidth={2} />
            </div>
            <div className="mb-1 text-[14px] font-bold leading-tight text-text-primary">
              {edital.carga_horaria}h
            </div>
            <div className="radix-label-caps text-[10px] tracking-wide">CH</div>
          </div>
          <div className="rounded-lg bg-[#F8F9FA] p-3 text-center">
            <div className="mb-1 flex justify-center">
              <Users className="h-4 w-4 text-accent-gold-text" strokeWidth={2} />
            </div>
            <div className="mb-1 text-[14px] font-bold leading-tight text-text-primary">
              {String(edital.numero_vagas).padStart(2, '0')}
            </div>
            <div className="radix-label-caps text-[10px] tracking-wide">Vagas</div>
          </div>
          <div className="rounded-lg bg-[#F8F9FA] p-3 text-center">
            <div className="mb-1 flex justify-center">
              <Briefcase className="h-4 w-4 text-accent-gold-text" strokeWidth={2} />
            </div>
            <div className="mb-1 text-[14px] font-bold leading-tight text-text-primary">
              {edital.cadastro_reserva ? 'Sim' : 'Não'}
            </div>
            <div className="radix-label-caps text-[10px] tracking-wide">CR</div>
          </div>
        </div>

        <div className="mb-5 space-y-2 border-b border-divider pb-5">
          <div className="flex items-center gap-2 text-[12px] text-text-secondary">
            <span>📅</span>
            <span>
              Inscrição: {parseDataBR(edital.data_inicio_inscricao)} a{' '}
              {parseDataBR(edital.data_fim_inscricao)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span>⏳</span>
            {contagemLinha}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => toggle(edital.id)}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-accent-gold-text"
          >
            <Heart
              className={cn('h-4 w-4', saved && 'fill-accent-gold-text text-accent-gold-text')}
              strokeWidth={2}
            />
            Salvar ♡
          </button>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/editais/${edital.id}`)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-bold text-white transition-transform hover:scale-[1.01]"
            style={{
              background: 'linear-gradient(135deg, #C5A55A, #0D7C66)',
              boxShadow: '0 2px 8px rgba(197, 165, 90, 0.35)',
            }}
          >
            Ver edital
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
