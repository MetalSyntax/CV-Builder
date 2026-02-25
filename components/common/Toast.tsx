import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />
  };

  const bgColors = {
    success: 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 border-l-green-500',
    error: 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 border-l-red-500',
    info: 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 border-l-blue-500',
    warning: 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 border-l-amber-500'
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-xl border border-l-4 shadow-2xl 
        transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${bgColors[toast.type]}
      `}
    >
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {toast.message}
      </p>
      <button
        onClick={onRemove}
        className="ml-auto p-1 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
};
