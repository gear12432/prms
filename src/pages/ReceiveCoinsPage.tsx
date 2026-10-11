import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { ReceiveCoinsCard } from '../components/wallet/ReceiveCoinsCard';
import { useAuth } from '../hooks/useAuth';

interface ReceiveCoinsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const ReceiveCoinsPage: React.FC<ReceiveCoinsPageProps> = ({ onBack, onNavigate }) => {
  const { userProfile } = useAuth();

  const userId = userProfile?.userId || 'PL18753';
  const fullName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'phoneG User';

  return (
    <MainLayout
      title="Receive Coins"
      showBack={true}
      onBack={onBack}
      activeTab="receive"
      onTabChange={(tab) => onNavigate(tab)}
    >
      <div className="py-2">
        <ReceiveCoinsCard userId={userId} userName={fullName} />
      </div>
    </MainLayout>
  );
};
