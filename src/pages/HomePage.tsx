import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { WalletBalanceCard } from '../components/dashboard/WalletBalanceCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../hooks/useWallet';
import { User, ShieldCheck } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const { wallet, transactions } = useWallet();

  const firstName = userProfile?.firstName || 'User';
  const userId = userProfile?.userId || 'PL18753';
  const coinBalance = wallet?.coinBalance || 0;

  return (
    <MainLayout
      title="phoneG Dashboard"
      activeTab="home"
      onTabChange={(tab) => {
        if (tab === 'home') onNavigate('home');
        if (tab === 'send') onNavigate('send');
        if (tab === 'buy') onNavigate('buy');
        if (tab === 'receive') onNavigate('receive');
        if (tab === 'profile') onNavigate('profile');
      }}
      onNotificationClick={() => alert('Notifications: All wallet systems operational.')}
    >
      <div className="space-y-5 animate-fade-in">
        
        {/* User Greeting Bar */}
        <div className="flex items-center justify-between bg-[#111111]/80 backdrop-blur-md p-3.5 rounded-2xl border border-gray-800">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#202778] to-[#397EF5] flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/20">
              {userProfile?.profilePhotoPath ? (
                <img src={userProfile.profilePhotoPath} alt={firstName} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span>{firstName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Hello, {firstName}!</h2>
              <div className="flex items-center space-x-1.5 text-[11px] text-gray-400">
                <span className="font-mono text-blue-300 font-bold">{userId}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('profile')}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-gray-200 transition-colors"
          >
            Profile
          </button>
        </div>

        {/* Balance Card */}
        <WalletBalanceCard
          coinBalance={coinBalance}
          userId={userId}
          onBuyClick={() => onNavigate('buy')}
          onSendClick={() => onNavigate('send')}
          onReceiveClick={() => onNavigate('receive')}
        />

        {/* Quick Services Grid */}
        <QuickActions
          onBuyCoins={() => onNavigate('buy')}
          onSendCoins={() => onNavigate('send')}
          onReceiveCoins={() => onNavigate('receive')}
          onTransactions={() => onNavigate('transactions')}
          onProfile={() => onNavigate('profile')}
          onKycStatus={() => onNavigate('kyc-status')}
          onSupport={() => alert('phoneG Help & Support: Email support@phoneg.app or call 1800-123-PHONEG')}
        />

        {/* Recent Activity */}
        <RecentTransactions
          transactions={transactions}
          currentUid={userProfile?.uid || ''}
          onViewAll={() => onNavigate('transactions')}
        />

      </div>
    </MainLayout>
  );
};
