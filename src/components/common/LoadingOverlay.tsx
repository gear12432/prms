import React from 'react';
import { CircularProgress } from './CircularProgress';

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, message = 'Processing securely...' }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl p-6 max-w-xs w-full flex flex-col items-center justify-center space-y-4 shadow-2xl border border-gray-100 text-center animate-scale-up">
        <CircularProgress size={56} strokeWidth={5} color="#397EF5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#20244F]">Please Wait</h4>
          <p className="text-xs text-gray-500 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};
