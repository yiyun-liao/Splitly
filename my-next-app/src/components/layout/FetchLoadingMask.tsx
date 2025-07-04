'use client'

import { ReactNode } from 'react'
import { useLoading } from '@/contexts/LoadingContext'
import { ToastProvider } from '@/components/ui/Toast/Toast'

export function FetchLoadingMask({ children }: { children: ReactNode }) {
  const { isLoading } = useLoading()

  return (
    <>
      {/* ToastProvider 放这保证永远在最上层 */}
      <ToastProvider />

      <div
        className="relative"
        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
      >
        {children}
      </div>

      {isLoading && (
        <div
          className="fixed inset-0 bg-black/30 z-[9999]"
          style={{ pointerEvents: 'auto' }} //避免點擊
        />
      )}
    </>
  )
}
