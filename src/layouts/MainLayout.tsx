import React from 'react';
import { AppHeader } from '../components/common/AppHeader';
import { Home, Send, PlusCircle, QrCode, User } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  activeTab?: 'home' | 'send' | 'buy' | 'receive' | 'profile';
  onTabChange?: (tab: 'home' | 'send' | 'buy' | 'receive' | 'profile') => void;
  showNotification?: boolean;
  onNotificationClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'phoneG',
  showBack = false,
  onBack,
  activeTab = 'home',
  onTabChange,
  showNotification = true,
  onNotificationClick
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'send', label: 'Send', icon: Send },
    { id: 'buy', label: 'Buy', icon: PlusCircle },
    { id: 'receive', label: 'Receive', icon: QrCode },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col max-w-md mx-auto relative shadow-2xl border-x border-gray-800">
      <AppHeader
        title={title}
        showBack={showBack}
        onBack={onBack}
        showNotification={showNotification}
        onNotificationClick={onNotificationClick}
      />

      <main className="flex-1 p-4 pb-24 overflow-y-auto z-10">
        {children}
      </main>

      {/* Bottom Mobile Navigation */}
      {onTabChange && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md w-full bg-[#111111]/95 backdrop-blur-md border-t border-gray-800/80 z-40 px-3 py-2 flex items-center justify-around shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`flex flex-col items-center justify-center space-y-1 py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
                  isActive ? 'text-[#397EF5] bg-[#397EF5]/10 font-bold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
