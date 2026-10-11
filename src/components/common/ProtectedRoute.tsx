import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingOverlay } from './LoadingOverlay';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onRedirectToLogin: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onRedirectToLogin }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingOverlay show={true} message="Authenticating session..." />;
  }

  if (!currentUser) {
    onRedirectToLogin();
    return null;
  }

  return <>{children}</>;
};
