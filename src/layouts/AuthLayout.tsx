import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#191F2C] text-white flex flex-col justify-between p-4 max-w-md mx-auto relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#397EF5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#202778]/20 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-1 my-auto z-10 w-full py-6">
        {children}
      </main>

      <footer className="py-4 text-center text-[11px] text-gray-500 z-10 border-t border-gray-800/60">
        <p>© {new Date().getFullYear()} phoneG Fintech Systems. All Rights Reserved.</p>
        <p className="text-[10px] text-gray-600 mt-0.5">Secure Firebase Authentication & Firestore Encrypted</p>
      </footer>
    </div>
  );
};
