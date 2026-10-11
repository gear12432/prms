import React from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#202778] to-[#397EF5] flex items-center justify-center font-black text-white text-xl shadow-lg border border-white/20">
            pG
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Login & Registration</h1>
          <p className="text-xs text-gray-400">Welcome to phoneG Secure Wallet Portal</p>
        </div>

        <LoginForm
          onLoginSuccess={onLoginSuccess}
          onNavigateToRegister={onNavigateToRegister}
        />
      </div>
    </AuthLayout>
  );
};
