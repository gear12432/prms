import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SplashPage } from '../pages/SplashPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { HomePage } from '../pages/HomePage';
import { BuyCoinsPage } from '../pages/BuyCoinsPage';
import { SendCoinsPage } from '../pages/SendCoinsPage';
import { ReceiveCoinsPage } from '../pages/ReceiveCoinsPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { KycStatusPage } from '../pages/KycStatusPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { LoadingOverlay } from '../components/common/LoadingOverlay';

export const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return currentUser ? 'home' : 'splash';
  });

  if (loading) {
    return <LoadingOverlay show={true} message="Initializing phoneG wallet..." />;
  }

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is authenticated and on splash/login/register, auto redirect to home
  if (currentUser && (currentPage === 'splash' || currentPage === 'login' || currentPage === 'register')) {
    return <HomePage onNavigate={navigate} />;
  }

  // If user is not authenticated and on protected pages, render login
  if (!currentUser && currentPage !== 'splash' && currentPage !== 'register') {
    return (
      <LoginPage
        onLoginSuccess={() => navigate('home')}
        onNavigateToRegister={() => navigate('register')}
      />
    );
  }

  switch (currentPage) {
    case 'splash':
      return <SplashPage onGetStarted={() => navigate('login')} />;

    case 'login':
      return (
        <LoginPage
          onLoginSuccess={() => navigate('home')}
          onNavigateToRegister={() => navigate('register')}
        />
      );

    case 'register':
      return (
        <RegisterPage
          onBackToLogin={() => navigate('login')}
          onNavigateToHome={() => navigate('home')}
        />
      );

    case 'home':
      return (
        <ProtectedRoute onRedirectToLogin={() => navigate('login')}>
          <HomePage onNavigate={navigate} />
        </ProtectedRoute>
      );

    case 'buy':
      return (
        <ProtectedRoute onRedirectToLogin={() => navigate('login')}>
          <BuyCoinsPage onBack={() => navigate('home')} onNavigate={navigate} />
        </ProtectedRoute>
      );

    case 'send':
      return (
        <ProtectedRoute onRedirectToLogin={() => navigate('login')}>
          <SendCoinsPage onBack={() => navigate('home')} onNavigate={navigate} />
        </ProtectedRoute>
      );

    case 'receive':
      return (
        <ProtectedRoute onRedirectToLogin={() => navigate('login')}>
          <ReceiveCoinsPage onBack={() => navigate('home')} onNavigate={navigate} />
        </ProtectedRoute>
      );

    case 'transactions':
      return (
        <ProtectedRoute onRedirectToLogin={() => navigate('login')}>
          <TransactionsPage onBack={() => navigate('home')} onNavigate={navigate} />
        </ProtectedRoute>
      );

    case 'profile':
      return (
        <ProtectedRoute onRedirectToLogin={() => navigate('login')}>
          <ProfilePage
            onBack={() => navigate('home')}
            onNavigate={navigate}
            onLogoutSuccess={() => navigate('login')}
          />
        </ProtectedRoute>
      );

    case 'kyc-status':
      return (
        <ProtectedRoute onRedirectToLogin={() => navigate('login')}>
          <KycStatusPage onBack={() => navigate('profile')} onNavigate={navigate} />
        </ProtectedRoute>
      );

    default:
      return (
        <ProtectedRoute onRedirectToLogin={() => navigate('login')}>
          <HomePage onNavigate={navigate} />
        </ProtectedRoute>
      );
  }
};
