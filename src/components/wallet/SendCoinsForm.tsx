import React, { useState } from 'react';
import { AppInput } from '../common/AppInput';
import { AppButton } from '../common/AppButton';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatCoins } from '../../lib/formatters';
import { validateUserIdFormat } from '../../lib/validators';
import { getUidFromUserId } from '../../services/userService';
import { Send, UserCheck, AlertCircle, Coins, Search, CheckCircle2 } from 'lucide-react';

interface SendCoinsFormProps {
  currentBalance: number;
  currentUserPublicId: string;
  onSend: (recipientUserId: string, coinAmount: number, description?: string) => Promise<void>;
  loading: boolean;
}

export const SendCoinsForm: React.FC<SendCoinsFormProps> = ({
  currentBalance,
  currentUserPublicId,
  onSend,
  loading
}) => {
  const [recipientInput, setRecipientInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [description, setDescription] = useState('');
  
  const [recipientVerified, setRecipientVerified] = useState<boolean | null>(null);
  const [verifyingRecipient, setVerifyingRecipient] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numCoins = parseFloat(amountInput) || 0;

  const handleVerifyRecipient = async () => {
    setError(null);
    const cleanId = recipientInput.trim().toUpperCase();

    if (!cleanId) {
      setError('Please enter recipient User ID.');
      return;
    }

    if (cleanId === currentUserPublicId.trim().toUpperCase()) {
      setError('You cannot send coins to your own User ID.');
      setRecipientVerified(false);
      return;
    }

    if (!validateUserIdFormat(cleanId)) {
      setError('User ID format must be PL followed by 5 digits (e.g. PL18753).');
      setRecipientVerified(false);
      return;
    }

    setVerifyingRecipient(true);
    try {
      const match = await getUidFromUserId(cleanId);
      if (match) {
        setRecipientVerified(true);
      } else {
        setRecipientVerified(false);
        setError(`User ID "${cleanId}" not found in phoneG registry.`);
      }
    } catch (err: any) {
      setRecipientVerified(false);
      setError('Failed to lookup recipient User ID.');
    } finally {
      setVerifyingRecipient(false);
    }
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = recipientInput.trim().toUpperCase();

    if (!cleanId) {
      setError('Please enter recipient User ID.');
      return;
    }

    if (cleanId === currentUserPublicId.trim().toUpperCase()) {
      setError('You cannot send coins to your own User ID.');
      return;
    }

    if (numCoins <= 0) {
      setError('Please enter a valid coin amount.');
      return;
    }

    if (numCoins > currentBalance) {
      setError(`Insufficient balance. You currently have ${currentBalance} Coins.`);
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirm(false);
    try {
      await onSend(recipientInput.trim().toUpperCase(), numCoins, description);
      setRecipientInput('');
      setAmountInput('');
      setDescription('');
      setRecipientVerified(null);
    } catch (err: any) {
      setError(err.message || 'Coin transfer failed.');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-left space-y-5 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#20244F]">Send phoneG Coins</h2>
        <p className="text-xs text-gray-500">Transfer coins instantly to any phoneG User ID</p>
      </div>

      {/* Available Balance Banner */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
        <span className="font-semibold">Available Wallet Balance:</span>
        <span className="font-extrabold font-mono text-emerald-700 text-sm">
          {formatCoins(currentBalance)} COINS
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleOpenConfirm} className="space-y-4">
        {/* Recipient User ID */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#20244F] uppercase tracking-wider">
              Recipient User ID
            </label>
            {recipientVerified === true && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified User</span>
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            <div className="flex-1">
              <AppInput
                placeholder="e.g. PL18753"
                value={recipientInput}
                onChange={(e) => {
                  setRecipientInput(e.target.value.toUpperCase());
                  setRecipientVerified(null);
                }}
                icon={<UserCheck className="w-4 h-4" />}
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyRecipient}
              disabled={verifyingRecipient || !recipientInput.trim()}
              className="px-3.5 bg-[#202778] text-white text-xs font-bold rounded-xl hover:bg-[#191f61] transition-all flex items-center space-x-1 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </div>
        </div>

        {/* Amount */}
        <AppInput
          label="Coins to Send"
          type="number"
          min="1"
          max={currentBalance}
          placeholder="Enter quantity"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          icon={<Coins className="w-4 h-4 text-amber-500" />}
        />

        {/* Note */}
        <AppInput
          label="Note / Purpose (Optional)"
          placeholder="e.g. Dinner share or Gift"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <AppButton type="submit" variant="primary" loading={loading} fullWidth={true}>
          SEND COINS NOW
        </AppButton>
      </form>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm Coin Transfer"
        description={`Are you sure you want to send ${numCoins} Coins to User ID ${recipientInput.trim().toUpperCase()}? This action cannot be reversed.`}
        confirmText="Confirm Transfer"
        cancelText="Cancel"
        onConfirm={handleConfirmSend}
        onCancel={() => setShowConfirm(false)}
        loading={loading}
      />
    </div>
  );
};
