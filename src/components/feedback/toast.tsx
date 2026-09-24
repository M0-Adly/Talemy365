'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  title?: string
  message: string
  type: ToastType
}

export interface ToastOptions {
  type?: ToastType
  title?: string
  message: string
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
  addToast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
    }

    setToasts((prev) => {
      const next = [...prev, newToast]
      if (next.length > 3) return next.slice(next.length - 3)
      return next
    })

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      addToast({ message, type })
    },
    [addToast]
  )

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200'
      case 'error':
        return 'bg-rose-50 text-rose-900 border-rose-200'
      case 'info':
        return 'bg-blue-50 text-blue-900 border-blue-200'
    }
  }

  return (
    <ToastContext.Provider value={{ toast, addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px] gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex w-full items-start justify-between space-x-4 rounded-xl border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5',
              getTypeStyles(t.type)
            )}
          >
            <div>
              {t.title && <p className="text-sm font-bold">{t.title}</p>}
              <p className="text-sm font-medium">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md opacity-50 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2"
              aria-label="Close notification"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
