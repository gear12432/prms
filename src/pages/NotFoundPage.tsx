import React from 'react';
import { AppButton } from '../components/common/AppButton';
import { AlertTriangle, Home } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col items-center justify-center p-6 max-w-md mx-auto text-center space-y-5">
      <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-black">Page Not Found</h1>
        <p className="text-xs text-gray-400">The requested screen or feature is unavailable.</p>
      </div>
      <AppButton variant="primary" fullWidth={true} onClick={onGoHome}>
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </AppButton>
    </div>
  );
};
