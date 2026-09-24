'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface DialogContextValue {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  dialogRef: React.RefObject<HTMLDialogElement | null>
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined)

const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) throw new Error('Dialog components must be used within a Dialog')
  return context
}

export function Dialog({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const dialogRef = useRef<HTMLDialogElement>(null)

  const setIsOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      if (!dialog.open) dialog.showModal()
    } else {
      if (dialog.open) dialog.close()
    }
  }, [isOpen])

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen, dialogRef }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const { setIsOpen } = useDialogContext()

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void
    }>
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        setIsOpen(true)
        child.props?.onClick?.(e)
      },
    })
  }

  return (
    <button type="button" onClick={() => setIsOpen(true)}>
      {children}
    </button>
  )
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { dialogRef, setIsOpen } = useDialogContext()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => setIsOpen(false)
    const handleBackdropClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect()
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      if (!isInDialog) {
        dialog.close()
      }
    }

    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('click', handleBackdropClick)

    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('click', handleBackdropClick)
    }
  }, [setIsOpen, dialogRef])

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'backdrop:bg-black/50 backdrop:backdrop-blur-xs m-auto max-w-lg w-full rounded-2xl bg-white p-0 shadow-xl border border-gray-200',
        'open:animate-in open:fade-in-0 open:zoom-in-95',
        className
      )}
    >
      <div className="p-6">{children}</div>
    </dialog>
  )
}

export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left mb-4',
        className
      )}
    >
      {children}
    </div>
  )
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn('text-lg font-bold leading-none tracking-tight text-gray-900', className)}
    >
      {children}
    </h2>
  )
}

export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <p className={cn('text-sm text-gray-600', className)}>{children}</p>
}

export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-6',
        className
      )}
    >
      {children}
    </div>
  )
}

export function DialogClose({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const { setIsOpen } = useDialogContext()

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void
    }>
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        setIsOpen(false)
        child.props?.onClick?.(e)
      },
    })
  }

  return (
    <button type="button" onClick={() => setIsOpen(false)}>
      {children}
    </button>
  )
}
