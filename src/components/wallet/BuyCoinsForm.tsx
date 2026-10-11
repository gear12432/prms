import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';
import { COIN_CONVERSION_RATE_INR } from '../../lib/constants';
import { formatCurrency, formatCoins } from '../../lib/formatters';
import { Coins, CreditCard, ShieldCheck, Check } from 'lucide-react';

interface BuyCoinsFormProps {
  onBuy: (coinAmount: number, amountInINR: number, paymentMethod: string) => Promise<void>;
  loading: boolean;
}

export const BuyCoinsForm: React.FC<BuyCoinsFormProps> = ({ onBuy, loading }) => {
  const [coinsInput, setCoinsInput] = useState<string>('100');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [error, setError] = useState<string | null>(null);

  const numCoins = parseFloat(coinsInput) || 0;
  const inrAmount = numCoins * COIN_CONVERSION_RATE_INR;

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numCoins <= 0) {
      setError('Please enter a valid coin amount (minimum 1 coin).');
      return;
    }

    try {
      await onBuy(numCoins, inrAmount, paymentMethod);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-left space-y-5 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#20244F]">Buy phoneG Coins</h2>
        <p className="text-xs text-gray-500">Instantly credit coins to your phoneG wallet</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Conversion Rate Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-[#202778]">
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-[#397EF5]" />
          <span className="font-bold">Conversion Rate:</span>
        </div>
        <span className="font-extrabold font-mono text-[#397EF5]">1 Coin = ₹{COIN_CONVERSION_RATE_INR} INR</span>
      </div>

      {/* Quick Select Buttons */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
          Quick Select Coins
        </label>
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setCoinsInput(amt.toString())}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                numCoins === amt
                  ? 'bg-[#397EF5] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {amt} Coins
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <AppInput
        label="Enter Coin Quantity"
        type="number"
        min="1"
        value={coinsInput}
        onChange={(e) => setCoinsInput(e.target.value)}
        icon={<Coins className="w-4 h-4 text-amber-500" />}
      />

      {/* Summary Box */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Coin Quantity:</span>
          <span className="font-bold font-mono text-gray-800">{formatCoins(numCoins)} Coins</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Processing Fee:</span>
          <span className="font-bold font-mono text-emerald-600">FREE (₹0)</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex items-center justify-between text-sm font-extrabold text-[#20244F]">
          <span>Total Payable Amount:</span>
          <span className="text-[#397EF5] font-mono text-base">{formatCurrency(inrAmount)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
          Select Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['UPI', 'Card', 'Net Banking'].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                paymentMethod === method
                  ? 'border-[#397EF5] bg-blue-50/50 text-[#397EF5] shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{method}</span>
            </button>
          ))}
        </div>
      </div>

      <AppButton type="submit" variant="primary" loading={loading} fullWidth={true}>
        PROCEED TO PAY {formatCurrency(inrAmount)}
      </AppButton>

      <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>256-bit Encrypted Secure Payment Gateway</span>
      </div>
    </form>
  );
};
