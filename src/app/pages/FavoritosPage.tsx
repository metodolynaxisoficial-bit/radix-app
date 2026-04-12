"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart } from 'lucide-react'
import { CardPSS } from '@/app/components/card-pss'
import { useFavorites } from '@/context/FavoritesContext'
import { Button } from '@/app/components/ui/button'
import { fetchEditais } from '@/services/editaisService'
import type { EditalPSS } from '@/data/mockEditais'

type FiltroFav = 'todos' | 'aberta' | 'encerrado'

export default function FavoritosPage() {
  const { ids } = useFavorites()
  const router = useRouter()
  const [chip, setChip] = useState<FiltroFav>('todos')
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

  const favoritos = useMemo(() => editais.filter((e) => ids.has(e.id)), [editais, ids])

  const filtrados = useMemo(() => {
    if (chip === 'aberta') return favoritos.filter((e) => e.status === 'Aberto')
    if (chip === 'encerrado') return favoritos.filter((e) => e.status === 'Encerrado')
    return favoritos
  }, [favoritos, chip])

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6 pb-28 text-text-primary lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="radix-section-title mb-6 text-[26px] font-semibold">Favoritos</h1>

        <div className="mb-6 flex snap-x gap-2 overflow-x-auto">
          {(
            [
              { id: 'todos' as const, label: 'Todos' },
              { id: 'aberta' as const, label: 'Inscrição Aberta' },
              { id: 'encerrado' as const, label: 'Encerrado' },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChip(c.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                chip === c.id
                  ? 'border-transparent bg-accent-gold-text text-white shadow-[0_2px_8px_rgba(13,124,102,0.25)]'
                  : 'border-[#E8ECF0] bg-[#F0F2F5] text-[#6B7A8D] hover:border-[#0D7C66]/30'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {favoritos.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Heart className="mb-4 h-24 w-24 text-divider" strokeWidth={1} />
            <p className="max-w-sm text-[15px] leading-relaxed text-text-secondary">
              Nenhum edital salvo ainda. Explore as oportunidades e salve as que mais interessam.
            </p>
            <Button type="button" className="mt-8" onClick={() => router.push("/dashboard/editais")}>
              Explorar editais
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtrados.length === 0 ? (
              <p className="py-8 text-center text-text-secondary">Nenhum edital nesta categoria.</p>
            ) : (
              filtrados.map((e, i) => <CardPSS key={e.id} edital={e} index={i} className="min-w-0" />)
            )}
          </div>
        )}

        <p className="mt-8 text-center text-[12px] text-text-secondary">
          <Link href="/dashboard" className="transition-colors hover:text-link">
            ← Painel
          </Link>
        </p>
      </div>
    </div>
  )
}
