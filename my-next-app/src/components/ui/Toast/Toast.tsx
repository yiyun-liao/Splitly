'use client'

import { Toaster } from 'react-hot-toast'
import "./Toast.css"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: '12px',
          padding: '8px 8px 8px 16px',
          fontSize: '16px',
        },
        success: {
          style: {
            background: '#FFFFFF',
            color: '#2e67a7',
            border: '1px solid #e0eaf5',
          },
          iconTheme: {
            primary: '#2e67a7',
            secondary: '#e0eaf5',
          },
        },
        error: {
          style: {
            background: 'oklch(93.6% .032 17.717)',
            color: 'oklch(63.7% .237 25.331)',
            border: '1px solid oklch(88.5% .062 18.334)',
          },
          iconTheme: {
            primary: 'oklch(63.7% .237 25.331)',
            secondary: 'oklch(88.5% .062 18.334)',
          },
        },
      }}
    />
  )
}
