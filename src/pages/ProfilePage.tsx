import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { UserPrivateDetails } from '../types/user';
import { maskPan, maskAadhaar } from '../lib/formatters';
import { AppButton } from '../components/common/AppButton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { User, Phone, Mail, MapPin, ShieldCheck, LogOut, Copy, Check, CreditCard } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onLogoutSuccess: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onBack,
  onNavigate,
  onLogoutSuccess
}) => {
  const { userProfile, currentUser } = useAuth();
  const [privateDetails, setPrivateDetails] = useState<UserPrivateDetails | null>(null);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function fetchPrivate() {
      if (currentUser?.uid) {
        try {
          const snap = await getDoc(doc(db, 'userPrivate', currentUser.uid));
          if (snap.exists()) {
            setPrivateDetails(snap.data() as UserPrivateDetails);
          }
        } catch (err) {
          console.warn('Failed to load private profile:', err);
        }
      }
    }
    fetchPrivate();
  }, [currentUser?.uid]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUserId(true);
    setTimeout(() => setCopiedUserId(false), 2000);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      onLogoutSuccess();
    } catch (err) {
      alert('Failed to logout');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <MainLayout
      title="My Profile"
      showBack={true}
      onBack={onBack}
      activeTab="profile"
      onTabChange={(tab) => onNavigate(tab)}
    >
      <div className="space-y-5 animate-fade-in text-left">
        
        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-[#202778] to-[#397EF5] text-white rounded-3xl p-6 shadow-xl space-y-4 text-center relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-full bg-white text-[#202778] font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/30 overflow-hidden">
            {userProfile?.profilePhotoPath ? (
              <img src={userProfile.profilePhotoPath} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{userProfile?.firstName?.charAt(0).toUpperCase() || 'P'}</span>
            )}
          </div>

          <div>
            <h2 className="text-xl font-extrabold">{userProfile?.firstName} {userProfile?.lastName}</h2>
            <p className="text-xs text-blue-200">{userProfile?.email}</p>
          </div>

          {/* User ID Box */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center justify-between text-xs">
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-blue-200">Public User ID</span>
              <span className="font-mono font-bold text-base tracking-wider text-amber-300">{userProfile?.userId}</span>
            </div>
            <button
              onClick={() => handleCopy(userProfile?.userId || '')}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold flex items-center space-x-1 transition-all"
            >
              {copiedUserId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-extrabold text-[#20244F] uppercase tracking-wider">Account Credentials</h3>

          <div className="space-y-3 text-xs divide-y divide-gray-100">
            <div className="pt-2 flex items-center justify-between">
              <span className="text-gray-500 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#397EF5]" />
                <span>Mobile Number:</span>
              </span>
              <span className="font-bold text-[#20244F]">{userProfile?.mobileNumber}</span>
            </div>

            <div className="pt-2.5 flex items-center justify-between">
              <span className="text-gray-500 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#397EF5]" />
                <span>Gmail ID:</span>
              </span>
              <span className="font-bold text-[#20244F] truncate max-w-[180px]">{userProfile?.email}</span>
            </div>

            <div className="pt-2.5 flex items-center justify-between">
              <span className="text-gray-500 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>KYC Verification:</span>
              </span>
              <button
                onClick={() => onNavigate('kyc-status')}
                className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-[11px] font-bold uppercase hover:bg-amber-100"
              >
                {userProfile?.kycStatus || 'Pending'}
              </button>
            </div>
          </div>
        </div>

        {/* Address & Identity */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-extrabold text-[#20244F] uppercase tracking-wider">Verified Address</h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-[#397EF5] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#20244F]">{privateDetails?.address || 'Address registered'}</p>
                <p className="text-gray-500 mt-0.5">
                  {privateDetails?.city}, {privateDetails?.district}, {privateDetails?.state} - {privateDetails?.pinCode}
                </p>
              </div>
            </div>

            {privateDetails?.panNumber && (
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-500 flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span>PAN Card:</span>
                </span>
                <span className="font-mono font-bold text-gray-800">{maskPan(privateDetails.panNumber)}</span>
              </div>
            )}

            {privateDetails?.aadhaarNumber && (
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-500 flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span>Aadhaar Card:</span>
                </span>
                <span className="font-mono font-bold text-gray-800">{maskAadhaar(privateDetails.aadhaarNumber)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <AppButton variant="danger" fullWidth={true} onClick={() => setShowLogoutConfirm(true)}>
          <LogOut className="w-4 h-4" />
          <span>LOGOUT OF PHONEG</span>
        </AppButton>

        <ConfirmDialog
          isOpen={showLogoutConfirm}
          title="Confirm Logout"
          description="Are you sure you want to log out of your phoneG account?"
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
          loading={loggingOut}
        />
      </div>
    </MainLayout>
  );
};
