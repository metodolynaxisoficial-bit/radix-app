"use client"

import { useEffect, useState } from "react"
import { toast } from 'sonner'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { Switch } from '@/app/components/ui/switch'
import { Checkbox } from '@/app/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import { Button } from '@/app/components/ui/button'

const STORAGE = 'radix-alertas-prefs'

type Prefs = {
  whatsapp: boolean
  sms: boolean
  email: boolean
  push: boolean
  whatsappNum: string
  smsNum: string
  emailAddr: string
  pushToken: string
  tipos: Record<string, boolean>
  frequencia: 'realtime' | 'diario' | 'semanal'
}

const defaultPrefs: Prefs = {
  whatsapp: true,
  sms: false,
  email: true,
  push: false,
  whatsappNum: '',
  smsNum: '',
  emailAddr: '',
  pushToken: '',
  tipos: {
    novo_pss: true,
    abertura: true,
    prazo: true,
    resultado: false,
    suspensao: true,
  },
  frequencia: 'diario',
}

const TIPOS = [
  { id: 'novo_pss', label: 'Novo PSS publicado' },
  { id: 'abertura', label: 'Abertura de inscrições' },
  { id: 'prazo', label: 'Prazo encerrando (7 dias)' },
  { id: 'resultado', label: 'Resultado / convocação' },
  { id: 'suspensao', label: 'Suspensão ou retificação' },
] as const

export default function AlertasPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE)
      if (raw) setPrefs({ ...defaultPrefs, ...JSON.parse(raw) })
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(prefs))
  }, [prefs])

  const salvar = () => {
    toast.success('Preferências de alerta salvas com sucesso.')
  }

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6 pb-28 text-text-primary lg:px-8">
      <div className="mx-auto max-w-xl space-y-8">
        <h1 className="text-[26px] font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Central de alertas
        </h1>

        <section className="space-y-4 rounded-2xl border border-bg-card-border bg-bg-card p-5">
          <h2 className="text-[14px] font-semibold text-text-secondary">Canais</h2>
          <div className="flex items-center justify-between">
            <Label>WhatsApp</Label>
            <Switch
              checked={prefs.whatsapp}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, whatsapp: v }))}
            />
          </div>
          {prefs.whatsapp && (
            <Input
              placeholder="Número com DDD"
              value={prefs.whatsappNum}
              onChange={(e) => setPrefs((p) => ({ ...p, whatsappNum: e.target.value }))}
              className="bg-bg-primary"
            />
          )}
          <div className="flex items-center justify-between">
            <Label>SMS</Label>
            <Switch checked={prefs.sms} onCheckedChange={(v) => setPrefs((p) => ({ ...p, sms: v }))} />
          </div>
          {prefs.sms && (
            <Input
              placeholder="Celular"
              value={prefs.smsNum}
              onChange={(e) => setPrefs((p) => ({ ...p, smsNum: e.target.value }))}
              className="bg-bg-primary"
            />
          )}
          <div className="flex items-center justify-between">
            <Label>E-mail</Label>
            <Switch checked={prefs.email} onCheckedChange={(v) => setPrefs((p) => ({ ...p, email: v }))} />
          </div>
          {prefs.email && (
            <Input
              type="email"
              placeholder="seu@email.com"
              value={prefs.emailAddr}
              onChange={(e) => setPrefs((p) => ({ ...p, emailAddr: e.target.value }))}
              className="bg-bg-primary"
            />
          )}
          <div className="flex items-center justify-between">
            <Label>Push</Label>
            <Switch checked={prefs.push} onCheckedChange={(v) => setPrefs((p) => ({ ...p, push: v }))} />
          </div>
          {prefs.push && (
            <Input
              placeholder="Token ou ID do dispositivo"
              value={prefs.pushToken}
              onChange={(e) => setPrefs((p) => ({ ...p, pushToken: e.target.value }))}
              className="bg-bg-primary"
            />
          )}
        </section>

        <section className="space-y-3 rounded-2xl border border-bg-card-border bg-bg-card p-5">
          <h2 className="text-[14px] font-semibold text-text-secondary">Tipos de alerta</h2>
          {TIPOS.map((t) => (
            <label key={t.id} className="flex items-center gap-2 text-[14px]">
              <Checkbox
                checked={prefs.tipos[t.id] ?? false}
                onCheckedChange={(c) =>
                  setPrefs((p) => ({
                    ...p,
                    tipos: { ...p.tipos, [t.id]: Boolean(c) },
                  }))
                }
              />
              {t.label}
            </label>
          ))}
        </section>

        <section className="space-y-3 rounded-2xl border border-bg-card-border bg-bg-card p-5">
          <h2 className="text-[14px] font-semibold text-text-secondary">Frequência</h2>
          <RadioGroup
            value={prefs.frequencia}
            onValueChange={(v) =>
              setPrefs((p) => ({ ...p, frequencia: v as Prefs['frequencia'] }))
            }
            className="space-y-2"
          >
            <label className="flex items-center gap-2 text-[14px]">
              <RadioGroupItem value="realtime" id="f1" />
              Em tempo real
            </label>
            <label className="flex items-center gap-2 text-[14px]">
              <RadioGroupItem value="diario" id="f2" />
              Diário
            </label>
            <label className="flex items-center gap-2 text-[14px]">
              <RadioGroupItem value="semanal" id="f3" />
              Semanal
            </label>
          </RadioGroup>
        </section>

        <Button type="button" className="w-full" onClick={salvar}>
          Salvar preferências
        </Button>
      </div>
    </div>
  )
}
