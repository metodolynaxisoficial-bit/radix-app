import type { EditalPSS } from './mockEditais'

export const REGIOES: EditalPSS['regiao'][] = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
  'Distrito Federal',
]

export const UFS_BR = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const

/** Opções de filtro por cargo (multi-select) */
export const CARGOS_FILTRO = [
  'Dentista',
  'Cirurgião-Dentista',
  'Odontólogo',
  'Odontólogo ESF',
  'Dentista PSF',
  'Dentista Plantonista',
  'Cirurgião-Dentista Bucomaxilofacial',
] as const
