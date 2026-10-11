import React from 'react';
import { AppButton } from './AppButton';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-left shadow-2xl space-y-4 animate-scale-up border border-gray-100">
        <div className="flex items-center space-x-3 text-amber-500">
          <div className="p-2 bg-amber-50 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#20244F]">{title}</h3>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        <div className="flex items-center space-x-3 pt-2">
          <AppButton variant="secondary" onClick={onCancel} disabled={loading} fullWidth={true}>
            {cancelText}
          </AppButton>
          <AppButton variant="primary" onClick={onConfirm} loading={loading} fullWidth={true}>
            {confirmText}
          </AppButton>
        </div>
      </div>
    </div>
  );
};
