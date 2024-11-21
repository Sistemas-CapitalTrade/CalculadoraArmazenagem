'use client'

import React, { useEffect, useRef } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorWindowProps {
  message: string
  onContinue: () => void
}

export default function ErrorWindow({ message, onContinue }: ErrorWindowProps) {
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const errorElement = errorRef.current
    if (errorElement) {
      errorElement.focus()
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
    }
  }, [])

  return (
    <div 
      ref={errorRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      tabIndex={-1}
      aria-modal="true"
      role="alertdialog"
    >
      <div className="rounded-lg bg-card p-8 shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-foreground">Error</h2>
          <p className="text-center text-muted-foreground">{message}</p>
          <Button onClick={onContinue} className="w-full">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}