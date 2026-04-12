"use client"

import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { BottomNav } from "@/app/components/bottom-nav"
import { Toaster } from "@/app/components/ui/sonner"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="min-h-screen pb-24 lg:pb-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <BottomNav />
      <Toaster position="top-center" richColors />
    </div>
  )
}
