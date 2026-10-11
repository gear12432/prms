import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { TransactionList } from '../components/wallet/TransactionList';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../hooks/useAuth';

interface TransactionsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onBack, onNavigate }) => {
  const { userProfile } = useAuth();
  const { transactions } = useWallet();

  return (
    <MainLayout
      title="History"
      showBack={true}
      onBack={onBack}
      activeTab="home"
      onTabChange={(tab) => onNavigate(tab)}
    >
      <div>
        <TransactionList
          transactions={transactions}
          currentUid={userProfile?.uid || ''}
        />
      </div>
    </MainLayout>
  );
};
