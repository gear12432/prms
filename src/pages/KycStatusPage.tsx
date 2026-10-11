import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { KycRecord } from '../types/kyc';
import { maskPan, maskAadhaar, formatDateTime } from '../lib/formatters';
import { ShieldCheck, Clock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface KycStatusPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const KycStatusPage: React.FC<KycStatusPageProps> = ({ onBack, onNavigate }) => {
  const { userProfile, currentUser } = useAuth();
  const [kycRecord, setKycRecord] = useState<KycRecord | null>(null);

  useEffect(() => {
    async function fetchKyc() {
      if (currentUser?.uid) {
        try {
          const snap = await getDoc(doc(db, 'kycRecords', currentUser.uid));
          if (snap.exists()) {
            setKycRecord(snap.data() as KycRecord);
          }
        } catch (err) {
          console.warn('Failed to load KYC record:', err);
        }
      }
    }
    fetchKyc();
  }, [currentUser?.uid]);

  const status = userProfile?.kycStatus || 'pending';

  return (
    <MainLayout
      title="KYC Status"
      showBack={true}
      onBack={onBack}
      activeTab="profile"
      onTabChange={(tab) => onNavigate(tab)}
    >
      <div className="space-y-5 animate-fade-in text-left">
        
        {/* Status Card Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <Clock className="w-10 h-10 animate-pulse" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs uppercase tracking-wider rounded-full">
              {status === 'approved' ? 'VERIFIED' : 'PENDING VERIFICATION'}
            </span>
            <h2 className="text-xl font-extrabold text-[#20244F] mt-2">
              {status === 'approved' ? 'KYC Verification Approved' : 'KYC Under Review'}
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              {status === 'approved' 
                ? 'Your government identity documents are verified. All wallet limits unlocked.'
                : 'Your PAN and Aadhaar identity documents are under review by phoneG compliance.'}
            </p>
          </div>
        </div>

        {/* Documents Summary */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-extrabold text-[#20244F] uppercase tracking-wider">Submitted Documents</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-[#397EF5]" />
                <div>
                  <span className="font-bold text-[#20244F] block">PAN Card</span>
                  <span className="text-[11px] font-mono text-gray-500">
                    {kycRecord?.panNumber ? maskPan(kycRecord.panNumber) : 'Submitted'}
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-[#397EF5]" />
                <div>
                  <span className="font-bold text-[#20244F] block">Aadhaar Card</span>
                  <span className="text-[11px] font-mono text-gray-500">
                    {kycRecord?.aadhaarNumber ? maskAadhaar(kycRecord.aadhaarNumber) : 'Submitted'}
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>

            {kycRecord?.submittedAt && (
              <p className="text-[11px] text-gray-400 pt-1">
                Submitted on: {formatDateTime(kycRecord.submittedAt)}
              </p>
            )}
          </div>
        </div>

        {/* Information box */}
        <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-[#202778] space-y-1">
          <p className="font-bold">Identity Protection Note:</p>
          <p className="text-gray-600 leading-relaxed">
            All identity photos uploaded during registration are stored in private Firebase Storage paths restricted exclusively to your authenticated UID.
          </p>
        </div>

      </div>
    </MainLayout>
  );
};
