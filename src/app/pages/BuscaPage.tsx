"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Checkbox } from '@/app/components/ui/checkbox'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { Switch } from '@/app/components/ui/switch'
import { Button } from '@/app/components/ui/button'
import { REGIOES, UFS_BR, CARGOS_FILTRO } from '@/data/constants'
import { buildSearchParamsFromFilters, filterEditais, type EditalListFilters } from '@/lib/editalFilters'
import { fetchEditais } from '@/services/editaisService'
import type { EditalPSS } from '@/data/mockEditais'

const STATUS_OPTS = [
  { id: 'Aberto', label: 'Aberto' },
  { id: 'Encerrado', label: 'Encerrado' },
  { id: 'Em breve', label: 'Em breve' },
  { id: 'Suspenso', label: 'Suspenso' },
] as const

export default function BuscaPage() {
  const router = useRouter()
  const [editais, setEditais] = useState<EditalPSS[]>([])

  const [regioes, setRegioes] = useState<Set<string>>(new Set())
  const [estados, setEstados] = useState<Set<string>>(new Set())
  const [cargos, setCargos] = useState<Set<string>>(new Set())
  const [cro, setCro] = useState<'sim' | 'nao' | 'tanto'>('tanto')
  const [salMin, setSalMin] = useState<number | ''>('')
  const [salMax, setSalMax] = useState<number | ''>('')
  const [chMin, setChMin] = useState<number | ''>('')
  const [chMax, setChMax] = useState<number | ''>('')
  const [vagasMin, setVagasMin] = useState<number | ''>('')
  const [cadastroReserva, setCadastroReserva] = useState(false)
  const [statusFlags, setStatusFlags] = useState<Set<string>>(new Set())
  const [popMin, setPopMin] = useState<number | ''>('')
  const [popMax, setPopMax] = useState<number | ''>('')

  useEffect(() => {
    let cancelled = false
    fetchEditais().then((data) => {
      if (!cancelled) setEditais(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const croFilter = cro === 'tanto' ? undefined : cro

  const filtersForPreview = useMemo((): EditalListFilters => {
    return {
      regioes: regioes.size ? [...regioes] : undefined,
      estados: estados.size ? [...estados] : undefined,
      cargos: cargos.size ? [...cargos] : undefined,
      cro: croFilter,
      salMin: salMin === '' ? undefined : Number(salMin),
      salMax: salMax === '' ? undefined : Number(salMax),
      chMin: chMin === '' ? undefined : Number(chMin),
      chMax: chMax === '' ? undefined : Number(chMax),
      vagasMin: vagasMin === '' ? undefined : Number(vagasMin),
      cadastroReserva: cadastroReserva || undefined,
      statusFlags: statusFlags.size ? [...statusFlags] : undefined,
      popMin: popMin === '' ? undefined : Number(popMin),
      popMax: popMax === '' ? undefined : Number(popMax),
    }
  }, [
    regioes,
    estados,
    cargos,
    croFilter,
    salMin,
    salMax,
    chMin,
    chMax,
    vagasMin,
    cadastroReserva,
    statusFlags,
    popMin,
    popMax,
  ])

  const previewCount = useMemo(() => {
    if (!editais.length) return 0
    return filterEditais(editais, filtersForPreview).length
  }, [editais, filtersForPreview])

  const toggle = (set: Set<string>, v: string, fn: (s: Set<string>) => void) => {
    const n = new Set(set)
    if (n.has(v)) n.delete(v)
    else n.add(v)
    fn(n)
  }

  const limpar = () => {
    setRegioes(new Set())
    setEstados(new Set())
    setCargos(new Set())
    setCro('tanto')
    setSalMin('')
    setSalMax('')
    setChMin('')
    setChMax('')
    setVagasMin('')
    setCadastroReserva(false)
    setStatusFlags(new Set())
    setPopMin('')
    setPopMax('')
  }

  const buscar = () => {
    const qs = buildSearchParamsFromFilters(filtersForPreview)
    router.push(qs ? `/dashboard/editais?${qs}` : "/dashboard/editais")
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6 pb-28 text-text-primary lg:px-8">
      <div className="mx-auto max-w-xl space-y-8">
        <h1 className="radix-section-title text-[26px] font-semibold">Busca avançada</h1>

        <section className="radix-card radix-card-hover space-y-3 p-5">
          <h2 className="radix-label-caps font-semibold">Região</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {REGIOES.map((r) => (
              <label key={r} className="flex items-center gap-2 text-[14px] text-text-primary">
                <Checkbox
                  checked={regioes.has(r)}
                  onCheckedChange={() => toggle(regioes, r, setRegioes)}
                />
                {r}
              </label>
            ))}
          </div>
        </section>

        <section className="radix-card radix-card-hover space-y-3 p-5">
          <h2 className="radix-label-caps font-semibold">Estado (UF)</h2>
          <select
            multiple
            size={8}
            className="focus-ring-radix h-40 w-full rounded-xl border border-[#D1D9E0] bg-white p-2 text-[13px] text-text-primary"
            value={[...estados]}
            onChange={(e) => {
              const opts = [...e.target.selectedOptions].map((o) => o.value)
              setEstados(new Set(opts))
            }}
          >
            {UFS_BR.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-text-secondary">Segure Ctrl/Cmd para múltiplos.</p>
        </section>

        <section className="radix-card radix-card-hover space-y-3 p-5">
          <h2 className="radix-label-caps font-semibold">Cargo</h2>
          {CARGOS_FILTRO.map((c) => (
            <label key={c} className="mb-2 flex items-center gap-2 text-[14px] text-text-primary">
              <Checkbox
                checked={cargos.has(c)}
                onCheckedChange={() => toggle(cargos, c, setCargos)}
              />
              {c}
            </label>
          ))}
        </section>

        <section className="radix-card radix-card-hover space-y-3 p-5">
          <Label className="text-text-primary">CRO obrigatório</Label>
          <select
            value={cro}
            onChange={(e) => setCro(e.target.value as typeof cro)}
            className="focus-ring-radix mt-1 w-full rounded-xl border border-[#D1D9E0] bg-white p-3 text-text-primary"
          >
            <option value="tanto">Tanto faz</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </section>

        <section className="radix-card radix-card-hover grid grid-cols-2 gap-4 p-5">
          <div>
            <Label className="text-text-primary">Salário mín. (R$)</Label>
            <Input
              type="number"
              value={salMin}
              placeholder="Qualquer"
              onChange={(e) => {
                const v = e.target.value
                setSalMin(v === '' ? '' : Number(v))
              }}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label className="text-text-primary">Salário máx. (R$)</Label>
            <Input
              type="number"
              value={salMax}
              placeholder="Qualquer"
              onChange={(e) => {
                const v = e.target.value
                setSalMax(v === '' ? '' : Number(v))
              }}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label className="text-text-primary">CH mín. (h)</Label>
            <Input
              type="number"
              value={chMin}
              placeholder="Qualquer"
              onChange={(e) => {
                const v = e.target.value
                setChMin(v === '' ? '' : Number(v))
              }}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label className="text-text-primary">CH máx. (h)</Label>
            <Input
              type="number"
              value={chMax}
              placeholder="Qualquer"
              onChange={(e) => {
                const v = e.target.value
                setChMax(v === '' ? '' : Number(v))
              }}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
        </section>

        <section className="radix-card radix-card-hover space-y-3 p-5">
          <Label className="text-text-primary">Vagas mínimas</Label>
          <Input
            type="number"
            min={0}
            value={vagasMin}
            placeholder="Qualquer"
            onChange={(e) => {
              const v = e.target.value
              setVagasMin(v === '' ? '' : Number(v))
            }}
            className="focus-ring-radix border-[#D1D9E0] bg-white"
          />
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="cr-only" className="text-text-primary">
              Somente com cadastro reserva
            </Label>
            <Switch id="cr-only" checked={cadastroReserva} onCheckedChange={setCadastroReserva} />
          </div>
        </section>

        <section className="radix-card radix-card-hover space-y-3 p-5">
          <h2 className="radix-label-caps font-semibold">Status</h2>
          {STATUS_OPTS.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-[14px] text-text-primary">
              <Checkbox
                checked={statusFlags.has(s.id)}
                onCheckedChange={() => toggle(statusFlags, s.id, setStatusFlags)}
              />
              {s.label}
            </label>
          ))}
        </section>

        <section className="radix-card radix-card-hover grid grid-cols-2 gap-4 p-5">
          <div>
            <Label className="text-text-primary">População mín.</Label>
            <Input
              type="number"
              value={popMin}
              placeholder="Qualquer"
              onChange={(e) => {
                const v = e.target.value
                setPopMin(v === '' ? '' : Number(v))
              }}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label className="text-text-primary">População máx.</Label>
            <Input
              type="number"
              value={popMax}
              placeholder="Qualquer"
              onChange={(e) => {
                const v = e.target.value
                setPopMax(v === '' ? '' : Number(v))
              }}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
        </section>

        <p className="text-center text-[14px] font-medium text-radix-gold">
          {previewCount} {previewCount !== 1 ? 'editais' : 'edital'} encontrado{previewCount !== 1 ? 's' : ''} com estes
          critérios
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="ghost" className="flex-1 text-text-secondary" onClick={limpar}>
            Limpar filtros
          </Button>
          <Button type="button" className="flex-1" onClick={buscar}>
            Buscar
          </Button>
        </div>
      </div>
    </div>
  )
}
