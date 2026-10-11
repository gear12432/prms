export interface UserProfile {
  uid: string;
  userId: string; // PL18753
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  profilePhotoPath?: string;
  registrationStatus: 'pending' | 'completed';
  accountStatus: 'active' | 'suspended';
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserPrivateDetails {
  uid: string;
  address?: string;
  state?: string;
  district?: string;
  pinCode?: string;
  city?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  panDocumentPath?: string;
  aadhaarFrontPath?: string;
  aadhaarBackPath?: string;
  updatedAt?: string;
}

export interface RegistrationFormData {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;

  // Step 2: KYC
  panNumber: string;
  panPhoto?: File | string | null;
  aadhaarNumber: string;
  aadhaarFront?: File | string | null;
  aadhaarBack?: File | string | null;
  profilePhoto?: File | string | null;

  // Step 3: Address
  address: string;
  state: string;
  district: string;
  pinCode: string;
  city: string;
}
