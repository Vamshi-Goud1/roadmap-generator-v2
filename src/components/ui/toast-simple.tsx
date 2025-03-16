import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  title?: string;
}

interface ToastContextType {
  showToast: (message: string, type: Toast['type'], title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-2 w-full max-w-[420px]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "relative flex flex-col gap-1 w-full rounded-xl p-4 pr-8 shadow-lg backdrop-blur-xl border animate-in slide-in-from-top-full",
              {
                "bg-black/90 border-primary/20 text-white": toast.type === 'info',
                "bg-black/90 border-green-500/20 text-white": toast.type === 'success',
                "bg-black/90 border-red-500/20 text-white": toast.type === 'error',
              }
            )}
          >
            {toast.title && (
              <div className="font-semibold text-lg">{toast.title}</div>
            )}
            <div className="text-sm text-gray-300">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute right-2 top-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}; 