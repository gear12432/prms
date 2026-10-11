import React from 'react';
import { formatCoins, formatCurrency } from '../../lib/formatters';
import { COIN_CONVERSION_RATE_INR } from '../../lib/constants';
import { Coins, Plus, Send, QrCode, TrendingUp } from 'lucide-react';

interface WalletBalanceCardProps {
  coinBalance: number;
  userId: string;
  onBuyClick: () => void;
  onSendClick: () => void;
  onReceiveClick: () => void;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  coinBalance,
  userId,
  onBuyClick,
  onSendClick,
  onReceiveClick
}) => {
  const inrEquivalent = coinBalance * COIN_CONVERSION_RATE_INR;

  return (
    <div className="w-full bg-gradient-to-br from-[#202778] via-[#2a3294] to-[#397EF5] text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-5 border border-white/10">
      
      {/* Decorative background glow circle */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl">
            <Coins className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Total Coin Balance</p>
            <p className="text-xs font-semibold text-white/80 font-mono">ID: {userId}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-amber-400/20 border border-amber-300/40 text-amber-300 rounded-full text-[10px] font-extrabold flex items-center space-x-1">
          <TrendingUp className="w-3 h-3" />
          <span>1 Coin = ₹{COIN_CONVERSION_RATE_INR}</span>
        </span>
      </div>

      {/* Balance Amount Display */}
      <div className="space-y-1 text-left">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
            {formatCoins(coinBalance)}
          </span>
          <span className="text-base font-bold text-blue-200">COINS</span>
        </div>
        <p className="text-xs font-semibold text-white/70">
          ≈ {formatCurrency(inrEquivalent)} INR
        </p>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <button
          onClick={onBuyClick}
          className="bg-white hover:bg-gray-100 text-[#202778] font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-[#397EF5]" />
          <span>Buy Coins</span>
        </button>

        <button
          onClick={onSendClick}
          className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 backdrop-blur-md active:scale-95 transition-all border border-white/20"
        >
          <Send className="w-4 h-4 text-emerald-300" />
          <span>Send</span>
        </button>

        <button
          onClick={onReceiveClick}
          className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 backdrop-blur-md active:scale-95 transition-all border border-white/20"
        >
          <QrCode className="w-4 h-4 text-amber-300" />
          <span>Receive</span>
        </button>
      </div>
    </div>
  );
};
