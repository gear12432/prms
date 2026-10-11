import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { DocumentUpload } from './DocumentUpload';
import { AppButton } from '../common/AppButton';
import { RegistrationFormData } from '../../types/user';
import { validatePan, validateAadhaar } from '../../lib/validators';
import { CreditCard, FileText, User } from 'lucide-react';

interface KycDetailsFormProps {
  formData: RegistrationFormData;
  updateFormData: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const KycDetailsForm: React.FC<KycDetailsFormProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.panNumber.trim()) {
      errs.panNumber = 'PAN Card number is required.';
    } else if (!validatePan(formData.panNumber)) {
      errs.panNumber = 'Invalid PAN format (e.g. ABCDE1234F).';
    }

    if (!formData.panPhoto) {
      errs.panPhoto = 'PAN Card photo is required for KYC verification.';
    }

    if (!formData.aadhaarNumber.trim()) {
      errs.aadhaarNumber = 'Aadhaar Card number is required.';
    } else if (!validateAadhaar(formData.aadhaarNumber)) {
      errs.aadhaarNumber = 'Enter a valid 12-digit Aadhaar number.';
    }

    if (!formData.aadhaarFront) {
      errs.aadhaarFront = 'Aadhaar Front photo is required.';
    }

    if (!formData.aadhaarBack) {
      errs.aadhaarBack = 'Aadhaar Back photo is required.';
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
        <h3 className="text-lg font-extrabold text-[#20244F]">Step 2: KYC Verification</h3>
        <p className="text-xs text-gray-500">Provide government-issued identity documents</p>
      </div>

      {/* PAN Details */}
      <div className="space-y-3 pt-1">
        <AppInput
          label="PAN Card Number"
          placeholder="e.g. ABCDE1234F"
          maxLength={10}
          value={formData.panNumber}
          onChange={(e) => updateFormData({ panNumber: e.target.value.toUpperCase() })}
          error={errors.panNumber}
          icon={<CreditCard className="w-4 h-4" />}
        />

        <DocumentUpload
          label="PAN Card Photo"
          value={formData.panPhoto || null}
          onChange={(file) => updateFormData({ panPhoto: file })}
          error={errors.panPhoto}
        />
      </div>

      <div className="border-t border-gray-200/80 my-3" />

      {/* Aadhaar Details */}
      <div className="space-y-3">
        <AppInput
          label="Aadhaar Card Number"
          placeholder="12-digit Aadhaar number"
          maxLength={12}
          value={formData.aadhaarNumber}
          onChange={(e) => updateFormData({ aadhaarNumber: e.target.value.replace(/\D/g, '') })}
          error={errors.aadhaarNumber}
          icon={<FileText className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DocumentUpload
            label="Aadhaar Front Photo"
            value={formData.aadhaarFront || null}
            onChange={(file) => updateFormData({ aadhaarFront: file })}
            error={errors.aadhaarFront}
          />

          <DocumentUpload
            label="Aadhaar Back Photo"
            value={formData.aadhaarBack || null}
            onChange={(file) => updateFormData({ aadhaarBack: file })}
            error={errors.aadhaarBack}
          />
        </div>
      </div>

      <div className="border-t border-gray-200/80 my-3" />

      {/* Profile Photo */}
      <DocumentUpload
        label="Profile Photo (Optional)"
        value={formData.profilePhoto || null}
        onChange={(file) => updateFormData({ profilePhoto: file })}
        helperText="Clear passport-style selfie for wallet avatar"
      />

      <div className="pt-3 flex items-center space-x-3">
        <AppButton type="button" variant="secondary" onClick={onBack} fullWidth={true}>
          Back
        </AppButton>
        <AppButton type="submit" variant="primary" fullWidth={true}>
          Next: Address Details
        </AppButton>
      </div>
    </form>
  );
};
