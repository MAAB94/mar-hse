import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useHse } from '../../context/HseContext';

export const NotificationToast: React.FC = () => {
  const { activeToast, clearToast } = useHse();

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" aria-hidden="true" />;
      default:
        return <Info className="h-5 w-5 text-indigo-500 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900"
    >
      {getIcon()}
      <div className="flex-1 text-xs font-medium text-slate-800 dark:text-slate-100">
        {activeToast.message}
      </div>
      <button
        type="button"
        onClick={clearToast}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
