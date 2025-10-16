"use client"

import { useCallback, useState } from "react"

interface SelectionState<T> {
  isOpen: boolean
  selected: T | null
  openCreate: () => void
  openEdit: (item: T) => void
  close: () => void
  handleOpenChange: (open: boolean) => void
}

export function useSelectionState<T>(): SelectionState<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)

  const openCreate = useCallback(() => {
    setSelected(null)
    setIsOpen(true)
  }, [])

  const openEdit = useCallback((item: T) => {
    setSelected(item)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setSelected(null)
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        setSelected(null)
      }
    },
    [],
  )

  return {
    isOpen,
    selected,
    openCreate,
    openEdit,
    close,
    handleOpenChange,
  }
}
