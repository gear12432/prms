import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { SendCoinsForm } from '../components/wallet/SendCoinsForm';
import { sendCoins } from '../services/walletService';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../hooks/useWallet';
import { ToastMessage } from '../components/common/ToastMessage';

interface SendCoinsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const SendCoinsPage: React.FC<SendCoinsPageProps> = ({ onBack, onNavigate }) => {
  const { userProfile } = useAuth();
  const { wallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSend = async (recipientUserId: string, coinAmount: number, description?: string) => {
    if (!userProfile) return;

    setLoading(true);
    try {
      await sendCoins(userProfile.uid, userProfile.userId, {
        recipientUserId,
        coinAmount,
        description
      });
      setToast({
        type: 'success',
        message: `Successfully sent ${coinAmount} Coins to User ID ${recipientUserId}!`
      });
      setTimeout(() => {
        onNavigate('transactions');
      }, 1800);
    } catch (err: any) {
      setToast({
        type: 'error',
        message: err.message || 'Transfer failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      title="Send Coins"
      showBack={true}
      onBack={onBack}
      activeTab="send"
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

        <SendCoinsForm
          currentBalance={wallet?.coinBalance || 0}
          currentUserPublicId={userProfile?.userId || ''}
          onSend={handleSend}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};
