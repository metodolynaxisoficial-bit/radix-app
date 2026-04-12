import { supabase } from '../lib/supabase'
import { editaisMock as mockEditais } from '../data/mockEditais'
import type { EditalPSS } from '../data/mockEditais'

let cache: EditalPSS[] | null = null
let inflight: Promise<EditalPSS[]> | null = null

export async function fetchEditais(): Promise<EditalPSS[]> {
  if (cache) return cache
  if (inflight) return inflight

  inflight = (async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('editais_pss')
          .select('*')
          .order('data_inicio_inscricao', { ascending: false })
        if (!error && data && data.length > 0) {
          cache = data as EditalPSS[]
          return cache
        }
      } catch {
        console.warn('Supabase indisponível, usando mock')
      }
    }
    cache = mockEditais
    return cache
  })()

  try {
    return await inflight
  } finally {
    inflight = null
  }
}
