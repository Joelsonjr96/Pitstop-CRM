'use client';

import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastProps } from './toast';

interface ToasterContextType {
  toast: (props: Omit<ToastProps, 'onClose'>) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<({ id: number } & Omit<ToastProps, 'onClose'>)[]>([]);

  const toast = (props: Omit<ToastProps, 'onClose'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...props }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToasterContext.Provider value={{ toast }}>
      {children}
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts((prev) => prev.filter((to) => to.id !== t.id))} />
      ))}
    </ToasterContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToasterContext);
  if (!context) throw new Error('useToast must be used within a ToasterProvider');
  return context;
}
