import React, { useState } from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import { RegistrationStepper } from '../components/registration/RegistrationStepper';
import { PersonalDetailsForm } from '../components/registration/PersonalDetailsForm';
import { KycDetailsForm } from '../components/registration/KycDetailsForm';
import { AddressDetailsForm } from '../components/registration/AddressDetailsForm';
import { RegistrationSuccessModal } from '../components/registration/RegistrationSuccessModal';
import { RegistrationFormData } from '../types/user';
import { registerAuthUser } from '../services/authService';
import { generateUniqueUserId, createUserRecords } from '../services/userService';
import { uploadUserDocument } from '../services/storageService';
import { LoadingOverlay } from '../components/common/LoadingOverlay';

interface RegisterPageProps {
  onBackToLogin: () => void;
  onNavigateToHome: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onBackToLogin,
  onNavigateToHome
}) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState<string>('Creating your account...');
  const [error, setError] = useState<string | null>(null);

  // Registration success modal state
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [generatedUserId, setGeneratedUserId] = useState<string>('');
  const [generatedUid, setGeneratedUid] = useState<string>('');

  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',

    panNumber: '',
    panPhoto: null,
    aadhaarNumber: '',
    aadhaarFront: null,
    aadhaarBack: null,
    profilePhoto: null,

    address: '',
    state: '',
    district: '',
    pinCode: '',
    city: ''
  });

  const updateFormData = (fields: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleFinalSubmit = async () => {
    setError(null);
    setLoading(true);
    setLoadingMsg('Registering authentication credentials...');

    try {
      // 1. Create Firebase Auth user
      const user = await registerAuthUser(formData.email, formData.password);
      const uid = user.uid;

      // 2. Generate Unique Public User ID (PL18753)
      setLoadingMsg('Generating unique PL User ID...');
      const publicUserId = await generateUniqueUserId();

      // 3. Upload Document Files to Storage
      setLoadingMsg('Uploading encrypted KYC identity documents...');
      let panPath = '';
      let aadhaarFrontPath = '';
      let aadhaarBackPath = '';
      let profilePhotoPath = '';

      if (formData.panPhoto) {
        panPath = await uploadUserDocument(uid, 'pan', formData.panPhoto);
      }
      if (formData.aadhaarFront) {
        aadhaarFrontPath = await uploadUserDocument(uid, 'aadhaar_front', formData.aadhaarFront);
      }
      if (formData.aadhaarBack) {
        aadhaarBackPath = await uploadUserDocument(uid, 'aadhaar_back', formData.aadhaarBack);
      }
      if (formData.profilePhoto) {
        profilePhotoPath = await uploadUserDocument(uid, 'profile_photo', formData.profilePhoto);
      }

      // 4. Create User Profile, Wallet, Private Record & UID Lookup in Firestore
      setLoadingMsg('Finalizing Firestore wallet & profile registration...');
      await createUserRecords(
        uid,
        formData.email,
        publicUserId,
        formData,
        {
          panPath,
          aadhaarFrontPath,
          aadhaarBackPath,
          profilePhotoPath
        }
      );

      // Set credentials & show success modal
      setGeneratedUserId(publicUserId);
      setGeneratedUid(uid);
      setSuccessModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your form entries and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <LoadingOverlay show={loading} message={loadingMsg} />

      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-white">Create phoneG Account</h1>
          <p className="text-xs text-gray-400">Complete 3 simple steps to get 50 Free Welcome Coins</p>
        </div>

        <RegistrationStepper currentStep={step} />

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs font-medium text-left">
            {error}
          </div>
        )}

        {step === 1 && (
          <PersonalDetailsForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setStep(2)}
            onBackToLogin={onBackToLogin}
          />
        )}

        {step === 2 && (
          <KycDetailsForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <AddressDetailsForm
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleFinalSubmit}
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}

        {/* Success Modal */}
        <RegistrationSuccessModal
          isOpen={successModalOpen}
          userId={generatedUserId}
          uid={generatedUid}
          onContinueToHome={onNavigateToHome}
        />
      </div>
    </AuthLayout>
  );
};
