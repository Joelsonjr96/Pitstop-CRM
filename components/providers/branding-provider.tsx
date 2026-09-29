'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { Branding } from '@/config/branding';

const BrandingContext = createContext<Branding | undefined>(undefined);

export function BrandingProvider({ children, branding }: { children: ReactNode; branding: Branding }) {
  useEffect(() => {
    // Inject dynamic branding colors into CSS variables
    document.documentElement.style.setProperty('--primary', branding.primary);
    if (branding.accent) {
      document.documentElement.style.setProperty('--accent', branding.accent);
    }
  }, [branding]);

  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
