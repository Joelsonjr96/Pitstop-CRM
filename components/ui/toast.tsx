import React from 'react';

export interface ToastProps {
  message: string;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-slate-800 text-white',
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${styles[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold hover:text-slate-200">×</button>
    </div>
  );
}
