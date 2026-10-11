import React from 'react';
import { PlusCircle, Send, QrCode, History, User, ShieldCheck, HelpCircle, Settings } from 'lucide-react';

interface QuickActionsProps {
  onBuyCoins: () => void;
  onSendCoins: () => void;
  onReceiveCoins: () => void;
  onTransactions: () => void;
  onProfile: () => void;
  onKycStatus: () => void;
  onSupport: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onBuyCoins,
  onSendCoins,
  onReceiveCoins,
  onTransactions,
  onProfile,
  onKycStatus,
  onSupport
}) => {
  const actions = [
    { label: 'Buy Coins', icon: PlusCircle, color: 'text-blue-500 bg-blue-50', onClick: onBuyCoins },
    { label: 'Send Coins', icon: Send, color: 'text-emerald-500 bg-emerald-50', onClick: onSendCoins },
    { label: 'Receive Coins', icon: QrCode, color: 'text-amber-500 bg-amber-50', onClick: onReceiveCoins },
    { label: 'History', icon: History, color: 'text-purple-500 bg-purple-50', onClick: onTransactions },
    { label: 'My Profile', icon: User, color: 'text-indigo-500 bg-indigo-50', onClick: onProfile },
    { label: 'KYC Status', icon: ShieldCheck, color: 'text-teal-500 bg-teal-50', onClick: onKycStatus },
    { label: 'Support', icon: HelpCircle, color: 'text-rose-500 bg-rose-50', onClick: onSupport },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 text-left space-y-4">
      <h3 className="text-sm font-extrabold text-[#20244F] uppercase tracking-wider">Quick Services</h3>
      
      <div className="grid grid-cols-4 gap-3">
        {actions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center space-y-2 p-2.5 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all text-center group"
            >
              <div className={`p-3 rounded-2xl ${item.color} group-hover:scale-105 transition-transform shadow-xs`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
