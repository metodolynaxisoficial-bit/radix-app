"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Heart, Home, Search, User } from "lucide-react"
import { diasRestantesInscricao, type EditalPSS } from "@/data/mockEditais"
import { cn } from "@/app/components/ui/utils"
import { useEffect, useMemo, useState } from "react"
import { fetchEditais } from "@/services/editaisService"

function useAlertCount(editais: EditalPSS[]): number {
  return useMemo(
    () =>
      editais.filter((e) => {
        if (e.status !== "Aberto") return false
        const d = diasRestantesInscricao(e)
        return d > 0 && d <= 7
      }).length,
    [editais],
  )
}

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/busca", label: "Busca", icon: Search },
  { href: "/dashboard/favoritos", label: "Favoritos", icon: Heart },
  { href: "/dashboard/alertas", label: "Alertas", icon: Bell },
  { href: "/dashboard/perfil", label: "Perfil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
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

  const n = useAlertCount(editais)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-divider bg-white/95 backdrop-blur-[22px] lg:hidden">
      <div className="flex items-center justify-around px-2 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-1",
                active ? "text-[#0D7C66]" : "text-text-tertiary",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              <span className="max-w-full truncate text-[10px] font-medium uppercase tracking-wider">
                {label}
              </span>
              {href === "/dashboard/alertas" && n > 0 && (
                <span className="absolute right-2 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-urgency-red px-1 text-[9px] font-bold text-white">
                  {n > 9 ? "9+" : n}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
