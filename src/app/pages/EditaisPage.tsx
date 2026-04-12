"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from 'lucide-react'
import { CardPSS } from '@/app/components/card-pss'
import type { EditalPSS } from '@/data/mockEditais'
import {
  filterEditais,
  parseFiltersFromSearchParams,
  sortEditais,
  type EditalSortKey,
} from '@/lib/editalFilters'
import { Button } from '@/app/components/ui/button'
import { fetchEditais } from '@/services/editaisService'

const CHIPS: { id: string; label: string; param?: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'inscricao_aberta', label: 'Inscrição Aberta', param: 'inscricao_aberta' },
  { id: 'encerrando', label: 'Encerrando', param: 'encerrando' },
  { id: 'maior_salario', label: 'Maior Salário', param: 'maior_salario' },
  { id: 'menor_ch', label: 'Menor CH', param: 'menor_ch' },
  { id: 'cadastro_reserva', label: 'Cadastro Reserva', param: 'cadastro_reserva' },
]

const SORT_OPTS: { value: EditalSortKey; label: string }[] = [
  { value: 'recente', label: 'Mais recente' },
  { value: 'fim_inscricao', label: 'Fim inscrição mais próximo' },
  { value: 'salario_desc', label: 'Maior salário' },
  { value: 'salario_asc', label: 'Menor salário' },
  { value: 'ch_asc', label: 'Menor CH' },
  { value: 'ch_desc', label: 'Maior CH' },
  { value: 'vagas_desc', label: 'Mais vagas' },
  { value: 'pop_asc', label: 'Menor população' },
  { value: 'pop_desc', label: 'Maior população' },
]

export default function EditaisPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sort, setSort] = useState<EditalSortKey>('recente')
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

  const activeChip = searchParams.get('chip') || searchParams.get('filtro') || 'todos'

  const filtered = useMemo(() => {
    const f = parseFiltersFromSearchParams(searchParams)
    let list = filterEditais(editais, f)
    list = sortEditais(list, sort)
    return list
  }, [searchParams, sort, editais])

  const setChip = (id: string, param?: string) => {
    const next = new URLSearchParams(searchParams.toString())
    next.delete('filtro')
    if (id === 'todos') {
      next.delete('chip')
    } else if (param) {
      next.set('chip', param)
    }
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6 pb-28 lg:px-8">
      <div className="mx-auto max-w-3xl lg:max-w-5xl">
        <div className="mb-2 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="text-[13px] text-text-secondary transition-colors hover:text-link"
          >
            ← Voltar ao painel
          </Link>
        </div>
        <h1 className="radix-section-title mb-6 text-[28px] font-semibold">Editais PSS</h1>

        <div className="mb-4 flex snap-x gap-2 overflow-x-auto pb-2">
          {CHIPS.map((c) => {
            const on =
              c.id === 'todos' ? !searchParams.get('chip') && !searchParams.get('filtro') : activeChip === c.param
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setChip(c.id, c.param)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                  on
                    ? 'border-transparent bg-accent-gold-text text-white shadow-[0_2px_8px_rgba(13,124,102,0.25)]'
                    : 'border-[#E8ECF0] bg-[#F0F2F5] text-[#6B7A8D] hover:border-[#0D7C66]/30'
                }`}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-[13px] text-text-secondary">
            Ordenar
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as EditalSortKey)}
              className="focus-ring-radix rounded-xl border border-[#D1D9E0] bg-white px-3 py-2 text-text-primary"
            >
              {SORT_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <Button type="button" variant="outline" className="border-[#0D7C66] bg-transparent text-[#0D7C66]" onClick={() => router.push("/dashboard/busca")}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtros avançados
          </Button>
        </div>

        <p className="mb-4 text-[13px] text-text-secondary">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </p>

        <div className="flex flex-col gap-6">
          {editais.length === 0 ? (
            <p className="py-12 text-center text-text-secondary">Carregando editais…</p>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-text-secondary">Nenhum edital encontrado com esses filtros.</p>
          ) : (
            filtered.map((e, i) => <CardPSS key={e.id} edital={e} index={i} className="min-w-0" />)
          )}
        </div>
      </div>
    </div>
  )
}
