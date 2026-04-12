"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from 'sonner'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { Switch } from '@/app/components/ui/switch'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Button } from '@/app/components/ui/button'
import { useProfile, type ProfileData } from '@/context/ProfileContext'
import { REGIOES, UFS_BR } from '@/data/constants'

export default function PerfilPage() {
  const { profile, saveProfile } = useProfile()
  const [form, setForm] = useState<ProfileData>(profile)

  const set = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
  }

  const toggleUf = (uf: string) => {
    const s = new Set(form.estadosInteresse)
    if (s.has(uf)) s.delete(uf)
    else s.add(uf)
    set('estadosInteresse', [...s])
  }

  const toggleReg = (r: string) => {
    const s = new Set(form.regioesPrioritarias)
    if (s.has(r)) s.delete(r)
    else s.add(r)
    set('regioesPrioritarias', [...s])
  }

  const salvar = () => {
    saveProfile(form)
    toast.success('Perfil salvo com sucesso.')
  }

  const inicial = form.nome.trim().charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6 pb-28 text-text-primary lg:px-8">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent-gold-text text-2xl font-bold text-accent-gold-text"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {inicial}
          </div>
          <h1 className="text-[26px] font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Meu perfil
          </h1>
        </div>

        <section className="radix-card radix-card-hover space-y-4 p-5">
          <div>
            <Label>Nome</Label>
            <Input
              value={form.nome}
              onChange={(e) => set('nome', e.target.value)}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              value={form.telefone}
              onChange={(e) => set('telefone', e.target.value)}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input
              value={form.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
        </section>

        <section className="radix-card radix-card-hover space-y-3 p-5">
          <h2 className="radix-label-caps font-semibold">Estados de interesse</h2>
          <div className="flex flex-wrap gap-2">
            {UFS_BR.map((uf) => (
              <button
                key={uf}
                type="button"
                onClick={() => toggleUf(uf)}
                className={`rounded-lg border px-3 py-1 text-[12px] font-medium ${
                  form.estadosInteresse.includes(uf)
                    ? 'border-accent-gold-text bg-primary-light text-accent-gold-text'
                    : 'border-[#E8ECF0] bg-[#F0F2F5] text-text-secondary'
                }`}
              >
                {uf}
              </button>
            ))}
          </div>
        </section>

        <section className="radix-card radix-card-hover space-y-3 p-5">
          <h2 className="radix-label-caps font-semibold">Regiões prioritárias</h2>
          {REGIOES.map((r) => (
            <label key={r} className="flex items-center gap-2 text-[14px]">
              <Checkbox
                checked={form.regioesPrioritarias.includes(r)}
                onCheckedChange={() => toggleReg(r)}
              />
              {r}
            </label>
          ))}
        </section>

        <section className="radix-card radix-card-hover grid grid-cols-2 gap-4 p-5">
          <div>
            <Label>Salário desejado (mín. R$)</Label>
            <Input
              type="number"
              value={form.salarioMin}
              onChange={(e) => set('salarioMin', Number(e.target.value))}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label>Salário desejado (máx. R$)</Label>
            <Input
              type="number"
              value={form.salarioMax}
              onChange={(e) => set('salarioMax', Number(e.target.value))}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label>Carga horária mín. (h)</Label>
            <Input
              type="number"
              value={form.chMin}
              onChange={(e) => set('chMin', Number(e.target.value))}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
          <div>
            <Label>Carga horária máx. (h)</Label>
            <Input
              type="number"
              value={form.chMax}
              onChange={(e) => set('chMax', Number(e.target.value))}
              className="focus-ring-radix mt-1 border-[#D1D9E0] bg-white"
            />
          </div>
        </section>

        <div className="radix-card radix-card-hover flex items-center justify-between p-5">
          <Label>Interesse em cadastro de reserva</Label>
          <Switch
            checked={form.interesseCadastroReserva}
            onCheckedChange={(v) => set('interesseCadastroReserva', v)}
          />
        </div>

        <Button type="button" className="w-full" onClick={salvar}>
          Salvar perfil
        </Button>

        <p className="text-center text-[13px] text-text-secondary">
          <Link href="/dashboard/configuracoes" className="transition-colors hover:text-link">
            Configurações do app →
          </Link>
        </p>
      </div>
    </div>
  )
}
