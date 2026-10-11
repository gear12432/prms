import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <AppRoutes />
      </WalletProvider>
    </AuthProvider>
  );
}
