import { useEffect, useState } from 'react'

/** Re-render periódico para contagem regressiva e barras de progresso */
export function useTick(ms = 30_000) {
  const [, setT] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setT((x) => x + 1), ms)
    return () => window.clearInterval(id)
  }, [ms])
}
