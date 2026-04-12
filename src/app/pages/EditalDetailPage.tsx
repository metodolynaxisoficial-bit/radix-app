"use client"

import { motion } from "motion/react"
import { ArrowLeft, ExternalLink, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type { EditalPSS } from '@/data/mockEditais'
import {
  diasRestantesInscricao,
  diasRestantesProcesso,
  formatarMoeda,
  formatarPopulacao,
  parseDataBR,
  periodProgress,
} from '@/data/mockEditais'
import { useFavorites } from '@/context/FavoritesContext'
import { useTick } from '@/hooks/useTick'
import { cn } from '@/app/components/ui/utils'
import { fetchEditais } from '@/services/editaisService'

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF0F3]">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: 'linear-gradient(90deg, #0D7C66, #1A9E8F)',
        }}
      />
    </div>
  )
}

function badgeFor(edital: EditalPSS) {
  const d = diasRestantesInscricao(edital)
  if (edital.status === 'Suspenso') return 'bg-[#FFF0F0] text-[#DC3545] border-[#DC3545]/25'
  if (edital.status === 'Em breve') return 'bg-status-soon-bg text-status-soon border-status-soon/30'
  if (edital.status === 'Encerrado') return 'bg-status-closed-bg text-status-closed border-status-closed/30'
  if (edital.status === 'Aberto' && d > 0 && d <= 7) return 'bg-status-closing-bg text-status-closing border-status-closing/30'
  return 'bg-status-open-bg text-status-open border-status-open/30'
}

export default function EditalDetailPage() {
  useTick()
  const params = useParams<{ id: string }>()
  const id = params?.id
  const router = useRouter()
  const { toggle, isFavorite } = useFavorites()
  const [edital, setEdital] = useState<EditalPSS | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchEditais()
      .then((list) => {
        if (cancelled) return
        const found = id && typeof id === "string" ? list.find((e) => e.id === id) : undefined
        setEdital(found)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary px-4 py-16 text-center text-text-secondary">
        <p>Carregando…</p>
      </div>
    )
  }

  if (!edital) {
    return (
      <div className="min-h-screen bg-bg-primary px-4 py-16 text-center text-text-secondary">
        <p className="text-lg">Edital não encontrado</p>
        <Link href="/dashboard/editais" className="mt-4 inline-block text-link">
          Voltar à lista
        </Link>
      </div>
    )
  }

  const dInsc = diasRestantesInscricao(edital)
  const dProc = diasRestantesProcesso(edital)
  const pctInsc = periodProgress(edital.data_inicio_inscricao, edital.data_fim_inscricao)
  const pctProc = periodProgress(edital.data_inicio_processo, edital.data_fim_processo)

  const fav = isFavorite(edital.id)

  const labelStatus =
    edital.status === 'Aberto' && dInsc <= 1 && dInsc >= 0
      ? 'ÚLTIMO DIA'
      : edital.status.toUpperCase()

  const fields: { label: string; value: string }[] = [
    { label: 'Cargo', value: edital.cargo },
    { label: 'Município', value: edital.municipio },
    { label: 'Estado', value: `${edital.estado} (${edital.sigla_estado})` },
    { label: 'Região', value: edital.regiao },
    { label: 'População do município', value: formatarPopulacao(edital.habitantes_municipio) },
    { label: 'Vagas', value: String(edital.numero_vagas) },
    { label: 'Cadastro reserva', value: edital.cadastro_reserva ? 'Sim' : 'Não' },
    { label: 'Salário', value: formatarMoeda(edital.salario) },
    { label: 'Carga horária', value: `${edital.carga_horaria}h semanais` },
    {
      label: 'Taxa de inscrição',
      value: edital.taxa_inscricao <= 0 ? 'Gratuita' : formatarMoeda(edital.taxa_inscricao),
    },
    { label: 'CRO obrigatório', value: edital.cro_obrigatorio ? 'Sim' : 'Não' },
  ]

  return (
    <div className="min-h-screen bg-bg-primary pb-36 pt-4 text-text-primary">
      <div className="mx-auto max-w-3xl px-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-[14px] text-text-secondary transition-colors hover:text-link"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="mb-2">
          <span
            className={cn(
              'inline-flex rounded-lg border px-3 py-1 text-[11px] font-medium tracking-wide',
              edital.status === 'Aberto' && dInsc <= 1 && dInsc >= 0
                ? 'animate-pulse border-urgency-red bg-urgency-red font-semibold text-white'
                : badgeFor(edital),
            )}
          >
            {labelStatus}
          </span>
        </div>
        <h1 className="radix-section-title text-[22px] font-semibold leading-snug">{edital.titulo_edital}</h1>
        <p className="mt-2 text-[14px] text-text-secondary">{edital.orgao}</p>

        <div className="radix-card radix-card-hover mt-8 border-[#0D7C66]/25 p-6">
          <h2 className="mb-4 text-[16px] font-semibold text-radix-gold">Tempo e prazo</h2>
          <div className="space-y-6">
            <div>
              <p className="text-[13px] text-text-secondary">
                Inscrição: {parseDataBR(edital.data_inicio_inscricao)} a{' '}
                {parseDataBR(edital.data_fim_inscricao)}
              </p>
              <div className="mt-2">
                <ProgressBar value={pctInsc} />
              </div>
              <p className="mt-2 text-[13px] text-text-primary">
                {edital.status === 'Encerrado' || dInsc < 0
                  ? 'Inscrições encerradas'
                  : edital.status === 'Em breve'
                    ? 'Inscrições ainda não abriram'
                    : `Faltam ${dInsc} dias para encerrar inscrição`}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-text-secondary">
                Processo: {parseDataBR(edital.data_inicio_processo)} a{' '}
                {parseDataBR(edital.data_fim_processo)}
              </p>
              <div className="mt-2">
                <ProgressBar value={pctProc} />
              </div>
              <p className="mt-2 text-[13px] text-text-primary">
                {dProc < 0 ? 'Processo encerrado' : `Faltam ${dProc} dias para término do processo`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label} className="radix-card radix-card-hover p-4">
              <div className="radix-label-caps font-semibold">{f.label}</div>
              <div className="mt-1 text-[16px] text-text-primary">{f.value}</div>
            </div>
          ))}
        </div>

        <div className="radix-card radix-card-hover mt-8 p-6">
          <h2 className="mb-3 text-[15px] font-semibold text-text-primary">Requisitos</h2>
          <p className="text-[14px] leading-relaxed text-text-secondary">{edital.requisitos}</p>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-[16px] font-semibold text-text-primary">Etapas do processo</h2>
          <div className="relative space-y-0 pl-2">
            {edital.etapas.map((et, i) => (
              <div key={et.titulo} className="relative flex gap-4 pb-8 last:pb-0">
                {i < edital.etapas.length - 1 && (
                  <div className="absolute left-[7px] top-3 h-full w-px bg-divider" />
                )}
                <div className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full bg-accent-gold-text" />
                <div>
                  <div className="font-semibold text-text-primary">{et.titulo}</div>
                  <p className="mt-1 text-[13px] text-text-secondary">{et.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {edital.observacoes ? (
          <p className="mt-6 text-[13px] text-text-secondary">{edital.observacoes}</p>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-divider bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:static lg:mt-10 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row">
          <motion.a
            href={edital.link_edital}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-center text-[14px] font-bold text-white shadow-[0_2px_8px_rgba(197,165,90,0.35)]"
            style={{
              background: 'linear-gradient(135deg, #C5A55A, #0D7C66)',
              boxShadow: '0 2px 8px rgba(197, 165, 90, 0.35)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            Abrir Edital
            <ExternalLink className="h-4 w-4" />
          </motion.a>
          <a
            href={edital.link_orgao}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center rounded-xl border border-[#0D7C66] bg-transparent py-3 text-[14px] font-semibold text-[#0D7C66]"
          >
            Site Oficial
          </a>
          <button
            type="button"
            onClick={() => toggle(edital.id)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E8ECF0] bg-white py-3 px-4 text-[14px] font-medium text-text-primary"
          >
            <Heart className={cn('h-5 w-5', fav && 'fill-accent-gold-text text-accent-gold-text')} />
            {fav ? 'Salvo' : 'Salvar nos Favoritos'}
          </button>
        </div>
      </div>
    </div>
  )
}
