import React from 'react'
import { Loader } from 'lucide-react'

interface LoadingWindowProps {
  message?: string
}

export default function LoadingWindow({ message = 'Loading...' }: LoadingWindowProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="rounded-lg bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium text-foreground">{message}</p>
        </div>
      </div>
    </div>
  )
}