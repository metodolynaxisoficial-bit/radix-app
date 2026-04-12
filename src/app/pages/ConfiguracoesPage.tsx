"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import { Switch } from '@/app/components/ui/switch'
import { Label } from '@/app/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog'
import { useTheme } from '@/context/ThemeContext'
import { useFavorites } from '@/context/FavoritesContext'
import { fetchEditais } from '@/services/editaisService'
import type { EditalPSS } from '@/data/mockEditais'

export default function ConfiguracoesPage() {
  const { dark, setDark } = useTheme()
  const { exportJson } = useFavorites()
  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
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

  const exportarFavoritos = () => {
    const ids = JSON.parse(exportJson()) as string[]
    const data = editais.filter((e) => ids.includes(e.id))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'radix-favoritos.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6 pb-28 text-text-primary lg:px-8">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-[26px] font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Configurações
        </h1>

        <div className="radix-card radix-card-hover overflow-hidden">
          <div className="flex items-center justify-between border-b border-bg-card-border px-5 py-4">
            <div>
              <p className="font-medium text-text-primary">Aparência</p>
              <p className="text-[12px] text-text-secondary">Ative para reduzir brilho (interface permanece clara)</p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="theme-dark" className="text-[11px] text-text-secondary">
                Escuro
              </Label>
              <Switch id="theme-dark" checked={dark} onCheckedChange={setDark} />
            </div>
          </div>

          <Link
            href="/dashboard/alertas"
            className="flex items-center justify-between border-b border-bg-card-border px-5 py-4 transition-colors hover:bg-bg-primary/50"
          >
            <div>
              <p className="font-medium text-text-primary">Notificações</p>
              <p className="text-[12px] text-text-secondary">Central de alertas</p>
            </div>
            <ChevronRight className="h-5 w-5 text-text-secondary" />
          </Link>

          <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-bg-card-border px-5 py-4 text-left transition-colors hover:bg-bg-primary/50"
              >
                <span className="font-medium text-text-primary">Termos de uso</span>
                <ChevronRight className="h-5 w-5 text-text-secondary" />
              </button>
            </DialogTrigger>
            <DialogContent className="border-bg-card-border bg-bg-card text-text-primary">
              <DialogHeader>
                <DialogTitle>Termos de uso</DialogTitle>
              </DialogHeader>
              <p className="text-[14px] text-text-secondary">
                Texto dos termos será disponibilizado em versões futuras do aplicativo.
              </p>
            </DialogContent>
          </Dialog>

          <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-bg-card-border px-5 py-4 text-left transition-colors hover:bg-bg-primary/50"
              >
                <span className="font-medium text-text-primary">Política de privacidade</span>
                <ChevronRight className="h-5 w-5 text-text-secondary" />
              </button>
            </DialogTrigger>
            <DialogContent className="border-bg-card-border bg-bg-card text-text-primary">
              <DialogHeader>
                <DialogTitle>Política de privacidade</DialogTitle>
              </DialogHeader>
              <p className="text-[14px] text-text-secondary">
                Política de privacidade em elaboração. Dados mock permanecem apenas no seu navegador.
              </p>
            </DialogContent>
          </Dialog>

          <button
            type="button"
            onClick={exportarFavoritos}
            className="flex w-full items-center justify-between border-b border-bg-card-border px-5 py-4 text-left transition-colors hover:bg-bg-primary/50"
          >
            <div>
              <p className="font-medium text-text-primary">Exportar favoritos</p>
              <p className="text-[12px] text-text-secondary">Download JSON com editais salvos</p>
            </div>
            <ChevronRight className="h-5 w-5 text-text-secondary" />
          </button>

          <div className="px-5 py-4">
            <p className="font-medium text-text-primary">Sobre</p>
            <p className="mt-1 text-[13px] text-text-secondary">Versão 1.0.0</p>
            <p className="text-[13px] text-text-secondary">Contato: contato@radix.app (fictício)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-text-secondary">
          <Label className="text-text-secondary">Dica:</Label>
          <span>favoritos e perfil ficam no armazenamento local do navegador.</span>
        </div>
      </div>
    </div>
  )
}
