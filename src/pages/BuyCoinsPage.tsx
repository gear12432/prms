import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { BuyCoinsForm } from '../components/wallet/BuyCoinsForm';
import { buyCoins } from '../services/walletService';
import { useAuth } from '../hooks/useAuth';
import { ToastMessage } from '../components/common/ToastMessage';

interface BuyCoinsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const BuyCoinsPage: React.FC<BuyCoinsPageProps> = ({ onBack, onNavigate }) => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleBuy = async (coinAmount: number, amountInINR: number, paymentMethod: string) => {
    if (!userProfile) return;

    setLoading(true);
    try {
      await buyCoins(userProfile.uid, userProfile.userId, {
        coinAmount,
        amountInINR,
        paymentMethod
      });
      setToast({
        type: 'success',
        message: `Successfully purchased ${coinAmount} phoneG Coins!`
      });
      setTimeout(() => {
        onNavigate('home');
      }, 1500);
    } catch (err: any) {
      setToast({
        type: 'error',
        message: err.message || 'Payment failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      title="Buy Coins"
      showBack={true}
      onBack={onBack}
      activeTab="buy"
      onTabChange={(tab) => onNavigate(tab)}
    >
      <div className="space-y-4">
        {toast && (
          <ToastMessage
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <BuyCoinsForm onBuy={handleBuy} loading={loading} />
      </div>
    </MainLayout>
  );
};
