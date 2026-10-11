export interface KycRecord {
  uid: string;
  userId: string;
  panNumber: string;
  aadhaarNumber: string;
  panDocumentPath: string;
  aadhaarFrontPath: string;
  aadhaarBackPath: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
