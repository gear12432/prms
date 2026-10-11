import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserWallet } from '../types/wallet';
import { WalletTransaction } from '../types/transaction';
import { useAuth } from '../hooks/useAuth';
import { subscribeUserWallet } from '../services/walletService';
import { subscribeUserTransactions } from '../services/transactionService';

interface WalletContextType {
  wallet: UserWallet | null;
  transactions: WalletTransaction[];
  loadingWallet: boolean;
  loadingTransactions: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  transactions: [],
  loadingWallet: true,
  loadingTransactions: true,
  error: null,
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loadingWallet, setLoadingWallet] = useState<boolean>(true);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || !userProfile) {
      setWallet(null);
      setTransactions([]);
      setLoadingWallet(false);
      setLoadingTransactions(false);
      return;
    }

    setLoadingWallet(true);
    setLoadingTransactions(true);

    const unsubWallet = subscribeUserWallet(
      currentUser.uid,
      (updatedWallet) => {
        setWallet(updatedWallet);
        setLoadingWallet(false);
      },
      (err) => {
        console.warn('Wallet subscription error:', err);
        setLoadingWallet(false);
      }
    );

    const unsubTxs = subscribeUserTransactions(
      currentUser.uid,
      (updatedTxs) => {
        setTransactions(updatedTxs);
        setLoadingTransactions(false);
      },
      (err) => {
        console.warn('Transactions subscription error:', err);
        setLoadingTransactions(false);
      }
    );

    return () => {
      unsubWallet();
      unsubTxs();
    };
  }, [currentUser, userProfile?.uid]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        loadingWallet,
        loadingTransactions,
        error
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
