import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ProfileData = {
  nome: string
  email: string
  telefone: string
  whatsapp: string
  estadosInteresse: string[]
  regioesPrioritarias: string[]
  salarioMin: number
  salarioMax: number
  chMin: number
  chMax: number
  interesseCadastroReserva: boolean
}

const STORAGE_KEY = 'radix-perfil'

const defaultProfile: ProfileData = {
  nome: 'Dra. Marina Alves',
  email: 'marina.alves@email.com',
  telefone: '(81) 99999-0000',
  whatsapp: '(81) 98888-1111',
  estadosInteresse: ['PE', 'SP', 'SC'],
  regioesPrioritarias: ['Nordeste', 'Sudeste'],
  salarioMin: 4500,
  salarioMax: 12000,
  chMin: 20,
  chMax: 40,
  interesseCadastroReserva: true,
}

type ProfileContextValue = {
  profile: ProfileData
  setProfile: (p: Partial<ProfileData>) => void
  saveProfile: (p: ProfileData) => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

function loadProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultProfile }
    return { ...defaultProfile, ...JSON.parse(raw) } as ProfileData
  } catch {
    return { ...defaultProfile }
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ProfileData>(loadProfile)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const setProfile = useCallback((p: Partial<ProfileData>) => {
    setProfileState((prev) => ({ ...prev, ...p }))
  }, [])

  const saveProfile = useCallback((p: ProfileData) => {
    setProfileState(p)
  }, [])

  const value = useMemo(
    () => ({ profile, setProfile, saveProfile }),
    [profile, setProfile, saveProfile],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
