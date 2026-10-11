import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { PasswordInput } from '../auth/PasswordInput';
import { AppButton } from '../common/AppButton';
import { RegistrationFormData } from '../../types/user';
import { validateEmail, validateMobile, validatePasswordStrength } from '../../lib/validators';
import { User, Phone, Mail } from 'lucide-react';

interface PersonalDetailsFormProps {
  formData: RegistrationFormData;
  updateFormData: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBackToLogin: () => void;
}

export const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  formData,
  updateFormData,
  onNext,
  onBackToLogin
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required.';
    } else if (!validateMobile(formData.mobileNumber)) {
      errs.mobileNumber = 'Enter a valid 10-digit mobile number.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Gmail ID is required.';
    } else if (!validateEmail(formData.email)) {
      errs.email = 'Enter a valid Gmail / email address.';
    }

    const passValidation = validatePasswordStrength(formData.password);
    if (!passValidation.valid) {
      errs.password = passValidation.message || 'Invalid password.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-left space-y-4 animate-fade-in">
      <div className="space-y-1 pb-1">
        <h3 className="text-lg font-extrabold text-[#20244F]">Step 1: Personal Details</h3>
        <p className="text-xs text-gray-500">Enter your official name and contact credentials</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AppInput
          label="First Name"
          placeholder="e.g. Rahul"
          value={formData.firstName}
          onChange={(e) => updateFormData({ firstName: e.target.value })}
          error={errors.firstName}
          icon={<User className="w-4 h-4" />}
        />
        <AppInput
          label="Last Name"
          placeholder="e.g. Sharma"
          value={formData.lastName}
          onChange={(e) => updateFormData({ lastName: e.target.value })}
          error={errors.lastName}
        />
      </div>

      <AppInput
        label="Mobile Number"
        placeholder="10-digit mobile number"
        type="tel"
        maxLength={10}
        value={formData.mobileNumber}
        onChange={(e) => updateFormData({ mobileNumber: e.target.value.replace(/\D/g, '') })}
        error={errors.mobileNumber}
        icon={<Phone className="w-4 h-4" />}
      />

      <AppInput
        label="Gmail ID / Email"
        placeholder="yourname@gmail.com"
        type="email"
        value={formData.email}
        onChange={(e) => updateFormData({ email: e.target.value })}
        error={errors.email}
        icon={<Mail className="w-4 h-4" />}
      />

      <PasswordInput
        label="Password"
        value={formData.password}
        onChange={(e) => updateFormData({ password: e.target.value })}
        error={errors.password}
        placeholder="Min 6 characters"
      />

      <PasswordInput
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
        error={errors.confirmPassword}
        placeholder="Re-enter password"
      />

      <div className="pt-3 flex items-center space-x-3">
        <AppButton type="button" variant="secondary" onClick={onBackToLogin} fullWidth={true}>
          Back to Login
        </AppButton>
        <AppButton type="submit" variant="primary" fullWidth={true}>
          Next: KYC Details
        </AppButton>
      </div>
    </form>
  );
};
