"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { StaticImageData } from "next/image"
import radixLogo from "@/assets/radix-logo.png"

const logoSrc = typeof radixLogo === "string" ? radixLogo : (radixLogo as StaticImageData).src

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const t = window.setTimeout(() => router.replace("/login"), 2500)
    return () => window.clearTimeout(t)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFFFF] px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center text-center"
      >
        <img
          src={logoSrc}
          alt="RADIX"
          className="mx-auto h-auto w-[min(280px,72vw)] max-w-full object-contain"
        />
        <p className="mt-6 text-[14px] text-[#6B7A8D]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          A raiz de toda oportunidade
        </p>
      </motion.div>
    </div>
  )
}
