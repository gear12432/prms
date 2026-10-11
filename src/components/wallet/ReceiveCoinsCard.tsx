import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AppButton } from '../common/AppButton';
import { Copy, Check, QrCode, Share2, ShieldCheck } from 'lucide-react';

interface ReceiveCoinsCardProps {
  userId: string; // PL18753
  userName: string;
}

export const ReceiveCoinsCard: React.FC<ReceiveCoinsCardProps> = ({ userId, userName }) => {
  const [copied, setCopied] = useState(false);

  const qrPayload = JSON.stringify({
    app: 'phoneG',
    type: 'receive_coins',
    userId: userId,
    name: userName
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Receive phoneG Coins',
        text: `Send phoneG coins to my User ID: ${userId}`,
        url: window.location.origin
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-center space-y-6 animate-fade-in max-w-sm mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#20244F]">Receive Coins</h2>
        <p className="text-xs text-gray-500">Scan QR code or share your unique phoneG User ID</p>
      </div>

      {/* QR Container */}
      <div className="p-5 bg-gradient-to-br from-[#202778] to-[#397EF5] rounded-3xl shadow-lg inline-block relative border border-blue-200">
        <div className="bg-white p-4 rounded-2xl shadow-inner flex items-center justify-center">
          <QRCodeSVG
            value={qrPayload}
            size={180}
            level="H"
            includeMargin={true}
            fgColor="#20244F"
          />
        </div>
        <p className="text-[11px] font-bold text-blue-100 mt-2 tracking-wider uppercase">
          phoneG Secure QR Code
        </p>
      </div>

      {/* User ID Box */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-left">
        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Your Public User ID
        </span>
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
          <div>
            <span className="text-lg font-black text-[#397EF5] font-mono tracking-wider">
              {userId}
            </span>
            <span className="block text-xs font-semibold text-gray-600">{userName}</span>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-[#397EF5]/10 hover:bg-[#397EF5]/20 text-[#397EF5] rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy ID'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <AppButton variant="secondary" onClick={handleShare} fullWidth={true}>
          <Share2 className="w-4 h-4 text-[#397EF5]" />
          <span>Share Details</span>
        </AppButton>
        <AppButton variant="primary" onClick={handleCopy} fullWidth={true}>
          <Copy className="w-4 h-4" />
          <span>Copy User ID</span>
        </AppButton>
      </div>

      <div className="flex items-center justify-center space-x-1 text-[11px] text-gray-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Safe transaction receiving address</span>
      </div>
    </div>
  );
};
