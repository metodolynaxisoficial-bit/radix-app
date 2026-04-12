import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

/** Filtro rápido do header do dashboard (sincronizado com navegação para /editais) */
type FiltersContextValue = {
  dashboardQuery: string
  setDashboardQuery: (q: string) => void
}

const FiltersContext = createContext<FiltersContextValue | null>(null)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [dashboardQuery, setDashboardQuery] = useState('')

  const value = useMemo(
    () => ({ dashboardQuery, setDashboardQuery }),
    [dashboardQuery],
  )

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}

export function useFilters() {
  const ctx = useContext(FiltersContext)
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider')
  return ctx
}
