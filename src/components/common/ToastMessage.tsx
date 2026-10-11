import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({
  type,
  message,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgStyles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-[#202778] text-white'
  };

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-[90%] px-4 py-3 rounded-xl shadow-xl flex items-center justify-between space-x-3 transition-all animate-slide-up ${bgStyles[type]}`}>
      <div className="flex items-center space-x-2.5 min-w-0">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-xs font-semibold leading-tight truncate">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
