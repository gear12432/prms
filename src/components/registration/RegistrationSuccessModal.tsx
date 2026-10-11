import React, { useState } from 'react';
import { AppButton } from '../common/AppButton';
import { CheckCircle2, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  userId: string; // PL18753
  uid: string; // Firebase internal UID
  onContinueToHome: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  isOpen,
  userId,
  uid,
  onContinueToHome
}) => {
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'userId' | 'uid') => {
    navigator.clipboard.writeText(text);
    if (type === 'userId') {
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    } else {
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-5 animate-scale-up border border-emerald-100">
        
        {/* Animated Green Checkmark */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner animate-bounce">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#20244F] tracking-tight">Registration Successful!</h2>
          <p className="text-xs text-gray-500 font-medium">Welcome to phoneG! Your coin account is now active.</p>
        </div>

        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-left text-xs text-emerald-800">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>50 Free Welcome Bonus Coins credited to your wallet!</span>
        </div>

        {/* Credentials Display */}
        <div className="space-y-3 bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left">
          
          {/* Public User ID */}
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Public Login User ID
            </span>
            <div className="mt-1 flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-base font-extrabold text-[#397EF5] tracking-wider font-mono">
                {userId}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(userId, 'userId')}
                className="px-2.5 py-1.5 bg-[#397EF5]/10 hover:bg-[#397EF5]/20 text-[#397EF5] rounded-lg text-xs font-bold flex items-center space-x-1 transition-all active:scale-95"
              >
                {copiedUserId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUserId ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Internal UID */}
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Unique Canonical UID
            </span>
            <div className="mt-1 flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-medium text-gray-700 truncate max-w-[180px] font-mono">
                {uid}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(uid, 'uid')}
                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all active:scale-95"
              >
                {copiedUid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUid ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>

        <AppButton variant="primary" fullWidth={true} onClick={onContinueToHome}>
          CONTINUE TO HOME DASHBOARD
        </AppButton>
      </div>
    </div>
  );
};
