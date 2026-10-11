import React from 'react';
import { User, Shield, MapPin, Check } from 'lucide-react';

interface RegistrationStepperProps {
  currentStep: number; // 1, 2, or 3
}

export const RegistrationStepper: React.FC<RegistrationStepperProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Personal Details', icon: User },
    { number: 2, label: 'KYC Details', icon: Shield },
    { number: 3, label: 'Address Details', icon: MapPin },
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-5">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-gray-200 -z-0" />
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-[#397EF5] transition-all duration-300 -z-0"
          style={{
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const Icon = step.icon;

          return (
            <div key={step.number} className="flex flex-col items-center z-10 space-y-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isCurrent
                    ? 'bg-[#397EF5] text-white ring-4 ring-[#397EF5]/20 shadow-md'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px] leading-tight ${
                  isCurrent || isCompleted ? 'text-[#20244F]' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
