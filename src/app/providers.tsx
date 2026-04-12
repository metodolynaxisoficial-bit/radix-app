"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/context/ThemeContext"
import { FavoritesProvider } from "@/context/FavoritesContext"
import { ProfileProvider } from "@/context/ProfileContext"
import { FiltersProvider } from "@/context/FiltersContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <ProfileProvider>
          <FiltersProvider>{children}</FiltersProvider>
        </ProfileProvider>
      </FavoritesProvider>
    </ThemeProvider>
  )
}
