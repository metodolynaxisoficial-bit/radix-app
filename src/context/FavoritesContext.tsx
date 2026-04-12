import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'radix-favoritos'

type FavoritesContextValue = {
  ids: Set<string>
  toggle: (id: string) => void
  isFavorite: (id: string) => boolean
  exportJson: () => string
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function loadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => loadIds())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  }, [ids])

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isFavorite = useCallback((id: string) => ids.has(id), [ids])

  const exportJson = useCallback(() => JSON.stringify([...ids], null, 2), [ids])

  const value = useMemo(
    () => ({ ids, toggle, isFavorite, exportJson }),
    [ids, toggle, isFavorite, exportJson],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
