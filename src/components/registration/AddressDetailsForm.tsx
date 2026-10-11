import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';
import { RegistrationFormData } from '../../types/user';
import { validatePinCode } from '../../lib/validators';
import { INDIAN_STATES_AND_DISTRICTS } from '../../lib/constants';
import { MapPin, Building, Hash } from 'lucide-react';

interface AddressDetailsFormProps {
  formData: RegistrationFormData;
  updateFormData: (data: Partial<RegistrationFormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

export const AddressDetailsForm: React.FC<AddressDetailsFormProps> = ({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  loading
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stateKeys = Object.keys(INDIAN_STATES_AND_DISTRICTS);
  const districtOptions = formData.state ? INDIAN_STATES_AND_DISTRICTS[formData.state] || [] : [];

  const handleStateChange = (state: string) => {
    const districts = INDIAN_STATES_AND_DISTRICTS[state] || [];
    updateFormData({
      state,
      district: districts.length > 0 ? districts[0] : ''
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.address.trim()) errs.address = 'Full address is required.';
    if (!formData.state) errs.state = 'State selection is required.';
    if (!formData.district) errs.district = 'District selection is required.';
    
    if (!formData.pinCode.trim()) {
      errs.pinCode = 'PIN code is required.';
    } else if (!validatePinCode(formData.pinCode)) {
      errs.pinCode = 'Enter a valid 6-digit PIN code.';
    }

    if (!formData.city.trim()) errs.city = 'City / Town name is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-left space-y-4 animate-fade-in">
      <div className="space-y-1 pb-1">
        <h3 className="text-lg font-extrabold text-[#20244F]">Step 3: Address Details</h3>
        <p className="text-xs text-gray-500">Residential address for verification and statement delivery</p>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
          Full Address (House / Flat No, Street, Landmark)
        </label>
        <textarea
          rows={3}
          value={formData.address}
          onChange={(e) => updateFormData({ address: e.target.value })}
          placeholder="Enter house no, street, area, landmark"
          className={`w-full bg-white text-[#20244F] text-sm font-medium rounded-xl border p-3 outline-none transition-all ${
            errors.address ? 'border-red-500 ring-2 ring-red-200' : 'border-[#D8D8D8] focus:border-[#397EF5] focus:ring-2 focus:ring-[#397EF5]/20'
          }`}
        />
        {errors.address && <p className="text-xs text-red-500 font-medium">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* State Dropdown */}
        <div className="space-y-1 text-left">
          <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
            State
          </label>
          <select
            value={formData.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className={`w-full bg-white text-[#20244F] text-sm font-medium rounded-xl border p-3 outline-none transition-all ${
              errors.state ? 'border-red-500' : 'border-[#D8D8D8] focus:border-[#397EF5]'
            }`}
          >
            <option value="">Select State</option>
            {stateKeys.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-xs text-red-500 font-medium">{errors.state}</p>}
        </div>

        {/* District Dropdown */}
        <div className="space-y-1 text-left">
          <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
            District
          </label>
          <select
            value={formData.district}
            onChange={(e) => updateFormData({ district: e.target.value })}
            className={`w-full bg-white text-[#20244F] text-sm font-medium rounded-xl border p-3 outline-none transition-all ${
              errors.district ? 'border-red-500' : 'border-[#D8D8D8] focus:border-[#397EF5]'
            }`}
            disabled={!formData.state}
          >
            <option value="">Select District</option>
            {districtOptions.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
          {errors.district && <p className="text-xs text-red-500 font-medium">{errors.district}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AppInput
          label="PIN Code"
          placeholder="6-digit PIN"
          maxLength={6}
          value={formData.pinCode}
          onChange={(e) => updateFormData({ pinCode: e.target.value.replace(/\D/g, '') })}
          error={errors.pinCode}
          icon={<Hash className="w-4 h-4" />}
        />

        <AppInput
          label="City / Town"
          placeholder="e.g. Mumbai"
          value={formData.city}
          onChange={(e) => updateFormData({ city: e.target.value })}
          error={errors.city}
          icon={<Building className="w-4 h-4" />}
        />
      </div>

      <div className="pt-3 flex items-center space-x-3">
        <AppButton type="button" variant="secondary" onClick={onBack} disabled={loading} fullWidth={true}>
          Back
        </AppButton>
        <AppButton type="submit" variant="royal" loading={loading} fullWidth={true}>
          Confirm & Create Account
        </AppButton>
      </div>
    </form>
  );
};
