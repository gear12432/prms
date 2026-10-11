import React from 'react';
import { ArrowLeft, MoreVertical, Bell, ShieldCheck } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenuClick?: () => void;
  showNotification?: boolean;
  onNotificationClick?: () => void;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'phoneG',
  showBack = false,
  onBack,
  showMenu = false,
  onMenuClick,
  showNotification = false,
  onNotificationClick,
  rightAction
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111111] text-white px-4 py-3.5 flex items-center justify-between border-b border-gray-800/60 shadow-md transition-all">
      <div className="flex items-center space-x-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-2">
          {!showBack && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#202778] to-[#397EF5] flex items-center justify-center font-bold text-white shadow-inner">
              <span className="text-sm tracking-tight font-extrabold">pG</span>
            </div>
          )}
          <h1 className="text-lg font-bold tracking-tight text-white line-clamp-1">{title}</h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {rightAction}
        {showNotification && (
          <button
            onClick={onNotificationClick}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all relative text-gray-200"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#397EF5] rounded-full animate-pulse" />
          </button>
        )}
        {showMenu && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-gray-200"
            aria-label="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
