// src/contexts/LoadingContext.tsx
'use client'
import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
  isLoading: false,
  setLoading: (v: boolean) => {}
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
