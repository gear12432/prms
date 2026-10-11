import React from 'react';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onChange, error }) => {
  return (
    <div className="space-y-1">
      <label className="flex items-start space-x-2.5 cursor-pointer text-left">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#397EF5] focus:ring-[#397EF5] transition-all"
        />
        <span className="text-xs text-gray-600 leading-snug">
          I agree to the <button type="button" className="text-[#397EF5] underline font-semibold">Terms & Conditions</button> and <button type="button" className="text-[#397EF5] underline font-semibold">Privacy Policy</button> of phoneG.
        </span>
      </label>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};
