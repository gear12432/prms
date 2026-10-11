import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { PasswordInput } from './PasswordInput';
import { TermsCheckbox } from './TermsCheckbox';
import { AppButton } from '../common/AppButton';
import { loginWithUserIdOrEmail } from '../../services/authService';
import { User, Lock, UserPlus } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTermsError(null);

    if (!identifier.trim()) {
      setError('Please enter your User ID or Gmail ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (!acceptedTerms) {
      setTermsError('You must accept the Terms & Conditions to log in.');
      return;
    }

    setLoading(true);
    try {
      await loginWithUserIdOrEmail(identifier, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-left space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-[#20244F]">Login to Continue</h2>
          <p className="text-xs text-gray-500">Access your phoneG coin wallet and account</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AppInput
            label="User ID / Gmail ID"
            placeholder="Enter PL18753 or Gmail ID"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            icon={<User className="w-4 h-4" />}
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <TermsCheckbox
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
            error={termsError || undefined}
          />

          <AppButton type="submit" variant="primary" loading={loading}>
            LOGIN
          </AppButton>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => alert('Forgot User ID: Please check your registration success details or contact phoneG Support with your registered Mobile Number.')}
              className="text-[#397EF5] hover:underline font-semibold"
            >
              Forgot User ID?
            </button>
            <button
              type="button"
              onClick={() => alert('Password Reset: Please enter your Gmail ID in the User ID field and select reset via email.')}
              className="text-[#397EF5] hover:underline font-semibold"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>

      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-700/60 w-full" />
        <span className="bg-[#191F2C] px-3 text-xs text-gray-400 font-bold uppercase tracking-wider">OR</span>
        <div className="border-t border-gray-700/60 w-full" />
      </div>

      {/* Registration Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 flex flex-col items-center justify-center space-y-3 text-center">
        <div className="p-2.5 bg-blue-50 text-[#397EF5] rounded-full">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#20244F]">Don't have a phoneG account?</h3>
          <p className="text-xs text-gray-500 mt-0.5">Register in 3 simple steps & receive 50 bonus coins!</p>
        </div>
        <AppButton variant="danger" fullWidth={true} onClick={onNavigateToRegister}>
          REGISTER NEW ACCOUNT
        </AppButton>
      </div>
    </div>
  );
};
