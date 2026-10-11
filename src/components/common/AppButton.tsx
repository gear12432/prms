import React from 'react';
import { Loader2 } from 'lucide-react';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'royal' | 'outline' | 'danger';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  fullWidth = true,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = "relative px-5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm";

  const variantClasses = {
    primary: "bg-[#397EF5] hover:bg-[#2e6dd9] text-white shadow-blue-500/20 shadow-md",
    royal: "bg-[#202778] hover:bg-[#191f61] text-white shadow-indigo-900/30 shadow-md",
    secondary: "bg-white hover:bg-gray-100 text-[#20244F] border border-[#D8D8D8]",
    outline: "border-2 border-[#397EF5] text-[#397EF5] hover:bg-[#397EF5]/10",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
