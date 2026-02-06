"use client"

import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
}

const ToastContext = React.createContext<
  ((props: ToastProps) => void) | null
>(null)

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toast, setToast] = React.useState<ToastProps | null>(null)

  return (
    <ToastContext.Provider value={setToast}>
      {children}
      {toast ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border bg-background p-4 shadow">
          <div className="font-medium">{toast.title}</div>
          <div className="text-sm text-muted-foreground">
            {toast.description}
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return {
    toast: ctx,
  }
}
