"use client"

import type React from "react"
import { useEffect } from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function NavLink({ href, children, icon }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)
  const router = useRouter()

  useEffect(() => {
    router.prefetch(href)
  }, [href, router])

  return (
    <Link href={href} className="relative">
      <motion.div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        )}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span className="font-medium">{children}</span>
      </motion.div>
    </Link>
  )
}
