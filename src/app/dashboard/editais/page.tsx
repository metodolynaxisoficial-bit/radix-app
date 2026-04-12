import { Suspense } from "react"
import EditaisPage from "@/app/pages/EditaisPage"

function EditaisFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary text-text-secondary">
      Carregando…
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<EditaisFallback />}>
      <EditaisPage />
    </Suspense>
  )
}
