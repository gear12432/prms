import React from 'react';
import { AppButton } from '../components/common/AppButton';
import { Coins, ShieldCheck, Zap, ArrowRight, MoreVertical } from 'lucide-react';

interface SplashPageProps {
  onGetStarted: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between p-5 max-w-md mx-auto relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#397EF5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#202778]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between py-2 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#202778] to-[#397EF5] flex items-center justify-center font-bold text-white shadow-md">
            <span className="text-xs font-black">pG</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-white/90">Welcome to phoneG</span>
        </div>
        <button className="p-2 rounded-full hover:bg-white/10 text-gray-300">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Main Illustration & Copy */}
      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-8 z-10 py-8">
        
        {/* Wallet & Coins Illustration */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#202778] via-[#397EF5]/40 to-transparent flex items-center justify-center border border-white/10 shadow-2xl relative animate-pulse">
            <div className="w-36 h-36 rounded-full bg-[#111111] flex flex-col items-center justify-center p-4 border border-blue-500/30 shadow-inner">
              <Coins className="w-16 h-16 text-amber-300 animate-bounce" />
              <div className="mt-2 text-xs font-black tracking-widest text-[#397EF5] font-mono">phoneG COINS</div>
            </div>
          </div>

          <div className="absolute -top-2 -right-2 p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg border border-white/20">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="absolute -bottom-2 -left-2 p-2.5 bg-[#397EF5] text-white rounded-2xl shadow-lg border border-white/20">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Text Copy */}
        <div className="space-y-3 max-w-xs mx-auto">
          <div className="inline-block px-3 py-1 bg-[#397EF5]/15 border border-[#397EF5]/30 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider">
            NEXT-GEN FINTECH COIN APP
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            phoneG
          </h1>
          <p className="text-sm font-medium text-gray-300 leading-relaxed">
            Easy way for all your transactions
          </p>
        </div>

      </main>

      {/* Action Footer */}
      <footer className="z-10 space-y-4 pb-4">
        <AppButton variant="primary" fullWidth={true} onClick={onGetStarted}>
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </AppButton>
        <p className="text-[11px] text-gray-400 text-center">
          Instant Coin Buying, Sending & Instant Firebase Security
        </p>
      </footer>
    </div>
  );
};
