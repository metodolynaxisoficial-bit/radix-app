"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Button } from '@/app/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState('login')

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="radix-card radix-card-hover w-full max-w-md border-[#E8ECF0] p-8"
      >
        <div className="mb-8 text-center">
          <h1
            className="text-[36px] font-semibold text-[#0D7C66]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            RADIX
          </h1>
          <p className="mt-1 text-[13px] text-text-secondary">Entre ou crie sua conta</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 grid w-full grid-cols-2 bg-[#F0F2F5]">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-l">E-mail</Label>
              <Input
                id="email-l"
                type="email"
                placeholder="voce@email.com"
                className="focus-ring-radix border-[#D1D9E0] bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha-l">Senha</Label>
              <Input
                id="senha-l"
                type="password"
                placeholder="••••••••"
                className="focus-ring-radix border-[#D1D9E0] bg-white"
              />
            </div>
            <Button type="button" className="mt-2 w-full" onClick={() => router.push("/dashboard")}>
              Entrar
            </Button>
          </TabsContent>

          <TabsContent value="cadastro" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" placeholder="Seu nome" className="focus-ring-radix border-[#D1D9E0] bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-c">E-mail</Label>
              <Input
                id="email-c"
                type="email"
                placeholder="voce@email.com"
                className="focus-ring-radix border-[#D1D9E0] bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel">Telefone</Label>
              <Input id="tel" placeholder="(00) 00000-0000" className="focus-ring-radix border-[#D1D9E0] bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha-c">Senha</Label>
              <Input
                id="senha-c"
                type="password"
                placeholder="••••••••"
                className="focus-ring-radix border-[#D1D9E0] bg-white"
              />
            </div>
            <Button type="button" className="mt-2 w-full" onClick={() => router.push("/dashboard")}>
              Criar conta
            </Button>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
