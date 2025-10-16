"use client"

import { cloneElement, isValidElement, type ReactElement } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactElement
  description?: string
  index: number
}

export function StatCard({ title, value, icon, description, index }: StatCardProps) {
  let renderedIcon: ReactElement | null = null

  if (isValidElement<{ className?: string }>(icon)) {
    renderedIcon = cloneElement(icon, {
      className: cn("w-7 h-7 text-primary", icon.props.className),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300 shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">{title}</p>
              <h3 className="text-4xl font-bold text-foreground mb-2 font-serif">{value}</h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              {renderedIcon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
