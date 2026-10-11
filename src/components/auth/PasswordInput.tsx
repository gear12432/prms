import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  id?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  value,
  onChange,
  error,
  placeholder = 'Enter your password',
  id
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AppInput
      id={id}
      type={showPassword ? 'text' : 'password'}
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      placeholder={placeholder}
      icon={<Lock className="w-4 h-4" />}
      endAdornment={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  );
};
