import type { EditalPSS } from '@/data/mockEditais'
import { diasRestantesInscricao } from '@/data/mockEditais'

export type EditalSortKey =
  | 'recente'
  | 'fim_inscricao'
  | 'salario_desc'
  | 'salario_asc'
  | 'ch_asc'
  | 'ch_desc'
  | 'vagas_desc'
  | 'pop_asc'
  | 'pop_desc'

export interface EditalListFilters {
  regioes?: string[]
  estados?: string[]
  cargos?: string[]
  cro?: 'sim' | 'nao' | 'tanto'
  salMin?: number
  salMax?: number
  chMin?: number
  chMax?: number
  vagasMin?: number
  cadastroReserva?: boolean
  statusFlags?: string[]
  popMin?: number
  popMax?: number
  chip?: string
  regiao?: string
  status?: string
  filtro?: string
  q?: string
}

function matchesStatusCheckbox(edital: EditalPSS, flags: string[]): boolean {
  if (!flags.length) return true
  const d = diasRestantesInscricao(edital)
  return flags.some((f) => {
    if (f === 'Aberto') return edital.status === 'Aberto'
    if (f === 'Encerrado') return edital.status === 'Encerrado'
    if (f === 'Em breve') return edital.status === 'Em breve'
    if (f === 'Suspenso') return edital.status === 'Suspenso'
    if (f === 'Encerrando') return edital.status === 'Aberto' && d > 0 && d <= 7
    return false
  })
}

function cargoMatches(edital: EditalPSS, cargos: string[]): boolean {
  const ec = edital.cargo.trim().toLowerCase()
  return cargos.some((c) => {
    const cc = c.trim().toLowerCase()
    if (ec === cc) return true
    if (cc === 'dentista') {
      if (ec === 'dentista') return true
      if (ec.startsWith('dentista ')) return true
      return false
    }
    if (ec.includes(cc) || cc.includes(ec)) return true
    return false
  })
}

export function filterEditais(list: EditalPSS[], f: EditalListFilters): EditalPSS[] {
  let out = [...list]

  if (f.q?.trim()) {
    const q = f.q.trim().toLowerCase()
    out = out.filter(
      (e) =>
        e.cargo.toLowerCase().includes(q) ||
        e.municipio.toLowerCase().includes(q) ||
        e.estado.toLowerCase().includes(q) ||
        e.sigla_estado.toLowerCase().includes(q) ||
        e.orgao.toLowerCase().includes(q) ||
        e.titulo_edital.toLowerCase().includes(q),
    )
  }

  if (f.regiao) {
    out = out.filter((e) => e.regiao === f.regiao)
  }

  if (f.regioes?.length) {
    out = out.filter((e) => f.regioes!.includes(e.regiao))
  }

  if (f.estados?.length) {
    out = out.filter((e) => f.estados!.includes(e.sigla_estado))
  }

  if (f.cargos?.length) {
    out = out.filter((e) => cargoMatches(e, f.cargos!))
  }

  if (f.cro === 'sim') out = out.filter((e) => e.cro_obrigatorio)
  if (f.cro === 'nao') out = out.filter((e) => !e.cro_obrigatorio)

  if (f.salMin != null) out = out.filter((e) => e.salario >= f.salMin!)
  if (f.salMax != null) out = out.filter((e) => e.salario <= f.salMax!)

  if (f.chMin != null) out = out.filter((e) => e.carga_horaria >= f.chMin!)
  if (f.chMax != null) out = out.filter((e) => e.carga_horaria <= f.chMax!)

  if (f.vagasMin != null) out = out.filter((e) => e.numero_vagas >= f.vagasMin!)

  if (f.cadastroReserva === true) out = out.filter((e) => e.cadastro_reserva)

  if (f.popMin != null) out = out.filter((e) => e.habitantes_municipio >= f.popMin!)
  if (f.popMax != null) out = out.filter((e) => e.habitantes_municipio <= f.popMax!)

  if (f.statusFlags?.length) {
    out = out.filter((e) => matchesStatusCheckbox(e, f.statusFlags!))
  }

  if (f.status) {
    out = out.filter((e) => e.status === f.status)
  }

  const chip = f.chip || f.filtro
  if (chip === 'ativos') {
    out = out.filter((e) => e.status === 'Aberto' || e.status === 'Em breve')
  } else if (chip === 'aberta' || chip === 'inscricao_aberta') {
    out = out.filter((e) => e.status === 'Aberto')
  } else if (chip === 'encerrando') {
    out = out.filter((e) => {
      const d = diasRestantesInscricao(e)
      return e.status === 'Aberto' && d > 0 && d <= 7
    })
  } else if (chip === 'maior_salario') {
    out = out.filter((e) => e.status === 'Aberto')
  } else if (chip === 'menor_ch') {
    out = out.filter((e) => e.status === 'Aberto')
  } else if (chip === 'cadastro_reserva') {
    out = out.filter((e) => e.cadastro_reserva)
  } else if (chip === 'novos_semana') {
    const limite = Date.now() - 7 * 86400000
    out = out.filter((e) => new Date(e.data_inicio_inscricao).getTime() >= limite)
  }

  return out
}

export function sortEditais(list: EditalPSS[], key: EditalSortKey): EditalPSS[] {
  const arr = [...list]
  switch (key) {
    case 'recente':
      return arr.sort(
        (a, b) =>
          new Date(b.data_inicio_inscricao).getTime() - new Date(a.data_inicio_inscricao).getTime(),
      )
    case 'fim_inscricao':
      return arr.sort(
        (a, b) =>
          new Date(a.data_fim_inscricao).getTime() - new Date(b.data_fim_inscricao).getTime(),
      )
    case 'salario_desc':
      return arr.sort((a, b) => b.salario - a.salario)
    case 'salario_asc':
      return arr.sort((a, b) => a.salario - b.salario)
    case 'ch_asc':
      return arr.sort((a, b) => a.carga_horaria - b.carga_horaria)
    case 'ch_desc':
      return arr.sort((a, b) => b.carga_horaria - a.carga_horaria)
    case 'vagas_desc':
      return arr.sort((a, b) => b.numero_vagas - a.numero_vagas)
    case 'pop_asc':
      return arr.sort((a, b) => a.habitantes_municipio - b.habitantes_municipio)
    case 'pop_desc':
      return arr.sort((a, b) => b.habitantes_municipio - a.habitantes_municipio)
    default:
      return arr
  }
}

export function parseFiltersFromSearchParams(sp: URLSearchParams): EditalListFilters {
  const f: EditalListFilters = {}
  const regiao = sp.get('regiao')
  if (regiao) f.regiao = regiao

  const regioes = sp.get('regioes')
  if (regioes) f.regioes = regioes.split(',').filter(Boolean)

  const estados = sp.get('estados')
  if (estados) f.estados = estados.split(',').filter(Boolean)

  const cargos = sp.get('cargos')
  if (cargos) f.cargos = cargos.split(',').filter(Boolean)

  const status = sp.get('status')
  if (status) f.status = status

  const chip = sp.get('chip') || sp.get('filtro')
  if (chip) f.chip = chip

  const q = sp.get('q')
  if (q) f.q = q

  const cro = sp.get('cro')
  if (cro === 'sim' || cro === 'nao' || cro === 'tanto') f.cro = cro

  const salMin = sp.get('salMin')
  if (salMin != null && salMin !== '') f.salMin = Number(salMin)
  const salMax = sp.get('salMax')
  if (salMax != null && salMax !== '') f.salMax = Number(salMax)

  const chMin = sp.get('chMin')
  if (chMin != null && chMin !== '') f.chMin = Number(chMin)
  const chMax = sp.get('chMax')
  if (chMax != null && chMax !== '') f.chMax = Number(chMax)

  const vagasMin = sp.get('vagasMin')
  if (vagasMin != null && vagasMin !== '') f.vagasMin = Number(vagasMin)

  if (sp.get('cadastroReserva') === '1') f.cadastroReserva = true

  const statusFlags = sp.get('statusFlags')
  if (statusFlags) f.statusFlags = statusFlags.split(',').filter(Boolean)

  const popMin = sp.get('popMin')
  if (popMin != null && popMin !== '') f.popMin = Number(popMin)
  const popMax = sp.get('popMax')
  if (popMax != null && popMax !== '') f.popMax = Number(popMax)

  return f
}

export function buildSearchParamsFromFilters(f: EditalListFilters): string {
  const p = new URLSearchParams()
  if (f.regiao) p.set('regiao', f.regiao)
  if (f.regioes?.length) p.set('regioes', f.regioes.join(','))
  if (f.estados?.length) p.set('estados', f.estados.join(','))
  if (f.cargos?.length) p.set('cargos', f.cargos.join(','))
  if (f.status) p.set('status', f.status)
  if (f.chip) p.set('chip', f.chip)
  if (f.q) p.set('q', f.q)
  if (f.cro && f.cro !== 'tanto') p.set('cro', f.cro)
  if (f.salMin != null) p.set('salMin', String(f.salMin))
  if (f.salMax != null) p.set('salMax', String(f.salMax))
  if (f.chMin != null) p.set('chMin', String(f.chMin))
  if (f.chMax != null) p.set('chMax', String(f.chMax))
  if (f.vagasMin != null) p.set('vagasMin', String(f.vagasMin))
  if (f.cadastroReserva) p.set('cadastroReserva', '1')
  if (f.statusFlags?.length) p.set('statusFlags', f.statusFlags.join(','))
  if (f.popMin != null) p.set('popMin', String(f.popMin))
  if (f.popMax != null) p.set('popMax', String(f.popMax))
  return p.toString()
}
