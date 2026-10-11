import React from 'react';

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
  helperText?: string;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  icon,
  endAdornment,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white text-[#20244F] placeholder-gray-400 text-sm font-medium rounded-xl border transition-all outline-none py-3.5 ${
            icon ? 'pl-10' : 'pl-4'
          } ${endAdornment ? 'pr-11' : 'pr-4'} ${
            error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-[#D8D8D8] focus:border-[#397EF5] focus:ring-2 focus:ring-[#397EF5]/20'
          } ${className}`}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-3.5 flex items-center justify-center">
            {endAdornment}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-red-500 font-medium animate-fade-in">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};
