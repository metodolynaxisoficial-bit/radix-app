"use client"

import { motion } from "motion/react"
import { Bell, ChevronRight, Search, Settings, User } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CardPSS } from '@/app/components/card-pss'
import { BrazilMapRadix } from '@/app/components/brazil-map-radix'
import { KpiClick } from '@/app/components/kpi-click'
import { RankingItem } from '@/app/components/ranking-item'
import { RegionCard } from '@/app/components/region-card'
import {
  contagemPorRegiao,
  diasRestantesInscricao,
  formatarMoeda,
  isPssAtivo,
  novosEstaSemana,
  type EditalPSS,
} from '@/data/mockEditais'
import { REGIOES } from '@/data/constants'
import { useFilters } from '@/context/FiltersContext'
import { fetchEditais } from '@/services/editaisService'

export default function DashboardPage() {
  const router = useRouter()
  const { dashboardQuery, setDashboardQuery } = useFilters()
  const [localQ, setLocalQ] = useState(dashboardQuery)
  const [editais, setEditais] = useState<EditalPSS[]>([])

  useEffect(() => {
    let cancelled = false
    fetchEditais().then((data) => {
      if (!cancelled) setEditais(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const counts = useMemo(() => contagemPorRegiao(editais), [editais])

  const kpiAtivos = useMemo(
    () => editais.filter((e) => e.status === 'Aberto' || e.status === 'Em breve').length,
    [editais],
  )
  const kpiAbertas = useMemo(() => editais.filter((e) => e.status === 'Aberto').length, [editais])
  const kpiEncerrando = useMemo(
    () =>
      editais.filter(
        (e) => e.status === 'Aberto' && diasRestantesInscricao(e) > 0 && diasRestantesInscricao(e) <= 7,
      ).length,
    [editais],
  )
  const kpiNovos = useMemo(() => novosEstaSemana(editais), [editais])

  const novosPss = useMemo(
    () =>
      [...editais]
        .sort(
          (a, b) =>
            new Date(b.data_inicio_inscricao).getTime() - new Date(a.data_inicio_inscricao).getTime(),
        )
        .slice(0, 6),
    [editais],
  )

  const encerrando = useMemo(
    () =>
      editais
        .filter((e) => e.status === 'Aberto')
        .sort((a, b) => diasRestantesInscricao(a) - diasRestantesInscricao(b)),
    [editais],
  )

  const topSalarios = useMemo(
    () =>
      [...editais]
        .filter((e) => e.status === 'Aberto')
        .sort((a, b) => b.salario - a.salario)
        .slice(0, 5),
    [editais],
  )

  const menorCh = useMemo(
    () =>
      [...editais]
        .filter((e) => e.status === 'Aberto')
        .sort((a, b) => a.carga_horaria - b.carga_horaria)
        .slice(0, 5),
    [editais],
  )

  const alertN = kpiEncerrando

  const runSearch = () => {
    setDashboardQuery(localQ)
    const q = encodeURIComponent(localQ.trim())
    router.push(q ? `/dashboard/editais?q=${q}` : "/dashboard/editais")
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="radix-header-bar sticky top-0 z-40 border-b border-divider"
      >
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <Link
            href="/dashboard"
            className="radix-section-title shrink-0 text-[26px] font-bold tracking-tight text-[#0D7C66]"
          >
            RADIX
          </Link>
          <div className="relative max-w-2xl min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              type="search"
              placeholder="Cargo, município ou estado…"
              className="focus-ring-radix w-full rounded-xl border border-[#D1D9E0] bg-white py-3 pl-10 pr-4 text-[14px] text-text-primary placeholder:text-text-secondary"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Link
              href="/dashboard/alertas"
              className="relative rounded-lg p-2 transition-colors hover:bg-[#F0F2F5]"
            >
              <Bell className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
              {alertN > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-urgency-red" />
              )}
            </Link>
            <Link href="/dashboard/perfil" className="rounded-lg p-2 transition-colors hover:bg-[#F0F2F5]">
              <User className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
            </Link>
            <Link
              href="/dashboard/configuracoes"
              className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-[#F0F2F5] hover:text-accent-gold-text"
              aria-label="Configurações"
            >
              <Settings className="h-5 w-5 sm:hidden" strokeWidth={1.5} />
              <span className="hidden px-1 text-[12px] sm:inline">Ajustes</span>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-[1600px] space-y-10 px-4 py-8 lg:px-6">
        <section>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="w-[min(85vw,260px)] shrink-0 snap-start sm:w-auto sm:min-w-[200px] sm:flex-1">
              <KpiClick
                value={kpiAtivos}
                label="Total PSS Ativos"
                index={0}
                onClick={() => router.push("/dashboard/editais?chip=ativos")}
              />
            </div>
            <div className="w-[min(85vw,260px)] shrink-0 snap-start sm:w-auto sm:min-w-[200px] sm:flex-1">
              <KpiClick
                value={kpiAbertas}
                label="Inscrições Abertas"
                index={1}
                onClick={() => router.push("/dashboard/editais?chip=inscricao_aberta")}
              />
            </div>
            <div className="w-[min(85vw,260px)] shrink-0 snap-start sm:w-auto sm:min-w-[200px] sm:flex-1">
              <KpiClick
                value={kpiEncerrando}
                label="Encerrando em 7 dias"
                index={2}
                onClick={() => router.push("/dashboard/editais?chip=encerrando")}
              />
            </div>
            <div className="w-[min(85vw,260px)] shrink-0 snap-start sm:w-auto sm:min-w-[200px] sm:flex-1">
              <KpiClick
                value={kpiNovos}
                label="Novos esta semana"
                index={3}
                onClick={() => router.push("/dashboard/editais?chip=novos_semana")}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="radix-section-title mb-4 text-[24px] font-semibold">Mapa do Brasil</h2>
          <div className="radix-card radix-card-hover p-6">
            <BrazilMapRadix
              counts={counts}
              onSelect={(r) => router.push(`/dashboard/editais?regiao=${encodeURIComponent(r)}`)}
            />
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="radix-section-title text-[24px] font-semibold">Novos PSS</h2>
            <button
              type="button"
              onClick={() => router.push("/dashboard/editais")}
              className="flex items-center gap-1 text-[14px] font-medium text-link transition-colors hover:text-accent-gold-hover"
            >
              Ver todos →
            </button>
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4">
            {novosPss.map((e, i) => (
              <CardPSS key={e.id} edital={e} index={i} showNovoBadge />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="radix-section-title text-[24px] font-semibold">Inscrições Encerrando</h2>
            <button
              type="button"
              onClick={() => router.push("/dashboard/editais?chip=encerrando")}
              className="flex items-center gap-1 text-[14px] font-medium text-link"
            >
              Ver todos
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4">
            {encerrando.map((e, i) => (
              <CardPSS key={e.id} edital={e} index={i} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="radix-section-title mb-4 text-[24px] font-semibold">Melhores Salários</h2>
            <div className="space-y-3">
              {topSalarios.map((e, i) => (
                <RankingItem
                  key={e.id}
                  position={i + 1}
                  cargo={e.cargo}
                  municipio={e.municipio}
                  estado={e.sigla_estado}
                  value={formatarMoeda(e.salario)}
                  valueEmphasis="gold"
                  index={i}
                  onClick={() => router.push(`/dashboard/editais/${e.id}`)}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="radix-section-title mb-4 text-[24px] font-semibold">Menor Carga Horária</h2>
            <div className="space-y-3">
              {menorCh.map((e, i) => (
                <RankingItem
                  key={e.id}
                  position={i + 1}
                  cargo={e.cargo}
                  municipio={e.municipio}
                  estado={e.sigla_estado}
                  value={`${e.carga_horaria}h`}
                  index={i}
                  onClick={() => router.push(`/dashboard/editais/${e.id}`)}
                />
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="radix-section-title mb-4 text-[24px] font-semibold">Por Região</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {REGIOES.map((name, index) => (
              <RegionCard
                key={name}
                name={name}
                count={editais.filter((e) => isPssAtivo(e) && e.regiao === name).length}
                index={index}
                onClick={() => router.push(`/dashboard/editais?regiao=${encodeURIComponent(name)}`)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
